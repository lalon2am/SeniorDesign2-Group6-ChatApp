// src/app/api/auth/logout/route.js
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create a response that will clear the auth cookie
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

    // Clear the cookie (adjust based on your auth setup)
    response.cookies.set({
      name: 'token',
      value: '',
      expires: new Date(0), // Expire immediately
      path: '/',
    });

    // Optionally clear other cookies if needed
    response.cookies.set({
      name: 'session',
      value: '',
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'Logout failed', error: error.message },
      { status: 500 }
    );
  }
}