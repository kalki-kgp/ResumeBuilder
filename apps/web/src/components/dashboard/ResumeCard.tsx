import { MoreVertical, Calendar, Download, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumeCardProps {
    title: string;
    lastEdited: string;
    thumbnail?: string; // Optional color or image url
}

export function ResumeCard({ title, lastEdited, thumbnail }: ResumeCardProps) {
    return (
        <div className="group relative bg-[#12141c] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all hover:shadow-2xl hover:shadow-black/50">
            {/* Thumbnail Area */}
            <div className={`h-40 w-full ${thumbnail || 'bg-gradient-to-br from-gray-800 to-gray-900'} relative flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
                <div className="w-24 h-32 bg-white shadow-lg rounded-sm transform scale-75 opacity-10 group-hover:opacity-20 transition-opacity" />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                </div>
            </div>

            {/* Info Area */}
            <div className="p-4 z-10 relative bg-[#12141c]">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white truncate pr-2" title={title}>
                        {title}
                    </h3>
                    <button className="text-gray-500 hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {lastEdited}
                </div>
            </div>
        </div>
    );
}
