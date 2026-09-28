"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { X, Github, Sparkles, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RepoItem {
  id: string;
  name: string;
  description: string;
  html_url: string;
  language: string;
  stars: number;
  topics: string[];
}

interface GitHubImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubImportModal: React.FC<GitHubImportModalProps> = ({ isOpen, onClose }) => {
  const { addProject, targetRole } = useResumeStore();
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [generatingRepoId, setGeneratingRepoId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFetchRepos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Please enter a GitHub username");
      return;
    }

    try {
      setIsFetching(true);
      const res = await fetch(`/api/github/repos?username=${encodeURIComponent(username.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load repositories");
      }
      setRepos(data.repos || []);
      toast.success(`Fetched ${data.repos.length} public repositories!`);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to fetch repos");
    } finally {
      setIsFetching(false);
    }
  };

  const handleImportRepo = async (repo: RepoItem) => {
    try {
      setGeneratingRepoId(repo.id);
      toast.info(`Generating quantifiable STAR bullets for ${repo.name}...`);

      const res = await fetch("/api/github/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoName: repo.name,
          repoDescription: repo.description,
          repoUrl: repo.html_url,
          language: repo.language,
          topics: repo.topics,
          targetRole: targetRole || "Software Engineer",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate project bullets");
      }

      // Add to store
      addProject();
      // The store creates an empty project, now we update it
      const store = useResumeStore.getState();
      const projects = store.content.projects;
      const latestProject = projects[projects.length - 1];
      if (latestProject) {
        store.updateProject(latestProject.id, {
          name: data.project.name,
          role: data.project.role,
          description: data.project.description,
          bullets: data.project.bullets,
          technologies: data.project.technologies,
          liveUrl: data.project.liveUrl,
          githubUrl: data.project.githubUrl,
        });
      }

      toast.success(`Added ${repo.name} to resume projects!`);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to import repo");
    } finally {
      setGeneratingRepoId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Import from GitHub</h2>
              <p className="text-xs text-slate-400">
                Turn your real repositories into quantifiable resume project bullets.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/40">
          <form onSubmit={handleFetchRepos} className="flex gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username (e.g. torvalds or your-handle)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isFetching}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              {isFetching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Github className="w-3.5 h-3.5" />}
              <span>{isFetching ? "Loading..." : "Fetch Repos"}</span>
            </button>
          </form>
        </div>

        {/* Repos List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {repos.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Enter your GitHub handle above to load your repositories and transform them into Google XYZ bullet points.
            </div>
          ) : (
            repos.map((repo) => (
              <div
                key={repo.id}
                className="p-4 bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 rounded-xl flex items-center justify-between gap-4 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-white truncate">{repo.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      {repo.language}
                    </span>
                    {repo.stars > 0 && (
                      <span className="flex items-center gap-0.5 text-[10px] text-amber-400 font-mono">
                        <Star className="w-3 h-3 fill-current" /> {repo.stars}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {repo.description}
                  </p>
                </div>

                <button
                  onClick={() => handleImportRepo(repo)}
                  disabled={generatingRepoId === repo.id}
                  className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0"
                >
                  {generatingRepoId === repo.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>{generatingRepoId === repo.id ? "Synthesizing..." : "Import with AI"}</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
