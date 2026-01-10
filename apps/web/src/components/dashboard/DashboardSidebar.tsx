"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, LogOut, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
    userEmail?: string;
    onLogout: () => void;
}

export function DashboardSidebar({ userEmail, onLogout }: DashboardSidebarProps) {
    const pathname = usePathname();

    const links = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/resumes", label: "My Resumes", icon: FileText },
        { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ];

    return (
        <aside className="w-64 border-r border-white/10 bg-[#0B0C15]/50 backdrop-blur-xl h-screen fixed left-0 top-0 flex flex-col z-40 hidden md:flex">
            {/* Logo */}
            <div className="p-6 border-b border-white/5">
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
                            className="w-5 h-5 text-[#0B0C15]"
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
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-blue-600/10 text-blue-400"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-white/5">
                <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{userEmail?.split('@')[0]}</p>
                        <p className="text-xs text-gray-400 truncate">{userEmail}</p>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    className="w-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 justify-start"
                    onClick={onLogout}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                </Button>
            </div>
        </aside>
    );
}
