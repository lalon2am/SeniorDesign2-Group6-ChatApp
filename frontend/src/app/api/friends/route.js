//main friends endpoint: frontend/src/api/friends/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@lib/postgres';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    if (!userId) {
        return NextResponse.json(
            { error: "Missing 'userId' parameter" },
            { status: 400 }
        );
    }

    let client;
    try {
        client = await connectToDatabase();
        
        // Get both incoming and outgoing requests
        const query = {
            text: `
                SELECT 
                    f.id,
                    f.user_id as senderId,
                    f.friend_id as recipientId,
                    f.status,
                    f.created_at,
                    u.username as senderUsername
                FROM friends f
                JOIN users u ON f.user_id = u.id
                WHERE (f.friend_id = $1 OR f.user_id = $1)
                ${status ? "AND f.status = $2" : ""}
                ORDER BY f.created_at DESC
            `,
            values: status ? [userId, status] : [userId]
        };

        const result = await client.query(query);
        
        return NextResponse.json(result.rows);

    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch friends' },
            { status: 500 }
        );
    } finally {
        if (client) await client.release();
    }
}