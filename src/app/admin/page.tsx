"use client";
import useSWR from "swr";
import {
    Users,
    Briefcase,
    Send,
    Activity,
    AlertTriangle,
    CreditCard
} from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboard() {
    const { data: stats, error } = useSWR("/api/admin/stats", fetcher, { refreshInterval: 10000 });

    if (error) return <div className="text-red-400">Failed to load stats</div>;
    if (!stats) return <div className="text-gray-400">Loading admin stats...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">System Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    label="Total Users"
                    value={stats.users}
                    icon={Users}
                    color="text-blue-400"
                />
                <StatCard
                    label="Total Teams"
                    value={stats.teams}
                    icon={Briefcase}
                    color="text-indigo-400"
                />
                <StatCard
                    label="Credits Consumed"
                    value={stats.creditsUsed.toLocaleString()}
                    icon={CreditCard}
                    color="text-green-400"
                />
                <StatCard
                    label="Active Campaigns"
                    value={`${stats.campaigns.active} / ${stats.campaigns.total}`}
                    icon={Send}
                    color="text-purple-400"
                />
                <StatCard
                    label="Pending Jobs"
                    value={stats.jobs.pending}
                    icon={Activity}
                    color="text-yellow-400"
                />
                <StatCard
                    label="Failed Jobs"
                    value={stats.jobs.failed}
                    icon={AlertTriangle}
                    color="text-red-400"
                />
            </div>

            {/* Placeholder for User Management Table */}
            <div className="glass p-6 rounded-xl mt-8">
                <h2 className="text-xl font-bold text-white mb-4">Recent System Activity</h2>
                <div className="text-gray-400 text-sm italic">
                    Log stream implementation pending...
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color }: any) {
    return (
        <div className="glass p-6 rounded-xl border border-white/5 flex items-center justify-between">
            <div>
                <div className="text-sm text-gray-400 mb-1">{label}</div>
                <div className="text-2xl font-bold text-white">{value}</div>
            </div>
            <div className={`p-3 rounded-lg bg-white/5 ${color}`}>
                <Icon size={24} />
            </div>
        </div>
    );
}
