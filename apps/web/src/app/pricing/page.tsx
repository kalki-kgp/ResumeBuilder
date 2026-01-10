"use client";

import { useState } from "react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PricingCard, PricingTier } from "@/components/pricing/PricingCard";

const tiers: PricingTier[] = [
    {
        name: "Starter Plan",
        description: "Beginners who want to explore optimal resumes without commitment.",
        price: { monthly: "$0", annually: "$0" },
        ctaText: "Get Started Free",
        features: [
            { text: "1 resume profile", included: true },
            { text: "3 AI optimizations/month", included: true },
            { text: "Basic ATS scan", included: true },
            { text: "Standard templates", included: true },
            { text: "Export as PDF", included: true },
        ]
    },
    {
        name: "Creator Plan",
        description: "Job seekers who need more flexibility and tailored content.",
        price: { monthly: "$18.00", annually: "$15.00" },
        ctaText: "Upgrade",
        highlight: true,
        features: [
            { text: "Unlimited resume profiles", included: true },
            { text: "Unlimited AI optimizations", included: true },
            { text: "Advanced ATS keyword targeting", included: true },
            { text: "Premium templates", included: true },
            { text: "Cover letter generator", included: true },
            { text: "Job matching feed", included: true },
            { text: "LinkedIn profile optimization", included: true },
        ]
    },
    {
        name: "Enterprise Plan",
        description: "Power users and agencies producing high volume content.",
        price: { monthly: "$49.00", annually: "$39.00" },
        ctaText: "Contact Sales",
        features: [
            { text: "Custom branding", included: true },
            { text: "Priority support", included: true },
            { text: "Human resume review", included: true },
            { text: "Interview prep coaching", included: true },
            { text: "Application tracking system", included: true },
            { text: "Team collaboration", included: true },
            { text: "API Access", included: true },
        ]
    }
];

export default function PricingPage() {
    const [isAnnual, setIsAnnual] = useState(false);

    return (
        <main className="min-h-screen bg-[#0B0C15] text-white">
            <LandingNavbar />

            <div className="pt-32 pb-24 px-6 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-purple-900/20 blur-[120px] rounded-full -z-10" />

                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Choose the Perfect Plan for You
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
                            Choose a plan that will help you create professional resumes with AI quickly and easily. Suitable for personal projects, and active job hunting.
                        </p>

                        {/* Toggle */}
                        <div className="inline-flex items-center p-1 bg-white/5 rounded-full border border-white/10">
                            <button
                                onClick={() => setIsAnnual(false)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!isAnnual ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setIsAnnual(true)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${isAnnual ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                            >
                                Annually
                            </button>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        <PricingCard tier={tiers[0]} annual={isAnnual} />
                        <PricingCard tier={tiers[1]} annual={isAnnual} />
                        <PricingCard tier={tiers[2]} annual={isAnnual} />
                    </div>
                </div>
            </div>

            <LandingFooter />
        </main>
    );
}
