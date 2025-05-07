import { NextResponse } from 'next/server';
import { connectToDatabase } from '@lib/postgres';

export async function POST(request) {
  try {
    const { senderId, recipientId } = await request.json();

    // Input validation
    if (!senderId || !recipientId) {
      return NextResponse.json(
        { success: false, message: 'Both senderId and recipientId are required' },
        { status: 400 }
      );
    }

    if (senderId === recipientId) {
      return NextResponse.json(
        { success: false, message: 'Cannot send request to yourself' },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();

    // Check if users exist
    const usersExist = await client.query(
      'SELECT id FROM users WHERE id IN ($1, $2)',
      [senderId, recipientId]
    );

    if (usersExist.rows.length !== 2) {
      return NextResponse.json(
        { success: false, message: 'One or both users not found' },
        { status: 404 }
      );
    }

    // Check for existing relationship
    const existingRequest = await client.query(
      `SELECT id, status FROM friends 
       WHERE (user_id = $1 AND friend_id = $2)
          OR (user_id = $2 AND friend_id = $1)`,
      [senderId, recipientId]
    );

    if (existingRequest.rows.length > 0) {
      const existing = existingRequest.rows[0];
      return NextResponse.json(
        { 
          success: false,
          message: existing.status === 'accepted' 
            ? 'You are already friends' 
            : 'Friend request already exists'
        },
        { status: 409 }
      );
    }

    // Create new request
    const result = await client.query(
      `INSERT INTO friends (user_id, friend_id, status)
       VALUES ($1, $2, 'pending')
       RETURNING *`,
      [senderId, recipientId]
    );

    return NextResponse.json({
      success: true,
      message: 'Friend request sent successfully',
      request: result.rows[0]
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';