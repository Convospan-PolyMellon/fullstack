"use client";

import { usePathname } from "next/navigation";
import { NotificationBell } from "@/components/ui/NotificationBell";

import { Search, Sparkles } from "lucide-react";
import { QuickActions } from "./QuickActions";

export function DashboardHeader() {
    const pathname = usePathname();
    const segments = pathname?.split("/").filter(Boolean) || [];
    const breadcrumb = segments.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" / ");

    return (
        <header className="fixed top-0 right-0 left-64 h-16 glass-panel border-b border-white/10 z-40 flex items-center justify-between px-8">
            {/* Left: Breadcrumb & Search */}
            <div className="flex items-center gap-8 flex-1">
                <div className="flex items-center text-sm text-gray-400 min-w-max">
                    <span className="font-medium text-white">{breadcrumb || "Dashboard"}</span>
                </div>

                <div className="relative max-w-md w-full hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search leads, campaigns..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                        <span className="text-[10px] text-gray-500 border border-white/10 rounded px-1.5 bg-black/20">⌘ K</span>
                    </div>
                </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-4">
                <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 transition-all text-sm font-medium group">
                    <Sparkles className="w-4 h-4 group-hover:text-purple-200 transition-colors" />
                    <span>Ask AI</span>
                </button>

                <div className="h-6 w-px bg-white/10" />

                <QuickActions />

                <div className="h-6 w-px bg-white/10" />

                <NotificationBell />

                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-[2px] cursor-pointer hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                        <span className="text-xs font-bold text-white">JD</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
