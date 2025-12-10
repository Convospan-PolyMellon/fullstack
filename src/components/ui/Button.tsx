import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
}

export function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20",
        secondary: "bg-white/10 hover:bg-white/20 text-white",
        outline: "border border-white/20 hover:bg-white/5 text-white",
        ghost: "hover:bg-white/5 text-white/60 hover:text-white",
        danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
    };

    return (
        <button
            {...props}
            className={cn(
                "px-6 py-3 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                className
            )}
        >
            {children}
        </button>
    );
}
