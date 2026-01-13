"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MouseEvent } from "react";

interface TemplateCardProps {
    id?: string; // Template ID for reference
    title: string;
    description: string;
    image: string; // Tailwind color or image URL
    tags: string[];
    index: number;
    onSelect: () => void;
}

export function TemplateCard({ title, description, image, tags, index, onSelect }: TemplateCardProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set(clientX - left - width / 2);
        y.set(clientY - top - height / 2);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const rotateX = useTransform(mouseY, [-200, 200], [10, -10]);
    const rotateY = useTransform(mouseX, [-200, 200], [-10, 10]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            style={{ perspective: 1000 }}
            className="group relative h-[500px]"
        >
            <motion.div
                style={{ rotateX, rotateY }}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                className="w-full h-full bg-[#12141c] border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-shadow duration-300 flex flex-col transform-style-3d bg-white/5 backdrop-blur-sm"
            >
                {/* Preview Image */}
                <div className={`relative h-[65%] w-full ${image} overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] to-transparent opacity-60" />

                    {/* Mock Resume Content */}
                    <div className="absolute inset-4 bg-white shadow-2xl rounded-sm transform group-hover:scale-105 transition-transform duration-700 opacity-90 p-4">
                        <div className="h-2 w-1/3 bg-gray-200 rounded mb-2" />
                        <div className="h-2 w-1/4 bg-gray-200 rounded mb-4" />
                        <div className="space-y-2">
                            <div className="h-1 w-full bg-gray-100 rounded" />
                            <div className="h-1 w-full bg-gray-100 rounded" />
                            <div className="h-1 w-2/3 bg-gray-100 rounded" />
                        </div>
                    </div>

                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-medium text-white">Top Pick</span>
                    </div>

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect();
                            }}
                            className="bg-white text-black hover:bg-gray-200 font-medium"
                        >
                            Use Template
                        </Button>
                        <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                            Preview
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col relative z-10 bg-[#12141c]">
                    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {description}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex gap-2">
                            {tags.map(tag => (
                                <span key={tag} className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
