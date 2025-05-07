// frontend/src/app/api/friends/list/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase, releaseConnection } from '@lib/postgres';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json(
            { error: "User ID is required" },
            { status: 400 }
        );
    }

    // Validate userId is numeric
    if (isNaN(userId)) {
        return NextResponse.json(
            { error: "User ID must be a number" },
            { status: 400 }
        );
    }

    let client;
    try {
        client = await connectToDatabase();
        
        // Validate user exists first (using numeric ID)
        const userCheck = await client.query('SELECT id FROM users WHERE id = $1', [Number(userId)]);
        if (userCheck.rows.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const query = `
            SELECT 
                u.id,
                u.username,
                u.email,
                f.id as friendship_id,
                f.status
            FROM friends f
            JOIN users u ON (
                (f.user_id = $1 AND f.friend_id = u.id) OR
                (f.friend_id = $1 AND f.user_id = u.id)
            )
            WHERE f.status = 'accepted'
        `;
        
        const result = await client.query(query, [Number(userId)]);
        
        return NextResponse.json({
            success: true,
            friends: result.rows
        });

    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to fetch friends list',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    } finally {
        if (client) await client.release();
    }
}