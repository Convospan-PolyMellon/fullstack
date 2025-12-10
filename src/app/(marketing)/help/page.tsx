"use client";

import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FAQSection } from "@/components/support/FAQSection";
import { ContactSupportForm } from "@/components/support/ContactSupportForm";

export default function HelpPage() {
    return (
        <div className="p-8 space-y-8 max-w-6xl mx-auto">
            <SectionHeader title="Help Center" subtitle="Find answers or get in touch with our team" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <FAQSection />
                </div>
                <div className="space-y-8">
                    <ContactSupportForm />
                </div>
            </div>
        </div>
    );
}
