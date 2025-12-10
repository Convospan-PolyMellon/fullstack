import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: any) {
    const { id } = params;
    const body = await req.json();
    const updated = await prisma.campaign.update({
        where: { id },
        data: body,
    });
    return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: any) {
    const { id } = params;
    await prisma.campaign.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}
