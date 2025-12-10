import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export function GlassCard({ children, className = "", ...props }: GlassCardProps) {
    return (
        <div className={`glass-card p-6 rounded-xl ${className}`} {...props}>
            {children}
        </div>
    );
}
