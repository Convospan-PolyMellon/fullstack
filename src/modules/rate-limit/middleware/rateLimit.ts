class RateLimitMiddleware {
    private requests: Map<string, number[]> = new Map();
    private limit = 100; // requests
    private window = 60 * 1000; // 1 minute

    checkLimit(ip: string): boolean {
        const now = Date.now();
        const timestamps = this.requests.get(ip) || [];

        // Filter out old requests
        const validTimestamps = timestamps.filter(t => now - t < this.window);

        if (validTimestamps.length >= this.limit) {
            return false;
        }

        validTimestamps.push(now);
        this.requests.set(ip, validTimestamps);
        return true;
    }
}

export const rateLimitMiddleware = new RateLimitMiddleware();
