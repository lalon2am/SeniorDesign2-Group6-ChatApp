// src/app/api/friends/respond/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@lib/postgres';

export async function POST(request) {
  try {
    const { requestId, action } = await request.json();
    const currentUserId = request.headers.get('x-user-id');
    
    // Input validation
    if (!requestId || !action) {
      return NextResponse.json(
        { message: 'Both requestId and action are required' },
        { status: 400 }
      );
    }

    if (!['accept', 'decline'].includes(action)) {
      return NextResponse.json(
        { message: 'Action must be either "accept" or "decline"' },
        { status: 400 }
      );
    }

    const status = action === 'accept' ? 'accepted' : 'declined';

    // PostgreSQL implementation
    const client = await connectToDatabase();
    try {
      await client.query('BEGIN');
      await client.query('SET LOCAL statement_timeout = 5000'); // 5s timeout

      // Verify request exists and is pending
      const verifyResult = await client.query(
        `SELECT id, user_id, friend_id FROM friends 
         WHERE id = $1 AND status = 'pending'
         FOR UPDATE`,
        [requestId]
      );

      if (verifyResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { message: 'Friend request not found or already processed' },
          { status: 404 }
        );
      }

      const { user_id: senderId, friend_id: recipientId } = verifyResult.rows[0];
      if (recipientId !== currentUserId) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { message: 'You can only respond to requests sent to you' },
          { status: 403 }
        );
      }

      // Update the request status
      const updateResult = await client.query(
        `UPDATE friends
         SET status = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [status, requestId]
      );

      // If accepting, create reciprocal friendship records
      if (action === 'accept') {
        try {
          // Insert both directions of friendship
          await client.query(
            `INSERT INTO friends (user_id, friend_id, status)
             VALUES ($1, $2, 'accepted'), ($2, $1, 'accepted')
             ON CONFLICT (user_id, friend_id) 
             DO UPDATE SET status = 'accepted', updated_at = NOW()`,
            [senderId, recipientId]
          );
        } catch (error) {
          if (error.code === '23505') { // Unique violation
            console.log('Friendship already exists, continuing');
          } else {
            throw error;
          }
        }
      }

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: `Friend request ${status}`,
        request: updateResult.rows[0]
      });

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', {
        code: error.code,
        constraint: error.constraint,
        detail: error.detail,
        hint: error.hint,
        query: error.query
      });

      const errorMessage = error.code === '23503' 
        ? 'Invalid user reference' 
        : error.code === '40P01'
        ? 'Deadlock detected, please try again'
        : `Failed to process request: ${error.message}`;

      return NextResponse.json(
        { message: errorMessage },
        { status: error.code === '23503' ? 400 : 500 }
      );
    } finally {
      await client.release();
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';