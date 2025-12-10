"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SmartCampaignForm from "@/components/dashboard/campaigns/SmartCampaignForm";

export default function NewCampaignPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Campaign State
    const [name, setName] = useState("");
    const [type, setType] = useState<"standard" | "smart">("standard");
    const [audience, setAudience] = useState("");
    const [aiConfig, setAIConfig] = useState({
        tone: "Professional",
        goal: "Introduction",
        context: "",
        prompt: "",
    });

    const handleCreate = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/dashboard/campaigns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    type,
                    audience: type === "standard" ? audience : undefined,
                    aiConfig: type === "smart" ? aiConfig : undefined,
                    // OwnerId is handled by session in backend usually, or passed here if needed.
                    // Assuming backed gets it from session or we pass a mock for now.
                    ownerId: "mock-user-id"
                }),
            });
            if (res.ok) {
                router.push("/campaigns");
            } else {
                alert("Failed to create campaign");
            }
        } catch (e) {
            console.error(e);
            alert("Error creating campaign");
        } finally {
            setLoading(false);
        }
    };

    const generatePreview = async () => {
        try {
            const res = await fetch("/api/ai/preview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(aiConfig),
            });

            if (!res.ok) throw new Error("Preview failed");

            const data = await res.json();
            return data.result;
        } catch (e) {
            console.error(e);
            return "Failed to generate preview. Please try again.";
        }
    };

    return (
        <div className="max-w-3xl mx-auto pt-10 px-6">
            <h1 className="text-3xl font-bold mb-8 gradient-text">Create New Campaign</h1>

            <div className="glass p-8 rounded-2xl">
                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Campaign Name</label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Summer Outreach 2025"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Campaign Type</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    className={`p-4 rounded-xl border text-left transition ${type === "standard" ? "bg-purple-500/20 border-purple-500" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                                    onClick={() => setType("standard")}
                                >
                                    <div className="font-semibold mb-1">Standard</div>
                                    <div className="text-sm text-gray-400">Manual templates and sequences.</div>
                                </button>
                                <button
                                    className={`p-4 rounded-xl border text-left transition ${type === "smart" ? "bg-purple-500/20 border-purple-500" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                                    onClick={() => setType("smart")}
                                >
                                    <div className="font-semibold mb-1">Smart AI</div>
                                    <div className="text-sm text-gray-400">AI-generated personalized content.</div>
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={() => setStep(2)}
                                disabled={!name}
                                className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && type === "smart" && (
                    <div className="space-y-6">
                        <SmartCampaignForm
                            config={aiConfig}
                            onChange={setAIConfig}
                            onGeneratePreview={generatePreview}
                        />
                        <div className="flex justify-between pt-6 border-t border-white/10">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-2 text-gray-400 hover:text-white transition"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={loading}
                                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
                            >
                                {loading ? "Creating..." : "Launch Campaign"}
                            </button>
                        </div>
                    </div>
                )}
                {step === 2 && type === "standard" && (
                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <h3 className="text-lg font-semibold text-white mb-2">Standard Campaign Setup</h3>
                            <p className="text-sm text-gray-400 mb-4">Describe your target audience and we'll set up a basic sequence.</p>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Target Audience</label>
                                <input
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g. CTOs at Series B Tech companies"
                                    onChange={(e) => setAudience(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between pt-6 border-t border-white/10">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-2 text-gray-400 hover:text-white transition"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={loading}
                                className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
                            >
                                {loading ? "Creating..." : "Create Campaign"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}