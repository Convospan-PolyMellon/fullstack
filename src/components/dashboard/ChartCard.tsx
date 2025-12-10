"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function ChartCard({ title, series, subtitle }: any) {
    return (
        <div className="glass p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-purple-300">{title}</h3>
                    <div className="text-sm text-gray-300">{subtitle}</div>
                </div>
            </div>

            <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                    <LineChart data={series}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.06} />
                        <XAxis dataKey="day" tick={{ fill: "#9CA3AF" }} />
                        <YAxis tick={{ fill: "#9CA3AF" }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
