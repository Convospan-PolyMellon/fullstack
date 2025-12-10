import SectionTitle from "../../components/SectionTitle";
import GlassCard from "../../components/GlassCard";

export default function AboutPage() {
    return (
        <div className="section">
            <SectionTitle title="About CovoSpan" />
            <GlassCard title="Our Mission">
                <p>
                    At CovoSpan, we believe that growth teams should focus on strategy and relationships, not repetitive tasks. Our AI Agent Army handles the grunt work of prospecting, outreach, and engagement so you can close more deals.
                </p>
            </GlassCard>
        </div>
    );
}
