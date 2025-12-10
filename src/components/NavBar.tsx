"use client";

import { useState, useEffect } from "react";
import { MobileMenu } from "./MobileMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationBell } from "./ui/NotificationBell";

export function NavBar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/campaigns", label: "Campaigns" },
        { href: "/templates", label: "Templates" },
        { href: "/inbox", label: "Inbox" },
        { href: "/team", label: "Team" },
        { href: "/integrations", label: "Integrations" },
        { href: "/profile", label: "Profile" },
        { href: "/admin/users", label: "Users" },
        { href: "/admin/audit", label: "Audit" },
        { href: "/admin/rate-limits", label: "Limits" },
        { href: "/admin/health", label: "Health" },
        { href: "/csv-ingestion", label: "Import" },
        { href: "/workflows", label: "Workflows" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/0 ${scrolled ? "glass border-white/10 shadow-lg py-3" : "bg-transparent py-5 backdrop-blur-sm"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-blue-500/25 transition-all">
                        C
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        ConvoSpan
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-white/10 text-white shadow-inner"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Side Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-medium text-gray-300">1,250 Credits</span>
                    </div>

                    <div className="h-6 w-px bg-white/10" />

                    <NotificationBell />

                    <button className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-[2px] hover:scale-105 transition-transform">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                            <span className="text-sm font-bold text-white">JD</span>
                        </div>
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
                    onClick={() => setOpen(true)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                </button>
            </div>

            <MobileMenu isOpen={open} onClose={() => setOpen(false)} links={navLinks} />
        </nav>
    );
}
