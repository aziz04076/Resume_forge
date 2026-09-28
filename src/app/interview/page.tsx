"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useResumeStore } from "@/lib/store/useResumeStore";
import {
  InterviewQuestionsResponse,
  InterviewAnswerEvaluation,
  InterviewQuestion,
} from "@/schemas/ai.schema";
import {
  ArrowLeft,
  Mic,
  MicOff,
  Sparkles,
  Bot,
  Play,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
}

export default function MockInterviewPage() {
  const { content, targetRole } = useResumeStore();

  const [roleTitle, setRoleTitle] = useState<string>(targetRole || "Senior Software Engineer");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [questionsData, setQuestionsData] = useState<InterviewQuestionsResponse | null>(null);

  // Active question index
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Speech Recognition state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [recognitionInstance, setRecognitionInstance] = useState<ISpeechRecognition | null>(null);

  // Evaluation state
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<InterviewAnswerEvaluation | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const windowObj = window as unknown as {
        SpeechRecognition?: new () => ISpeechRecognition;
        webkitSpeechRecognition?: new () => ISpeechRecognition;
      };

      const SpeechRecognition =
        windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + " ";
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event) => {
          console.error("Speech Recognition Error:", event.error);
          setIsRecording(false);
          toast.error(`Microphone error: ${event.error}`);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        setRecognitionInstance(recognition);
      }
    }
  }, []);

  const handleToggleRecord = () => {
    if (!recognitionInstance) {
      toast.error("Web Speech API not supported in this browser. You can type your answer manually.");
      return;
    }

    if (isRecording) {
      recognitionInstance.stop();
      setIsRecording(false);
      toast.info("Voice recording stopped");
    } else {
      setTranscript("");
      try {
        recognitionInstance.start();
        setIsRecording(true);
        toast.success("Listening... Speak your answer now.");
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Generate Questions
  const handleGenerateQuestions = async () => {
    try {
      setIsGenerating(true);
      toast.info("Generating role-specific interview questions from resume...");

      const res = await fetch("/api/ai/interview-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "GENERATE_QUESTIONS",
          resumeContent: content,
          targetRole: roleTitle,
          jobDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate questions");

      setQuestionsData(data);
      setCurrentIndex(0);
      setTranscript("");
      setEvaluation(null);
      toast.success("Interview session initialized!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to generate questions");
    } finally {
      setIsGenerating(false);
    }
  };

  // Evaluate Answer
  const handleEvaluateAnswer = async () => {
    const currentQ = questionsData?.questions[currentIndex];
    if (!currentQ || !transcript.trim()) {
      toast.error("Please speak or type an answer first");
      return;
    }

    try {
      setIsEvaluating(true);
      toast.info("AI Bar Raiser evaluating your answer...");

      const res = await fetch("/api/ai/interview-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "EVALUATE_ANSWER",
          targetRole: roleTitle,
          question: currentQ.question,
          userTranscript: transcript,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Evaluation failed");

      setEvaluation(data);
      toast.success("Evaluation ready!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Evaluation failed");
    } finally {
      setIsEvaluating(false);
    }
  };

  const currentQ: InterviewQuestion | undefined = questionsData?.questions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 selection:text-indigo-200 pb-20">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-xs text-white">
              <Bot className="w-4 h-4" />
            </div>
            <h1 className="text-sm font-bold text-white">AI Voice Mock Interview Coach</h1>
          </div>
        </div>

        <Link
          href="/editor"
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          Back to Editor
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-8 space-y-6">
        {/* Step 1: Session Setup */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Target Role & Mock Session Setup</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Questions will be dynamically synthesized from your actual resume projects and target position.
              </p>
            </div>

            <button
              onClick={handleGenerateQuestions}
              disabled={isGenerating}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 transition-all"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isGenerating ? "Synthesizing Questions..." : "Start Practice Session"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Position</label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Job Description (Optional context)
              </label>
              <input
                type="text"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste key responsibilities or leave blank..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Active Question Card */}
        {questionsData && currentQ && (
          <div className="p-6 bg-slate-900 border border-purple-500/30 rounded-2xl space-y-6">
            {/* Question Progress Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">
                  Question {currentIndex + 1} of {questionsData.questions.length}
                </span>
                <span className="text-xs uppercase font-semibold text-slate-400 font-mono">
                  [{currentQ.type}]
                </span>
              </div>

              {/* Question Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCurrentIndex((prev) => Math.max(0, prev - 1));
                    setTranscript("");
                    setEvaluation(null);
                  }}
                  disabled={currentIndex === 0}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded text-xs"
                >
                  Prev
                </button>
                <button
                  onClick={() => {
                    setCurrentIndex((prev) => Math.min(questionsData.questions.length - 1, prev + 1));
                    setTranscript("");
                    setEvaluation(null);
                  }}
                  disabled={currentIndex === questionsData.questions.length - 1}
                  className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 rounded text-xs text-white"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div>
              <h3 className="text-lg font-bold text-white leading-relaxed">{currentQ.question}</h3>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                <span>Interviewer intent: {currentQ.rationale}</span>
              </p>
            </div>

            {/* Voice Input & Transcript Area */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Your Answer</span>
                <button
                  onClick={handleToggleRecord}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isRecording
                      ? "bg-rose-600 text-white animate-pulse"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-purple-400" />}
                  <span>{isRecording ? "Stop Recording" : "Speak Answer (Mic)"}</span>
                </button>
              </div>

              <textarea
                rows={5}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Click 'Speak Answer' to record your voice via Web Speech API, or type your answer here..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 outline-none leading-relaxed"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleEvaluateAnswer}
                  disabled={isEvaluating || !transcript.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 transition-all"
                >
                  <Award className="w-4 h-4" />
                  <span>{isEvaluating ? "Evaluating with Claude..." : "Score & Review Answer"}</span>
                </button>
              </div>
            </div>

            {/* Step 3: Evaluation Breakdown Card */}
            {evaluation && (
              <div className="p-5 bg-slate-950 border border-purple-500/20 rounded-xl space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div
                      className={`text-2xl font-bold ${
                        evaluation.score >= 80
                          ? "text-emerald-400"
                          : evaluation.score >= 60
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      {evaluation.score} / 100
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Answer Score</div>
                      <div className="text-[11px] text-slate-400">{evaluation.confidenceRating}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Strengths */}
                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg">
                    <h5 className="font-semibold text-emerald-400 mb-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                    </h5>
                    <ul className="space-y-1 text-slate-300">
                      {evaluation.strengths.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-lg">
                    <h5 className="font-semibold text-rose-400 mb-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Areas to Improve
                    </h5>
                    <ul className="space-y-1 text-slate-300">
                      {evaluation.weaknesses.map((w, i) => (
                        <li key={i}>• {w}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Model Answer Suggestion */}
                <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                  <h5 className="font-semibold text-purple-400 mb-1.5 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" /> Ideal Model Answer
                  </h5>
                  <p className="text-slate-300 leading-relaxed italic">
                    &quot;{evaluation.improvedAnswerSuggestion}&quot;
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
