import { LRUCache } from "lru-cache";

type Options = {
    uniqueTokenPerInterval?: number;
    interval?: number;
};

export const rateLimit = (options?: Options) => {
    const tokenCache = new LRUCache({
        max: options?.uniqueTokenPerInterval || 500,
        ttl: options?.interval || 60000,
    });

    return {
        check: (limit: number, token: string) => {
            const tokenCount = (tokenCache.get(token) as number[]) || [0];
            if (tokenCount[0] === 0) {
                tokenCache.set(token, [1]);
            } else {
                tokenCount[0] += 1;
                tokenCache.set(token, tokenCount);
            }
            const currentUsage = tokenCount[0];
            const isRateLimited = currentUsage > limit;
            return {
                isRateLimited,
                currentUsage,
            };
        },
    };
};

// Global instance for AI endpoints (limit: 5 requests per minute per user)
export const aiLimiter = rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500
});
