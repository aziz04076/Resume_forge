"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        aria-label="Toggle theme"
        className={`w-10 h-10 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center border border-slate-700/60 bg-slate-900/60 text-slate-300 opacity-60 ${className}`}
      >
        <Moon className="w-4 h-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`w-10 h-10 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
        isDark
          ? "bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-700/80 hover:border-slate-600 focus-visible:ring-offset-slate-950 shadow-sm"
          : "bg-white hover:bg-slate-100 text-indigo-700 border-slate-300 hover:border-slate-400 focus-visible:ring-offset-white shadow-sm"
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-300 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-700 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
};
