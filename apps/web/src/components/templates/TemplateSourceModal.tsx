"use client";

import { useEffect, useState } from "react";
import { X, FileText, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resumeApi, Resume } from "@/lib/api";
import { authStorage } from "@/lib/auth";

interface TemplateSourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    templateId: string;
    templateName: string;
    onSelectBlank: () => void;
    onSelectResume: (resumeId: number) => void;
}

export function TemplateSourceModal({
    isOpen,
    onClose,
    templateId,
    templateName,
    onSelectBlank,
    onSelectResume,
}: TemplateSourceModalProps) {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadResumes();
        }
    }, [isOpen]);

    const loadResumes = async () => {
        setIsLoading(true);
        try {
            const token = authStorage.getToken();
            if (token) {
                const data = await resumeApi.list(token);
                // Only show resumes that have been uploaded (have a file)
                const uploadedResumes = data.resumes.filter((r) => r.file_path);
                setResumes(uploadedResumes);
            }
        } catch (error) {
            console.error("Failed to load resumes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBlankClick = async () => {
        setIsProcessing(true);
        try {
            await onSelectBlank();
        } finally {
            setIsProcessing(false);
        }
    };

    const handleResumeSelect = async () => {
        if (!selectedResumeId) return;
        setIsProcessing(true);
        try {
            await onSelectResume(selectedResumeId);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[#12141c] border border-white/10 rounded-2xl w-full max-w-2xl mx-4 overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div>
                        <h2 className="text-xl font-bold text-white">Create Your Resume</h2>
                        <p className="text-gray-400 text-sm mt-1">
                            Using template: <span className="text-white">{templateName}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                        disabled={isProcessing}
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Option 1: Start from Blank */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-400">Start Fresh</h3>
                        <button
                            onClick={handleBlankClick}
                            disabled={isProcessing}
                            className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 rounded-xl transition-all group disabled:opacity-50"
                        >
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                                <Plus className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="font-medium text-white">Create from Blank</p>
                                <p className="text-sm text-gray-400">Start with an empty template and fill in your details</p>
                            </div>
                            {isProcessing && !selectedResumeId && (
                                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                            )}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-3 bg-[#12141c] text-gray-500 text-sm">or</span>
                        </div>
                    </div>

                    {/* Option 2: Use Uploaded Resume */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-400">
                            Auto-fill from My Resumes
                        </h3>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                            </div>
                        ) : resumes.length === 0 ? (
                            <div className="text-center py-8 px-4 bg-white/5 rounded-xl border border-white/10">
                                <FileText className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                                <p className="text-gray-400 text-sm">No uploaded resumes found</p>
                                <p className="text-gray-500 text-xs mt-1">
                                    Upload a resume from the dashboard to use auto-fill
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {resumes.map((resume) => (
                                    <button
                                        key={resume.id}
                                        onClick={() => setSelectedResumeId(resume.id)}
                                        disabled={isProcessing}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${selectedResumeId === resume.id
                                                ? "bg-blue-500/10 border-blue-500/50"
                                                : "bg-white/5 border-white/10 hover:border-white/20"
                                            } disabled:opacity-50`}
                                    >
                                        <div
                                            className={`w-10 h-12 rounded-lg flex items-center justify-center ${resume.thumbnail_color || "bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                                                }`}
                                        >
                                            <FileText className="w-5 h-5 text-white/60" />
                                        </div>
                                        <div className="text-left flex-1">
                                            <p className="font-medium text-white">{resume.title}</p>
                                            <p className="text-xs text-gray-400">
                                                {resume.ats_score > 0 && `ATS Score: ${resume.ats_score}% • `}
                                                {resume.extracted_data_path ? "Data extracted" : "Pending extraction"}
                                            </p>
                                        </div>
                                        {selectedResumeId === resume.id && (
                                            <CheckCircle2 className="w-5 h-5 text-blue-400" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Use Selected Resume Button */}
                        {resumes.length > 0 && (
                            <Button
                                onClick={handleResumeSelect}
                                disabled={!selectedResumeId || isProcessing}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                            >
                                {isProcessing && selectedResumeId ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Use Selected Resume"
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
