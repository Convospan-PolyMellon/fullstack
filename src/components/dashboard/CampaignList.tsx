"use client";
import { useState } from "react";
import { toast } from "sonner";

export default function CampaignList({ campaigns }: any) {
    const [running, setRunning] = useState<string | null>(null);

    const handleRun = async (id: string) => {
        setRunning(id);
        try {
            const res = await fetch("/api/orchestrator/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ campaignId: id }),
            });
            if (!res.ok) throw new Error("Failed to start campaign");
            toast.success("Campaign triggered!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to trigger campaign");
        } finally {
            setRunning(null);
        }
    };

    const handleExport = async () => {
        try {
            const res = await fetch("/api/exports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ entity: "campaigns" }),
            });
            if (res.ok) {
                toast.success("Export started! Check notifications.");
            } else {
                toast.error("Export failed to start");
            }
        } catch (e) {
            toast.error("Export error");
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex justify-end">
                <button
                    onClick={handleExport}
                    className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition"
                >
                    ⬇ Export CSV
                </button>
            </div>
            {campaigns.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                    <div>
                        <div className="font-semibold text-sm">{c.name}</div>
                        <div className="text-xs text-gray-400">{c.audience} • {c.leads} leads</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-300">{c.status}</div>
                        <button
                            onClick={() => handleRun(c.id)}
                            disabled={running === c.id}
                            className="p-2 rounded bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 transition"
                            title="Run Campaign"
                        >
                            {running === c.id ? "..." : "▶"}
                        </button>
                        <a
                            href={`/dashboard/campaigns/${c.id}/edit`}
                            className="p-2 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
                            title="Edit Campaign"
                        >
                            ✎
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
}
