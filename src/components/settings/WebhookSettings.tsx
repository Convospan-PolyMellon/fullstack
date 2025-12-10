"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

interface Webhook {
    id: string;
    url: string;
    events: string[];
    isActive: boolean;
}

const AVAILABLE_EVENTS = [
    { id: "lead.created", label: "Lead Created" },
    { id: "lead.updated", label: "Lead Updated" },
    { id: "campaign.started", label: "Campaign Started" },
    { id: "campaign.finished", label: "Campaign Finished" },
];

export default function WebhookSettings() {
    const [webhooks, setWebhooks] = useState<Webhook[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newUrl, setNewUrl] = useState("");
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchWebhooks();
    }, []);

    const fetchWebhooks = async () => {
        try {
            const res = await fetch("/api/webhooks");
            const data = await res.json();
            setWebhooks(data);
        } catch (error) {
            console.error("Failed to fetch webhooks", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/webhooks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url: newUrl,
                    events: selectedEvents,
                }),
            });

            if (res.ok) {
                setNewUrl("");
                setSelectedEvents([]);
                setIsCreating(false);
                fetchWebhooks();
            }
        } catch (error) {
            console.error("Failed to create webhook", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this webhook?")) return;
        try {
            await fetch(`/api/webhooks/${id}`, { method: "DELETE" });
            fetchWebhooks();
        } catch (error) {
            console.error("Failed to delete webhook", error);
        }
    };

    const toggleEvent = (eventId: string) => {
        setSelectedEvents(prev =>
            prev.includes(eventId)
                ? prev.filter(e => e !== eventId)
                : [...prev, eventId]
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Webhooks</h2>
                <Button onClick={() => setIsCreating(true)} variant="primary" className="px-3 py-1 text-sm">
                    + Add Endpoint
                </Button>
            </div>

            {isCreating && (
                <GlassCard className="p-6">
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Endpoint URL</label>
                            <input
                                type="url"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                placeholder="https://api.example.com/webhook"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Events to Subscribe</label>
                            <div className="grid grid-cols-2 gap-2">
                                {AVAILABLE_EVENTS.map(event => (
                                    <label key={event.id} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedEvents.includes(event.id)}
                                            onChange={() => toggleEvent(event.id)}
                                            className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-300">{event.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="secondary" onClick={() => setIsCreating(false)} className="px-4 py-2">
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary" className="px-4 py-2">
                                Create Webhook
                            </Button>
                        </div>
                    </form>
                </GlassCard>
            )}

            <div className="space-y-4">
                {webhooks.map(webhook => (
                    <GlassCard key={webhook.id} className="p-4 flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${webhook.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                <h4 className="font-medium text-white truncate max-w-md">{webhook.url}</h4>
                            </div>
                            <div className="flex gap-2 mt-2">
                                {webhook.events.map(event => (
                                    <span key={event} className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">
                                        {event}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <Button
                            onClick={() => handleDelete(webhook.id)}
                            variant="danger"
                            className="px-3 py-1 text-xs"
                        >
                            Delete
                        </Button>
                    </GlassCard>
                ))}

                {!isLoading && webhooks.length === 0 && !isCreating && (
                    <div className="text-center py-8 text-gray-500">
                        No webhooks configured.
                    </div>
                )}
            </div>
        </div>
    );
}
