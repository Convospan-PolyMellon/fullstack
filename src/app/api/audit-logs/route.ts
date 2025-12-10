import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const action = searchParams.get("action");
        const limit = parseInt(searchParams.get("limit") || "50");

        const where: any = {};
        if (action && action !== "ALL") {
            where.action = action;
        }

        const logs = await prisma.activityLog.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: limit
        });

        return NextResponse.json(logs);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
