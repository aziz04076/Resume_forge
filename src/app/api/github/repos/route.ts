import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username || username.trim() === "") {
      return NextResponse.json({ error: "GitHub username is required" }, { status: 400 });
    }

    const cleanUsername = username.trim().replace(/^@/, "");

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "ResumeForge-Career-Copilot",
    };

    if (env.GITHUB_ACCESS_TOKEN) {
      headers.Authorization = `token ${env.GITHUB_ACCESS_TOKEN}`;
    }

    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos?sort=updated&per_page=20`,
      { headers }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({ error: `GitHub user '${cleanUsername}' not found` }, { status: 404 });
      }
      if (res.status === 403) {
        return NextResponse.json(
          { error: "GitHub API rate limit exceeded. Please configure GITHUB_ACCESS_TOKEN in .env." },
          { status: 403 }
        );
      }
      return NextResponse.json({ error: "Failed to fetch repositories from GitHub" }, { status: res.status });
    }

    const repos = await res.json();

    const formattedRepos = repos
      .filter((repo: { fork: boolean }) => !repo.fork)
      .map((repo: {
        id: number;
        name: string;
        description: string | null;
        html_url: string;
        language: string | null;
        stargazers_count: number;
        topics: string[];
      }) => ({
        id: String(repo.id),
        name: repo.name,
        description: repo.description || "No description provided",
        html_url: repo.html_url,
        language: repo.language || "TypeScript",
        stars: repo.stargazers_count,
        topics: repo.topics || [],
      }));

    return NextResponse.json({ repos: formattedRepos });
  } catch (error) {
    console.error("GitHub repos fetch error:", error);
    return NextResponse.json({ error: "Failed to query GitHub API" }, { status: 500 });
  }
}
