import { Plus } from "lucide-react";

export function CreateResumeCard() {
    return (
        <button className="group h-[254px] w-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-blue-500/50 transition-all flex flex-col items-center justify-center gap-4 text-center cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center group-hover:bg-blue-600/20 group-hover:scale-110 transition-all duration-300">
                <Plus className="w-6 h-6 text-blue-500" />
            </div>
            <div>
                <h3 className="text-lg font-medium text-white mb-1">Create New Resume</h3>
                <p className="text-sm text-gray-500">Start from scratch or import</p>
            </div>
        </button>
    );
}
