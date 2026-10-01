import React, { useState } from 'react';
import { Brain, CheckCircle2, Award, ArrowRight, RotateCcw } from 'lucide-react';
import type { VideoItem } from '../data/videos';
import type { WatchLog, ExperimentSettings } from '../hooks/useExperimentState';
import { DataExport } from './DataExport';

interface MemoryAssessmentProps {
  videos: VideoItem[];
  logs: WatchLog[];
  settings: ExperimentSettings;
  onRestart: () => void;
}

export const MemoryAssessment: React.FC<MemoryAssessmentProps> = ({
  videos,
  logs,
  settings,
  onRestart,
}) => {
  const allQuestions = videos.flatMap((v) => v.recallQuestions);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSelectAnswer = (qId: string, optionIdx: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    allQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const score = calculateScore();
  const percentage = Math.round((score / (allQuestions.length || 1)) * 100);

  return (
    <div className="w-full h-full bg-zinc-950 overflow-y-auto p-4 sm:p-6 text-white flex flex-col items-center">
      <div className="w-full max-w-lg flex flex-col gap-6 py-4">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2 border-b border-zinc-800 pb-6">
          <div className="p-3.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Brain className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Memory & Event Recall Test</h1>
          <p className="text-xs text-zinc-400 max-w-sm">
            Evaluating memory formation efficiency across experimental event boundary conditions.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-300 font-mono mt-1">
            <span>Condition: {settings.boundaryType.toUpperCase()} ({settings.pauseDuration}s pause)</span>
          </div>
        </div>

        {/* Score Summary Box when submitted */}
        {submitted && (
          <div className="bg-gradient-to-br from-indigo-950/80 to-zinc-900 border border-indigo-500/40 rounded-2xl p-6 text-center flex flex-col items-center gap-3 shadow-xl">
            <Award className="w-12 h-12 text-amber-400 animate-bounce" />
            <div>
              <div className="text-3xl font-extrabold text-white">{score} / {allQuestions.length}</div>
              <div className="text-sm font-semibold text-indigo-300 mt-1">{percentage}% Accuracy Score</div>
            </div>
            <p className="text-xs text-zinc-400 max-w-xs">
              Your memory retrieval data has been recorded alongside video watch times for experiment logging.
            </p>

            {/* Export Component */}
            <div className="w-full mt-2">
              <DataExport logs={logs} settings={settings} recallScore={score} totalQuestions={allQuestions.length} />
            </div>
          </div>
        )}

        {/* Question List */}
        <div className="flex flex-col gap-6">
          {allQuestions.map((q, idx) => {
            const isAnswered = userAnswers[q.id] !== undefined;
            const isCorrect = submitted && userAnswers[q.id] === q.correctAnswer;
            const isIncorrect = submitted && isAnswered && userAnswers[q.id] !== q.correctAnswer;

            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border transition-all ${
                  submitted
                    ? isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/50'
                      : isIncorrect
                      ? 'bg-rose-950/20 border-rose-500/50'
                      : 'bg-zinc-900 border-zinc-800'
                    : 'bg-zinc-900/90 border-zinc-800'
                }`}
              >
                <div className="flex items-start justify-between mb-3 gap-2">
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-800/40">
                    Question {idx + 1}
                  </span>
                  {submitted && isCorrect && (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-white mb-3">{q.question}</h3>

                <div className="flex flex-col gap-2">
                  {q.options.map((option, optIdx) => {
                    const isSelected = userAnswers[q.id] === optIdx;
                    let optStyle = 'bg-zinc-800/60 border-zinc-700/60 hover:bg-zinc-800 text-zinc-300';

                    if (isSelected) {
                      optStyle = 'bg-indigo-600/30 border-indigo-500 text-white font-semibold';
                    }

                    if (submitted) {
                      if (optIdx === q.correctAnswer) {
                        optStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-semibold';
                      } else if (isSelected && optIdx !== q.correctAnswer) {
                        optStyle = 'bg-rose-600/30 border-rose-500 text-rose-200';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={submitted}
                        onClick={() => handleSelectAnswer(q.id, optIdx)}
                        className={`p-3 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${optStyle}`}
                      >
                        <span>{option}</span>
                        {isSelected && !submitted && (
                          <div className="w-2 h-2 rounded-full bg-indigo-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit or Restart Controls */}
        <div className="pt-2 pb-8 flex flex-col gap-3">
          {!submitted ? (
            <button
              disabled={Object.keys(userAnswers).length < allQuestions.length}
              onClick={() => setSubmitted(true)}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                Object.keys(userAnswers).length < allQuestions.length
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/50'
              }`}
            >
              Submit Assessment ({Object.keys(userAnswers).length}/{allQuestions.length})
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onRestart}
              className="w-full py-3.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Restart Experiment Trial
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
