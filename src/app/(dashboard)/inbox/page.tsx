"use client";

import React, { useState, useEffect } from "react";
import { ThreadList } from "@/components/inbox/ThreadList";
import { ChatWindow } from "@/components/inbox/ChatWindow";
import { Thread } from "@/lib/inboxService";
import { LeadIntelligenceSidebar } from "@/components/inbox/LeadIntelligenceSidebar";

export default function InboxPage() {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/inbox")
            .then(res => res.json())
            .then(data => {
                setThreads(data);
                setLoading(false);
                if (data.length > 0 && !selectedThreadId) {
                    setSelectedThreadId(data[0].id);
                }
            });
    }, []);

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden"> {/* Subtract navbar height */}
            {/* Left: Thread List */}
            <div className="w-1/4 min-w-[280px] max-w-[350px] h-full border-r border-white/10">
                {loading ? (
                    <div className="p-4 text-white/60">Loading threads...</div>
                ) : (
                    <ThreadList
                        threads={threads}
                        selectedThreadId={selectedThreadId}
                        onSelectThread={setSelectedThreadId}
                    />
                )}
            </div>

            {/* Middle: Chat Window */}
            <div className="flex-1 h-full min-w-[400px]">
                {selectedThreadId ? (
                    <ChatWindow threadId={selectedThreadId} />
                ) : (
                    <div className="flex items-center justify-center h-full text-white/40">
                        Select a conversation to start chatting
                    </div>
                )}
            </div>

            {/* Right: AI Intelligence */}
            {selectedThreadId && (
                <div className="w-1/4 min-w-[300px] h-full hidden lg:block">
                    <LeadIntelligenceSidebar threadId={selectedThreadId} />
                </div>
            )}
        </div>
    );
}
