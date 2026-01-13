"use client";

import { Briefcase, GraduationCap, Mail, MapPin, Phone, Sparkles, Wrench } from "lucide-react";

// Sample data for template previews
const sampleData = {
    name: "Daniel Fetch",
    title: "Software Engineer",
    email: "daniel@email.com",
    phone: "+1 234 567 890",
    location: "San Francisco, CA",
    summary: "Experienced software engineer with 5+ years in full-stack development...",
    experience: [
        { title: "Senior Developer", company: "Tech Corp", dates: "2020 - Present" },
        { title: "Developer", company: "StartupXYZ", dates: "2018 - 2020" },
    ],
    education: [{ degree: "BS Computer Science", school: "MIT", dates: "2014 - 2018" }],
    skills: ["React", "TypeScript", "Node.js", "Python"],
};

interface TemplatePreviewProps {
    templateId: string;
    size?: "sm" | "md" | "lg";
    showSampleData?: boolean;
    className?: string;
}

export function TemplatePreview({ templateId, size = "md", showSampleData = true, className = "" }: TemplatePreviewProps) {
    const sizeClasses = {
        sm: "w-32 aspect-[1/1.4]",
        md: "w-48 aspect-[1/1.4]",
        lg: "w-64 aspect-[1/1.4]",
    };

    // Different template styles
    const renderTemplate = () => {
        switch (templateId) {
            case "modern-professional":
                return <ModernProfessionalPreview showData={showSampleData} />;
            case "classic-elegant":
                return <ClassicElegantPreview showData={showSampleData} />;
            default:
                return <ModernProfessionalPreview showData={showSampleData} />;
        }
    };

    return (
        <div className={`${sizeClasses[size]} bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
            <div className="w-full h-full transform scale-[0.25] origin-top-left" style={{ width: "400%", height: "400%" }}>
                {renderTemplate()}
            </div>
        </div>
    );
}

// Modern Professional Template Preview
function ModernProfessionalPreview({ showData }: { showData: boolean }) {
    if (!showData) {
        return (
            <div className="w-full h-full bg-white p-8">
                <div className="space-y-4">
                    <div className="h-8 w-48 bg-gray-200 rounded" />
                    <div className="h-4 w-32 bg-gray-100 rounded" />
                    <div className="mt-8 space-y-2">
                        <div className="h-3 w-full bg-gray-100 rounded" />
                        <div className="h-3 w-full bg-gray-100 rounded" />
                        <div className="h-3 w-3/4 bg-gray-100 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-white p-10 text-black">
            {/* Header */}
            <div className="border-b-2 border-gray-800 pb-6 mb-8">
                <h1 className="text-5xl font-bold text-gray-900 mb-2">{sampleData.name}</h1>
                <p className="text-xl text-blue-600 font-medium mb-4">{sampleData.title}</p>
                <div className="flex flex-wrap items-center gap-6 text-base text-gray-600">
                    <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4" /> {sampleData.email}
                    </span>
                    <span className="flex items-center gap-2">
                        <Phone className="w-4 h-4" /> {sampleData.phone}
                    </span>
                    <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> {sampleData.location}
                    </span>
                </div>
            </div>

            {/* Summary */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" /> Professional Summary
                </h2>
                <p className="text-gray-700 text-base leading-relaxed">{sampleData.summary}</p>
            </div>

            {/* Experience */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" /> Work Experience
                </h2>
                <div className="space-y-4">
                    {sampleData.experience.map((exp, i) => (
                        <div key={i} className="flex justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg">{exp.title}</h3>
                                <p className="text-gray-600">{exp.company}</p>
                            </div>
                            <span className="text-gray-500">{exp.dates}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Education */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" /> Education
                </h2>
                {sampleData.education.map((edu, i) => (
                    <div key={i} className="flex justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{edu.degree}</h3>
                            <p className="text-gray-600">{edu.school}</p>
                        </div>
                        <span className="text-gray-500">{edu.dates}</span>
                    </div>
                ))}
            </div>

            {/* Skills */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-blue-600" /> Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                    {sampleData.skills.map((skill, i) => (
                        <span key={i} className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-base">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Classic Elegant Template Preview
function ClassicElegantPreview({ showData }: { showData: boolean }) {
    if (!showData) {
        return (
            <div className="w-full h-full bg-white p-8">
                <div className="text-center mb-8">
                    <div className="h-8 w-48 bg-gray-200 rounded mx-auto" />
                    <div className="h-4 w-32 bg-gray-100 rounded mx-auto mt-2" />
                </div>
                <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-100 rounded" />
                    <div className="h-3 w-full bg-gray-100 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-white p-10 text-black">
            {/* Header - Centered */}
            <div className="text-center border-b border-gray-300 pb-6 mb-8">
                <h1 className="text-5xl font-serif font-bold text-gray-900 mb-2">{sampleData.name}</h1>
                <p className="text-xl text-gray-600 italic mb-4">{sampleData.title}</p>
                <div className="flex justify-center items-center gap-6 text-base text-gray-600">
                    <span>{sampleData.email}</span>
                    <span>•</span>
                    <span>{sampleData.phone}</span>
                    <span>•</span>
                    <span>{sampleData.location}</span>
                </div>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-3 gap-8">
                {/* Left Column - 1/3 */}
                <div className="col-span-1 space-y-8">
                    {/* Skills */}
                    <div>
                        <h2 className="text-lg font-serif font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">
                            Skills
                        </h2>
                        <div className="space-y-2">
                            {sampleData.skills.map((skill, i) => (
                                <div key={i} className="text-gray-700 text-base">
                                    • {skill}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Education */}
                    <div>
                        <h2 className="text-lg font-serif font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">
                            Education
                        </h2>
                        {sampleData.education.map((edu, i) => (
                            <div key={i} className="mb-4">
                                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                                <p className="text-gray-600 text-sm">{edu.school}</p>
                                <p className="text-gray-500 text-sm">{edu.dates}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column - 2/3 */}
                <div className="col-span-2 space-y-8">
                    {/* Summary */}
                    <div>
                        <h2 className="text-lg font-serif font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">
                            Profile
                        </h2>
                        <p className="text-gray-700 text-base leading-relaxed">{sampleData.summary}</p>
                    </div>

                    {/* Experience */}
                    <div>
                        <h2 className="text-lg font-serif font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">
                            Experience
                        </h2>
                        <div className="space-y-6">
                            {sampleData.experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">{exp.title}</h3>
                                            <p className="text-gray-600 italic">{exp.company}</p>
                                        </div>
                                        <span className="text-gray-500 text-sm">{exp.dates}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TemplatePreview;
