"use client";

import React, { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function CRMSettingsPage() {
    const [apiKey, setApiKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"connected" | "disconnected">("disconnected");

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // In a real app, we'd save this to the backend/DB
        // For MVP, we'll just simulate a connection check
        setTimeout(() => {
            if (apiKey.length > 10) {
                setStatus("connected");
                alert("Connected to HubSpot!");
            } else {
                alert("Invalid API Key");
            }
            setLoading(false);
        }, 1500);
    };

    const handleManualSync = async () => {
        if (status !== "connected") return alert("Please connect CRM first");

        // Trigger sync for a demo lead
        try {
            const res = await fetch("/api/crm/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId: "demo-lead-id" }) // Replace with real selection
            });
            const data = await res.json();
            alert(JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(error);
            alert("Sync failed");
        }
    };

    return (
        <main className="p-8 min-h-screen bg-black relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <SectionHeader title="CRM Integration" subtitle="Sync your leads to HubSpot" />

                <div className="glass p-8 rounded-xl border border-white/10 mt-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#ff7a59] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">HS</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">HubSpot</h3>
                                <p className="text-gray-400 text-sm">Sync contacts and companies</p>
                            </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${status === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                            }`}>
                            {status === 'connected' ? 'Connected' : 'Disconnected'}
                        </div>
                    </div>

                    <form onSubmit={handleConnect} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Access Token
                            </label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="pat-na1-..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff7a59] transition-colors"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Paste your Private App Access Token from HubSpot Settings.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-[#ff7a59] hover:bg-[#ff8f73] text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
                            >
                                {loading ? "Connecting..." : "Connect HubSpot"}
                            </button>

                            {status === 'connected' && (
                                <button
                                    type="button"
                                    onClick={handleManualSync}
                                    className="px-6 py-3 rounded-lg font-bold border border-white/10 hover:bg-white/5 text-white transition-colors"
                                >
                                    Test Sync
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
