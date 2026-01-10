import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PricingFeature {
    text: string;
    included: boolean;
}

export interface PricingTier {
    name: string;
    description: string;
    price: {
        monthly: string;
        annually: string;
    };
    features: PricingFeature[];
    highlight?: boolean;
    ctaText: string;
}

interface PricingCardProps {
    tier: PricingTier;
    annual: boolean;
}

export function PricingCard({ tier, annual }: PricingCardProps) {
    return (
        <div className={`
      relative p-8 rounded-2xl border transition-all duration-300
      ${tier.highlight
                ? 'bg-gradient-to-b from-[#1c1c2e] to-[#0f0f16] border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.15)] scale-105 z-10'
                : 'bg-[#0f0f16] border-white/5 hover:border-white/10'
            }
    `}>
            {tier.highlight && (
                <div className="absolute top-0 right-0 p-3">
                    <div className="bg-white text-black text-xs font-bold px-2 py-1 rounded">
                        Save 25%
                    </div>
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-gray-400 text-sm h-10">{tier.description}</p>
            </div>

            <div className="mb-8">
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                        {annual ? tier.price.annually : tier.price.monthly}
                    </span>
                    <span className="text-gray-500">
                        {annual ? '/mp' : '/monthly'}
                    </span>
                </div>
            </div>

            <Button
                className={`w-full h-12 mb-8 text-sm font-medium transition-all
          ${tier.highlight
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                    }
        `}
            >
                {tier.ctaText}
            </Button>

            <div className="space-y-4">
                <p className="text-sm font-semibold text-white">Plan Limits</p>
                {tier.features.slice(0, 2).map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 p-0.5 rounded-full bg-white/10">
                            <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-400">{feature.text}</span>
                    </div>
                ))}

                <div className="h-px bg-white/5 my-4" />

                <p className="text-sm font-semibold text-white">
                    {tier.name === 'Free' ? 'Features' : `Everything In ${tier.name === 'Pro' ? 'Free' : 'Pro'} Plus...`}
                </p>
                {tier.features.slice(2).map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className={`mt-0.5 p-0.5 rounded-full ${tier.highlight ? 'bg-purple-500/20' : 'bg-white/10'}`}>
                            <Check className={`w-3 h-3 ${tier.highlight ? 'text-purple-400' : 'text-white'}`} />
                        </div>
                        <span className="text-sm text-gray-400">{feature.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
