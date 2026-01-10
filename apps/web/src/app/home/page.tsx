import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TrustedBySection } from "@/components/landing/TrustedBySection";
import { JobMatchingSection } from "@/components/landing/JobMatchingSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-[#0B0C15] relative overflow-hidden">
            {/* Global Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[100px]" />
                <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-indigo-900/10 rounded-full blur-[80px]" />
            </div>

            <LandingNavbar />

            <div className="relative z-10">
                <HeroSection />
                <FeaturesSection />
                <JobMatchingSection />
                <TrustedBySection />
                <HowItWorksSection />
            </div>

            <div className="relative z-10">
                <LandingFooter />
            </div>
        </main>
    );
}
