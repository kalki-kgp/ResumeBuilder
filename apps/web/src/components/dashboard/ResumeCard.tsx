import Link from "next/link";
import { MoreHorizontal, Calendar, Edit, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumeCardProps {
    id: number;
    title: string;
    lastEdited: string;
    score: number;
    thumbnail?: string;
}

export function ResumeCard({ id, title, lastEdited, score, thumbnail }: ResumeCardProps) {
    return (
        <div className="group bg-[#12141c] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all hover:shadow-lg hover:shadow-black/50 flex gap-4 items-center">
            {/* Thumbnail Icon */}
            <div className={`w-16 h-20 rounded-lg ${thumbnail || 'bg-white/5'} flex items-center justify-center border border-white/5 shrink-0`}>
                <FileText className="w-8 h-8 text-gray-600 group-hover:text-blue-400 transition-colors" />
            </div>

            {/* Info Area */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold px-1.5 rounded ${score > 80 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                {score}%
                            </span>
                            <h3 className="font-semibold text-white truncate text-sm" title={title}>
                                {title}
                            </h3>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {lastEdited}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-gray-400 hover:text-white hover:bg-white/10">
                        <Edit className="w-3 h-3" />
                    </Button>
                    <div className="h-3 w-px bg-white/10" />
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-gray-400 hover:text-white hover:bg-white/10">
                        <MoreHorizontal className="w-3 h-3" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
