import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";

const payments = [
    { id: "INV-001", date: "Oct 24, 2023", amount: "$49.00", status: "Paid" },
    { id: "INV-002", date: "Sep 24, 2023", amount: "$49.00", status: "Paid" },
    { id: "INV-003", date: "Aug 24, 2023", amount: "$49.00", status: "Paid" },
];

export function PaymentHistory() {
    return (
        <GlassCard>
            <h3 className="text-xl font-bold gradient-text mb-4">Payment History</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="text-xs uppercase bg-white/5 text-gray-400">
                        <tr>
                            <th className="px-4 py-3 rounded-tl-lg">Invoice</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3 rounded-tr-lg">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                <td className="px-4 py-3 font-medium text-white">{payment.id}</td>
                                <td className="px-4 py-3">{payment.date}</td>
                                <td className="px-4 py-3">{payment.amount}</td>
                                <td className="px-4 py-3">
                                    <Badge variant={payment.status === "Paid" ? "success" : "warning"}>
                                        {payment.status}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    );
}
