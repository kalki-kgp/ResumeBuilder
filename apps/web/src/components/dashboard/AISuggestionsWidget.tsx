import { Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AISuggestionsWidget() {
    return (
        <div className="space-y-4">
            <h3 className="font-bold text-white px-2">AI Smart Suggestions</h3>

            {/* Suggestion 1 */}
            <div className="bg-[#12141c] border border-white/5 rounded-2xl p-5">
                <div className="flex gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white">Improve your experience section</h4>
                        <p className="text-xs text-gray-400 mt-1">Let&apos;s make your job descriptions stand out with action verbs.</p>
                    </div>
                </div>
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-8">
                    <Sparkles className="w-3 h-3 mr-2" /> Rewrite with AI
                </Button>
            </div>

            {/* Suggestion 2 */}
            <div className="bg-[#12141c] border border-white/5 rounded-2xl p-5">
                <div className="flex gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                        <Lightbulb className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white">Increase your ATS score by 12%</h4>
                        <p className="text-xs text-gray-400 mt-1">Optimize keywords and formatting with our AI.</p>
                    </div>
                </div>
                <Button size="sm" variant="outline" className="w-full bg-transparent border-white/10 hover:bg-white/5 text-white text-xs h-8">
                    Analyze Resume
                </Button>
            </div>
        </div>
    );
}
