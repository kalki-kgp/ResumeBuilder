// JSON-based template definitions for the resume builder

export interface TemplateField {
    key: string;
    label: string;
    type: "text" | "textarea" | "date" | "url" | "array" | "object";
    placeholder?: string;
    required?: boolean;
}

export interface TemplateSection {
    key: string;
    label: string;
    icon: string; // Lucide icon name
    fields: TemplateField[];
    isArray?: boolean; // If true, user can add multiple entries (e.g., work experience)
}

export interface ResumeTemplate {
    id: string;
    name: string;
    description: string;
    previewColor: string; // Tailwind gradient class
    tags: string[];
    sections: TemplateSection[];
}

// JSON Schema that templates expect - this is what gets filled and stored
export interface ResumeData {
    contact: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        linkedin?: string;
        github?: string;
        portfolio?: string;
    };
    summary: string;
    experience: Array<{
        title: string;
        company: string;
        location: string;
        startDate: string;
        endDate: string;
        current: boolean;
        highlights: string[];
    }>;
    education: Array<{
        degree: string;
        institution: string;
        location: string;
        startDate: string;
        endDate: string;
        gpa?: string;
        highlights?: string[];
    }>;
    skills: {
        technical: string[];
        soft: string[];
        languages?: string[];
    };
    projects?: Array<{
        name: string;
        description: string;
        technologies: string[];
        url?: string;
        highlights?: string[];
    }>;
    certifications?: Array<{
        name: string;
        issuer: string;
        date: string;
        url?: string;
    }>;
}

// Empty resume data for blank templates
export const emptyResumeData: ResumeData = {
    contact: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        portfolio: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: {
        technical: [],
        soft: [],
        languages: [],
    },
    projects: [],
    certifications: [],
};

// Template definitions
export const templates: ResumeTemplate[] = [
    {
        id: "modern-professional",
        name: "Modern Professional",
        description: "Clean, minimal design with a focus on readability. Perfect for corporate and tech roles.",
        previewColor: "bg-gradient-to-br from-blue-600/20 to-cyan-500/10",
        tags: ["ATS Friendly", "Corporate", "Tech"],
        sections: [
            {
                key: "contact",
                label: "Contact Information",
                icon: "User",
                fields: [
                    { key: "fullName", label: "Full Name", type: "text", required: true },
                    { key: "email", label: "Email", type: "text", required: true },
                    { key: "phone", label: "Phone", type: "text", required: true },
                    { key: "location", label: "Location", type: "text", placeholder: "City, State" },
                    { key: "linkedin", label: "LinkedIn", type: "url", placeholder: "linkedin.com/in/..." },
                    { key: "github", label: "GitHub", type: "url", placeholder: "github.com/..." },
                    { key: "portfolio", label: "Portfolio", type: "url" },
                ],
            },
            {
                key: "summary",
                label: "Professional Summary",
                icon: "FileText",
                fields: [
                    { key: "summary", label: "Summary", type: "textarea", placeholder: "Brief overview of your experience and goals..." },
                ],
            },
            {
                key: "experience",
                label: "Work Experience",
                icon: "Briefcase",
                isArray: true,
                fields: [
                    { key: "title", label: "Job Title", type: "text", required: true },
                    { key: "company", label: "Company", type: "text", required: true },
                    { key: "location", label: "Location", type: "text" },
                    { key: "startDate", label: "Start Date", type: "date" },
                    { key: "endDate", label: "End Date", type: "date" },
                    { key: "highlights", label: "Highlights", type: "array", placeholder: "Key achievements..." },
                ],
            },
            {
                key: "education",
                label: "Education",
                icon: "GraduationCap",
                isArray: true,
                fields: [
                    { key: "degree", label: "Degree", type: "text", required: true },
                    { key: "institution", label: "Institution", type: "text", required: true },
                    { key: "location", label: "Location", type: "text" },
                    { key: "startDate", label: "Start Date", type: "date" },
                    { key: "endDate", label: "End Date", type: "date" },
                    { key: "gpa", label: "GPA", type: "text" },
                ],
            },
            {
                key: "skills",
                label: "Skills",
                icon: "Wrench",
                fields: [
                    { key: "technical", label: "Technical Skills", type: "array", placeholder: "Python, JavaScript, React..." },
                    { key: "soft", label: "Soft Skills", type: "array", placeholder: "Leadership, Communication..." },
                ],
            },
            {
                key: "projects",
                label: "Projects",
                icon: "FolderKanban",
                isArray: true,
                fields: [
                    { key: "name", label: "Project Name", type: "text", required: true },
                    { key: "description", label: "Description", type: "textarea" },
                    { key: "technologies", label: "Technologies", type: "array" },
                    { key: "url", label: "URL", type: "url" },
                ],
            },
        ],
    },
    {
        id: "classic-elegant",
        name: "Classic Elegant",
        description: "Timeless, sophisticated layout that works across all industries. Emphasis on achievements.",
        previewColor: "bg-gradient-to-br from-purple-600/20 to-pink-500/10",
        tags: ["Traditional", "Executive", "All Industries"],
        sections: [
            {
                key: "contact",
                label: "Contact Information",
                icon: "User",
                fields: [
                    { key: "fullName", label: "Full Name", type: "text", required: true },
                    { key: "email", label: "Email", type: "text", required: true },
                    { key: "phone", label: "Phone", type: "text", required: true },
                    { key: "location", label: "Location", type: "text" },
                    { key: "linkedin", label: "LinkedIn", type: "url" },
                ],
            },
            {
                key: "summary",
                label: "Executive Summary",
                icon: "FileText",
                fields: [
                    { key: "summary", label: "Summary", type: "textarea" },
                ],
            },
            {
                key: "experience",
                label: "Professional Experience",
                icon: "Briefcase",
                isArray: true,
                fields: [
                    { key: "title", label: "Position", type: "text", required: true },
                    { key: "company", label: "Organization", type: "text", required: true },
                    { key: "location", label: "Location", type: "text" },
                    { key: "startDate", label: "From", type: "date" },
                    { key: "endDate", label: "To", type: "date" },
                    { key: "highlights", label: "Achievements", type: "array" },
                ],
            },
            {
                key: "education",
                label: "Education",
                icon: "GraduationCap",
                isArray: true,
                fields: [
                    { key: "degree", label: "Degree/Certificate", type: "text", required: true },
                    { key: "institution", label: "Institution", type: "text", required: true },
                    { key: "location", label: "Location", type: "text" },
                    { key: "endDate", label: "Year", type: "date" },
                ],
            },
            {
                key: "skills",
                label: "Core Competencies",
                icon: "Wrench",
                fields: [
                    { key: "technical", label: "Technical Skills", type: "array" },
                    { key: "soft", label: "Leadership Skills", type: "array" },
                    { key: "languages", label: "Languages", type: "array" },
                ],
            },
            {
                key: "certifications",
                label: "Certifications & Awards",
                icon: "Award",
                isArray: true,
                fields: [
                    { key: "name", label: "Certification/Award", type: "text", required: true },
                    { key: "issuer", label: "Issuing Organization", type: "text" },
                    { key: "date", label: "Date", type: "date" },
                ],
            },
        ],
    },
];

// Helper to get template by ID
export function getTemplateById(id: string): ResumeTemplate | undefined {
    return templates.find((t) => t.id === id);
}

// Helper to generate template schema for backend (what gets sent for auto-fill)
export function getTemplateSchema(template: ResumeTemplate) {
    return {
        template_id: template.id,
        template_name: template.name,
        version: "1.0",
        sections: template.sections.map((section) => ({
            key: section.key,
            label: section.label,
            type: section.isArray ? "array" : "object",
            fields: section.fields.map((field) => ({
                key: field.key,
                label: field.label,
                type: field.type,
                required: field.required ?? false,
            })),
        })),
    };
}
