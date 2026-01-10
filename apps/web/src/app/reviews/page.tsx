"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Star } from "lucide-react";

// Mock Data
const reviews = [
    {
        id: "01",
        text: "An unforgettable experience! The tool was pure luxury, and the crew took care of every little detail. We can't wait for our next trip.",
        author: "Sophia & Daniel, Maldives",
    },
    {
        id: "02",
        text: "We celebrated our anniversary with this, it was magical. Crystal-clear workflows... absolutely perfect. It felt like having a dedicated team.",
        author: "Liam & Emily, Dubai",
    },
    {
        id: "03",
        text: "I've never seen such a polished product. The AI suggestions were spot on and saved me hours of work.",
        author: "Marcus, New York",
    },
    {
        id: "04",
        text: "Simply the best resume builder I've ever used. The designs are stunning and the ATS optimization really works.",
        author: "Sarah, London",
    },
    {
        id: "05",
        text: "Got three interviews in the first week after using this. The investment paid off almost immediately.",
        author: "David, Berlin",
    },
    {
        id: "06",
        text: "The interface is beautiful and intuitive. It actually makes updating my resume enjoyable.",
        author: "Jessica, Toronto",
    },
];

const ReviewCard = ({ review, index }: { review: any; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="mb-8 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative group hover:bg-white/10 transition-colors"
        >
            <div className="absolute top-8 left-8 text-xs text-gray-500 font-mono">
                ({review.id})
            </div>

            <div className="mt-8 mb-8">
                <p className="text-gray-300 text-lg leading-relaxed">
                    &quot;{review.text}&quot;
                </p>
            </div>

            <div className="flex justify-end">
                <p className="text-sm text-gray-400 font-medium">
                    — {review.author}
                </p>
            </div>
        </motion.div>
    );
};

export default function ReviewsPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

    // Split reviews into two columns
    const col1 = reviews.filter((_, i) => i % 2 === 0);
    const col2 = reviews.filter((_, i) => i % 2 !== 0);

    return (
        <main ref={containerRef} className="min-h-[200vh] bg-[#050505] text-white selection:bg-white/20">
            <LandingNavbar />

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#050505] to-[#050505]" />
            </div>

            <div className="relative z-10 pt-32 px-6">
                {/* Hero Header */}
                <div className="max-w-7xl mx-auto mb-32 relative">
                    <div className="absolute left-0 top-0 flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-5 h-5 text-gray-500 fill-gray-500" />
                        ))}
                    </div>

                    <h1 className="text-[12vw] leading-[0.9] font-serif text-white/90 mix-blend-difference z-20 pointer-events-none text-center md:text-right mt-12">
                        What <br />
                        <span className="italic opacity-50">they say?</span>
                    </h1>
                </div>

                {/* Scrollable Reviews Grid */}
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-16 pb-32">
                    <motion.div style={{ y: y1 }} className="flex flex-col gap-8 pt-32">
                        {col1.map((review, i) => (
                            <ReviewCard key={i} review={review} index={i} />
                        ))}
                    </motion.div>

                    <motion.div style={{ y: y2 }} className="flex flex-col gap-8">
                        {col2.map((review, i) => (
                            <ReviewCard key={i} review={review} index={i} />
                        ))}
                    </motion.div>
                </div>

                {/* Stats Footer */}
                <div className="max-w-7xl mx-auto py-32 border-t border-white/10 flex flex-col md:flex-row justify-end gap-16 md:gap-32">
                    <div>
                        <h3 className="text-6xl md:text-8xl font-serif">1200+</h3>
                        <p className="text-xl text-gray-500 mt-2">Reviews</p>
                    </div>
                    <div>
                        <h3 className="text-6xl md:text-8xl font-serif">10,000+</h3>
                        <p className="text-xl text-gray-500 mt-2">Happy Clients</p>
                    </div>
                </div>
            </div>

            <LandingFooter />
        </main>
    );
}
