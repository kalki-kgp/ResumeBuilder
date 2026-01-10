import { Upload, User, FileText, ChevronRight } from "lucide-react";

export function HowItWorksSection() {
    const steps = [
        {
            step: 1,
            title: "Upload Your Resume",
            description: "Add your existing resume or document.",
            icon: Upload,
            visual: (
                <div className="w-full h-32 bg-landing-bg/50 rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                    <div className="w-16 h-12 bg-white/10 rounded-md flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {/* Replaced loading with upload icon for static look if desired, but spinner is dynamic */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Upload className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                </div>
            ),
        },
        {
            step: 2,
            title: "AI Builds Your Profile",
            description: "Our AI analyzes and enhances your information.",
            icon: User,
            visual: (
                <div className="w-full h-32 bg-landing-bg/50 rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors" />
                    <div className="flex gap-2 items-center">
                        <div className="w-12 h-16 bg-white/5 rounded border border-white/10 p-1 flex flex-col gap-1">
                            <div className="w-full h-8 bg-white/5 rounded" />
                            <div className="w-full h-1 bg-white/5 rounded" />
                            <div className="w-2/3 h-1 bg-white/5 rounded" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                            <User className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="w-16 h-10 bg-white/5 rounded border border-white/10 flex items-center p-2 gap-2">
                            <div className="w-full space-y-1">
                                <div className="w-full h-1 bg-white/10 rounded" />
                                <div className="w-2/3 h-1 bg-white/10 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            step: 3,
            title: "Get Your New Resume",
            description: "Generate an ATS-friendly resume & find matching jobs.",
            icon: FileText,
            visual: (
                <div className="w-full h-32 bg-landing-bg/50 rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors" />
                    <div className="relative w-48 h-24 bg-white shadow-xl rounded-t-lg -mb-8 overflow-hidden transform group-hover:-translate-y-2 transition-transform">
                        <div className="p-3 flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200" />
                            <div className="flex-1 space-y-2">
                                <div className="w-20 h-2 bg-gray-200 rounded" />
                                <div className="w-full h-1 bg-gray-100 rounded" />
                                <div className="w-full h-1 bg-gray-100 rounded" />
                            </div>
                            <div className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-xs">91</div>
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <section className="py-24 px-6 relative">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        How It Works: Just 3 Simple Steps
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative h-full p-1 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 hover:border-white/20 transition-all">
                                <div className="h-full bg-[#0B0C15]/80 backdrop-blur-xl rounded-xl p-6 flex flex-col">
                                    {/* Visual Area */}
                                    <div className="mb-8">
                                        {step.visual}
                                    </div>

                                    <div className="mt-auto">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-lg font-mono text-gray-500">{step.step}.</span>
                                            <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                                        </div>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Connector Arrow (Desktop only) */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 -right-4 z-10 text-gray-600">
                                    <ChevronRight className="w-8 h-8" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
