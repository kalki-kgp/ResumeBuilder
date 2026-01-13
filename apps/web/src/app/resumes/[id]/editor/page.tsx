"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
    ArrowLeft,
    ChevronDown,
    ChevronRight,
    User,
    Briefcase,
    GraduationCap,
    Wrench,
    FileText,
    Plus,
    Trash2,
    Download,
    Eye,
    Mail,
    Phone,
    MapPin,
    Globe,
    Linkedin,
    Github,
    X,
    Loader2,
    Palette,
} from "lucide-react";
import { authStorage } from "@/lib/auth";
import { resumeApi, Resume } from "@/lib/api";
import { templates, getTemplateById } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { TemplatePreview } from "@/components/templates/TemplatePreview";
import { LiveTemplate } from "@/components/templates/LiveTemplate";

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

// ============ Helper Functions ============
function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

function getString(data: unknown, ...keys: string[]): string {
    if (!data || typeof data !== "object") return "";
    let current: unknown = data;
    for (const key of keys) {
        if (current && typeof current === "object" && key in current) {
            current = (current as Record<string, unknown>)[key];
        } else {
            return "";
        }
    }
    if (typeof current === "string") return current;
    if (typeof current === "number") return String(current);
    if (typeof current === "object" && current !== null) {
        const obj = current as Record<string, unknown>;
        const firstKey = Object.keys(obj)[0];
        if (firstKey && typeof obj[firstKey] === "string") {
            return obj[firstKey] as string;
        }
    }
    return "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeImportedData(data: any): ResumeFormData {
    const contact: ContactInfo = {
        fullName: getString(data, "contact", "fullName") || getString(data, "contact", "full_name") || getString(data, "contact", "name") || "",
        email: getString(data, "contact", "email") || "",
        phone: getString(data, "contact", "phone") || "",
        location: getString(data, "contact", "location") || "",
        linkedin: getString(data, "contact", "linkedin") || "",
        github: getString(data, "contact", "github") || "",
        portfolio: getString(data, "contact", "portfolio") || "",
    };

    const summary = getString(data, "summary") || getString(data, "professional_summary") || "";

    const rawExp = data?.experience || data?.work_experience || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const experience: Experience[] = Array.isArray(rawExp) ? rawExp.map((exp: any) => ({
        id: generateId(),
        title: exp.title || exp.job_title || exp.position || "",
        company: exp.company || exp.organization || "",
        location: exp.location || "",
        startDate: exp.startDate || exp.start_date || "",
        endDate: exp.endDate || exp.end_date || "",
        current: exp.current || exp.is_current || false,
        description: exp.description || (Array.isArray(exp.bullet_points) ? exp.bullet_points.join("\n") : ""),
    })) : [];

    const rawEdu = data?.education || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const education: Education[] = Array.isArray(rawEdu) ? rawEdu.map((edu: any) => ({
        id: generateId(),
        degree: edu.degree || "",
        institution: edu.institution || edu.school || "",
        location: edu.location || "",
        startDate: edu.startDate || edu.start_date || "",
        endDate: edu.endDate || edu.end_date || "",
        gpa: edu.gpa || "",
    })) : [];

    const rawSkills = data?.skills?.technical || data?.technical_skills || data?.skills || [];
    const skills: string[] = Array.isArray(rawSkills) ? rawSkills : [];

    return { contact, summary, experience, education, skills };
}

const emptyFormData: ResumeFormData = {
    contact: { fullName: "", email: "", phone: "", location: "", linkedin: "", github: "", portfolio: "" },
    summary: "",
    experience: [],
    education: [],
    skills: [],
};

// ============ Accordion Component ============
interface AccordionProps {
    title: string;
    icon: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    count?: number;
}

function Accordion({ title, icon, isOpen, onToggle, children, count }: AccordionProps) {
    return (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-[#12141c]">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                        {icon}
                    </div>
                    <span className="font-medium text-white">{title}</span>
                    {count !== undefined && count > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                            {count}
                        </span>
                    )}
                </div>
                {isOpen ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
            </button>
            {isOpen && <div className="p-4 pt-0 border-t border-white/5">{children}</div>}
        </div>
    );
}

// ============ Form Input Component ============
interface FormInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    icon?: React.ReactNode;
}

function FormInput({ label, value, onChange, placeholder, type = "text", icon }: FormInputProps) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm text-gray-400">{label}</label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all ${icon ? "pl-10" : ""}`}
                />
            </div>
        </div>
    );
}

function FormTextarea({ label, value, onChange, placeholder, rows = 3 }: FormInputProps & { rows?: number }) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm text-gray-400">{label}</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
            />
        </div>
    );
}

// ============ Template Drawer Component ============
interface TemplateDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    currentTemplateId: string;
    onSelectTemplate: (templateId: string) => void;
}

function TemplateDrawer({ isOpen, onClose, currentTemplateId, onSelectTemplate }: TemplateDrawerProps) {
    const currentIndex = templates.findIndex((t) => t.id === currentTemplateId);

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-[#0B0C15] border-l border-white/10 z-50 transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="font-semibold text-white">Templates</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Vertical Carousel */}
                <div className="h-[calc(100%-64px)] flex flex-col items-center justify-center py-8 overflow-hidden">
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                        {templates.map((template, index) => {
                            const distance = index - currentIndex;
                            const isSelected = index === currentIndex;

                            // Position calculation
                            const yOffset = distance * 180; // Spacing between items
                            const scale = isSelected ? 1 : 0.65;
                            const opacity = isSelected ? 1 : 0.4;
                            const zIndex = isSelected ? 10 : 5 - Math.abs(distance);

                            // Only show nearby templates
                            if (Math.abs(distance) > 2) return null;

                            return (
                                <button
                                    key={template.id}
                                    onClick={() => onSelectTemplate(template.id)}
                                    className="absolute transition-all duration-300 ease-out focus:outline-none"
                                    style={{
                                        transform: `translateY(${yOffset}px) scale(${scale})`,
                                        opacity,
                                        zIndex,
                                    }}
                                >
                                    {/* Template Preview Card */}
                                    <div
                                        className={`rounded-xl overflow-hidden border-2 transition-all ${isSelected
                                            ? "border-blue-500 shadow-lg shadow-blue-500/30"
                                            : "border-white/10 hover:border-white/30"
                                            }`}
                                    >
                                        <TemplatePreview
                                            templateId={template.id}
                                            size="md"
                                            showSampleData={true}
                                        />
                                    </div>

                                    {/* Template Name */}
                                    <p className={`mt-3 text-center text-sm font-medium transition-colors ${isSelected ? "text-white" : "text-gray-500"
                                        }`}>
                                        {template.name}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

// ============ Main Editor Component ============
export default function EditorPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const resumePreviewRef = useRef<HTMLDivElement>(null);

    const resumeId = Number(params?.id);
    const templateId = searchParams?.get("template") || "modern-professional";
    const source = searchParams?.get("source") || "blank";

    const [resume, setResume] = useState<Resume | null>(null);
    const [formData, setFormData] = useState<ResumeFormData>(emptyFormData);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [isTemplateDrawerOpen, setIsTemplateDrawerOpen] = useState(false);
    const [currentTemplateId, setCurrentTemplateId] = useState(templateId);
    const [openSections, setOpenSections] = useState({
        contact: true,
        summary: false,
        experience: false,
        education: false,
        skills: false,
    });

    const template = getTemplateById(currentTemplateId);

    // Calculate completion percentage
    const completionPercentage = (() => {
        let filled = 0;
        let total = 7;
        if (formData.contact.fullName) filled++;
        if (formData.contact.email) filled++;
        if (formData.contact.phone) filled++;
        if (formData.contact.location) filled++;
        if (formData.summary) { filled++; total++; }
        if (formData.experience.length > 0) { filled++; total++; }
        if (formData.education.length > 0) { filled++; total++; }
        if (formData.skills.length > 0) { filled++; total++; }
        return Math.round((filled / total) * 100);
    })();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const token = authStorage.getToken();

            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const resumeRecord = await resumeApi.get(token, resumeId);
                setResume(resumeRecord);

                const storedData = sessionStorage.getItem(`resume-data-${resumeId}`);
                if (storedData) {
                    try {
                        const parsed = JSON.parse(storedData);
                        const normalized = normalizeImportedData(parsed);
                        setFormData(normalized);
                        sessionStorage.removeItem(`resume-data-${resumeId}`);
                        setOpenSections({
                            contact: true,
                            summary: !!normalized.summary,
                            experience: normalized.experience.length > 0,
                            education: normalized.education.length > 0,
                            skills: normalized.skills.length > 0,
                        });
                    } catch (e) {
                        console.error("Failed to parse stored data:", e);
                    }
                }
            } catch (error) {
                console.error("Failed to load resume:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [resumeId, router]);

    // Export PDF function
    const handleExportPDF = async () => {
        if (!resumePreviewRef.current) return;

        setIsExporting(true);
        try {
            const canvas = await html2canvas(resumePreviewRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 0;

            pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`${resume?.title || "resume"}.pdf`);
        } catch (error) {
            console.error("Failed to export PDF:", error);
            alert("Failed to export PDF. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleTemplateChange = (newTemplateId: string) => {
        setCurrentTemplateId(newTemplateId);
        setIsTemplateDrawerOpen(false);
        // Update URL without navigation
        const newUrl = `/resumes/${resumeId}/editor?template=${newTemplateId}&source=${source}`;
        window.history.replaceState({}, "", newUrl);
    };

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const updateContact = (field: keyof ContactInfo, value: string) => {
        setFormData((prev) => ({
            ...prev,
            contact: { ...prev.contact, [field]: value },
        }));
    };

    const addExperience = () => {
        setFormData((prev) => ({
            ...prev,
            experience: [...prev.experience, {
                id: generateId(),
                title: "",
                company: "",
                location: "",
                startDate: "",
                endDate: "",
                current: false,
                description: "",
            }],
        }));
    };

    const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
        setFormData((prev) => ({
            ...prev,
            experience: prev.experience.map((exp) =>
                exp.id === id ? { ...exp, [field]: value } : exp
            ),
        }));
    };

    const removeExperience = (id: string) => {
        setFormData((prev) => ({
            ...prev,
            experience: prev.experience.filter((exp) => exp.id !== id),
        }));
    };

    const addEducation = () => {
        setFormData((prev) => ({
            ...prev,
            education: [...prev.education, {
                id: generateId(),
                degree: "",
                institution: "",
                location: "",
                startDate: "",
                endDate: "",
                gpa: "",
            }],
        }));
    };

    const updateEducation = (id: string, field: keyof Education, value: string) => {
        setFormData((prev) => ({
            ...prev,
            education: prev.education.map((edu) =>
                edu.id === id ? { ...edu, [field]: value } : edu
            ),
        }));
    };

    const removeEducation = (id: string) => {
        setFormData((prev) => ({
            ...prev,
            education: prev.education.filter((edu) => edu.id !== id),
        }));
    };

    const [newSkill, setNewSkill] = useState("");
    const addSkill = () => {
        if (newSkill.trim()) {
            setFormData((prev) => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()],
            }));
            setNewSkill("");
        }
    };

    const removeSkill = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index),
        }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0B0C15] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-gray-400">Loading editor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0C15] text-white flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0B0C15] sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="h-6 w-px bg-white/10" />
                    <div>
                        <h1 className="font-semibold text-white">{resume?.title || "Resume Editor"}</h1>
                        <p className="text-xs text-gray-500">
                            {template?.name || "Template"} • {source === "blank" ? "From scratch" : "Auto-filled"}
                        </p>
                    </div>
                </div>

                {/* Progress & Actions */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                                style={{ width: `${completionPercentage}%` }}
                            />
                        </div>
                        <span className="text-sm text-gray-400">{completionPercentage}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="text-gray-300 border-white/10 hover:bg-white/5"
                            onClick={() => setIsTemplateDrawerOpen(true)}
                        >
                            <Palette className="w-4 h-4 mr-2" />
                            Templates
                        </Button>
                        <Button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isExporting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Exporting...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4 mr-2" />
                                    Export PDF
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Form Editor */}
                <div className="w-[480px] border-r border-white/10 overflow-y-auto">
                    <div className="p-6 space-y-4">
                        {/* Contact Information */}
                        <Accordion
                            title="Contact Information"
                            icon={<User className="w-4 h-4" />}
                            isOpen={openSections.contact}
                            onToggle={() => toggleSection("contact")}
                        >
                            <div className="space-y-4 pt-4">
                                <FormInput
                                    label="Full Name"
                                    value={formData.contact.fullName}
                                    onChange={(v) => updateContact("fullName", v)}
                                    placeholder="John Doe"
                                    icon={<User className="w-4 h-4" />}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        label="Email"
                                        value={formData.contact.email}
                                        onChange={(v) => updateContact("email", v)}
                                        placeholder="john@example.com"
                                        type="email"
                                        icon={<Mail className="w-4 h-4" />}
                                    />
                                    <FormInput
                                        label="Phone"
                                        value={formData.contact.phone}
                                        onChange={(v) => updateContact("phone", v)}
                                        placeholder="+1 234 567 8900"
                                        icon={<Phone className="w-4 h-4" />}
                                    />
                                </div>
                                <FormInput
                                    label="Location"
                                    value={formData.contact.location}
                                    onChange={(v) => updateContact("location", v)}
                                    placeholder="City, Country"
                                    icon={<MapPin className="w-4 h-4" />}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        label="LinkedIn"
                                        value={formData.contact.linkedin}
                                        onChange={(v) => updateContact("linkedin", v)}
                                        placeholder="linkedin.com/in/..."
                                        icon={<Linkedin className="w-4 h-4" />}
                                    />
                                    <FormInput
                                        label="GitHub"
                                        value={formData.contact.github}
                                        onChange={(v) => updateContact("github", v)}
                                        placeholder="github.com/..."
                                        icon={<Github className="w-4 h-4" />}
                                    />
                                </div>
                                <FormInput
                                    label="Portfolio"
                                    value={formData.contact.portfolio}
                                    onChange={(v) => updateContact("portfolio", v)}
                                    placeholder="yourwebsite.com"
                                    icon={<Globe className="w-4 h-4" />}
                                />
                            </div>
                        </Accordion>

                        {/* Professional Summary */}
                        <Accordion
                            title="Professional Summary"
                            icon={<FileText className="w-4 h-4" />}
                            isOpen={openSections.summary}
                            onToggle={() => toggleSection("summary")}
                        >
                            <div className="pt-4">
                                <FormTextarea
                                    label="Summary"
                                    value={formData.summary}
                                    onChange={(v) => setFormData((prev) => ({ ...prev, summary: v }))}
                                    placeholder="Write a brief professional summary..."
                                    rows={4}
                                />
                            </div>
                        </Accordion>

                        {/* Work Experience */}
                        <Accordion
                            title="Work Experience"
                            icon={<Briefcase className="w-4 h-4" />}
                            isOpen={openSections.experience}
                            onToggle={() => toggleSection("experience")}
                            count={formData.experience.length}
                        >
                            <div className="pt-4 space-y-4">
                                {formData.experience.map((exp, index) => (
                                    <div key={exp.id} className="p-4 bg-white/5 rounded-lg space-y-4 relative group">
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => removeExperience(exp.id)}
                                                className="p-1.5 hover:bg-red-500/20 rounded text-red-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-xs text-gray-500 font-medium">EXPERIENCE {index + 1}</div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormInput
                                                label="Job Title"
                                                value={exp.title}
                                                onChange={(v) => updateExperience(exp.id, "title", v)}
                                                placeholder="Software Engineer"
                                            />
                                            <FormInput
                                                label="Company"
                                                value={exp.company}
                                                onChange={(v) => updateExperience(exp.id, "company", v)}
                                                placeholder="Company Name"
                                            />
                                        </div>
                                        <FormInput
                                            label="Location"
                                            value={exp.location}
                                            onChange={(v) => updateExperience(exp.id, "location", v)}
                                            placeholder="City, Country"
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormInput
                                                label="Start Date"
                                                value={exp.startDate}
                                                onChange={(v) => updateExperience(exp.id, "startDate", v)}
                                                placeholder="Jan 2020"
                                            />
                                            <FormInput
                                                label="End Date"
                                                value={exp.endDate}
                                                onChange={(v) => updateExperience(exp.id, "endDate", v)}
                                                placeholder="Present"
                                            />
                                        </div>
                                        <FormTextarea
                                            label="Description"
                                            value={exp.description}
                                            onChange={(v) => updateExperience(exp.id, "description", v)}
                                            placeholder="Describe your responsibilities..."
                                            rows={3}
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={addExperience}
                                    className="w-full py-3 border-2 border-dashed border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Experience
                                </button>
                            </div>
                        </Accordion>

                        {/* Education */}
                        <Accordion
                            title="Education"
                            icon={<GraduationCap className="w-4 h-4" />}
                            isOpen={openSections.education}
                            onToggle={() => toggleSection("education")}
                            count={formData.education.length}
                        >
                            <div className="pt-4 space-y-4">
                                {formData.education.map((edu, index) => (
                                    <div key={edu.id} className="p-4 bg-white/5 rounded-lg space-y-4 relative group">
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => removeEducation(edu.id)}
                                                className="p-1.5 hover:bg-red-500/20 rounded text-red-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-xs text-gray-500 font-medium">EDUCATION {index + 1}</div>
                                        <FormInput
                                            label="Degree"
                                            value={edu.degree}
                                            onChange={(v) => updateEducation(edu.id, "degree", v)}
                                            placeholder="Bachelor of Science"
                                        />
                                        <FormInput
                                            label="Institution"
                                            value={edu.institution}
                                            onChange={(v) => updateEducation(edu.id, "institution", v)}
                                            placeholder="University Name"
                                        />
                                        <div className="grid grid-cols-3 gap-4">
                                            <FormInput
                                                label="Start"
                                                value={edu.startDate}
                                                onChange={(v) => updateEducation(edu.id, "startDate", v)}
                                                placeholder="2016"
                                            />
                                            <FormInput
                                                label="End"
                                                value={edu.endDate}
                                                onChange={(v) => updateEducation(edu.id, "endDate", v)}
                                                placeholder="2020"
                                            />
                                            <FormInput
                                                label="GPA"
                                                value={edu.gpa}
                                                onChange={(v) => updateEducation(edu.id, "gpa", v)}
                                                placeholder="3.8"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={addEducation}
                                    className="w-full py-3 border-2 border-dashed border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Education
                                </button>
                            </div>
                        </Accordion>

                        {/* Skills */}
                        <Accordion
                            title="Skills"
                            icon={<Wrench className="w-4 h-4" />}
                            isOpen={openSections.skills}
                            onToggle={() => toggleSection("skills")}
                            count={formData.skills.length}
                        >
                            <div className="pt-4 space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {formData.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center gap-2 group"
                                        >
                                            {skill}
                                            <button
                                                onClick={() => removeSkill(index)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && addSkill()}
                                        placeholder="Type a skill and press Enter"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50"
                                    />
                                    <Button onClick={addSkill} className="bg-blue-600 hover:bg-blue-700">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Accordion>
                    </div>
                </div>

                {/* Right Panel - Live Preview */}
                <div className="flex-1 bg-[#1a1c24] p-8 overflow-y-auto">
                    <div className="max-w-[21cm] mx-auto">
                        {/* Preview Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Eye className="w-4 h-4" />
                                Live Preview
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                    A4
                                </button>
                                <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                    100%
                                </button>
                            </div>
                        </div>

                        {/* Resume Preview - Dynamic template based on selection */}
                        <LiveTemplate
                            ref={resumePreviewRef}
                            templateId={currentTemplateId}
                            data={formData}
                        />
                    </div>
                </div>
            </div>

            {/* Template Drawer */}
            <TemplateDrawer
                isOpen={isTemplateDrawerOpen}
                onClose={() => setIsTemplateDrawerOpen(false)}
                currentTemplateId={currentTemplateId}
                onSelectTemplate={handleTemplateChange}
            />
        </div>
    );
}
