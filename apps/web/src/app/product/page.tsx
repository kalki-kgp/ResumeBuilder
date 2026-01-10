"use client";

import { motion } from "framer-motion";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, PenTool, LayoutTemplate, FileText, CheckCircle2 } from "lucide-react";

export default function ProductPage() {
    return (
        <main className="min-h-screen bg-[#0B0C15] text-white overflow-hidden">
            <LandingNavbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 relative px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full -z-10" />

                <div className="max-w-7xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
                    >
                        Crafted for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            Perfection
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto mb-12"
                    >
                        The most advanced AI resume builder ever created.
                        Experience real-time editing, intelligent suggestions, and pixel-perfect export.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative mx-auto max-w-5xl rounded-xl border border-white/10 p-2 bg-white/5 backdrop-blur-sm shadow-2xl"
                    >
                        <div className="aspect-[16/9] rounded-lg bg-[#1a1b26] overflow-hidden relative group">
                            {/* Mock Interface */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-mono text-sm">
                                [Interactive Product Demo Placeholder]
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Core Values / Features */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto space-y-32">

                    {/* Feature 1 */}
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1 space-y-6">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h2 className="text-4xl font-bold">Real-time Intelligence</h2>
                            <p className="text-lg text-gray-400 leading-relaxed">
                                Our AI engine analyzes your career history in real-time as you type, offering suggestions to improve impact, clarity, and grammar instantly. It&apos;s like having a professional editor by your side.
                            </p>
                            <ul className="space-y-3 mt-6">
                                {['Context-aware suggestions', 'Action verb optimizer', 'Skill gap analysis'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-gray-300">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 h-[400px] rounded-3xl bg-gradient-to-br from-purple-900/10 to-blue-900/10 border border-white/10 relative overflow-hidden">
                            {/* Decorative Elements */}
                            <div className="absolute inset-10 rounded-xl bg-[#0f0f16] border border-white/5 p-6 animate-pulse">
                                <div className="h-4 w-3/4 bg-white/10 rounded mb-4" />
                                <div className="h-4 w-1/2 bg-white/10 rounded mb-8" />
                                <div className="h-20 w-full bg-purple-500/5 rounded border border-purple-500/20 p-4">
                                    <div className="flex gap-2 items-center text-purple-300 text-sm mb-2">
                                        <Zap className="w-3 h-3" /> AI Suggestion
                                    </div>
                                    <div className="h-2 w-full bg-purple-500/10 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2 (Reversed) */}
                    <div className="flex flex-col md:flex-row-reverse items-center gap-16">
                        <div className="flex-1 space-y-6">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                <LayoutTemplate className="w-6 h-6" />
                            </div>
                            <h2 className="text-4xl font-bold">Dynamic Templates</h2>
                            <p className="text-lg text-gray-400 leading-relaxed">
                                Switch between professional layouts with a single click. Our design system ensures your content always fits perfectly, preserving hierarchy and readability across every template.
                            </p>
                            <ul className="space-y-3 mt-6">
                                {['ATS-Optimized layouts', 'Custom typography', 'Color themes'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-gray-300">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 h-[400px] rounded-3xl bg-gradient-to-bl from-blue-900/10 to-cyan-900/10 border border-white/10 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="grid grid-cols-2 gap-4 opacity-50">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-32 h-44 bg-white/5 border border-white/10 rounded-lg transform hover:-translate-y-2 transition-transform duration-500" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 mb-20">
                <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-3xl p-12 border border-white/10 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold mb-6">Ready to create something amazing?</h2>
                        <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
                            Join thousands of professionals who have upgraded their career with our tools.
                        </p>
                        <Button className="h-12 px-8 bg-white text-black hover:bg-gray-200 text-base">
                            Start Building Now <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </main>
    );
}
