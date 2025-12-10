import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiter for MVP (Use Redis/Upstash in production)
const rateLimit = new Map();

export function middleware(request: NextRequest) {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const path = request.nextUrl.pathname;

    // 1. CORS for API routes
    if (path.startsWith("/api")) {
        const response = NextResponse.next();
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        if (request.method === "OPTIONS") {
            return new NextResponse(null, { status: 200, headers: response.headers });
        }
    }

    // 2. Rate Limiting (Skip for static assets)
    if (!path.startsWith("/_next") && !path.startsWith("/static")) {
        const windowMs = 60 * 1000; // 1 minute
        const maxReqs = 100; // 100 requests per minute

        const current = rateLimit.get(ip) || { count: 0, startTime: Date.now() };

        if (Date.now() - current.startTime > windowMs) {
            current.count = 1;
            current.startTime = Date.now();
        } else {
            current.count++;
        }

        rateLimit.set(ip, current);

        if (current.count > maxReqs) {
            return new NextResponse("Too Many Requests", { status: 429 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
