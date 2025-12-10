import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: any) {
    const { id } = params;
    // update agent status
    await prisma.agent.update({ where: { id }, data: { status: "running" } });
    // add activity
    await prisma.activity.create({
        data: {
            type: "agent-run",
            message: `Agent ${id} started`,
            agentId: id,
        },
    });

    // Hook: tell orchestrator to run
    const session = await import("next-auth").then(m => m.getServerSession(require("@/app/api/auth/[...nextauth]/route").authOptions));
    const user = (session as any)?.user?.email ? await prisma.user.findUnique({ where: { email: (session as any).user.email } }) : null;

    await import("@/lib/queue").then(m => m.JobQueue.enqueue("agent_run", { agentId: id, userId: user?.id }));
    return NextResponse.json({ ok: true });
}
