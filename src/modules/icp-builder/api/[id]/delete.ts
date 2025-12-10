import { NextResponse } from "next/server";
import { icpService } from "../../service/icpService";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await icpService.delete(params.id);
        return NextResponse.json({ ok: true });
    } catch (err: any) {
        return NextResponse.json(
            { ok: false, error: err.message },
            { status: 500 }
        );
    }
}
