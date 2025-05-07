// frontend/src/app/api/users/[userId]/route.js
import { NextResponse } from 'next/server';
// Import your database connection logic here (e.g., using postgres.js or Sequelize)
// import { sql } from '@vercel/postgres'; // Comment out your database import

export async function GET(request, { params }) {
  const { userId } = params;
  console.log('[Frontend API - /api/users/' + userId + '] Received userId:', userId);

  try {
    // Temporarily bypass database check - ALWAYS return true (user exists)
    console.log('[Frontend API - /api/users/' + userId + '] Temporarily bypassing user existence check.');
    return NextResponse.json(true, { status: 200 });

    // Original database check (commented out)
    /*
    const userIdNumber = parseInt(userId, 10);
    console.log('[Frontend API - /api/users/' + userId + '] Searching for user with ID:', userIdNumber);

    const result = await sql`SELECT * FROM users WHERE id = ${userIdNumber}`;
    const user = result.rows[0];

    console.log('[Frontend API - /api/users/' + userId + '] Database query result:', user ? 'User found' : 'User not found');

    if (user) {
      return NextResponse.json(true, { status: 200 });
    } else {
      return NextResponse.json(false, { status: 404 });
    }
    */
  } catch (error) {
    console.error('[Frontend API - /api/users/' + userId + '] Error checking user existence:', error);
    return NextResponse.json({ message: 'Error checking user existence' }, { status: 500 });
  }
}