import React, { useState, useEffect } from 'react';
import {
  Award,
  Check,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Flame,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Exercise } from '../types/fitness';
import {
  calculate1RM,
  calculateTotalVolume,
  ExerciseSetLog,
  getExerciseRecord,
  getRecommendedStartingWeight,
  getSavedSetLogs,
  saveSetLogs,
} from '../utils/weightTracker';
import { normalizePersianDigits } from '../utils/numberUtils';
import { ConfirmModal } from './ConfirmModal';

interface ExerciseWeightLoggerProps {
  exercise: Exercise;
  userWeight?: number;
  userGender?: string;
  userExperience?: string;
  isCompact?: boolean;
}

export const ExerciseWeightLogger: React.FC<ExerciseWeightLoggerProps> = ({
  exercise,
  userWeight = 75,
  userGender = 'male',
  userExperience = 'intermediate',
  isCompact = false,
}) => {
  const [sets, setSets] = useState<ExerciseSetLog[]>(() => {
    return getSavedSetLogs(exercise.id, exercise.sets || 4);
  });

  const [record, setRecord] = useState(() => getExerciseRecord(exercise.id));
  const [isExpanded, setIsExpanded] = useState<boolean>(!isCompact);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const suggestedWeight = getRecommendedStartingWeight(
    exercise.targetMuscle,
    userGender,
    userWeight,
    userExperience
  );

  // Sync with localStorage
  useEffect(() => {
    saveSetLogs(exercise.id, sets);
    setRecord(getExerciseRecord(exercise.id));
  }, [sets, exercise.id]);

  const updateSet = (index: number, updates: Partial<ExerciseSetLog>) => {
    setSets((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const adjustWeight = (index: number, delta: number) => {
    setSets((prev) => {
      const next = [...prev];
      const cur = next[index].weightKg || 0;
      const updated = Math.max(0, Math.round((cur + delta) * 2) / 2);
      next[index] = { ...next[index], weightKg: updated };
      return next;
    });
  };

  const adjustReps = (index: number, delta: number) => {
    setSets((prev) => {
      const next = [...prev];
      const cur = next[index].reps || 10;
      const updated = Math.max(1, cur + delta);
      next[index] = { ...next[index], reps: updated };
      return next;
    });
  };

  const toggleSetComplete = (index: number) => {
    setSets((prev) => {
      const next = [...prev];
      const wasCompleted = next[index].completed;
      // If completing and weight is 0, auto-fill with suggested or previous set weight
      let weight = next[index].weightKg;
      if (!wasCompleted && (!weight || weight === 0)) {
        const prevSet = index > 0 ? next[index - 1].weightKg : 0;
        weight = prevSet > 0 ? prevSet : suggestedWeight;
      }
      next[index] = {
        ...next[index],
        weightKg: weight,
        completed: !wasCompleted,
        timestamp: Date.now(),
      };
      return next;
    });
  };

  const addSet = () => {
    setSets((prev) => [
      ...prev,
      {
        setNumber: prev.length + 1,
        weightKg: prev.length > 0 ? prev[prev.length - 1].weightKg : suggestedWeight,
        reps: prev.length > 0 ? prev[prev.length - 1].reps : 10,
        completed: false,
      },
    ]);
  };

  const handleConfirmReset = () => {
    const cleared = sets.map((s) => ({ ...s, completed: false, weightKg: 0 }));
    setSets(cleared);
    saveSetLogs(exercise.id, cleared);
    setShowResetConfirm(false);
  };

  const resetLogs = () => {
    setShowResetConfirm(true);
  };

  const completedCount = sets.filter((s) => s.completed).length;
  const totalVolume = calculateTotalVolume(sets);
  const maxWeightLogged = sets.reduce((max, s) => (s.completed && s.weightKg > max ? s.weightKg : max), 0);
  const estimated1RM = maxWeightLogged > 0 ? calculate1RM(maxWeightLogged, 8) : 0;

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 overflow-hidden text-xs">
      {/* Logger Header / Toggle */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-850 cursor-pointer flex items-center justify-between border-b border-slate-800/70 select-none transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
            <Dumbbell className="w-3.5 h-3.5" />
          </div>
          <span className="font-extrabold text-white text-xs">
            ثبت وزنه‌ها و تکرارها ({completedCount} از {sets.length} ست انجام شد)
          </span>
          {completedCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
              حداکثر: {maxWeightLogged} kg
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          {record && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
              <Award className="w-3 h-3 text-amber-400" />
              رکورد قبلی: {record.maxWeight}kg × {record.reps}
            </span>
          )}
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-3.5 space-y-3 bg-slate-950/40">
          {/* Top Quick Stats / Hint */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>وزنه شروع پیشنهادی بر اساس وزن شما:</span>
              <strong className="text-amber-400 font-mono">{suggestedWeight} kg</strong>
            </div>

            <div className="flex items-center gap-3 text-slate-400">
              {totalVolume > 0 && (
                <span className="flex items-center gap-1 text-sky-300">
                  <TrendingUp className="w-3 h-3" />
                  حجم کل: <strong className="text-white font-mono">{totalVolume.toLocaleString('fa-IR')} kg</strong>
                </span>
              )}
              {estimated1RM > 0 && (
                <span className="flex items-center gap-1 text-emerald-300">
                  <Flame className="w-3 h-3 text-orange-400" />
                  تخمین 1RM: <strong className="text-white font-mono">{estimated1RM} kg</strong>
                </span>
              )}
            </div>
          </div>

          {/* Sets Table */}
          <div className="space-y-2">
            {sets.map((set, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 transition-all ${
                  set.completed
                    ? 'bg-emerald-950/20 border-emerald-800/50 shadow-sm'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Set identifier badge */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                      set.completed
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {set.setNumber}
                  </span>
                  <span className="font-bold text-slate-300 text-xs">ست {set.setNumber}</span>
                  {set.completed && (
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mr-1">
                      <Check className="w-3 h-3" />
                      ثبت شد
                    </span>
                  )}
                </div>

                {/* Controls: Weight & Reps Steppers */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Weight input with +/- */}
                  <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => adjustWeight(idx, -2.5)}
                      className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors active:scale-95"
                      title="کاهش ۲.۵ کیلوگرم"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <div className="flex flex-row-reverse items-center justify-between px-2 gap-1.5 min-w-[75px] bg-slate-950/60 rounded-xl py-1 border border-white/5">
                      <span className="text-[10px] text-slate-400 font-mono font-bold select-none">kg</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={set.weightKg === 0 ? '' : String(set.weightKg)}
                        placeholder={String(suggestedWeight)}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const norm = normalizePersianDigits(e.target.value);
                          updateSet(idx, { weightKg: norm === '' ? 0 : Number(norm) });
                        }}
                        className="w-12 text-center bg-transparent text-white font-mono font-bold text-xs focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => adjustWeight(idx, 2.5)}
                      className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors active:scale-95"
                      title="افزایش ۲.۵ کیلوگرم"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Reps input with +/- */}
                  <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => adjustReps(idx, -1)}
                      className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors active:scale-95"
                      title="کاهش یک تکرار"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <div className="flex items-center px-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={set.reps === 0 ? '' : String(set.reps)}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const norm = normalizePersianDigits(e.target.value);
                          updateSet(idx, { reps: norm === '' ? 0 : Math.max(1, parseInt(norm)) });
                        }}
                        className="w-10 text-center bg-transparent text-white font-mono font-bold text-xs focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400 mr-0.5">تکرار</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => adjustReps(idx, 1)}
                      className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors active:scale-95"
                      title="افزایش یک تکرار"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Complete checkmark button */}
                  <button
                    type="button"
                    onClick={() => toggleSetComplete(idx)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
                      set.completed
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{set.completed ? 'انجام شد' : 'ثبت ست'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom actions: Add Set / Reset */}
          <div className="flex items-center justify-between pt-1 text-[11px]">
            <button
              type="button"
              onClick={addSet}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>افزودن یک ست اضافه</span>
            </button>

            {completedCount > 0 && (
              <button
                type="button"
                onClick={resetLogs}
                className="text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
                title="شروع مجدد ست‌ها برای جلسه بعدی"
              >
                <RotateCcw className="w-3 h-3" />
                <span>ریست ست‌های این جلسه</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={showResetConfirm}
        title="ریست رکوردهای جلسه"
        message={`آیا مایل به ریست کردن ست‌های ثبت‌شده برای حرکت «${exercise.nameFa}» جهت شروع جلسه تمرینی جدید هستید؟`}
        confirmText="ریست ست‌ها"
        cancelText="انصراف"
        variant="warning"
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};
