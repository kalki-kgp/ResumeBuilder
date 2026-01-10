"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Building2, SlidersHorizontal, ArrowUpRight, Sparkles } from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";

const allJobs = [
    {
        id: 1,
        role: "Senior Product Designer",
        company: "Linear",
        location: "Remote",
        salary: "$120k - $180k",
        type: "Design",
        match: 98,
        logo: "bg-purple-500/20",
        tags: ["Figma", "React", "Design Systems"],
    },
    {
        id: 2,
        role: "Frontend Engineer",
        company: "Vercel",
        location: "New York, NY",
        salary: "$140k - $200k",
        type: "Engineering",
        match: 95,
        logo: "bg-white/20",
        tags: ["Next.js", "TypeScript", "Tailwind"],
    },
    {
        id: 3,
        role: "UX Researcher",
        company: "Notion",
        location: "San Francisco, CA",
        salary: "$110k - $160k",
        type: "Design",
        match: 92,
        logo: "bg-red-500/20",
        tags: ["User Testing", "Data Analysis"],
    },
    {
        id: 4,
        role: "Staff Software Engineer",
        company: "Stripe",
        location: "Seattle, WA",
        salary: "$180k - $260k",
        type: "Engineering",
        match: 89,
        logo: "bg-indigo-500/20",
        tags: ["Distributed Systems", "Go", "Java"],
    },
    {
        id: 5,
        role: "Product Manager",
        company: "Airbnb",
        location: "Remote",
        salary: "$150k - $210k",
        type: "Product",
        match: 85,
        logo: "bg-pink-500/20",
        tags: ["Strategy", "Analytics", "SQL"],
    },
    {
        id: 6,
        role: "Design Engineer",
        company: "Raycast",
        location: "London, UK",
        salary: "£80k - £120k",
        type: "Engineering",
        match: 94,
        logo: "bg-orange-500/20",
        tags: ["Swift", "React", "UI/UX"],
    },
];

const filters = ["All", "Engineering", "Design", "Product"];

export default function JobsPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredJobs = allJobs.filter(job => {
        const matchesFilter = activeFilter === "All" || job.type === activeFilter;
        const matchesSearch = job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <main className="min-h-screen bg-[#0B0C15] text-white selection:bg-blue-500/30">
            <LandingNavbar />

            <div className="pt-32 pb-24 px-6 relative max-w-7xl mx-auto">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/20 blur-[100px] rounded-full -z-10" />

                {/* Header area */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Find your next <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            dream job
                        </span>
                    </h1>

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4 items-center bg-white/5 border border-white/10 p-2 rounded-2xl backdrop-blur-md">
                        <div className="flex-1 flex items-center gap-3 px-4 w-full">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by role or company..."
                                className="bg-transparent border-none outline-none text-white placeholder:text-gray-500 w-full h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="h-8 w-px bg-white/10 hidden md:block" />
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            {filters.map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeFilter === filter
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                            : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                        <div className="h-8 w-px bg-white/10 hidden md:block" />
                        <Button variant="ghost" className="text-gray-400 hover:text-white">
                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                            Filters
                        </Button>
                    </div>
                </div>

                {/* Job List */}
                <div className="grid gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredJobs.map((job, index) => (
                            <motion.div
                                key={job.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-white/10 transition-all flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
                            >
                                <div className="flex gap-4 items-center">
                                    <div className={`w-14 h-14 rounded-xl ${job.logo} flex items-center justify-center border border-white/10`}>
                                        <Building2 className="w-7 h-7 text-white/90" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-xl text-white group-hover:text-blue-400 transition-colors">
                                            {job.role}
                                        </h3>
                                        <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                                            <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {job.company}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-600" />
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-600" />
                                            <span>{job.salary}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 md:gap-8 w-full md:w-auto">
                                    <div className="flex gap-2">
                                        {job.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 rounded-lg bg-black/40 text-xs text-gray-400 border border-white/5">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-4 ml-auto">
                                        <span className="text-green-400 font-mono text-sm font-bold bg-green-900/20 px-2 py-1 rounded border border-green-500/20">
                                            {job.match}% Match
                                        </span>
                                        <Button className="bg-white text-black hover:bg-gray-200 rounded-lg">
                                            Apply <ArrowUpRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredJobs.length === 0 && (
                        <div className="text-center py-20 text-gray-500">
                            No jobs found matching your criteria.
                        </div>
                    )}
                </div>

                {/* AI Floating CTA */}
                <div className="fixed bottom-8 right-8 z-40 hidden md:block">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow-xl shadow-blue-500/30 border border-blue-400/50 font-medium"
                    >
                        <Sparkles className="w-4 h-4" />
                        Auto-Apply to Matches
                    </motion.button>
                </div>
            </div>

            <LandingFooter />
        </main>
    );
}
