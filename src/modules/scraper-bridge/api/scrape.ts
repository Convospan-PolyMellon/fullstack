import { NextResponse } from "next/server";
import { scraperService } from "../service/scraperService";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = await scraperService.scrape(body);
        return NextResponse.json({ ok: true, result });
    } catch (err: any) {
        return NextResponse.json(
            { ok: false, error: err.message },
            { status: 500 }
        );
    }
}
