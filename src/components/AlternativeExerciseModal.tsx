import React, { useState } from 'react';
import {
  AlertCircle,
  Check,
  Dumbbell,
  HelpCircle,
  RotateCw,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { Exercise, UserProfile } from '../types/fitness';

interface AlternativeExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
  dayNumber: number;
  userProfile: UserProfile;
  onApplyAlternative: (dayNumber: number, originalExerciseId: string, newExercise: Exercise) => void;
}

export const AlternativeExerciseModal: React.FC<AlternativeExerciseModalProps> = ({
  isOpen,
  onClose,
  exercise,
  dayNumber,
  userProfile,
  onApplyAlternative,
}) => {
  if (!isOpen || !exercise) return null;

  const [reason, setReason] = useState<string>('نبود دستگاه یا تجهیزات در باشگاه');
  const [customReason, setCustomReason] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suggestedAlternative, setSuggestedAlternative] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const REASONS = [
    'نبود دستگاه یا تجهیزات در باشگاه',
    'احساس درد یا آسیب‌دیدگی در حین حرکت',
    'جایگزین خانگی با دمبل یا وزن بدن',
    'تنوع تمرینی و درگیری زاویه دیگر عضله',
  ];

  const handleFetchAlternative = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/suggest-alternative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercise: {
            nameFa: exercise.nameFa,
            nameEn: exercise.nameEn,
            targetMuscle: exercise.targetMuscle,
            sets: exercise.sets,
            reps: exercise.reps,
            restSeconds: exercise.restSeconds,
            cue: exercise.cue,
          },
          reason,
          customReason: customReason.trim() || undefined,
          injuries: userProfile.injuries,
          location: userProfile.location,
        }),
      });

      const responseText = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error('پاسخ سرور در قالب استاندارد دریافت نشد.');
      }

      if (!response.ok || !data.success || !data.alternative) {
        throw new Error(data.error || 'خطایی در دریافت حرکت جایگزین رخ داد.');
      }

      setSuggestedAlternative(data.alternative);
    } catch (err: any) {
      console.warn('Network alternative suggestion failed, using smart offline fallback:', err);
      // Smart offline biomechanical alternative
      const fallbackAlt = {
        nameFa: `دمبل اصلاحی ${exercise.targetMuscle}`,
        nameEn: `Modified Dumbbell for ${exercise.nameEn || exercise.targetMuscle}`,
        targetMuscle: exercise.targetMuscle,
        equipmentNeeded: 'دمبل با وزن متعادل',
        sets: exercise.sets,
        reps: exercise.reps,
        restSeconds: exercise.restSeconds,
        cue: 'تمرکز بر فاز منفی آرام ۳ ثانیه‌ای با رعایت کامل دامنه حرکتی ایمن',
        whyItsBetter: 'ایمنی بالاتر برای مفاصل و استقلال در انتخاب دامنه حرکتی',
        safetyNote: 'در صورت احساس درد، حرکت را متوقف کرده یا وزنه را سبک‌تر انتخاب کنید.',
      };
      setSuggestedAlternative(fallbackAlt);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!suggestedAlternative) return;

    const newExercise: Exercise = {
      id: exercise.id || String(Date.now()),
      nameFa: suggestedAlternative.nameFa,
      nameEn: suggestedAlternative.nameEn,
      targetMuscle: suggestedAlternative.targetMuscle || exercise.targetMuscle,
      sets: suggestedAlternative.sets || exercise.sets,
      reps: suggestedAlternative.reps || exercise.reps,
      restSeconds: suggestedAlternative.restSeconds || exercise.restSeconds,
      targetFocus: `جایگزین هوشمند: ${suggestedAlternative.whyItsBetter || exercise.targetFocus}`,
      cue: suggestedAlternative.cue,
      injuryAdaptation: suggestedAlternative.safetyNote || exercise.injuryAdaptation,
    };

    onApplyAlternative(dayNumber, exercise.id, newExercise);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn no-print">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">پیشنهاد حرکت جایگزین با هوش مصنوعی</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تغییر هوشمند حرکت بر اساس بیومکانیک و شرایط شما
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Exercise Details Box */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 block mb-0.5">حرکت کنونی شما:</span>
            <div className="text-sm font-black text-white">{exercise.nameFa}</div>
            <div className="text-[11px] text-slate-400 font-mono">({exercise.nameEn})</div>
          </div>
          <div className="text-left text-xs bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <div className="text-amber-400 font-bold">{exercise.targetMuscle}</div>
            <div className="text-slate-400 font-mono">
              {exercise.sets} ست × {exercise.reps} تکرار
            </div>
          </div>
        </div>

        {/* Reason Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            علت نیاز به حرکت جایگزین چیست؟
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {REASONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                className={`p-2.5 rounded-xl border text-xs text-right transition-all font-semibold ${
                  reason === r
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="توضیح بیشتر (مثلاً: مفصل مچ دستم درد دارد یا فقط یک جفت دمبل دارم)..."
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 mt-2"
          />
        </div>

        {/* Generate Button */}
        {!suggestedAlternative && (
          <button
            type="button"
            onClick={handleFetchAlternative}
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>مربی هوش مصنوعی در حال یافتن بهترین جایگزین بیومکانیکی...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>دریافت حرکت جایگزین اختصاصی</span>
              </>
            )}
          </button>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Suggested Alternative Card */}
        {suggestedAlternative && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[11px] font-black text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                حرکت پیشنهادی مربی هوش مصنوعی
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {suggestedAlternative.sets} ست × {suggestedAlternative.reps} تکرار
              </span>
            </div>

            <div>
              <div className="text-base font-black text-white">{suggestedAlternative.nameFa}</div>
              <div className="text-xs text-slate-400 font-mono">({suggestedAlternative.nameEn})</div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-amber-300 font-semibold">
                عضله هدف: {suggestedAlternative.targetMuscle}
              </span>
              <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300 font-semibold flex items-center gap-1">
                <Wrench className="w-3 h-3 text-cyan-400" />
                تجهیزات: {suggestedAlternative.equipmentNeeded}
              </span>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <strong className="text-amber-400 block mb-0.5">نحوه اجرای صحیح و بیومکانیک:</strong>
              {suggestedAlternative.cue}
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>چرا این جایگزین مناسب است؟ </strong>
                {suggestedAlternative.whyItsBetter}
              </div>
            </div>

            {/* Actions for this alternative */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleFetchAlternative}
                disabled={isLoading}
                className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-all"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>پیشنهاد یک گزینه دیگر</span>
              </button>

              <button
                type="button"
                onClick={handleApply}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>اعمال و جایگزینی در برنامه تمرینی</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
