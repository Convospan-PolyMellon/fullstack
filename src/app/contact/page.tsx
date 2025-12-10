import SectionTitle from "../../components/SectionTitle";
import GlassCard from "../../components/GlassCard";

export default function ContactPage() {
    return (
        <div className="section max-w-2xl">
            <SectionTitle title="Contact Us" />
            <GlassCard title="Get in Touch">
                <p className="mb-4">Have questions? We'd love to hear from you.</p>
                <p>Email: support@covospan.com</p>
            </GlassCard>
        </div>
    );
}
