"use client";

import { useEffect, useState } from "react";

export default function AuditLogViewer() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/audit")
            .then(res => res.json())
            .then(json => {
                if (json.ok) setLogs(json.logs);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading audit logs...</div>;

    return (
        <div style={{ background: "#fff", padding: 24, borderRadius: 8, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Audit Logs</h3>
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #f3f4f6", textAlign: "left" }}>
                            <th style={{ padding: 12 }}>Time</th>
                            <th style={{ padding: 12 }}>Action</th>
                            <th style={{ padding: 12 }}>User</th>
                            <th style={{ padding: 12 }}>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: 24, textAlign: "center", color: "#999" }}>No logs found</td>
                            </tr>
                        ) : (
                            logs.map(log => {
                                const meta = log.meta as any;
                                return (
                                    <tr key={log.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                        <td style={{ padding: 12, color: "#6b7280" }}>
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                        <td style={{ padding: 12, fontWeight: 500 }}>
                                            {log.action.replace("AUDIT: ", "")}
                                        </td>
                                        <td style={{ padding: 12 }}>
                                            {meta?.userId || "System"}
                                        </td>
                                        <td style={{ padding: 12, color: "#6b7280", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {JSON.stringify(meta?.details || {})}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
