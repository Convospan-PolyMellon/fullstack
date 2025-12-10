import { NextResponse } from "next/server";
import { auditService } from "../service/auditService";

export async function GET() {
    try {
        const logs = await auditService.getLogs();
        return NextResponse.json({ ok: true, logs });
    } catch (err: any) {
        return NextResponse.json(
            { ok: false, error: err.message },
            { status: 500 }
        );
    }
}
