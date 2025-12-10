import { NextResponse } from "next/server";
import { healthService } from "@/modules/monitoring/service/healthService";
import { getCurrentContext } from "@/lib/auth";
import { APIError, handleAPIError } from "@/lib/apiResponse";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const { userId } = await getCurrentContext();
        if (!userId) throw new APIError("Unauthorized", 401, "UNAUTHORIZED");

        const currentUser = await prisma.user.findUnique({ where: { id: userId } }) as any;
        if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "superadmin")) {
            throw new APIError("Forbidden: Admin access required", 403, "FORBIDDEN");
        }

        const health = await healthService.getHealth();
        return NextResponse.json({ health, ok: true });
    } catch (error: any) {
        return handleAPIError(error);
    }
}
