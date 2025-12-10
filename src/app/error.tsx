"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <h1 className="text-6xl font-bold text-red-500">Oops!</h1>
            <h2 className="text-2xl font-semibold text-white">Something went wrong</h2>
            <p className="text-gray-400 max-w-md">
                We encountered an unexpected error. Our team has been notified.
            </p>
            <div className="flex gap-4">
                <Button variant="secondary" onClick={() => window.location.href = "/dashboard"}>
                    Go Home
                </Button>
                <Button variant="primary" onClick={() => reset()}>
                    Try Again
                </Button>
            </div>
        </div>
    );
}
