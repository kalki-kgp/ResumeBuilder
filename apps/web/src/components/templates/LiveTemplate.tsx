"use client";

import {
    Briefcase,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
    Sparkles,
    Wrench,
    Linkedin,
    Github,
    FileText,
} from "lucide-react";
import { forwardRef } from "react";

// ============ Types ============
interface ContactInfo {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
}

interface Experience {
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

interface Education {
    id: string;
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa: string;
}

interface ResumeFormData {
    contact: ContactInfo;
    summary: string;
    experience: Experience[];
    education: Education[];
    skills: string[];
}

interface LiveTemplateProps {
    templateId: string;
    data: ResumeFormData;
}

// ============ Main Component ============
export const LiveTemplate = forwardRef<HTMLDivElement, LiveTemplateProps>(
    function LiveTemplate({ templateId, data }, ref) {
        switch (templateId) {
            case "classic-elegant":
                return <ClassicElegantTemplate ref={ref} data={data} />;
            case "modern-professional":
            default:
                return <ModernProfessionalTemplate ref={ref} data={data} />;
        }
    }
);

// ============ Modern Professional Template ============
const ModernProfessionalTemplate = forwardRef<HTMLDivElement, { data: ResumeFormData }>(
    function ModernProfessionalTemplate({ data }, ref) {
        const hasContact = data.contact.email || data.contact.phone || data.contact.location;
        const hasLinks = data.contact.linkedin || data.contact.github;
        const isEmpty = !data.summary && data.experience.length === 0 && data.education.length === 0 && data.skills.length === 0;

        return (
            <div ref={ref} className="bg-white rounded-lg shadow-2xl aspect-[1/1.414] p-12 text-black">
                {/* Header */}
                <div className="border-b-2 border-gray-800 pb-4 mb-6">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {data.contact.fullName || "Your Name"}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        {hasContact ? (
                            <>
                                {data.contact.email && (
                                    <span className="flex items-center gap-1">
                                        <Mail className="w-3 h-3" /> {data.contact.email}
                                    </span>
                                )}
                                {data.contact.phone && (
                                    <span className="flex items-center gap-1">
                                        <Phone className="w-3 h-3" /> {data.contact.phone}
                                    </span>
                                )}
                                {data.contact.location && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> {data.contact.location}
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-gray-400 italic">Add your contact information</span>
                        )}
                    </div>
                    {hasLinks && (
                        <div className="flex items-center gap-4 text-sm text-blue-600 mt-2">
                            {data.contact.linkedin && (
                                <span className="flex items-center gap-1">
                                    <Linkedin className="w-3 h-3" /> {data.contact.linkedin}
                                </span>
                            )}
                            {data.contact.github && (
                                <span className="flex items-center gap-1">
                                    <Github className="w-3 h-3" /> {data.contact.github}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Summary */}
                {data.summary && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-600" /> Professional Summary
                        </h2>
                        <p className="text-gray-700 text-sm leading-relaxed">{data.summary}</p>
                    </div>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-blue-600" /> Work Experience
                        </h2>
                        <div className="space-y-4">
                            {data.experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{exp.title || "Position"}</h3>
                                            <p className="text-gray-600 text-sm">{exp.company}{exp.location && `, ${exp.location}`}</p>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {exp.startDate || "Start"} — {exp.endDate || "End"}
                                        </span>
                                    </div>
                                    {exp.description && (
                                        <p className="text-gray-700 text-sm mt-2 whitespace-pre-line">{exp.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-blue-600" /> Education
                        </h2>
                        <div className="space-y-3">
                            {data.education.map((edu) => (
                                <div key={edu.id} className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{edu.degree || "Degree"}</h3>
                                        <p className="text-gray-600 text-sm">{edu.institution || "Institution"}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm text-gray-500">
                                            {edu.startDate || ""} {edu.startDate && edu.endDate && "—"} {edu.endDate || ""}
                                        </span>
                                        {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills */}
                {data.skills.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Wrench className="w-4 h-4 text-blue-600" /> Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {isEmpty && (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <FileText className="w-12 h-12 mb-4 opacity-50" />
                        <p>Start filling in your information on the left</p>
                        <p className="text-sm">Your resume will appear here</p>
                    </div>
                )}
            </div>
        );
    }
);

// ============ Classic Elegant Template ============
const ClassicElegantTemplate = forwardRef<HTMLDivElement, { data: ResumeFormData }>(
    function ClassicElegantTemplate({ data }, ref) {
        const hasContact = data.contact.email || data.contact.phone || data.contact.location;
        const isEmpty = !data.summary && data.experience.length === 0 && data.education.length === 0 && data.skills.length === 0;

        return (
            <div ref={ref} className="bg-white rounded-lg shadow-2xl aspect-[1/1.414] p-12 text-black font-serif">
                {/* Header - Centered */}
                <div className="text-center border-b border-gray-300 pb-6 mb-8">
                    <h1 className="text-5xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Georgia, serif" }}>
                        {data.contact.fullName || "Your Name"}
                    </h1>
                    <div className="flex justify-center items-center gap-4 text-sm text-gray-600 mt-4">
                        {hasContact ? (
                            <>
                                {data.contact.email && <span>{data.contact.email}</span>}
                                {data.contact.email && data.contact.phone && <span className="text-gray-400">•</span>}
                                {data.contact.phone && <span>{data.contact.phone}</span>}
                                {(data.contact.email || data.contact.phone) && data.contact.location && <span className="text-gray-400">•</span>}
                                {data.contact.location && <span>{data.contact.location}</span>}
                            </>
                        ) : (
                            <span className="text-gray-400 italic">Add your contact information</span>
                        )}
                    </div>
                </div>

                {/* Two-column layout */}
                <div className="grid grid-cols-3 gap-8">
                    {/* Left Column - 1/3 */}
                    <div className="col-span-1 space-y-6">
                        {/* Skills */}
                        {data.skills.length > 0 && (
                            <div>
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-200 pb-2">
                                    Skills
                                </h2>
                                <div className="space-y-1">
                                    {data.skills.map((skill, i) => (
                                        <div key={i} className="text-gray-700 text-sm">
                                            • {skill}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {data.education.length > 0 && (
                            <div>
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-200 pb-2">
                                    Education
                                </h2>
                                <div className="space-y-4">
                                    {data.education.map((edu) => (
                                        <div key={edu.id}>
                                            <h3 className="font-semibold text-gray-900 text-sm">{edu.degree || "Degree"}</h3>
                                            <p className="text-gray-600 text-xs">{edu.institution}</p>
                                            <p className="text-gray-500 text-xs italic">
                                                {edu.startDate} {edu.startDate && edu.endDate && "-"} {edu.endDate}
                                            </p>
                                            {edu.gpa && <p className="text-gray-500 text-xs">GPA: {edu.gpa}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Links */}
                        {(data.contact.linkedin || data.contact.github) && (
                            <div>
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-200 pb-2">
                                    Links
                                </h2>
                                <div className="space-y-1 text-xs text-gray-600">
                                    {data.contact.linkedin && <p>{data.contact.linkedin}</p>}
                                    {data.contact.github && <p>{data.contact.github}</p>}
                                    {data.contact.portfolio && <p>{data.contact.portfolio}</p>}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - 2/3 */}
                    <div className="col-span-2 space-y-6">
                        {/* Summary / Profile */}
                        {data.summary && (
                            <div>
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-200 pb-2">
                                    Profile
                                </h2>
                                <p className="text-gray-700 text-sm leading-relaxed italic">{data.summary}</p>
                            </div>
                        )}

                        {/* Experience */}
                        {data.experience.length > 0 && (
                            <div>
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-200 pb-2">
                                    Experience
                                </h2>
                                <div className="space-y-4">
                                    {data.experience.map((exp) => (
                                        <div key={exp.id}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{exp.title || "Position"}</h3>
                                                    <p className="text-gray-600 text-sm italic">{exp.company}</p>
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {exp.startDate} — {exp.endDate || "Present"}
                                                </span>
                                            </div>
                                            {exp.description && (
                                                <p className="text-gray-700 text-sm mt-2 whitespace-pre-line">{exp.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Empty state */}
                {isEmpty && (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 col-span-3">
                        <FileText className="w-12 h-12 mb-4 opacity-50" />
                        <p>Start filling in your information on the left</p>
                        <p className="text-sm">Your resume will appear here</p>
                    </div>
                )}
            </div>
        );
    }
);

export default LiveTemplate;
