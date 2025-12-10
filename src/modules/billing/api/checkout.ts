import { NextResponse } from "next/server";
import { billingService } from "../service/billingService";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { planId } = body;

        // Mock user ID
        const userId = "user_123";

        if (!planId) {
            return NextResponse.json({ ok: false, error: "Plan ID required" }, { status: 400 });
        }

        const session = await billingService.createCheckoutSession(planId, userId);
        return NextResponse.json({ ok: true, url: session.url });
    } catch (err: any) {
        return NextResponse.json(
            { ok: false, error: err.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const userId = "user_123";
        const status = await billingService.getSubscriptionStatus(userId);
        return NextResponse.json({ ok: true, status });
    } catch (err: any) {
        return NextResponse.json(
            { ok: false, error: err.message },
            { status: 500 }
        );
    }
}
