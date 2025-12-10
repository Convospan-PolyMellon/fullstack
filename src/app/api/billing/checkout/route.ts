import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjusted path to use lib/auth if available, or direct api path
import { prisma } from "@/lib/db"; // Use lib/db or prisma
import Razorpay from "razorpay";

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { amount, currency = "INR", receipt = "receipt#1" } = await req.json();

    if (!amount) {
        return new NextResponse("Amount is required", { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });
        if (!user) return new NextResponse("User not found", { status: 404 });

        // Retrieve team to link meta
        const membership = await prisma.teamMember.findFirst({
            where: { userId: user.id },
            select: { teamId: true }
        });

        const options = {
            amount: amount * 100, // amount in the smallest currency unit (paise)
            currency,
            receipt,
            notes: {
                userId: user.id,
                teamId: membership?.teamId || "unknown",
                paymentType: "topup" // or subscription
            }
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error("Razorpay Order Creation Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
