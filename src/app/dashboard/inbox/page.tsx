"use client";
import { useState, useEffect, useRef } from "react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function InboxPage() {
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
    const { data: conversations, error } = useSWR("/api/inbox", fetcher, { refreshInterval: 10000 });

    return (
        <div className="flex h-[calc(100vh-100px)] glass border border-white/10 rounded-xl overflow-hidden">
            {/* Sidebar List */}
            <div className="w-1/3 border-r border-white/10 flex flex-col bg-black/20">
                <div className="p-4 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Inbox</h2>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="mt-2 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations?.map((conv: any) => (
                        <div
                            key={conv.id}
                            onClick={() => setSelectedLeadId(conv.id)}
                            className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition ${selectedLeadId === conv.id ? "bg-white/10 border-l-4 border-l-purple-500" : ""
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h3 className={`font-semibold text-white ${!conv.isRead ? "text-purple-300" : ""}`}>
                                    {conv.name}
                                </h3>
                                <span className="text-xs text-gray-400">
                                    {new Date(conv.lastMessageDate).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="text-sm text-gray-400 line-clamp-1">{conv.entity} • {conv.platform}</div>
                            <p className={`text-sm mt-1 line-clamp-2 ${!conv.isRead ? "text-white font-medium" : "text-gray-500"}`}>
                                {conv.lastMessage}
                            </p>
                        </div>
                    ))}
                    {!conversations && <div className="p-4 text-center text-gray-500">Loading...</div>}
                    {conversations?.length === 0 && <div className="p-4 text-center text-gray-500">No messages found.</div>}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-black/40">
                {selectedLeadId ? (
                    <ChatView leadId={selectedLeadId} />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    );
}

function ChatView({ leadId }: { leadId: string }) {
    const { data, error } = useSWR(`/api/inbox/${leadId}`, fetcher, { refreshInterval: 5000 });
    const [reply, setReply] = useState("");
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [data]);

    const handleSend = async () => {
        if (!reply.trim()) return;
        setSending(true);
        try {
            await fetch("/api/inbox/reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId, content: reply, platform: "LINKEDIN" }),
            });
            setReply("");
            mutate(`/api/inbox/${leadId}`);
            toast.success("Reply sent!");
        } catch (e) {
            toast.error("Failed to send");
        } finally {
            setSending(false);
        }
    };

    if (!data) return <div className="p-8 text-gray-400">Loading chat...</div>;

    return (
        <>
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                <div>
                    <h3 className="text-lg font-bold text-white">{data.lead.fullName}</h3>
                    <div className="text-sm text-gray-400">{data.lead.company} • {data.lead.linkedIn ? "LinkedIn" : "Email"}</div>
                </div>
                <button className="text-xs px-3 py-1 bg-white/5 rounded border border-white/10 hover:bg-white/10">
                    View Profile
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {data.messages?.map((msg: any) => (
                    <div key={msg.id} className={`flex ${msg.direction === "OUTBOUND" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] rounded-xl p-3 ${msg.direction === "OUTBOUND" ? "bg-purple-600/80 text-white rounded-br-none" : "bg-white/10 text-gray-200 rounded-bl-none"
                            }`}>
                            <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                            <div className="text-[10px] opacity-50 mt-1 text-right">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="relative">
                    <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pr-24 text-white focus:outline-none focus:border-purple-500 resize-none h-24"
                    />
                    <div className="absolute bottom-3 right-3 flex gap-2">
                        <button className="p-2 text-purple-400 hover:bg-purple-400/10 rounded-lg transition" title="AI Suggestion">
                            ✨
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={sending || !reply.trim()}
                            className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-500 disabled:opacity-50 transition"
                        >
                            {sending ? "Sending..." : "Send"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
