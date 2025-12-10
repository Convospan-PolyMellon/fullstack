"use client";

import React, { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const PLANS = [
    {
        name: "Free",
        price: "$0",
        features: ["100 AI Credits/mo", "Basic Analytics", "1 Campaign"],
        priceId: null,
    },
    {
        name: "Pro",
        price: "$29",
        features: ["1000 AI Credits/mo", "Advanced Analytics", "Unlimited Campaigns", "Priority Support"],
        priceId: "price_1Q...", // Replace with real Stripe Price ID
        popular: true,
    },
    {
        name: "Enterprise",
        price: "$99",
        features: ["Unlimited AI Credits", "Custom Integrations", "Dedicated Manager", "SLA"],
        priceId: "price_1Q...", // Replace with real Stripe Price ID
    },
];

export default function BillingPage() {
    const [loading, setLoading] = useState<string | null>(null);

    const handleUpgrade = async (priceId: string | null) => {
        if (!priceId) return; // Free plan
        setLoading(priceId);

        try {
            const res = await fetch("/api/billing/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Failed to start checkout");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setLoading(null);
        }
    };

    return (
        <main className="p-8 min-h-screen bg-black relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">
                <SectionHeader title="Billing & Plans" subtitle="Upgrade your agent army" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.name}
                            className={`glass p-8 rounded-2xl border ${plan.popular ? 'border-blue-500 shadow-blue-500/20 shadow-lg' : 'border-white/10'} relative flex flex-col`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="text-4xl font-bold text-white mb-6">
                                {plan.price}<span className="text-lg text-gray-400 font-normal">/mo</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center text-gray-300">
                                        <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleUpgrade(plan.priceId)}
                                disabled={!plan.priceId || !!loading}
                                className={`w-full py-3 rounded-xl font-bold transition-all ${plan.priceId
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white'
                                        : 'bg-white/10 text-gray-400 cursor-default'
                                    }`}
                            >
                                {loading === plan.priceId ? "Processing..." : plan.priceId ? "Upgrade Now" : "Current Plan"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
