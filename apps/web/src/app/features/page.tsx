"use client";

import { motion } from "framer-motion";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import {
    Wand2, FileSearch, ShieldCheck, Download,
    MousePointerClick, Share2, History, Languages
} from "lucide-react";

const features = [
    {
        title: "AI Writer",
        description: "Generate professional summaries and bullet points instantly.",
        icon: Wand2,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        colSpan: "col-span-1 md:col-span-2",
    },
    {
        title: "ATS Scanner",
        description: "Check your resume against job descriptions.",
        icon: FileSearch,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        colSpan: "col-span-1",
    },
    {
        title: "Privacy First",
        description: "Your data is encrypted and never shared. We are GDPR compliant.",
        icon: ShieldCheck,
        color: "text-green-400",
        bg: "bg-green-500/10",
        colSpan: "col-span-1",
    },
    {
        title: "PDF Export",
        description: "Download in perfectly formatted PDF or Word docs.",
        icon: Download,
        color: "text-orange-400",
        bg: "bg-orange-500/10",
        colSpan: "col-span-1 md:col-span-2",
    },
    {
        title: "Drag & Drop",
        description: "Easily rearrange sections with intuitive controls.",
        icon: MousePointerClick,
        color: "text-pink-400",
        bg: "bg-pink-500/10",
        colSpan: "col-span-1",
    },
    {
        title: "Smart Sharing",
        description: "Share a live link to your resume with analytics.",
        icon: Share2,
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
        colSpan: "col-span-1",
    },
    {
        title: "Version History",
        description: "Never lose a change. Restore previous versions anytime.",
        icon: History,
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        colSpan: "col-span-1",
    },
    {
        title: "Multi-Language",
        description: "Create resumes in multiple languages seamlessly.",
        icon: Languages,
        color: "text-indigo-400",
        bg: "bg-indigo-500/10",
        colSpan: "col-span-1",
    },
];

export default function FeaturesPage() {
    return (
        <main className="min-h-screen bg-[#0B0C15] text-white">
            <LandingNavbar />

            <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Everything you need <br /> to get hired
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        A comprehensive suite of tools designed to help you craft the perfect resume and land your dream job.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -5 }}
                            className={`${feature.colSpan} p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all group`}
                        >
                            <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed font-light">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <LandingFooter />
        </main>
    );
}
