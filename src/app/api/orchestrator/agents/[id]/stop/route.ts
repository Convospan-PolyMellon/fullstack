import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: any) {
    const { id } = params;
    await prisma.agent.update({ where: { id }, data: { status: "idle" } });
    await prisma.activity.create({
        data: { type: "agent-stop", message: `Agent ${id} stopped`, agentId: id },
    });
    // Hook: tell orchestrator to stop
    const session = await import("next-auth").then(m => m.getServerSession(require("@/app/api/auth/[...nextauth]/route").authOptions));
    const user = session?.user?.email ? await prisma.user.findUnique({ where: { email: session.user.email } }) : null;

    await import("@/lib/queue").then(m => m.JobQueue.enqueue("agent_stop", { agentId: id, userId: user?.id }));
    return NextResponse.json({ ok: true });
}
