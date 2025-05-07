// lib/postgres.js
if (typeof window !== 'undefined') {
  throw new Error('This module can only be used in server components or API routes');
}

import pg from 'pg';
const { Pool } = pg;

// Configuration for Render.com PostgreSQL with enhanced settings
const pool = new Pool({
  // Primary connection configuration
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  
  // Fallback individual parameters (for local development)
  ...(process.env.POSTGRES_URL ? {} : {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
  }),

  // SSL configuration
  ssl: process.env.POSTGRES_NO_SSL ? false : {
    rejectUnauthorized: process.env.NODE_ENV === 'production',
    ca: process.env.POSTGRES_CA_CERT // For custom CA certificates
  },

  // Optimized pool settings for Render.com
  max: process.env.NODE_ENV === 'production' ? 5 : 10, // Lower in production
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // 10 second connection timeout
  application_name: 'bubble-chat-app-' + process.env.NODE_ENV,

  // Advanced tuning
  maxUses: 5000, // Rotate connections periodically
  allowExitOnIdle: true,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000
});

// Connection lifecycle tracking
let activeConnections = 0;
let totalConnectionAttempts = 0;

// Enhanced event listeners for debugging
pool.on('connect', (client) => {
  activeConnections++;
  totalConnectionAttempts++;
  console.log(`[DB] ✅ Connection established (Active: ${activeConnections}, Total: ${totalConnectionAttempts})`);
});

pool.on('remove', (client) => {
  activeConnections--;
  console.log(`[DB] 🔌 Connection released (Active: ${activeConnections})`);
});

pool.on('error', (err, client) => {
  console.error('[DB] ❌ Client error:', {
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    client: client ? 'active' : 'idle'
  });
});

// Enhanced connectToDatabase with exponential backoff retry
export async function connectToDatabase(retries = 3, baseDelay = 1000) {
  try {
    const client = await pool.connect();
    console.log('[DB] ✅ Connection ready');
    return client;
  } catch (error) {
    if (retries > 0) {
      const delay = baseDelay * (4 - retries); // Exponential backoff
      console.log(`[DB] ⏳ Retrying connection (${retries} left, waiting ${delay}ms)...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectToDatabase(retries - 1, baseDelay);
    }

    console.error('[DB] ❌ Connection failed:', {
      error: error.message,
      code: error.code,
      host: pool.options.host || new URL(process.env.POSTGRES_URL).hostname,
      time: new Date().toISOString(),
      activeConnections,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });

    throw new Error(`Database connection failed after multiple attempts: ${error.message}`);
  }
}

// Safe connection release with additional checks
export async function releaseConnection(client) {
  if (!client) return;

  try {
    if (client.release) {
      await client.release();
      console.log('[DB] 🔌 Connection released successfully');
    } else {
      console.warn('[DB] ⚠️ Connection object missing release method');
    }
  } catch (releaseError) {
    console.error('[DB] ❌ Release failed:', {
      error: releaseError.message,
      stack: process.env.NODE_ENV === 'development' ? releaseError.stack : undefined
    });
  }
}

// Connection health check utility
export async function checkDatabaseHealth() {
  let client;
  try {
    client = await connectToDatabase(1); // Quick single retry
    const result = await client.query('SELECT NOW() as time, pg_postmaster_start_time() as start_time');
    return {
      healthy: true,
      dbTime: result.rows[0].time,
      uptime: new Date() - new Date(result.rows[0].start_time)
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message
    };
  } finally {
    if (client) await releaseConnection(client);
  }
}

// Graceful shutdown handlers
function setupShutdownHandlers() {
  const shutdown = async (signal) => {
    console.log(`[DB] 🛑 Received ${signal}. Closing pool...`);
    try {
      await pool.end();
      console.log('[DB] 🛑 Pool closed successfully');
      process.exit(0);
    } catch (error) {
      console.error('[DB] ❌ Shutdown failed:', error);
      process.exit(1);
    }
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('beforeExit', () => pool.end());
}

setupShutdownHandlers();

// Export the pool directly for special cases
export default pool;