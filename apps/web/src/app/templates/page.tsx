"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

import { TemplateCard } from "@/components/templates/TemplateCard";
import { resumeApi } from "@/lib/api";
import { authStorage } from "@/lib/auth";

const templates = [
    {
        id: "modern-slate",
        title: "Modern Slate",
        description: "Clean, crisp, and ATS-friendly. Perfect for corporate roles.",
        image: "bg-blue-900/40",
        tags: ["ATS Friendly", "Corporate"],
    },
    {
        id: "creative",
        title: "Creative Spark",
        description: "Bold headers and a unique layout to showcase your design portfolio.",
        image: "bg-purple-900/40",
        tags: ["Design", "Modern"],
    },
    {
        id: "minimal",
        title: "Minimalist Mono",
        description: "Focus purely on content with this elegant, typographically perfect template.",
        image: "bg-stone-800/60",
        tags: ["Simple", "Clean"],
    },
    {
        id: "tech",
        title: "Tech Lead",
        description: "Optimized for engineering managers and senior developers.",
        image: "bg-cyan-900/40",
        tags: ["Engineering", "Dark Mode"],
    },
    {
        id: "executive",
        title: "Executive Suite",
        description: "Command attention with a layout designed for C-level executives and VPs.",
        image: "bg-indigo-900/40",
        tags: ["Senior", "Leadership"],
    },
    {
        id: "startup",
        title: "Startup Hustle",
        description: "Dynamic and energetic, perfect for showing impact in fast-paced environments.",
        image: "bg-emerald-900/40",
        tags: ["Growth", "Impact"],
    },
];

const categories = ["All Styles", "ATS Optimized", "Creative", "Simple", "Tech"];

export default function TemplatesPage() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState("All Styles");
    const [isCreating, setIsCreating] = useState(false);

    const handleUseTemplate = async (templateId: string, templateTitle: string) => {
        try {
            setIsCreating(true);
            const token = authStorage.getToken();

            if (!token) {
                router.push("/login"); // Should typically redirect to login with callback
                return;
            }

            // 1. Create a new resume
            const resume = await resumeApi.create(token, {
                title: `My ${templateTitle} Resume`,
            });

            // 2. Redirect to editor with template selected
            // Using window.location to ensure full navigation and state reset if needed
            router.push(`/resumes/${resume.id}/editor?template=${templateId}`);

        } catch (error) {
            console.error("Failed to create resume:", error);
            alert("Failed to create resume. Please try again.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0B0C15] text-white">
            {/* Custom Nav for Template Selection Context */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-[#0B0C15]/80 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="h-6 w-px bg-white/10" />
                    <span className="font-semibold text-white">Template Gallery</span>
                </div>
                <div className="text-sm text-gray-500 hidden md:block">
                    {isCreating ? "Creating Workspace..." : "Step 1: Choose Template"}
                </div>
            </nav>

            <div className="pt-32 pb-24 px-6 max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="text-center mb-16 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full -z-10" />

                    <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Choose Your Foundation
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Select a professional template to make your resume stand out.
                    </p>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 sticky top-24 z-40 bg-[#0B0C15]/80 backdrop-blur-xl p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeCategory === cat
                                        ? 'bg-white text-black shadow-lg shadow-white/10'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search templates..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/20 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                    {templates.map((template, index) => (
                        <TemplateCard
                            key={template.id}
                            {...template}
                            index={index}
                            onSelect={() => handleUseTemplate(template.id, template.title)}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
