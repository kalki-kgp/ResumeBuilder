import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingNavbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-landing-bg/50 border-b border-landing-border">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5 text-landing-bg"
                    >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6" />
                        <path d="M16 13H8" />
                        <path d="M16 17H8" />
                        <path d="M10 9H8" />
                    </svg>
                </div>
                <span className="text-xl font-bold text-white">Snipper</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
                <Link href="/features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                    Features
                </Link>
                <Link href="/jobs" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                    Jobs
                </Link>
                <Link href="/product" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                    Product
                </Link>
                <Link href="/reviews" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                    Reviews
                </Link>
                <Link href="/pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                    Pricing
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                    Login
                </Link>
                <Link href="/signup">
                    <Button className="bg-[#2D2E3A] hover:bg-[#3E3F4D] text-white border border-landing-border rounded-lg shadow-[0_0_20px_rgba(124,58,237,0.1)]">
                        Get Started
                        <span className="ml-2">»</span>
                    </Button>
                </Link>
            </div>
        </nav>
    );
}
