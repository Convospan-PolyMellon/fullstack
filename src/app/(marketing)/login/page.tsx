"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <SectionHeader title="Welcome Back" subtitle="Sign in to your account" />

                <GlassCard>
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-300">Password</label>
                                <a href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0">
                            Sign In
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-[#0f172a] text-gray-400">Or continue with</span>
                            </div>
                        </div>

                        <button type="button" className="w-full glass py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-white/10 transition">
                            <span className="text-white font-medium">Google</span>
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-400">
                        Don't have an account?{" "}
                        <a href="/signup" className="text-blue-400 hover:text-blue-300 font-medium">Sign up</a>
                    </p>
                </GlassCard>
            </div>
        </main>
    );
}
