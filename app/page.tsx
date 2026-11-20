"use client";

import { useCallback, useEffect, useState } from "react";
import {
  QuizState,
  Feedback,
  getNextQuestion,
  submitAnswer,
  initQuizState,
  getEncouragementMessage,
  getAccuracyLabel,
} from "@/lib/quiz-engine";
import { ALL_DATA } from "@/lib/data";
import { loadState, saveState, clearState } from "@/lib/storage";
import Link from "next/link";

const ROUND_SIZE = ALL_DATA.length;

type GamePhase = "idle" | "question" | "feedback";

export default function QuizPage() {
  const [state, setState] = useState<QuizState>(() => loadState());
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [encouragement, setEncouragement] = useState<string>("");

  // Save state whenever it changes
  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  const startOrContinue = useCallback(() => {
    const { state: newState } = getNextQuestion(state);
    setState(newState);
    setPhase("question");
    setFeedback(null);
  }, [state]);

  const handleAnswer = useCallback(
    (answer: string) => {
      if (phase !== "question") return;
      const { state: newState, feedback: fb } = submitAnswer(state, answer);
      setState(newState);
      setFeedback(fb);
      setEncouragement(getEncouragementMessage(fb, newState.streak));
      setPhase("feedback");
    },
    [state, phase]
  );

  const handleNext = useCallback(() => {
    const { state: newState } = getNextQuestion(state);
    setState(newState);
    setPhase("question");
    setFeedback(null);
  }, [state]);

  const handleReset = useCallback(() => {
    clearState();
    const fresh = initQuizState();
    setState(fresh);
    setPhase("idle");
    setFeedback(null);
  }, []);

  if (!state) {
    return null;
  }

  const question = state.currentQuestion;
  const accuracy = getAccuracyLabel(state.correctCount, state.totalAsked);
  const roundProgress = Math.round((state.answeredInRound / ROUND_SIZE) * 100);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      {/* Header */}
      <header className="w-full max-w-2xl mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700">
              🌍 Capital Quizeroo
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Learn capitals · One question at a time
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/data"
              className="text-sm px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition"
            >
              📚 Data
            </Link>
            <button
              onClick={handleReset}
              className="text-sm px-3 py-1.5 rounded-lg bg-white border border-red-200 text-red-500 hover:bg-red-50 transition"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </header>

      {/* Score Bar */}
      <div className="w-full max-w-2xl grid grid-cols-4 gap-3 mb-6">
        <ScoreBadge label="Score" value={state.score.toString()} icon="⭐" color="yellow" />
        <ScoreBadge label="Accuracy" value={accuracy} icon="🎯" color="green" />
        <ScoreBadge label="Streak" value={state.streak.toString()} icon="🔥" color="orange" />
        <ScoreBadge label="Round" value={state.roundNumber.toString()} icon="🔄" color="blue" />
      </div>

      {/* Round progress */}
      {state.totalAsked > 0 && (
        <div className="w-full max-w-2xl mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Round {state.roundNumber} progress</span>
            <span>{state.answeredInRound} / {ROUND_SIZE} answered</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${roundProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Main card */}
      <div className="w-full max-w-2xl">
        {phase === "idle" && (
          <IdleCard
            totalAsked={state.totalAsked}
            score={state.score}
            onStart={startOrContinue}
          />
        )}

        {phase === "question" && question && (
          <QuestionCard
            question={question}
            onAnswer={handleAnswer}
          />
        )}

        {phase === "feedback" && feedback && question && (
          <FeedbackCard
            feedback={feedback}
            encouragement={encouragement}
            question={question}
            onNext={handleNext}
          />
        )}
      </div>

      {/* Stats footer */}
      {state.totalAsked > 0 && (
        <div className="w-full max-w-2xl mt-8 text-center text-xs text-gray-400">
          Total answered: {state.totalAsked} · Correct: {state.correctCount} · Best streak: {state.bestStreak}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function ScoreBadge({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: string;
  color: "yellow" | "green" | "orange" | "blue";
}) {
  const colorMap = {
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    green: "bg-green-50 border-green-200 text-green-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
  };
  return (
    <div className={`rounded-xl border p-3 text-center ${colorMap[color]}`}>
      <div className="text-lg">{icon}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs opacity-70">{label}</div>
    </div>
  );
}

function IdleCard({
  totalAsked,
  score,
  onStart,
}: {
  totalAsked: number;
  score: number;
  onStart: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="text-6xl mb-4">🌍</div>
      <h2 className="text-2xl font-bold text-indigo-700 mb-2">
        {totalAsked === 0 ? "Welcome to Capital Quizeroo!" : "Ready to continue?"}
      </h2>
      <p className="text-gray-500 mb-2">
        {totalAsked === 0
          ? "Test your knowledge of capitals for Indian states, union territories, and countries of the Americas."
          : `You've answered ${totalAsked} questions so far with a score of ${score}.`}
      </p>
      <p className="text-sm text-gray-400 mb-8">
        Questions cover all places in rotation — every place gets asked before any repeats!
      </p>
      <button
        onClick={onStart}
        className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-lg font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-md"
      >
        {totalAsked === 0 ? "Start Quiz! 🚀" : "Continue →"}
      </button>
    </div>
  );
}

import { Question } from "@/lib/quiz-engine";
import { getTypeLabel } from "@/lib/quiz-engine";

function QuestionCard({
  question,
  onAnswer,
}: {
  question: Question;
  onAnswer: (a: string) => void;
}) {
  const categoryBadge = getCategoryBadge(question);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Category */}
      <div className="flex justify-between items-center mb-6">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryBadge.cls}`}>
          {categoryBadge.icon} {categoryBadge.label}
        </span>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {getTypeLabel(question.place.type)}
        </span>
      </div>

      {/* Prompt */}
      <h2 className="text-xl font-semibold text-gray-800 mb-8 leading-relaxed">
        {question.prompt}
      </h2>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((opt) => (
          <button
            key={opt}
            onClick={() => onAnswer(opt)}
            className="w-full text-left px-5 py-4 rounded-xl border-2 border-indigo-100 bg-indigo-50 text-gray-700 font-medium hover:border-indigo-400 hover:bg-indigo-100 active:scale-[0.98] transition-all text-sm"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function FeedbackCard({
  feedback,
  encouragement,
  question,
  onNext,
}: {
  feedback: Feedback;
  encouragement: string;
  question: Question;
  onNext: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-8 border-l-8 ${
        feedback.wasCorrect ? "border-green-500" : "border-red-400"
      }`}
    >
      {/* Result */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">
          {feedback.wasCorrect ? "✅" : "❌"}
        </div>
        <p className="text-xl font-bold text-gray-800">{encouragement}</p>
        {feedback.wasCorrect && (
          <p className="text-indigo-600 font-semibold mt-1">
            +{feedback.points} pts
            {feedback.streakBonus > 0 && (
              <span className="text-orange-500 ml-2">
                (🔥 +{feedback.streakBonus} streak bonus!)
              </span>
            )}
          </p>
        )}
      </div>

      {/* Answer detail */}
      <div className="bg-gray-50 rounded-xl p-5 mb-6 space-y-3">
        {!feedback.wasCorrect && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <span>❌ Your answer:</span>
            <span className="font-semibold">{feedback.selectedAnswer}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-green-700">
          <span>✅ Correct answer:</span>
          <span className="font-semibold">{feedback.correctAnswer}</span>
        </div>

        {/* Educational detail */}
        <div className="pt-2 border-t border-gray-200 text-sm text-gray-600 space-y-1">
          <div>
            <span className="font-medium">📍 {question.place.name}</span>
          </div>
          <div>Capital: <span className="font-medium">{question.place.capital}</span></div>
          <div>Type: <span className="font-medium">{getTypeLabel(question.place.type)}</span></div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all"
        autoFocus
      >
        Next Question →
      </button>
    </div>
  );
}

function getCategoryBadge(question: Question): { label: string; icon: string; cls: string } {
  const type = question.type;
  if (type === "state_or_ut") {
    return { label: "State or UT?", icon: "🇮🇳", cls: "bg-orange-100 text-orange-700" };
  }
  if (type === "north_or_south") {
    return { label: "North or South?", icon: "🌎", cls: "bg-blue-100 text-blue-700" };
  }
  if (type === "name_the_capital") {
    return { label: "Name the Capital", icon: "🏛️", cls: "bg-purple-100 text-purple-700" };
  }
  return { label: "Name the Place", icon: "📍", cls: "bg-teal-100 text-teal-700" };
}
