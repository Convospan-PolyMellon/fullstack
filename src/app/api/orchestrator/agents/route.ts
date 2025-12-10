import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const agents = await prisma.agent.findMany({ orderBy: { updatedAt: "desc" } });
    return NextResponse.json(agents);
}
