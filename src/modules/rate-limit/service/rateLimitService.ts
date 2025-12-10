import { NextResponse } from "next/server";

interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
}

// In-memory store for MVP (Use Redis/Upstash in production)
const ipStore = new Map<string, { count: number; resetTime: number }>();

export class RateLimitService {
    private config: RateLimitConfig;

    constructor(config: RateLimitConfig = { windowMs: 60 * 1000, maxRequests: 100 }) {
        this.config = config;
    }

    checkLimit(identifier: string): { success: boolean; limit: number; remaining: number; reset: number } {
        const now = Date.now();
        const record = ipStore.get(identifier);

        if (!record || now > record.resetTime) {
            // New window
            ipStore.set(identifier, {
                count: 1,
                resetTime: now + this.config.windowMs
            });
            return {
                success: true,
                limit: this.config.maxRequests,
                remaining: this.config.maxRequests - 1,
                reset: now + this.config.windowMs
            };
        }

        // Existing window
        if (record.count >= this.config.maxRequests) {
            return {
                success: false,
                limit: this.config.maxRequests,
                remaining: 0,
                reset: record.resetTime
            };
        }

        record.count++;
        return {
            success: true,
            limit: this.config.maxRequests,
            remaining: this.config.maxRequests - record.count,
            reset: record.resetTime
        };
    }

    // Helper to get current stats for Admin UI
    getStats() {
        const stats: any[] = [];
        ipStore.forEach((value, key) => {
            if (Date.now() < value.resetTime) {
                stats.push({ ip: key, ...value });
            }
        });
        return stats;
    }

    // Helper to update config dynamically
    updateConfig(newConfig: Partial<RateLimitConfig>) {
        this.config = { ...this.config, ...newConfig };
    }
}

export const rateLimitService = new RateLimitService();
