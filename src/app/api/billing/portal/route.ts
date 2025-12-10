import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json({ message: "Manage subscriptions via Razorpay dashboard or contact support." });
}
