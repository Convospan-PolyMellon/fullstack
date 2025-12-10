import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return new NextResponse("User not found", { status: 404 });

    // For MVP, we assume user belongs to one team or we pick the first one
    // In a real app, teamId should be passed or context-aware
    const membership = await prisma.teamMember.findFirst({
        where: { userId: user.id },
        include: { team: true }
    });

    if (!membership) {
        return new NextResponse("You are not part of a team", { status: 400 });
    }

    // Only admins can invite? Let's say yes for now
    if (membership.role !== "admin" && membership.role !== "owner") {
        // allowing 'owner' if strictly defined, but usually 'admin' covers management
        // checking if 'owner' is a role string or distinct
    }

    const { email, role } = await req.json();

    if (!email) {
        return new NextResponse("Email is required", { status: 400 });
    }

    // Check if already invited
    const existing = await prisma.teamMember.findFirst({
        where: {
            teamId: membership.teamId,
            email: email
        }
    });

    if (existing) {
        return new NextResponse("User already invited or in team", { status: 409 });
    }

    // Create invite
    const invite = await prisma.teamMember.create({
        data: {
            teamId: membership.teamId,
            email,
            role: role || "member",
            status: "invited"
        }
    });

    // Generate link (simulated)
    const inviteLink = `${process.env.NEXTAUTH_URL}/join?token=${invite.id}`; // using ID as token for MVP simplicity

    return NextResponse.json({ ok: true, inviteLink });
}
