"use client";

import { useRef, useState } from "react";
import { Plus, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CreateResumeCardProps {
    onUpload?: (file: File) => Promise<void>;
    isUploading?: boolean;
}

export function CreateResumeCard({ onUpload, isUploading }: CreateResumeCardProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onUpload) {
            await onUpload(file);
        }
        // Reset input so same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file && onUpload) {
            // Validate file type
            if (file.type === "application/pdf" || file.type.startsWith("image/")) {
                await onUpload(file);
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    return (
        <div
            className={`bg-[#12141c] border rounded-2xl p-6 h-full flex flex-col justify-between transition-colors ${
                dragOver ? "border-blue-500 bg-blue-500/5" : "border-white/5"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            <div>
                <h3 className="text-lg font-bold text-white mb-1">Create New Resume</h3>
                <p className="text-gray-400 text-xs mb-2">Start from scratch or upload an existing resume.</p>
            </div>

            {/* Drop Zone / Icon */}
            <div className="flex items-center justify-center py-4">
                <div className={`w-20 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 transition-colors ${
                    dragOver ? "border-blue-500 bg-blue-500/10" : "border-blue-500/30 bg-blue-500/5"
                }`}>
                    {isUploading ? (
                        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                    ) : (
                        <>
                            <Plus className="w-5 h-5 text-blue-400" />
                            <span className="text-[10px] text-gray-500">Drop PDF</span>
                        </>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
                <Link href="/templates" className="w-full block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isUploading}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create New
                    </Button>
                </Link>

                <Button
                    variant="outline"
                    className="w-full bg-transparent border-white/10 hover:bg-white/5 text-white"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Existing
                        </>
                    )}
                </Button>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={handleFileSelect}
                />
            </div>
        </div>
    );
}
