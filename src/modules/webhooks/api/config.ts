import { NextResponse } from "next/server";
import { webhookService } from "../service/webhookService";

export async function GET() {
    return NextResponse.json({ ok: true, webhooks: webhookService.getWebhooks() });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { url, events } = body;

        if (!url || !events || !Array.isArray(events)) {
            return NextResponse.json({ ok: false, error: "URL and events array required" }, { status: 400 });
        }

        const webhook = webhookService.addWebhook(url, events);
        return NextResponse.json({ ok: true, webhook });
    } catch (err: any) {
        return NextResponse.json(
            { ok: false, error: err.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ ok: false, error: "ID required" }, { status: 400 });
        }

        webhookService.removeWebhook(id);
        return NextResponse.json({ ok: true });
    } catch (err: any) {
        return NextResponse.json(
            { ok: false, error: err.message },
            { status: 500 }
        );
    }
}
