"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface ATScoreCardProps {
    score: number;
}

export function ATScoreCard({ score }: ATScoreCardProps) {
    const circumference = 2 * Math.PI * 40; // radius 40
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="bg-[#12141c] border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-white">Your ATS Score</h3>
                    <p className="text-gray-400 text-xs">Resume is well optimized.</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Circular Progress */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-800"
                        />
                        <motion.circle
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1, delay: 0.5 }}
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeLinecap="round"
                            className="text-green-400"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-white">{score}</span>
                        <span className="text-[10px] text-gray-500 uppercase">of 100</span>
                    </div>
                </div>

                <div className="flex-1">
                    <p className="text-sm text-gray-300 mb-2">
                        <span className="text-green-400 font-bold">Strong</span> match for your target roles.
                    </p>
                    <button className="text-xs text-blue-400 hover:text-white flex items-center transition-colors">
                        View Details <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}
