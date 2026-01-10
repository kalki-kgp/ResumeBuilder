import { FileCheck, PenTool, Briefcase, LayoutTemplate } from "lucide-react";

const features = [
    {
        title: "ATS Score",
        description: "Analyze and optimize for ATS systems.",
        icon: FileCheck,
        color: "text-blue-400",
        gradient: "from-blue-500/20 to-blue-500/5",
    },
    {
        title: "AI Section Rewriting",
        description: "Improve and refine your resume content.",
        icon: PenTool,
        color: "text-indigo-400",
        gradient: "from-indigo-500/20 to-indigo-500/5",

    },
    {
        title: "Job Matching",
        description: "Find job opportunities tailored for you.",
        icon: Briefcase,
        color: "text-purple-400",
        gradient: "from-purple-500/20 to-purple-500/5",
    },
    {
        title: "Multiple Templates",
        description: "Choose from a variety of resume designs.",
        icon: LayoutTemplate,
        color: "text-cyan-400",
        gradient: "from-cyan-500/20 to-cyan-500/5",
    },
];

export function FeaturesSection() {
    return (
        <section className="py-24 px-6 relative">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Powerful Features to Boost Your Career
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`group p-6 rounded-xl border border-landing-border bg-gradient-to-b ${feature.gradient} backdrop-blur-sm hover:border-white/20 transition-all duration-300 hover:-translate-y-1`}
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className={`p-3 rounded-lg bg-landing-bg border border-white/5 ${feature.color}`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mt-2">{feature.title}</h3>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
