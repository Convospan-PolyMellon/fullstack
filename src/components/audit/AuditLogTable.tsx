"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ActivityLog {
    id: string;
    action: string;
    meta: any;
    createdAt: string;
}

export function AuditLogTable() {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");

    const fetchLogs = () => {
        setLoading(true);
        const url = filter === "ALL" ? "/api/audit-logs" : `/api/audit-logs?action=${filter}`;
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setLogs(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchLogs();
    }, [filter]);

    return (
        <GlassCard>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold gradient-text">System Activity Logs</h3>
                <div className="flex gap-2">
                    <select
                        className="bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="ALL">All Actions</option>
                        <option value="LIKE">Likes</option>
                        <option value="COMMENT">Comments</option>
                        <option value="CONNECT">Connections</option>
                        <option value="SCRAPE">Scrapes</option>
                        <option value="INMAIL">InMails</option>
                    </select>
                    <Button variant="outline" onClick={fetchLogs} className="py-2 px-4 text-sm">
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="text-xs uppercase bg-white/5 text-gray-400">
                        <tr>
                            <th className="px-4 py-3 rounded-tl-lg">Time</th>
                            <th className="px-4 py-3">Action</th>
                            <th className="px-4 py-3">Details</th>
                            <th className="px-4 py-3 rounded-tr-lg">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-white/40">Loading logs...</td>
                            </tr>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-white/40">No activity logs found.</td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant="neutral">{log.action}</Badge>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs text-white/60 truncate max-w-xs">
                                        {JSON.stringify(log.meta)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant="success">Success</Badge>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    );
}
