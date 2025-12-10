"use client";

import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";
import { WorkflowControls } from "@/components/workflow/WorkflowControls";

export default function WorkflowsPage() {
    return (
        <main className="p-8 h-[calc(100vh-6rem)] flex flex-col">
            <div className="flex justify-between items-end mb-6">
                <SectionHeader title="Workflow Builder" subtitle="Automate your agent army" />
                <div className="flex gap-3 mb-10">
                    <Button className="bg-white/5 hover:bg-white/10">Save Draft</Button>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
                        Activate Workflow
                    </Button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
                <div className="lg:col-span-1">
                    <WorkflowControls />
                </div>
                <div className="lg:col-span-3 h-full">
                    <WorkflowCanvas />
                </div>
            </div>
        </main>
    );
}
