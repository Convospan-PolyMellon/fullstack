import Link from "next/link";
import Nav from "./Nav";
import NotificationBell from "./dashboard/NotificationBell";

export default function Header() {
    return (
        <header className="glass fixed top-0 left-0 w-full z-20 py-4 px-6 flex justify-between items-center">
            <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                CovoSpan
            </Link>

            <div className="flex items-center gap-4">
                <NotificationBell />
                <Nav />
            </div>
        </header>
    );
}
