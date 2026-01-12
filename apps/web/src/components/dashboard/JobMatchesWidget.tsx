import Link from "next/link";
import { ArrowRight } from "lucide-react";

const mockMatches = [
    { title: "Marketing Manager", company: "Google", location: "San Francisco, CA", salary: "$90k - $110k", match: 92 },
    { title: "Backend Developer", company: "Dropbox", location: "Remote", salary: "$110k - $130k", match: 88 },
    { title: "Project Coordinator", company: "IBM", location: "New York, NY", salary: "$70k - $85k", match: 85 },
];

export function JobMatchesWidget() {
    return (
        <div className="bg-[#12141c] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Job Matches For You</h3>
                <Link href="/jobs" className="text-xs text-blue-400 hover:text-white flex items-center">
                    See All <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
            </div>

            <div className="space-y-4">
                {mockMatches.map((job, i) => (
                    <div key={i} className="group p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-1">
                            <div>
                                <h4 className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors">{job.title}</h4>
                                <p className="text-xs text-gray-400">{job.company}</p>
                            </div>
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${job.match > 90 ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                {job.match}%
                            </span>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                            <p className="text-[10px] text-gray-500">{job.location}</p>
                            <p className="text-[10px] text-gray-500">{job.salary}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 py-2 bg-blue-600/20 text-blue-400 text-xs font-medium rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                Refine Matches
            </button>
        </div>
    );
}
