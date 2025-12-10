import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/auth/signin");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true }
    });

    if (user?.role !== "admin") {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-500 mb-4">403 Forbidden</h1>
                    <p className="text-gray-400 mb-6">You do not have permission to access the Admin Console.</p>
                    <Link href="/dashboard" className="px-4 py-2 bg-white/10 rounded hover:bg-white/20 transition">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Simple Admin Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-black/40 p-4 flex flex-col">
                <h2 className="text-xl font-bold text-purple-400 mb-8 px-2">Admin Console</h2>

                <nav className="space-y-2 flex-1">
                    <Link href="/admin" className="block px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white">
                        Dashboard
                    </Link>
                    <Link href="/dashboard" className="block px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
                        User App
                    </Link>
                </nav>

                <div className="p-4 text-xs text-gray-600">
                    v1.0.0
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
