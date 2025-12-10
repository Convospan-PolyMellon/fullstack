"use client";

import React, { useEffect, useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { APISettings } from "@/components/settings/APISettings";
import { TeamSettings } from "@/components/settings/TeamSettings";

import WebhookSettings from "@/components/settings/WebhookSettings";

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchSettings = () => {
        fetch("/api/settings")
            .then((res) => res.json())
            .then((data) => {
                setSettings(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdate = async (data: any) => {
        try {
            const res = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const updated = await res.json();
            setSettings(updated);
            alert("Settings saved successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to save settings.");
        }
    };

    if (loading) return <div className="p-8 text-white/60">Loading settings...</div>;

    return (
        <div className="p-8 space-y-8 max-w-4xl">
            <SectionHeader title="Settings" subtitle="Manage your account and preferences" />

            <div className="grid grid-cols-1 gap-8">
                <ProfileSettings settings={settings} onUpdate={handleUpdate} />
                <TeamSettings />
                <WebhookSettings />
                <APISettings settings={settings} onUpdate={handleUpdate} />
            </div>
        </div>
    );
}
