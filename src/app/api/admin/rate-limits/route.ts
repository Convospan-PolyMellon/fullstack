import { NextResponse } from "next/server";
import { rateLimitService } from "@/modules/rate-limit/service/rateLimitService";
import { prisma } from "@/lib/db";
import { getCurrentContext } from "@/lib/auth";
import { APIError, handleAPIError } from "@/lib/apiResponse";

// GET: Get current stats
export async function GET() {
    try {
        const { userId } = await getCurrentContext();
        if (!userId) throw new APIError("Unauthorized", 401, "UNAUTHORIZED");

        const currentUser = await prisma.user.findUnique({ where: { id: userId } }) as any;
        if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "superadmin")) {
            throw new APIError("Forbidden: Admin access required", 403, "FORBIDDEN");
        }

        const stats = rateLimitService.getStats();
        return NextResponse.json({ stats });
    } catch (error: any) {
        return handleAPIError(error);
    }
}

// POST: Update config
export async function POST(req: Request) {
    try {
        const { userId } = await getCurrentContext();
        if (!userId) throw new APIError("Unauthorized", 401, "UNAUTHORIZED");

        const currentUser = await prisma.user.findUnique({ where: { id: userId } }) as any;
        if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "superadmin")) {
            throw new APIError("Forbidden: Admin access required", 403, "FORBIDDEN");
        }

        const body = await req.json();
        const { maxRequests, windowMs } = body;

        rateLimitService.updateConfig({ maxRequests, windowMs });

        return NextResponse.json({ success: true, message: "Rate limit config updated" });
    } catch (error: any) {
        return handleAPIError(error);
    }
}
