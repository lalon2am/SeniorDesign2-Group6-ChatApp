// src/app/api/friends/requests/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@lib/postgres';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status') || 'pending';

    if (!userId) {
      return NextResponse.json(
        { message: 'userId parameter is required' },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    try {
      // Verify user exists
      const userCheck = await client.query(
        'SELECT id FROM users WHERE id = $1',
        [userId]
      );

      if (userCheck.rows.length === 0) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }

      // Get incoming requests where user is the friend_id (recipient)
      const result = await client.query(
        `SELECT f.*, u.username as sender_username
         FROM friends f
         JOIN users u ON f.user_id = u.id
         WHERE f.friend_id = $1 AND f.status = $2
         ORDER BY f.created_at DESC`,
        [userId, status]
      );

      const requests = result.rows.map(row => ({
        id: row.id,
        senderId: row.user_id,
        recipientId: row.friend_id,
        status: row.status,
        createdAt: row.created_at,
        senderUsername: row.sender_username,
        isIncoming: true
      }));

      return NextResponse.json({ 
        success: true,
        requests,
        message: requests.length ? 'Requests found' : 'No requests found'
      });

    } finally {
      await client.release();
    }
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}