import SectionTitle from "../../components/SectionTitle";
import GlassCard from "../../components/GlassCard";

export default function CreditsPage() {
    return (
        <div className="section">
            <SectionTitle title="Credits & Usage" />
            <GlassCard title="Current Balance">
                <h2 className="text-5xl font-bold text-purple-400">2,500</h2>
                <p className="mt-2 text-gray-400">Credits remaining this month</p>
            </GlassCard>
        </div>
    );
}
