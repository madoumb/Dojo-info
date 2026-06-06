"use client";

import { useState } from "react";
import { Quiz } from "@/data/quizzes";
import { cn } from "@/lib/utils";

interface Props {
  quiz: Quiz;
}

type Phase = "intro" | "playing" | "results";

export default function QuizComponent({ quiz }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quiz.questions.length).fill(null));
  const [showExplanation, setShowExplanation] = useState(false);

  const question = quiz.questions[current];
  const score = answers.filter((a, i) => a === quiz.questions[i].correct).length;
  const percentage = Math.round((score / quiz.questions.length) * 100);
  const passed = percentage >= quiz.passingScore;

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (current < quiz.questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setPhase("results");
    }
  };

  const restart = () => {
    setPhase("intro");
    setCurrent(0);
    setSelected(null);
    setAnswers(Array(quiz.questions.length).fill(null));
    setShowExplanation(false);
  };

  if (phase === "intro") {
    return (
      <div className="glass rounded-2xl p-8 border border-purple-500/20 text-center space-y-6">
        <div className="text-5xl">🎯</div>
        <div>
          <h3 className="text-white font-bold text-xl mb-2">{quiz.title}</h3>
          <p className="text-slate-400 text-sm">
            {quiz.questions.length} questions · Score minimum : {quiz.passingScore}% · Durée estimée : {Math.ceil(quiz.questions.length * 1.5)} min
          </p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/5 text-left space-y-2">
          <p className="text-slate-300 text-sm font-semibold mb-3">📋 Règles :</p>
          {["Une seule bonne réponse par question", "L'explication s'affiche après chaque réponse", "Vous pouvez recommencer autant de fois que vous voulez"].map((r) => (
            <div key={r} className="flex items-center gap-2 text-slate-400 text-sm">
              <span className="text-purple-400">→</span> {r}
            </div>
          ))}
        </div>
        <button
          onClick={() => setPhase("playing")}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold hover:opacity-90 transition-all glow-purple"
        >
          Commencer le QCM →
        </button>
      </div>
    );
  }

  if (phase === "results") {
    return (
      <div className="glass rounded-2xl p-8 border border-white/5 space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">{passed ? "🏆" : "📚"}</div>
          <h3 className="text-white font-bold text-2xl mb-2">
            {passed ? "Félicitations !" : "Continuez à réviser"}
          </h3>
          <p className="text-slate-400">
            {passed ? "Module validé ! Badge débloqué." : `Score insuffisant — minimum requis : ${quiz.passingScore}%`}
          </p>
        </div>

        {/* Score circle */}
        <div className="flex justify-center">
          <div className={cn(
            "w-32 h-32 rounded-full flex flex-col items-center justify-center border-4",
            passed ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10"
          )}>
            <span className={cn("text-4xl font-bold", passed ? "text-green-400" : "text-red-400")}>{percentage}%</span>
            <span className="text-slate-500 text-xs">{score}/{quiz.questions.length}</span>
          </div>
        </div>

        {/* Détail par question */}
        <div className="space-y-2">
          <p className="text-slate-300 font-semibold text-sm mb-3">Récapitulatif :</p>
          {quiz.questions.map((q, i) => {
            const isCorrect = answers[i] === q.correct;
            return (
              <div key={i} className={cn(
                "flex items-start gap-3 p-3 rounded-xl border text-sm",
                isCorrect ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"
              )}>
                <span className={isCorrect ? "text-green-400 flex-shrink-0" : "text-red-400 flex-shrink-0"}>
                  {isCorrect ? "✓" : "✗"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 line-clamp-1">{q.question}</p>
                  {!isCorrect && (
                    <p className="text-green-400 text-xs mt-1">✓ {q.options[q.correct]}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={restart}
          className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-purple-500/30 transition-all font-medium"
        >
          🔄 Recommencer le QCM
        </button>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 border border-white/5 space-y-5">
      {/* Progression */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-sm">Question {current + 1}/{quiz.questions.length}</span>
        <span className="text-purple-400 text-sm font-medium">{Math.round(((current) / quiz.questions.length) * 100)}% complété</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full transition-all duration-500"
          style={{ width: `${((current) / quiz.questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="p-4 rounded-xl bg-white/3 border border-white/10">
        <p className="text-white font-semibold text-base leading-relaxed">{question.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((option, idx) => {
          const isSelected = selected === idx;
          const isCorrect = idx === question.correct;
          const showResult = selected !== null;

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={selected !== null}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl border text-sm transition-all",
                !showResult && "glass border-white/10 text-slate-300 hover:border-purple-500/40 hover:text-white",
                showResult && isCorrect && "bg-green-500/15 border-green-500/40 text-green-300",
                showResult && isSelected && !isCorrect && "bg-red-500/15 border-red-500/40 text-red-300",
                showResult && !isSelected && !isCorrect && "opacity-40 border-white/5 text-slate-500"
              )}
            >
              <span className="flex items-center gap-3">
                <span className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border",
                  !showResult && "border-white/20 text-slate-400",
                  showResult && isCorrect && "border-green-500/60 bg-green-500/20 text-green-400",
                  showResult && isSelected && !isCorrect && "border-red-500/60 bg-red-500/20 text-red-400",
                )}>
                  {showResult && isCorrect ? "✓" : showResult && isSelected && !isCorrect ? "✗" : String.fromCharCode(65 + idx)}
                </span>
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explication */}
      {showExplanation && (
        <div className={cn(
          "p-4 rounded-xl border text-sm",
          selected === question.correct
            ? "bg-green-500/8 border-green-500/25 text-green-200"
            : "bg-orange-500/8 border-orange-500/25 text-orange-200"
        )}>
          <p className="font-semibold mb-1">{selected === question.correct ? "✅ Bonne réponse !" : "❌ Mauvaise réponse"}</p>
          <p className="text-sm leading-relaxed opacity-90">{question.explanation}</p>
        </div>
      )}

      {selected !== null && (
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold hover:opacity-90 transition-all"
        >
          {current < quiz.questions.length - 1 ? "Question suivante →" : "Voir les résultats →"}
        </button>
      )}
    </div>
  );
}
