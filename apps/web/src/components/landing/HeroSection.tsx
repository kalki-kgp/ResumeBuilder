import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Upload } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
    return (
        <div className="relative pt-32 pb-20 px-6 overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-landing-primary/20 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-6">
                    <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-white">
                        Transform Your <br />
                        Resume with AI
                    </h1>
                    <p className="text-lg text-gray-400 max-w-lg">
                        Upload any <span className="text-blue-400 border-b border-blue-400/30">resume</span>, and let our AI create an optimized professional profile to land your next job.
                    </p>

                    <div className="flex items-center gap-4 mt-4">
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 border-t border-white/20">
                            Upload Resume
                        </Button>
                        <Button size="lg" variant="outline" className="bg-transparent border-landing-border text-gray-300 hover:text-white hover:bg-white/5">
                            See How It Works
                        </Button>
                    </div>

                    {/* Floating document icons/decorations */}
                    <div className="relative h-32 mt-8 w-full">
                        {/* Abstract representations of docs floating */}
                        <div className="absolute left-10 top-0 bg-[#1E293B] p-3 rounded-lg border border-white/10 shadow-xl -rotate-6">
                            <div className="w-12 h-1 bg-white/20 rounded mb-2" />
                            <div className="w-8 h-1 bg-white/20 rounded" />
                        </div>
                        <div className="absolute left-32 top-8 bg-[#1E293B] p-3 rounded-lg border border-white/10 shadow-xl rotate-12 z-10">
                            <div className="w-10 h-1 bg-white/20 rounded mb-2" />
                            <div className="w-6 h-1 bg-white/20 rounded" />
                        </div>
                    </div>
                </div>

                {/* Right Content - Visual Flow */}
                <div className="relative">
                    <div className="flex items-center justify-between gap-4">
                        {/* Step 1: Upload */}
                        <div className="flex-1 bg-landing-card border border-landing-border rounded-xl p-4 backdrop-blur-sm relative group">
                            <div className="absolute -top-3 left-4 text-xs font-mono text-gray-400 bg-landing-bg px-2">Uploaded Resume</div>
                            <div className="aspect-[3/4] bg-white/5 rounded-lg border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute top-0 w-full h-8 bg-blue-500/20 flex items-center px-2 gap-1 border-b border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-red-400" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                    <div className="w-2 h-2 rounded-full bg-green-400" />
                                    <span className="ml-2 text-[8px] text-gray-400">Uploaded Resume.pdf</span>
                                </div>
                                <div className="p-4 w-full h-full pt-10 space-y-2 opacity-50">
                                    <div className="w-3/4 h-2 bg-white/20 rounded" />
                                    <div className="w-1/2 h-2 bg-white/20 rounded" />
                                    <div className="w-full h-20 bg-white/10 rounded mt-4" />
                                    <div className="w-full h-20 bg-white/10 rounded" />
                                </div>
                            </div>
                        </div>

                        <ArrowRight className="w-6 h-6 text-blue-400/50 flex-shrink-0" />

                        {/* Step 2: AI Profile */}
                        <div className="flex-1 bg-landing-card border border-landing-border rounded-xl p-4 backdrop-blur-sm relative">
                            <div className="absolute -top-3 left-4 text-xs font-mono text-gray-400 bg-landing-bg px-2">AI-Generated Profile</div>
                            <div className="aspect-[3/4] bg-[#0F111A] rounded-lg border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)] p-3 overflow-hidden">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500" />
                                    <div>
                                        <div className="w-16 h-2 bg-white/40 rounded" />
                                        <div className="w-10 h-1.5 bg-white/20 rounded mt-1" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-16 bg-white/5 rounded border border-white/5 p-2">
                                        <div className="w-12 h-1.5 bg-blue-400/50 rounded mb-2" />
                                        <div className="w-full h-1 bg-white/10 rounded" />
                                        <div className="w-2/3 h-1 bg-white/10 rounded mt-1" />
                                    </div>
                                    <div className="h-24 bg-white/5 rounded border border-white/5 p-2">
                                        <div className="w-12 h-1.5 bg-blue-400/50 rounded mb-2" />
                                        <div className="space-y-1">
                                            <div className="flex gap-2"><div className="w-1 h-1 rounded-full bg-blue-400 mt-1" /><div className="w-full h-1 bg-white/10 rounded" /></div>
                                            <div className="flex gap-2"><div className="w-1 h-1 rounded-full bg-blue-400 mt-1" /><div className="w-full h-1 bg-white/10 rounded" /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ArrowRight className="w-6 h-6 text-blue-400/50 flex-shrink-0" />

                        {/* Step 3: Optimized */}
                        <div className="flex-1 bg-landing-card border border-landing-border rounded-xl p-4 backdrop-blur-sm relative">
                            <div className="absolute -top-3 left-4 text-xs font-mono text-gray-400 bg-landing-bg px-2">ATS-Optimized Resume</div>
                            <div className="aspect-[3/4] bg-[#0F111A] rounded-lg border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.15)] p-3 relative overflow-hidden">
                                <div className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">92</div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500" />
                                    <div>
                                        <div className="w-16 h-2 bg-white/40 rounded" />
                                        <div className="w-10 h-1.5 bg-white/20 rounded mt-1" />
                                    </div>
                                </div>
                                {/* Lines of text */}
                                <div className="space-y-2">
                                    <div className="w-full h-1 bg-white/20 rounded" />
                                    <div className="w-5/6 h-1 bg-white/20 rounded" />
                                    <div className="w-full h-1 bg-white/20 rounded" />
                                    <div className="mt-4 w-1/3 h-1.5 bg-indigo-400/50 rounded" />
                                    <div className="w-full h-1 bg-white/20 rounded" />
                                    <div className="w-5/6 h-1 bg-white/20 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Connecting gradient line behind */}
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -z-10" />
                </div>
            </div>
        </div>
    );
}
