// src/lib/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-strong-secret-here';
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
console.log("Using API_BASE_URL:", API_BASE_URL);

// Authentication functions (These are for frontend token handling)
export function createToken(payload) {
    console.log("[lib/auth.js] createToken called with payload:", payload);
    if (!JWT_SECRET) {
        console.error("[lib/auth.js] JWT_SECRET is not configured!");
        throw new Error('JWT_SECRET is not configured');
    }
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '24h',
        algorithm: 'HS256'
    });
    console.log("[lib/auth.js] createToken generated token:", token);
    return token;
}

export function verifyToken(token) {
    console.log("[lib/auth.js] verifyToken called with token:", token);
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("[lib/auth.js] verifyToken decoded:", decoded);
        return decoded;
    } catch (error) {
        console.error("[lib/auth.js] verifyToken failed:", error.message);
        return null;
    }
}

export function checkTokenExpiry(token) {
    console.log("[lib/auth.js] checkTokenExpiry called with token:", token);
    const decoded = jwt.decode(token);
    console.log("[lib/auth.js] checkTokenExpiry decoded:", decoded);
    if (!decoded?.exp) {
        console.log("[lib/auth.js] checkTokenExpiry: No expiry found in token.");
        return false;
    }
    const isExpired = decoded.exp * 1000 <= Date.now();
    console.log("[lib/auth.js] checkTokenExpiry: Token expired?", isExpired);
    return !isExpired;
}

// API utility function
export async function apiFetch(endpoint, options = {}) {
    const url = new URL(endpoint, API_BASE_URL);
    console.log("[lib/auth.js] apiFetch called with URL:", url.toString(), "and options:", options);

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    console.log("[lib/auth.js] apiFetch headers:", headers);

    try {
        const response = await fetch(url.toString(), {
            credentials: 'include', // Rely on browser to send cookies
            ...options,
            headers
        });
        console.log("[lib/auth.js] apiFetch response status:", response.status);

        if (!response.ok) {
            let errorData = {};
            try {
                errorData = await response.json();
            } catch (e) {
                console.error("[lib/auth.js] apiFetch: Error parsing error JSON:", e);
            }
            const errorMessage = errorData.message || `API request failed with status ${response.status}`;
            console.error("[lib/auth.js] apiFetch error:", errorMessage, errorData);
            throw new Error(errorMessage);
        }

        const responseData = await response.json();
        console.log("[lib/auth.js] apiFetch response data:", responseData);
        return responseData;
    } catch (error) {
        console.error("[lib/auth.js] apiFetch caught error:", error);
        throw error;
    }
}

// Specific API methods
export async function fetchMessages(user1, user2) {
    console.log("[lib/auth.js] fetchMessages called with user1:", user1, "user2:", user2);
    return apiFetch(`/api/messages/conversation?user1=${user1}&user2=${user2}`);
  }
  
  export async function sendMessage(senderId, recipientId, message) { // Receive individual arguments
    const payload = {
      sender: senderId,
      recipient: recipientId,
      message: message,
    };
    console.log("[lib/auth.js] sendMessage payload:", payload); // Log the payload
    return apiFetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

// Function to fetch user data using the verify endpoint
export async function fetchUser() {
    console.log("[lib/auth.js] fetchUser called");
    return apiFetch('/api/verify');
}

//Function to check if a user exists on the backend (Node.js)
export async function checkUserExists(userId) {
    console.log("[lib/auth.js] checkUserExists called with userId:", userId);
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/exists/${userId}`);
        if (response.ok) {
            const data = await response.json();
            console.log("[lib/auth.js] checkUserExists response:", data);
            return data; // Expecting 'true' or 'false' from the Node.js backend
        } else if (response.status === 404) {
            console.log("[lib/auth.js] checkUserExists: User not found (404)");
            return false;
        } else {
            const errorText = await response.text();
            console.error("[lib/auth.js] checkUserExists failed:", response.status, errorText);
            throw new Error(`Failed to check user existence: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        console.error("[lib/auth.js] checkUserExists error:", error);
        throw error;
    }}