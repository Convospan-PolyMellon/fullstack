"use client";

import { useEffect, useState } from "react";

export default function WebhookSettings() {
    const [webhooks, setWebhooks] = useState<any[]>([]);
    const [url, setUrl] = useState("");
    const [events, setEvents] = useState("lead.enriched, email.opened");
    const [loading, setLoading] = useState(false);

    const fetchWebhooks = async () => {
        const res = await fetch("/api/webhooks/config");
        const json = await res.json();
        if (json.ok) setWebhooks(json.webhooks);
    };

    useEffect(() => {
        fetchWebhooks();
    }, []);

    const handleAdd = async () => {
        if (!url) return;
        setLoading(true);
        try {
            const eventList = events.split(",").map(e => e.trim());
            await fetch("/api/webhooks/config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, events: eventList }),
            });
            setUrl("");
            fetchWebhooks();
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete webhook?")) return;
        await fetch(`/api/webhooks/config?id=${id}`, { method: "DELETE" });
        fetchWebhooks();
    };

    return (
        <div style={{ background: "#fff", padding: 24, borderRadius: 8, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Webhooks</h3>

            <div style={{ marginBottom: 20, display: "flex", gap: 12, alignItems: "flex-end" }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 12, fontWeight: 500 }}>Endpoint URL</label>
                    <input
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder="https://api.example.com/webhook"
                        style={{ width: "100%", padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 12, fontWeight: 500 }}>Events (comma separated)</label>
                    <input
                        value={events}
                        onChange={e => setEvents(e.target.value)}
                        placeholder="lead.enriched, email.opened"
                        style={{ width: "100%", padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}
                    />
                </div>
                <button
                    onClick={handleAdd}
                    disabled={loading}
                    style={{ padding: "9px 16px", background: "#0ea5e9", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
                >
                    Add
                </button>
            </div>

            <div style={{ borderTop: "1px solid #eee" }}>
                {webhooks.length === 0 && <div style={{ padding: 16, color: "#999", textAlign: "center" }}>No webhooks configured</div>}
                {webhooks.map(w => (
                    <div key={w.id} style={{ padding: "12px 0", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{ fontWeight: 500, fontSize: 14 }}>{w.url}</div>
                            <div style={{ fontSize: 12, color: "#666" }}>Events: {w.events.join(", ")}</div>
                        </div>
                        <button
                            onClick={() => handleDelete(w.id)}
                            style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: 12 }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
