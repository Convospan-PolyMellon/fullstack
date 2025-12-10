import GlowButton from "../components/GlowButton";
import GlassCard from "../components/GlassCard";
import SectionTitle from "../components/SectionTitle";

export default function Home() {
    return (
        <div className="w-full">

            {/* HERO */}
            <section className="text-center pt-32 pb-20">
                <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-purple-400 to-blue-500">
                    Reclaim Your Time. <br /> Supercharge Your Growth.
                </h1>
                <p className="text-xl text-gray-300 mt-4">
                    CovoSpan is the AI Agent Army that spans conversations across digital, social, and real-world workflows.
                </p>

                <div className="mt-10">
                    <GlowButton href="/dashboard">Get Started</GlowButton>
                </div>
            </section>

            {/* FEATURE EXAMPLE CARDS */}
            <section className="section grid grid-cols-1 md:grid-cols-3 gap-8">
                <GlassCard title="AI Outreach">
                    Personalized, automated messaging & follow-ups.
                </GlassCard>

                <GlassCard title="ICP Builder">
                    Analyze personas, industries, sentiment & buying signals.
                </GlassCard>

                <GlassCard title="LinkedIn Automation">
                    Comment, like, message, and connect automatically.
                </GlassCard>
            </section>

            {/* WHY COVOSPAN */}
            <SectionTitle title="Why Growth Teams Choose CovoSpan" />

            <section className="section grid grid-cols-1 md:grid-cols-2 gap-10">
                <GlassCard title="Faster Pipeline">
                    Enrich, qualify, and engage leads at 5x speed.
                </GlassCard>

                <GlassCard title="Always-On Agents">
                    Your AI works 24x7 — never missing a lead.
                </GlassCard>
            </section>

        </div>
    );
}
