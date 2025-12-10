import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia" as any,
});

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { amount, price } = await req.json(); // amount = credits, price = cost in cents

    // Validate logic (in real app, use lookup table or price IDs)
    // For MVP, we'll trust client asking for standard packs, but strictly map credits to price server-side
    // e.g. Pack 1: 1000 credits for $10
    // Pack 2: 5000 credits for $40

    let unitAmount = 1000; // $10.00 default
    let creditAmount = 1000;

    if (amount === 5000) {
        creditAmount = 5000;
        unitAmount = 4000; // $40.00
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const membership = await prisma.teamMember.findFirst({
        where: { userId: user.id },
        include: { team: true }
    });

    if (!membership) return new NextResponse("No team found", { status: 400 });
    const team = membership.team;

    // Create Checkout Session for One-time payment
    const checkoutSession = await stripe.checkout.sessions.create({
        customer_email: user.email!,
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: `${creditAmount.toLocaleString()} Credits`,
                        description: "Top-up for AI and Data usage",
                    },
                    unit_amount: unitAmount,
                },
                quantity: 1,
            },
        ],
        success_url: `${process.env.NEXTAUTH_URL}/dashboard?credits_added=true`,
        cancel_url: `${process.env.NEXTAUTH_URL}/settings?tab=billing`,
        metadata: {
            teamId: team.id,
            userId: user.id,
            type: "credit_topup",
            creditAmount: creditAmount.toString()
        }
    });

    return NextResponse.json({ url: checkoutSession.url });
}
