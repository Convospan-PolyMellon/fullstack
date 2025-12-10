import SectionTitle from "../../components/SectionTitle";
import GlassCard from "../../components/GlassCard";

export default function FAQPage() {
    return (
        <div className="section">
            <SectionTitle title="Frequently Asked Questions" />
            <div className="grid gap-6">
                <GlassCard title="How does the AI work?">
                    Our agents use advanced LLMs to analyze data and generate personalized messages.
                </GlassCard>
                <GlassCard title="Is my data safe?">
                    Yes, we use enterprise-grade encryption and do not share your data.
                </GlassCard>
            </div>
        </div>
    );
}
