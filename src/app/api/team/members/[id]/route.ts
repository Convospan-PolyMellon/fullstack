import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return new NextResponse("Unauthorized", { status: 401 });

    const { role } = await req.json();
    const { id } = params; // member ID to update

    // Verify requester is admin
    const requester = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!requester) return new NextResponse("User not found", { status: 404 });

    const requesterMembership = await prisma.teamMember.findFirst({ where: { userId: requester.id } });
    if (!requesterMembership || requesterMembership.role !== 'admin') {
        return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.teamMember.update({
        where: { id },
        data: { role }
    });

    return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = params; // member ID to remove

    // Verify requester is admin
    const requester = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!requester) return new NextResponse("User not found", { status: 404 });

    const requesterMembership = await prisma.teamMember.findFirst({ where: { userId: requester.id } });
    if (!requesterMembership || requesterMembership.role !== 'admin') {
        return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.teamMember.delete({ where: { id } });

    return NextResponse.json({ ok: true });
}
