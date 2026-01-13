"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

import { TemplateCard } from "@/components/templates/TemplateCard";
import { TemplateSourceModal } from "@/components/templates/TemplateSourceModal";
import { templates, getTemplateById, getTemplateSchema, emptyResumeData } from "@/lib/templates";
import { resumeApi } from "@/lib/api";
import { authStorage } from "@/lib/auth";

const categories = ["All Styles", "ATS Friendly", "Corporate", "Traditional"];

export default function TemplatesPage() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState("All Styles");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<{
        id: string;
        name: string;
    } | null>(null);

    const handleTemplateSelect = (templateId: string, templateName: string) => {
        setSelectedTemplate({ id: templateId, name: templateName });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTemplate(null);
    };

    const handleCreateBlank = async () => {
        if (!selectedTemplate) return;

        const token = authStorage.getToken();
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            // Create a new resume with empty data
            const template = getTemplateById(selectedTemplate.id);
            const resume = await resumeApi.create(token, {
                title: `New ${template?.name || "Resume"}`,
            });

            // Navigate to editor with template and blank data
            router.push(
                `/resumes/${resume.id}/editor?template=${selectedTemplate.id}&source=blank`
            );
        } catch (error) {
            console.error("Failed to create resume:", error);
            alert("Failed to create resume. Please try again.");
        }
    };

    const handleSelectResume = async (resumeId: number) => {
        if (!selectedTemplate) return;

        const token = authStorage.getToken();
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            // Get the template schema
            const template = getTemplateById(selectedTemplate.id);
            if (!template) {
                throw new Error("Template not found");
            }

            // Fill the template with extracted data from the selected resume
            const templateSchema = getTemplateSchema(template);
            const filledData = await resumeApi.fillTemplate(token, resumeId, templateSchema);

            // Create a new resume with the filled data
            const resume = await resumeApi.create(token, {
                title: `${template.name} Resume`,
            });

            // Navigate to editor with template and filled data
            // Store the filled data in sessionStorage to pass to editor
            sessionStorage.setItem(
                `resume-data-${resume.id}`,
                JSON.stringify(filledData.data)
            );

            router.push(
                `/resumes/${resume.id}/editor?template=${selectedTemplate.id}&source=resume&sourceId=${resumeId}`
            );
        } catch (error) {
            console.error("Failed to fill template:", error);
            alert("Failed to auto-fill template. Please try again.");
        }
    };

    // Filter templates
    const filteredTemplates = templates.filter((template) => {
        const matchesSearch =
            searchQuery === "" ||
            template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            activeCategory === "All Styles" ||
            template.tags.some((tag) =>
                tag.toLowerCase().includes(activeCategory.toLowerCase())
            );

        return matchesSearch && matchesCategory;
    });

    return (
        <main className="min-h-screen bg-[#0B0C15] text-white">
            {/* Custom Nav for Template Selection Context */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-[#0B0C15]/80 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="h-6 w-px bg-white/10" />
                    <span className="font-semibold text-white">Template Gallery</span>
                </div>
                <div className="text-sm text-gray-500 hidden md:block">
                    Step 1: Choose a Template
                </div>
            </nav>

            <div className="pt-32 pb-24 px-6 max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="text-center mb-16 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full -z-10" />

                    <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Choose Your Template
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Select a professional template, then fill it from scratch or import
                        from an existing resume.
                    </p>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 sticky top-24 z-40 bg-[#0B0C15]/80 backdrop-blur-xl p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeCategory === cat
                                        ? "bg-white text-black shadow-lg shadow-white/10"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
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
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/20 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                    {filteredTemplates.map((template, index) => (
                        <TemplateCard
                            key={template.id}
                            id={template.id}
                            title={template.name}
                            description={template.description}
                            image={template.previewColor}
                            tags={template.tags}
                            index={index}
                            onSelect={() => handleTemplateSelect(template.id, template.name)}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {filteredTemplates.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-400">No templates match your search.</p>
                    </div>
                )}
            </div>

            {/* Source Selection Modal */}
            {selectedTemplate && (
                <TemplateSourceModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    templateId={selectedTemplate.id}
                    templateName={selectedTemplate.name}
                    onSelectBlank={handleCreateBlank}
                    onSelectResume={handleSelectResume}
                />
            )}
        </main>
    );
}
