import { NextResponse } from "next/server";
import { icpService } from "../service/icpService";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status") || undefined;

        const icps = await icpService.list({ status });
        return NextResponse.json({ ok: true, icps });
    } catch (err: any) {
        return NextResponse.json(
            { ok: false, error: err.message },
            { status: 500 }
        );
    }
}
