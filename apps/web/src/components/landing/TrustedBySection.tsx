import { Box, Layers, Zap, Hexagon, Command } from "lucide-react";

const companies = [
    { name: "Plausible", icon: Box },
    { name: "Zapier", icon: Zap },
    { name: "Linear", icon: Layers },
    { name: "Mixpanel", icon: Hexagon },
    { name: "Raycast", icon: Command },
];

export function TrustedBySection() {
    return (
        <section className="py-12 border-y border-landing-border/50 bg-black/20">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-sm text-gray-500 mb-8 font-medium uppercase tracking-wider">
                    Trusted by professionals worldwide
                </p>
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {companies.map((company, index) => (
                        <div key={index} className="flex items-center gap-2 group cursor-default">
                            <company.icon className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors" />
                            <span className="text-lg font-bold text-white group-hover:text-white transition-colors">
                                {company.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
