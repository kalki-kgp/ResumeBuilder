import { BadgeCheck, Building2, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockJobs = [
    {
        role: "Senior Product Designer",
        company: "Linear",
        location: "Remote",
        salary: "$120k - $180k",
        match: 98,
        logo: "bg-purple-500/20",
        tags: ["Figma", "React", "Design Systems"],
    },
    {
        role: "Frontend Engineer",
        company: "Vercel",
        location: "New York, NY",
        salary: "$140k - $200k",
        match: 95,
        logo: "bg-white/20",
        tags: ["Next.js", "TypeScript", "Tailwind"],
    },
    {
        role: "UX Researcher",
        company: "Notion",
        location: "San Francisco, CA",
        salary: "$110k - $160k",
        match: 92,
        logo: "bg-red-500/20",
        tags: ["User Testing", "Data Analysis"],
    },
];

export function JobMatchingSection() {
    return (
        <section className="py-24 px-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                {/* Left Content */}
                <div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Stop Searching. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            Start Matching.
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-md">
                        Our AI scans thousands of job postings to find roles that perfectly align with your skills, experience, and career goals.
                    </p>

                    <div className="space-y-4 mb-8">
                        {[
                            "Personalized job feed based on your resume",
                            "Salary insights and market data",
                            "One-click apply with tailored cover letters"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <BadgeCheck className="w-4 h-4 text-green-400" />
                                </div>
                                <span className="text-gray-300">{item}</span>
                            </div>
                        ))}
                    </div>

                    <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-8 h-12">
                        Find Matches Now <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>

                {/* Right Content - Job Cards UI */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C15] via-transparent to-transparent z-10 lg:hidden" />

                    <div className="space-y-4">
                        {mockJobs.map((job, index) => (
                            <div
                                key={index}
                                className={`
                  p-5 rounded-xl border border-landing-border bg-landing-card backdrop-blur-md
                  transform transition-all duration-500
                  ${index === 1 ? 'lg:-translate-x-8 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]' : 'opacity-70 scale-95'}
                `}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4">
                                        <div className={`w-12 h-12 rounded-lg ${job.logo} flex items-center justify-center border border-white/10`}>
                                            <Building2 className="w-6 h-6 text-white/80" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white text-lg">{job.role}</h3>
                                            <p className="text-gray-400 text-sm">{job.company}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-green-400 font-mono font-bold">{job.match}% Match</span>
                                        <span className="text-xs text-gray-500">Just now</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {job.location}
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-gray-600" />
                                    <div>{job.salary}</div>
                                </div>

                                <div className="flex gap-2">
                                    {job.tags.map((tag, i) => (
                                        <span key={i} className="px-2 py-1 rounded-full bg-white/5 text-[10px] text-gray-300 border border-white/5">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Floating 'Matched' Badge */}
                    <div className="absolute top-1/2 -right-6 -translate-y-1/2 bg-blue-600 text-white rounded-lg p-3 shadow-xl animate-pulse hidden lg:block">
                        <div className="flex items-center gap-2">
                            <BadgeCheck className="w-5 h-5" />
                            <span className="font-bold">New Match Found!</span>
                        </div>
                        <div className="text-xs text-blue-100 mt-1">Frontend Engineer at Vercel</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
