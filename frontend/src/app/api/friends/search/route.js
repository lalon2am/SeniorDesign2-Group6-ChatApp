// src/app/api/users/search/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@lib/postgres';

export const dynamic = 'force-dynamic'; // Keep this!

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    
    // Validate query parameter
    if (!query || query.trim().length < 2) {
        return NextResponse.json(
            { 
                success: false,
                error: "Search query must be at least 2 characters long" 
            },
            { status: 400 }
        );
    }

    let client;
    try {
        client = await connectToDatabase();
        if (!client) {
            console.error('Database connection failed');
            throw new Error('Database connection failed');
        }

        const searchQuery = `
            SELECT 
                id, 
                username, 
                email
            FROM users 
            WHERE username ILIKE $1 OR email ILIKE $1
            LIMIT 10
            `;
        
        const result = await client.query(searchQuery, [`%${query}%`]);
        
        // Ensure this matches what your frontend expects
        return NextResponse.json({
            success: true,
            results: result.rows // Frontend looks for data.results
        });

    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            { 
                success: false,
                error: error.message || 'Search failed', // More specific error
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    } finally {
        if (client) {
            try {
                await client.release();
            } catch (releaseError) {
                console.error('DB release error:', releaseError);
            }
        }
    }
}