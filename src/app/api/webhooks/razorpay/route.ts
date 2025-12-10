import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validation logic here (signature check)

        const event = body.event;
        const payload = body.payload;

        if (event === "payment.captured") {
            const payment = payload.payment.entity;
            const notes = payment.notes;

            // Add Credits
            if (notes.teamId) {
                const amountInRupees = payment.amount / 100;
                const credits = Math.floor(amountInRupees / 10);

                await prisma.team.update({
                    where: { id: notes.teamId },
                    data: { credits: { increment: credits } }
                });

                await prisma.creditTransaction.create({
                    data: {
                        teamId: notes.teamId,
                        amount: credits,
                        description: `Top-up via Razorpay (ID: ${payment.id})`,
                        type: "topup",
                        meta: { paymentId: payment.id, orderId: payment.order_id }
                    }
                });
            }
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("Razorpay Webhook Error:", error);
        return new NextResponse("Webhook Handler Failed", { status: 500 });
    }
}
