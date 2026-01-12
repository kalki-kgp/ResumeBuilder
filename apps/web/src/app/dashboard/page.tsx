"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi, resumeApi, User, Resume, DashboardStats } from "@/lib/api";
import { authStorage } from "@/lib/auth";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ResumeCard } from "@/components/dashboard/ResumeCard";
import { CreateResumeCard } from "@/components/dashboard/CreateResumeCard";
import { ATScoreCard } from "@/components/dashboard/ATScoreCard";
import { JobMatchesWidget } from "@/components/dashboard/JobMatchesWidget";
import { AISuggestionsWidget } from "@/components/dashboard/AISuggestionsWidget";
import { Search } from "lucide-react";

// Helper to format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const refreshData = useCallback(async () => {
    const token = authStorage.getToken();
    if (!token) return;

    try {
      const [resumesData, statsData] = await Promise.all([
        resumeApi.list(token),
        resumeApi.getStats(token),
      ]);
      setResumes(resumesData.resumes);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to refresh data:", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const token = authStorage.getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Fetch user, resumes, and stats in parallel
        const [userData, resumesData, statsData] = await Promise.all([
          authApi.getCurrentUser(token),
          resumeApi.list(token),
          resumeApi.getStats(token),
        ]);
        setUser(userData);
        setResumes(resumesData.resumes);
        setStats(statsData);
      } catch (error) {
        authStorage.removeToken();
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleLogout = () => {
    authStorage.removeToken();
    router.push("/home");
  };

  const handleUpload = async (file: File) => {
    const token = authStorage.getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    setIsUploading(true);
    try {
      // Extract filename without extension for title
      const title = file.name.replace(/\.[^/.]+$/, "") || "Uploaded Resume";

      // Create resume entry
      const resume = await resumeApi.create(token, { title });

      // Upload the file (this will trigger ATS analysis)
      await resumeApi.uploadFile(token, resume.id, file);

      // Refresh the data to show updated resume with ATS score
      await refreshData();
    } catch (error) {
      console.error("Upload failed:", error);
      // You could add a toast notification here
    } finally {
      setIsUploading(false);
    }
  };

  // Filter resumes by search query
  const filteredResumes = resumes.filter((resume) =>
    resume.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0C15] flex items-center justify-center text-white">
        Loading workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C15] flex font-sans">
      <DashboardSidebar userEmail={user?.email} onLogout={handleLogout} />

      {/* Main Content Area + Right Panel */}
      <main className="flex-1 md:ml-64 flex min-h-screen">

        {/* Middle Column (Main Content) */}
        <div className="flex-1 p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.email?.split("@")[0].split(".")[0]}!
            </h1>
            <p className="text-gray-400">Manage your resumes and explore relevant opportunities.</p>
          </div>

          {/* Primary Action Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-64">
            <CreateResumeCard onUpload={handleUpload} isUploading={isUploading} />
            <ATScoreCard score={stats?.highest_ats_score ?? 0} />
          </div>

          {/* Recent Resumes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                Your Resumes {stats && stats.total_resumes > 0 && `(${stats.total_resumes})`}
              </h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search resumes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#12141c] border border-white/5 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                />
              </div>
            </div>

            {filteredResumes.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {filteredResumes.map(resume => (
                  <ResumeCard
                    key={resume.id}
                    id={resume.id}
                    title={resume.title}
                    lastEdited={formatRelativeTime(resume.updated_at)}
                    score={resume.ats_score}
                    thumbnail={resume.thumbnail_color}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">
                  {searchQuery ? "No resumes match your search." : "You haven't created any resumes yet."}
                </p>
                {!searchQuery && (
                  <p className="text-gray-500 text-sm">Click &quot;Create Resume&quot; above to get started!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Widgets) */}
        <div className="w-80 border-l border-white/10 bg-[#0B0C15]/50 backdrop-blur-xl p-6 hidden xl:block space-y-8 overflow-y-auto">
          <JobMatchesWidget />
          <AISuggestionsWidget />
        </div>

      </main>
    </div>
  );
}
