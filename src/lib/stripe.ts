import Stripe from "stripe";

// Prevent build failures if env var is missing
const apiKey = process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key_for_build";

export const stripe = new Stripe(apiKey, {
    apiVersion: "2024-12-18.acacia" as any,
    typescript: true,
});

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("⚠️  STRIPE_SECRET_KEY is missing. Stripe initialized with dummy key.");
}
