import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Snipper - Transform Your Resume with AI",
    description: "Upload any resume, and let our AI create an optimized professional profile to land your next job.",
};

export default function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-[#0B0C15] text-white overflow-x-hidden selection:bg-landing-primary selection:text-white">
            {children}
        </div>
    );
}
