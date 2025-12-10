"use client";

import { useEffect, useState } from "react";

type Job = {
    id: string;
    type: string;
    status: string;
    createdAt: string;
    completedAt?: string;
    error?: string;
};

export function JobStatusList() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch jobs (mock for now, or implement API)
        // In real app, use /api/jobs
        const fetchJobs = async () => {
            try {
                // Mock data
                setJobs([
                    { id: "1", type: "campaign_execution", status: "running", createdAt: new Date().toISOString() },
                    { id: "2", type: "lead_enrichment", status: "completed", createdAt: new Date(Date.now() - 3600000).toISOString(), completedAt: new Date().toISOString() },
                    { id: "3", type: "email_send", status: "failed", createdAt: new Date(Date.now() - 7200000).toISOString(), error: "Rate limit exceeded" },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) return <div>Loading jobs...</div>;

    return (
        <div style={{ background: "#fff", padding: 20, borderRadius: 8, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Recent Jobs</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {jobs.map((job) => (
                    <div key={job.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, border: "1px solid #eee", borderRadius: 6 }}>
                        <div>
                            <div style={{ fontWeight: 500 }}>{job.type}</div>
                            <div style={{ fontSize: 12, color: "#666" }}>ID: {job.id}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{
                                padding: "4px 8px",
                                borderRadius: 4,
                                fontSize: 12,
                                fontWeight: 500,
                                background: job.status === "completed" ? "#dcfce7" : job.status === "running" ? "#dbeafe" : job.status === "failed" ? "#fee2e2" : "#f3f4f6",
                                color: job.status === "completed" ? "#166534" : job.status === "running" ? "#1e40af" : job.status === "failed" ? "#991b1b" : "#374151"
                            }}>
                                {job.status}
                            </span>
                            <span style={{ fontSize: 12, color: "#999" }}>
                                {new Date(job.createdAt).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
