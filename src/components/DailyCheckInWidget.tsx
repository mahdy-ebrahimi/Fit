import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Droplet,
  Flame,
  Plus,
  Scale,
  Sparkles,
  Trophy,
  Utensils,
  Dumbbell,
  Zap,
  Trash2,
  X,
  History,
} from 'lucide-react';
import { DailyCheckIn, UserProfile } from '../types/fitness';
import { ConfirmModal } from './ConfirmModal';

interface DailyCheckInWidgetProps {
  profile: UserProfile;
  onWeightUpdated?: (newWeight: number) => void;
}

const LOCAL_STORAGE_KEY_CHECKINS = 'fitgen_daily_checkins';
const LOCAL_STORAGE_KEY_METRICS = 'fitgen_body_metrics_history';

export const DailyCheckInWidget: React.FC<DailyCheckInWidgetProps> = ({ profile, onWeightUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [checkInToDelete, setCheckInToDelete] = useState<string | null>(null);

  const getTodayDateStr = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // Form states
  const [date, setDate] = useState<string>(getTodayDateStr());
  const [weight, setWeight] = useState<string>(profile.weight ? String(profile.weight) : '');
  const [workoutStatus, setWorkoutStatus] = useState<'completed' | 'rest_day' | 'partial' | 'skipped'>('completed');
  const [workoutPercent, setWorkoutPercent] = useState<number>(100);
  const [dietPercent, setDietPercent] = useState<number>(90);
  const [waterLiters, setWaterLiters] = useState<number>(2.5);
  const [energyLevel, setEnergyLevel] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [notes, setNotes] = useState<string>('');

  // Load check-ins from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CHECKINS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCheckIns(parsed);
          // If today was already logged, populate form with today's values
          const todayLog = parsed.find((item: DailyCheckIn) => item.date === getTodayDateStr());
          if (todayLog) {
            if (todayLog.weight) setWeight(String(todayLog.weight));
            setWorkoutStatus(todayLog.workoutCompleted);
            setWorkoutPercent(todayLog.workoutAdherencePercent);
            setDietPercent(todayLog.dietAdherencePercent);
            setWaterLiters(todayLog.waterLiters || 2.5);
            setEnergyLevel(todayLog.energyLevel || 4);
            if (todayLog.notes) setNotes(todayLog.notes);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load checkins from localStorage:', e);
    }
  }, []);

  // Check if today has been logged
  const todayEntry = checkIns.find((c) => c.date === getTodayDateStr());

  // Calculate streak (consecutive days logged)
  const calculateStreak = () => {
    if (checkIns.length === 0) return 0;
    const sorted = [...checkIns].sort((a, b) => b.timestamp - a.timestamp);
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sorted.length; i++) {
      const itemDate = new Date(sorted[i].date);
      itemDate.setHours(0, 0, 0, 0);
      const diffDays = Math.round((today.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === streak || diffDays === streak + 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const streakDays = calculateStreak();

  const handleWorkoutStatusChange = (status: 'completed' | 'rest_day' | 'partial' | 'skipped') => {
    setWorkoutStatus(status);
    if (status === 'completed' || status === 'rest_day') setWorkoutPercent(100);
    else if (status === 'partial') setWorkoutPercent(65);
    else if (status === 'skipped') setWorkoutPercent(0);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = weight ? parseFloat(weight) : undefined;

    const newCheckIn: DailyCheckIn = {
      id: date,
      date,
      timestamp: new Date(date).getTime(),
      weight: weightNum,
      workoutCompleted: workoutStatus,
      workoutAdherencePercent: workoutPercent,
      dietAdherencePercent: dietPercent,
      waterLiters,
      energyLevel,
      notes: notes.trim() || undefined,
    };

    // Filter out existing for this date, then add new
    const updated = [newCheckIn, ...checkIns.filter((c) => c.date !== date)].sort(
      (a, b) => b.timestamp - a.timestamp
    );

    setCheckIns(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CHECKINS, JSON.stringify(updated));

      // Also sync to body metrics history if weight was entered!
      if (weightNum && !isNaN(weightNum)) {
        const heightMeters = profile.height / 100;
        const bmi = Number((weightNum / (heightMeters * heightMeters)).toFixed(1));

        const savedMetrics = localStorage.getItem(LOCAL_STORAGE_KEY_METRICS);
        let metricsList = savedMetrics ? JSON.parse(savedMetrics) : [];
        if (!Array.isArray(metricsList)) metricsList = [];

        // Check if date exists in metrics
        const existingIdx = metricsList.findIndex((m: any) => m.date === date);
        const metricItem = {
          id: date,
          date,
          timestamp: new Date(date).getTime(),
          weight: weightNum,
          targetWeight: profile.targetWeight,
          bmi,
          notes: notes.trim() || 'ثبت شده از چک‌این روزانه',
        };

        if (existingIdx >= 0) {
          metricsList[existingIdx] = { ...metricsList[existingIdx], ...metricItem };
        } else {
          metricsList.push(metricItem);
        }
        metricsList.sort((a: any, b: any) => a.timestamp - b.timestamp);
        localStorage.setItem(LOCAL_STORAGE_KEY_METRICS, JSON.stringify(metricsList));

        if (onWeightUpdated) {
          onWeightUpdated(weightNum);
        }
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setIsOpen(false);
    } catch (err) {
      console.error('Error saving check-in:', err);
    }
  };

  const confirmDelete = () => {
    if (!checkInToDelete) return;
    const updated = checkIns.filter((c) => c.id !== checkInToDelete);
    setCheckIns(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CHECKINS, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    setCheckInToDelete(null);
  };

  const handleDelete = (id: string) => {
    setCheckInToDelete(id);
  };

  // Average weekly adherence
  const recentLogs = checkIns.slice(0, 7);
  const avgDietAdherence =
    recentLogs.length > 0
      ? Math.round(recentLogs.reduce((acc, c) => acc + c.dietAdherencePercent, 0) / recentLogs.length)
      : dietPercent;

  return (
    <div className="glass-panel border border-white/5 rounded-3xl p-5 sm:p-6 shadow-glass space-y-4">
      {/* Top Banner / Summary Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#FF6B00] flex items-center justify-center text-black font-black shadow-glow">
            <Trophy className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">ثبت گزارش روزانه پایبندی و وزن (Daily Check-in)</h3>
              {streakDays > 0 && (
                <span className="flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30 shadow-glow">
                  <Flame className="w-3.5 h-3.5 text-[#FF6B00] animate-bounce" />
                  {streakDays} روز پیوستگی متوالی
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {todayEntry ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  گزارش امروز ({todayEntry.date}) ثبت شده: {todayEntry.weight ? `${todayEntry.weight} kg | ` : ''}
                  پایبندی رژیم: {todayEntry.dietAdherencePercent}٪ | تمرین: {todayEntry.workoutAdherencePercent}٪
                </span>
              ) : (
                'هنوز گزارش امروز خود را وارد نکرده‌اید. با ثبت روزانه، عادات سالم را تثبیت کنید.'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end no-print">
          {checkIns.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-3.5 py-2.5 rounded-2xl text-xs font-bold glass-input text-slate-300 hover:text-white transition-all flex items-center gap-1.5 active:scale-95"
            >
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>تاریخچه ({checkIns.length})</span>
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-[#FF6B00] to-orange-400 hover:from-orange-500 hover:to-orange-400 text-black shadow-glow transition-all active:scale-95"
          >
            {isOpen ? <ChevronUp className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[3]" />}
            <span>{todayEntry ? 'ویرایش گزارش امروز' : 'ثبت گزارش امروز'}</span>
          </button>
        </div>
      </div>

      {/* Success alert message */}
      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>گزارش روزانه شما با موفقیت در مرورگر ذخیره و نمودارها به‌روزرسانی شدند! 🎉</span>
        </div>
      )}

      {/* Mini Progress Highlights when closed */}
      {!isOpen && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 rounded-2xl glass-input flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FF6B00]/10 text-[#FF6B00]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">آخرین وزن ثبت‌شده</div>
              <div className="text-xs sm:text-sm font-black text-white font-mono">
                {todayEntry?.weight ? `${todayEntry.weight} kg` : `${profile.weight} kg`}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl glass-input flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">وضعیت تمرین امروز</div>
              <div className="text-xs sm:text-sm font-bold text-slate-200">
                {todayEntry
                  ? todayEntry.workoutCompleted === 'completed'
                    ? 'انجام شد (۱۰۰٪)'
                    : todayEntry.workoutCompleted === 'rest_day'
                    ? 'استراحت برنامه'
                    : todayEntry.workoutCompleted === 'partial'
                    ? 'بخشی از تمرین'
                    : 'انجام نشد'
                  : 'در انتظار ثبت'}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl glass-input flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">میانگین پایبندی رژیم</div>
              <div className="text-xs sm:text-sm font-black text-emerald-400 font-mono">
                {avgDietAdherence}٪
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl glass-input flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Droplet className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">آب مصرفی امروز</div>
              <div className="text-xs sm:text-sm font-black text-cyan-400 font-mono">
                {todayEntry?.waterLiters || waterLiters} لیتر
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DAILY CHECK-IN FORM (COLLAPSIBLE) */}
      {isOpen && (
        <form
          onSubmit={handleSave}
          className="p-5 sm:p-6 rounded-3xl glass-panel border border-[#FF6B00]/30 shadow-glass space-y-5 animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-sm font-bold text-[#FF6B00]">
              <Sparkles className="w-4 h-4" />
              <span>فرم ثبت وضعیت و عملکرد روزانه</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-xl glass-input"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Row 1: Date & Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                تاریخ گزارش
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                وزن امروز (کیلوگرم - ترجیحاً ناشتا)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="250"
                  placeholder="مثلاً 78.4"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    const current = parseFloat(weight) || profile.weight;
                    setWeight((current + 0.1).toFixed(1));
                  }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono rounded-xl text-slate-300"
                  title="افزودن ۱۰۰ گرم"
                >
                  +0.1
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const current = parseFloat(weight) || profile.weight;
                    setWeight((current - 0.1).toFixed(1));
                  }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono rounded-xl text-slate-300"
                  title="کاهش ۱۰۰ گرم"
                >
                  -0.1
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Workout Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-red-400" />
              وضعیت انجام تمرین امروز:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => handleWorkoutStatusChange('completed')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                  workoutStatus === 'completed'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                ✅ کامل انجام شد
              </button>
              <button
                type="button"
                onClick={() => handleWorkoutStatusChange('rest_day')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                  workoutStatus === 'rest_day'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                🛌 استراحت طبق برنامه
              </button>
              <button
                type="button"
                onClick={() => handleWorkoutStatusChange('partial')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                  workoutStatus === 'partial'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                ⚠️ بخشی از حرکات
              </button>
              <button
                type="button"
                onClick={() => handleWorkoutStatusChange('skipped')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                  workoutStatus === 'skipped'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                ❌ تمرین انجام نشد
              </button>
            </div>
          </div>

          {/* Row 3: Diet Adherence Slider & Water */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-400" />
                  میزان پایبندی به رژیم غذایی امروز:
                </label>
                <span className="text-xs font-black text-amber-400 font-mono">{dietPercent}٪</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={dietPercent}
                onChange={(e) => setDietPercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>تقلب آزاد (۰٪)</span>
                <span>متوسط (۵۰٪)</span>
                <span>کاملاً دقیق (۱۰۰٪)</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                  میزان آب نوشیده شده امروز:
                </label>
                <span className="text-xs font-black text-cyan-400 font-mono">{waterLiters} لیتر</span>
              </div>
              <div className="flex items-center gap-2">
                {[1.5, 2.0, 2.5, 3.0, 3.5, 4.0].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setWaterLiters(val)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                      waterLiters === val
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {val}L
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Energy & Mood */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              سطح انرژی، شادابی و ریکاوری امروز:
            </label>
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              {[
                { level: 5, label: '🔥 فوق‌العاده', sub: 'انرژی اوج' },
                { level: 4, label: '💪 خیلی خوب', sub: 'پرانگیزه' },
                { level: 3, label: '😐 معمولی', sub: 'متوسط' },
                { level: 2, label: '🥱 خسته', sub: 'کم‌انرژی' },
                { level: 1, label: '🛑 بی‌رمق', sub: 'نیاز به خواب' },
              ].map((item) => (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => setEnergyLevel(item.level as any)}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                    energyLevel === item.level
                      ? 'bg-[#FF6B00]/20 border-[#FF6B00] text-[#FF6B00] font-black shadow-glow'
                      : 'glass-input text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs">{item.label}</div>
                  <div className="text-[10px] text-slate-500">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Row 5: Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              یادداشت کوتاه وضعیت تمرین یا تغذیه (اختیاری)
            </label>
            <input
              type="text"
              placeholder="مثلاً: رکورد دمبل سینه بالا رفت، شام طبق برنامه فیله مرغ و سالاد بدون سس خوردم..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="glass-input w-full rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold glass-input text-slate-300 hover:text-white transition-all active:scale-95"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-[#FF6B00] to-orange-400 hover:from-orange-500 hover:to-orange-400 text-black shadow-glow transition-all active:scale-95"
            >
              ذخیره گزارش در حافظه (LocalStorage)
            </button>
          </div>
        </form>
      )}

      {/* CHECK-IN HISTORY DRAWER */}
      {showHistory && (
        <div className="pt-4 border-t border-white/10 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-300 flex items-center gap-1.5">
              <History className="w-4 h-4 text-[#FF6B00]" />
              تاریخچه گزارش‌های ثبت‌شده پایبندی روزانه
            </h4>
            <button
              onClick={() => setShowHistory(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg glass-input"
            >
              بستن
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {checkIns.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-400 text-[11px]">{item.date}</span>
                  {item.weight && (
                    <span className="font-mono font-bold text-amber-400">{item.weight} kg</span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.workoutCompleted === 'completed'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : item.workoutCompleted === 'rest_day'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    تمرین: {item.workoutAdherencePercent}٪
                  </span>
                  <span className="text-[11px] text-slate-300">
                    رژیم: <strong className="text-emerald-400 font-mono">{item.dietAdherencePercent}٪</strong>
                  </span>
                  <span className="text-[11px] text-cyan-400 font-mono">{item.waterLiters}L آب</span>
                  {item.notes && (
                    <span className="text-[11px] text-slate-400 italic truncate max-w-[150px] sm:max-w-[250px]">
                      «{item.notes}»
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-all"
                  title="حذف این رکورد"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!checkInToDelete}
        title="حذف گزارش پایبندی روزانه"
        message="آیا از حذف این گزارش پایبندی روزانه اطمینان دارید؟"
        confirmText="حذف گزارش"
        cancelText="انصراف"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setCheckInToDelete(null)}
      />
    </div>
  );
};
