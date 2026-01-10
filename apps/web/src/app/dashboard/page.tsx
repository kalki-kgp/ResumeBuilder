"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, User } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ResumeCard } from "@/components/dashboard/ResumeCard";
import { CreateResumeCard } from "@/components/dashboard/CreateResumeCard";
import { Search, Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock Data for UI demonstration
const mockResumes = [
  { id: 1, title: "Software Engineer - Google", lastEdited: "Edited 2 hours ago", thumbnail: "bg-blue-900/20" },
  { id: 2, title: "Product Manager Role", lastEdited: "Edited 1 day ago", thumbnail: "bg-purple-900/20" },
  { id: 3, title: "Creative Portfolio", lastEdited: "Edited 3 days ago", thumbnail: "bg-pink-900/20" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = authStorage.getToken();
      if (!token) {
        // For development/showcase purposes if auth is skipped, we can mock user or redirect
        // router.push("/login");
        // return;

        // MOCK USER FOR DEV
        setUser({ id: 1, email: "demo@user.com", is_active: true, created_at: new Date().toISOString() });
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authApi.getCurrentUser(token);
        setUser(userData);
      } catch (error) {
        authStorage.removeToken();
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const handleLogout = () => {
    authStorage.removeToken();
    router.push("/home");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0C15] flex items-center justify-center text-white">
        Loading workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C15] flex">
      <DashboardSidebar userEmail={user?.email} onLogout={handleLogout} />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 relative min-h-screen">
        {/* Background Glows */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 px-8 py-6">
          {/* Top Header */}
          <header className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Welcome back, {user?.email?.split("@")[0]}
              </h1>
              <p className="text-gray-400 text-sm">Here is what&apos;s happening with your resumes.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/20 w-64 transition-all"
                />
              </div>
              <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-blue-100/80 font-medium mb-1">Total Resumes</h3>
                <div className="text-4xl font-bold mb-2">3</div>
                <div className="text-sm bg-white/20 inline-block px-2 py-0.5 rounded text-white/90">
                  +1 this week
                </div>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Sparkles className="w-24 h-24" />
              </div>
            </div>

            <div className="bg-[#12141c] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <h3 className="text-gray-400 font-medium mb-1">Total Views</h3>
              <div className="text-3xl font-bold text-white mb-2">124</div>
              <div className="text-sm text-green-400">
                +12% vs last month
              </div>
            </div>

            <div className="bg-[#12141c] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <h3 className="text-gray-400 font-medium mb-1">AI Credits</h3>
              <div className="text-3xl font-bold text-white mb-2">450</div>
              <Button size="sm" variant="outline" className="h-7 text-xs border-white/10 bg-white/5 hover:bg-white/10 text-white">
                Top Up
              </Button>
            </div>
          </div>

          {/* Resumes Grid */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Resumes</h2>
              <Button variant="link" className="text-blue-400 hover:text-blue-300">View All</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <CreateResumeCard />
              {mockResumes.map(resume => (
                <ResumeCard
                  key={resume.id}
                  title={resume.title}
                  lastEdited={resume.lastEdited}
                  thumbnail={resume.thumbnail}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
