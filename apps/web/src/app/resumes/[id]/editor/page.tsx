"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { authStorage } from "@/lib/auth";
import { resumeApi, Resume, ExtractedResumeData, FilledTemplateData } from "@/lib/api";
import { Upload, FileText, CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditorPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const resumeId = Number(params?.id);
    const templateId = searchParams?.get("template") || "modern-slate";

    const [resume, setResume] = useState<Resume | null>(null);
    const [extractedData, setExtractedData] = useState<ExtractedResumeData | null>(null);
    const [filledData, setFilledData] = useState<FilledTemplateData | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); // Extracting or Filling

    const loadResume = async () => {
        const token = authStorage.getToken();
        if (!token) return;
        try {
            const data = await resumeApi.get(token, resumeId);
            setResume(data);
            if (data.extracted_data_path) {
                const extracted = await resumeApi.getExtractedData(token, resumeId);
                setExtractedData(extracted);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadResume();
    }, [resumeId]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const token = authStorage.getToken();
        if (!token) return;

        try {
            // Upload and Trigger Extraction (Backend handles extraction on upload)
            await resumeApi.uploadFile(token, resumeId, file);

            // Poll for completion or fetch immediately
            // In this implementation, uploadFile is sync-ish on backend but AI might be slow.
            // Assuming backend waits for extraction.

            await loadResume();
            const extracted = await resumeApi.getExtractedData(token, resumeId);
            setExtractedData(extracted);

        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleFillTemplate = async () => {
        const token = authStorage.getToken();
        if (!token) return;

        setIsProcessing(true);
        try {
            // Mock schema for now (should fetch from backend or definition)
            const templateSchema = {
                template_id: templateId,
                template_name: templateId,
                version: "1.0",
                sections: [
                    {
                        key: "contact",
                        label: "Contact Information",
                        type: "single",
                        fields: [
                            { key: "contact.full_name", label: "Full Name", type: "text", required: true },
                            { key: "contact.email", label: "Email", type: "text", required: true },
                            { key: "summary", label: "Professional Summary", type: "textarea", required: false },
                        ]
                    }
                ]
            };

            const result = await resumeApi.fillTemplate(token, resumeId, templateSchema);
            setFilledData(result);
        } catch (error) {
            console.error("Template fill failed", error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!resume) return <div className="min-h-screen bg-[#0B0C15] flex items-center justify-center text-white">Loading Editor...</div>;

    return (
        <div className="min-h-screen bg-[#0B0C15] text-white p-8">
            <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <div>
                    <h1 className="text-2xl font-bold">{resume.title}</h1>
                    <p className="text-sm text-gray-400">Template: {templateId}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="text-white border-white/20">Save</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">Download PDF</Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Source / Upload */}
                <div className="bg-[#12141c] border border-white/5 rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <FileText className="text-blue-400" /> Source Data
                    </h2>

                    {!resume.file_path ? (
                        <div className="border-2 border-dashed border-white/10 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors">
                            <Upload className="w-12 h-12 text-gray-500 mb-4" />
                            <h3 className="text-lg font-medium mb-2">Upload Existing Resume</h3>
                            <p className="text-gray-400 text-sm mb-6 max-w-xs">
                                Upload your PDF to automatically extract data and fill the template.
                            </p>
                            <label className="cursor-pointer">
                                <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                                <div className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
                                    {isUploading ? <Loader2 className="animate-spin w-5 h-5" /> : "Select PDF"}
                                </div>
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
                                <CheckCircle className="w-5 h-5" />
                                <div>
                                    <p className="font-medium">Resume Uploaded</p>
                                    <p className="text-xs opacity-80">{resume.file_path.split('/').pop()}</p>
                                </div>
                            </div>

                            {extractedData && (
                                <div className="bg-white/5 rounded-lg p-4 max-h-[500px] overflow-y-auto font-mono text-xs">
                                    <h3 className="font-bold mb-2 text-gray-400 uppercase tracking-wider">Extracted Data Preview</h3>
                                    <pre>{JSON.stringify(extractedData.contact, null, 2)}</pre>
                                    <pre>...</pre>
                                </div>
                            )}

                            <Button
                                className="w-full"
                                disabled={isProcessing}
                                onClick={handleFillTemplate}
                            >
                                {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                                {filledData ? "Re-Fill Template" : "Fill Template with AI"}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Right Column: Template Preview / Result */}
                <div className="bg-[#12141c] border border-white/5 rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">Template Result</h2>

                    {filledData ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 mb-4">
                                Template filled successfully!
                            </div>
                            <div className="bg-white rounded shadow-xl min-h-[600px] text-black p-8 font-serif">
                                {/* Simple Visual Preview of Filled Data */}
                                <h1 className="text-3xl font-bold border-b-2 border-black pb-2 mb-4">
                                    {filledData.data.contact?.full_name || "Your Name"}
                                </h1>
                                <p className="text-sm mb-6">
                                    {filledData.data.contact?.email} | {filledData.data.contact?.phone}
                                </p>

                                <h2 className="text-xl font-bold uppercase mb-2">Summary</h2>
                                <p className="text-sm mb-4">{filledData.data.summary}</p>

                                <div className="text-center text-gray-400 mt-20 italic">
                                    (Visual preview based on extracted data)
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                            <div className="w-32 h-40 border-2 border-current rounded mb-4" />
                            <p>Waiting for data...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Sparkles({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M9 5H5" />
            <path d="M19 15v4" />
            <path d="M22 17h-4" />
        </svg>
    )
}
