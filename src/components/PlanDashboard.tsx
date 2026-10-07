import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Dumbbell,
  Flame,
  HeartPulse,
  HelpCircle,
  Info,
  Layers,
  MessageSquare,
  Moon,
  Pill,
  Play,
  RotateCcw,
  Send,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Utensils,
  Volume2,
  Droplet,
  TrendingUp,
} from 'lucide-react';
import { GeneratedPlan, UserProfile, WorkoutDay, Exercise } from '../types/fitness';
import { BodyMetricsChart } from './BodyMetricsChart';
import { DailyCheckInWidget } from './DailyCheckInWidget';
import { AlternativeExerciseModal } from './AlternativeExerciseModal';
import { DietSupplementsSection } from './DietSupplementsSection';
import { ExerciseAnimationModal } from './ExerciseAnimationModal';
import { ExerciseWeightLogger } from './ExerciseWeightLogger';
import { SharePlanModal } from './SharePlanModal';
import { motion, type Variants } from 'framer-motion';
import {
  BodyRatioIcon,
  CaloriesBurnedIcon,
  MuscleMassIcon,
  NutritionPlanIcon,
  WaterIntakeIcon,
} from './FitGenIconPack';

// Entrance Animation Variants (Framer Motion)
const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(3px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
};

const tabContentVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: 'easeOut',
    },
  },
};

interface PlanDashboardProps {
  plan: GeneratedPlan;
  profile: UserProfile;
  onEditProfile: () => void;
  onPlanUpdated?: (newPlan: GeneratedPlan) => void;
  activeTab?: 'workout' | 'diet' | 'safety' | 'supplements' | 'metrics' | 'chat';
  onTabChange?: (tab: 'workout' | 'diet' | 'safety' | 'supplements' | 'metrics' | 'chat') => void;
}

export const PlanDashboard: React.FC<PlanDashboardProps> = ({
  plan,
  profile,
  onEditProfile,
  onPlanUpdated,
  activeTab: propActiveTab,
  onTabChange,
}) => {
  const [currentPlan, setCurrentPlan] = useState<GeneratedPlan>(plan);
  const [activeTab, setActiveTabState] = useState<'workout' | 'diet' | 'safety' | 'supplements' | 'metrics' | 'chat'>(propActiveTab || 'workout');
  
  const setActiveTab = (tab: 'workout' | 'diet' | 'safety' | 'supplements' | 'metrics' | 'chat') => {
    setActiveTabState(tab);
    if (onTabChange) onTabChange(tab);
  };

  useEffect(() => {
    if (propActiveTab) {
      setActiveTabState(propActiveTab);
    }
  }, [propActiveTab]);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [selectedExerciseForAlternative, setSelectedExerciseForAlternative] = useState<{ exercise: Exercise; dayNumber: number } | null>(null);
  const [selectedExerciseForAnimation, setSelectedExerciseForAnimation] = useState<Exercise | null>(null);
  const [dietTextSize, setDietTextSize] = useState<'normal' | 'large'>('large');
  const [isHighContrastDiet, setIsHighContrastDiet] = useState<boolean>(true);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  useEffect(() => {
    setCurrentPlan(plan);
  }, [plan]);

  const handleApplyAlternative = (dayNumber: number, originalExerciseId: string, newExercise: Exercise) => {
    const updatedDays = currentPlan.workoutPlan.days.map((day) => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          exercises: day.exercises.map((ex) => (ex.id === originalExerciseId ? newExercise : ex)),
        };
      }
      return day;
    });

    const updatedPlan: GeneratedPlan = {
      ...currentPlan,
      workoutPlan: {
        ...currentPlan.workoutPlan,
        days: updatedDays,
      },
    };

    setCurrentPlan(updatedPlan);
    if (onPlanUpdated) {
      onPlanUpdated(updatedPlan);
    }
    try {
      localStorage.setItem('fitgen_saved_plan_v1', JSON.stringify(updatedPlan));
    } catch (e) {
      console.error(e);
    }
  };

  // Mini Rest Timer state
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerInitial, setTimerInitial] = useState<number>(60);

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `سلام ${profile.gender === 'female' ? 'ورزشکار عزیز' : 'پهلوان عزیز'}! من مربی هوش مصنوعی فیت‌ژن شما هستم. برنامه اختصاصی شما با در نظر گرفتن تمام آسیب‌ها، بیماری‌ها، عضلات ضعیف و ترجیحات غذایی‌تان طراحی شد. اگر سوالی در مورد نحوه اجرای یک حرکت، جایگزین کردن یک غذا، یا تنظیم ست‌ها دارید، از من بپرسید!`,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds !== null && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      // Play brief tone if AudioContext is available
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        // ignore audio error
      }
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const startRestTimer = (seconds: number) => {
    setTimerInitial(seconds);
    setTimerSeconds(seconds);
    setTimerRunning(true);
  };

  const toggleExerciseComplete = (id: string) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          planSummary: {
            userGoal: profile.goal,
            weight: profile.weight,
            targetWeight: profile.targetWeight,
            injuries: profile.injuries,
            weakMuscles: profile.weakMuscles,
            allergies: profile.allergies,
            medicalConditions: profile.medicalConditions,
            splitName: plan.workoutPlan.splitName,
            targetCalories: plan.summary.targetCalories,
          },
          history: chatMessages.slice(-6),
        }),
      });

      const resText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(resText);
      } catch {}

      if (data.reply) {
        setChatMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: 'پاسخ دریافت شد. در اجرای حرکات بر دامنه کامل، فاز منفی ۳ ثانیه‌ای و حفظ ثبات مفاصل تمرکز فرمایید.' },
        ]);
      }
    } catch (err) {
      console.warn('Chat coach network error:', err);
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'در حال حاضر ارتباط اینترنتی ناپایدار است. برنامه‌ها، انیمیشن‌ها و ردیاب وزنه‌ها به صورت آفلاین فعال هستند.' },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const currentWorkoutDay = currentPlan.workoutPlan.days[selectedDayIndex] || currentPlan.workoutPlan.days[0];
  const currentExercises = currentWorkoutDay?.exercises || [];
  const currentAnimationIndex = selectedExerciseForAnimation
    ? currentExercises.findIndex((ex) => ex.id === selectedExerciseForAnimation.id)
    : -1;
  const prevExercise = currentAnimationIndex > 0 ? currentExercises[currentAnimationIndex - 1] : null;
  const nextExercise =
    currentAnimationIndex >= 0 && currentAnimationIndex < currentExercises.length - 1
      ? currentExercises[currentAnimationIndex + 1]
      : null;

  const TABS: Array<{ key: 'workout' | 'diet' | 'safety' | 'supplements' | 'metrics' | 'chat'; label: string }> = [
    { key: 'workout', label: 'برنامه تمرینی هفتگی' },
    { key: 'diet', label: 'رژیم غذایی و تغذیه' },
    { key: 'safety', label: 'پیشگیری از آسیب و ریکاوری' },
    { key: 'supplements', label: 'مکمل‌های علمی و ایمن' },
    { key: 'metrics', label: 'نمودار پیشرفت بدنی' },
    { key: 'chat', label: 'چت با مربی هوش مصنوعی' },
  ];

  const currentTabIndex = TABS.findIndex((t) => t.key === activeTab);
  const prevTab = currentTabIndex > 0 ? TABS[currentTabIndex - 1] : null;
  const nextTab = currentTabIndex < TABS.length - 1 ? TABS[currentTabIndex + 1] : null;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-1 sm:pt-2 pb-36 sm:pb-24 space-y-6 sm:space-y-8 animate-fadeIn w-full overflow-x-hidden">
      {/* Rest Timer Floating Bar (if active) */}
      {timerSeconds !== null && (
        <div className="fixed bottom-24 sm:bottom-6 left-3 sm:left-6 z-50 bg-slate-900 border border-amber-500/50 shadow-2xl shadow-amber-500/20 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 text-white backdrop-blur-md no-print">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r="20" className="stroke-slate-800" strokeWidth="4" fill="transparent" />
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-amber-400 transition-all duration-300"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 * (1 - (timerSeconds || 0) / (timerInitial || 1))}
              />
            </svg>
            <span className="absolute text-xs font-black">{timerSeconds}s</span>
          </div>
          <div>
            <div className="text-xs font-bold text-amber-400">تایمر استراحت ست</div>
            <div className="text-[11px] text-slate-400">
              {timerSeconds === 0 ? 'زمان تمام شد! آماده ست بعدی شوید.' : 'نفس عمیق و ریکاوری'}
            </div>
          </div>
          <div className="flex items-center gap-1.5 mr-2">
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs"
            >
              {timerRunning ? 'توقف' : 'شروع'}
            </button>
            <button
              onClick={() => setTimerSeconds(null)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs"
            >
              بستن
            </button>
          </div>
        </div>
      )}

      {/* Gord Coach Questionnaire Prompt Banner */}
      <div
        onClick={onEditProfile}
        className="rounded-3xl p-3.5 sm:p-4 bg-gradient-to-r from-[#FF6B00]/15 via-[#09152b] to-[#FF6B00]/10 border border-[#FF6B00]/30 flex items-center justify-between gap-3 cursor-pointer hover:border-[#FF6B00]/60 transition-all shadow-md group no-print"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B00] to-amber-500 flex items-center justify-center text-black font-black text-xs shadow-glow shrink-0">
            گُرد
          </div>
          <div className="text-right">
            <div className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <span>می‌خواهید مشخصات جدید را با مربی گُرد (GORD) تنظیم کنید؟</span>
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00] animate-pulse" />
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">
              روی این بخش بزنید تا کاراکتر مربی گُرد با شیت اختصاصی، تمام سوالات قد، وزن، عضلات و آسیب‌ها را از شما بپرسد.
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onEditProfile}
          className="px-3.5 py-2 rounded-xl bg-[#FF6B00] text-black font-black text-xs shadow-glow shrink-0 hover:scale-105 active:scale-95 transition-all"
        >
          شروع با مربی گُرد
        </button>
      </div>

      {/* Pro Athlete Top Dashboard Card */}
      <div className="rounded-3xl glass-panel p-6 sm:p-7 shadow-glass relative overflow-hidden border border-white/5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-5 border-b border-white/10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30 font-sans flex items-center gap-1">
                <span>مربی گُرد</span>
                <span className="font-mono text-[10px] text-amber-300">GORD</span>
              </span>
              <span className="text-xs text-slate-300 font-bold">
                {plan.summary.strategy}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-emerald-400 font-mono font-bold">
                هدف: {profile.targetWeight} kg
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {plan.workoutPlan.splitName}
            </h2>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {plan.summary.strategyExplanation}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto justify-end flex-wrap no-print">
            <button
              onClick={() => setSelectedExerciseForAnimation(currentWorkoutDay.exercises[0] || null)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-orange-400 hover:from-orange-500 hover:to-orange-400 text-black font-black text-xs flex items-center gap-1.5 shadow-glow transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black text-black" />
              <span>انیمیشن و تکنیک حرکات امروز</span>
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="px-3.5 py-2.5 rounded-2xl glass-input text-slate-200 hover:text-white hover:border-[#FF6B00]/40 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm"
              title="خروجی و اشتراک‌گذاری تصویر برنامه با موتور Canvas"
            >
              <Share2 className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>اشتراک کارت برنامه</span>
            </button>

            <button
              onClick={onEditProfile}
              className="px-3.5 py-2.5 rounded-2xl glass-input text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>ویرایش مشخصات</span>
            </button>
          </div>
        </div>

        {/* Unified Macro & Biometric Strip with 3D Glass Icons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-5">
          <div className="p-3.5 rounded-2xl glass-input text-center flex flex-col items-center justify-center">
            <CaloriesBurnedIcon size={32} className="mb-1" />
            <span className="text-[11px] text-slate-400 font-semibold block">کالری روزانه</span>
            <span className="text-base sm:text-lg font-black text-[#FF6B00]">{plan.summary.targetCalories}</span>
            <span className="text-[10px] text-slate-500 block font-mono">kcal</span>
          </div>

          <div className="p-3.5 rounded-2xl glass-input text-center flex flex-col items-center justify-center">
            <MuscleMassIcon size={32} className="mb-1" />
            <span className="text-[11px] text-slate-400 font-semibold block">پروتئین هدف</span>
            <span className="text-base sm:text-lg font-black text-rose-400">{plan.summary.macroSplit.proteinGrams}g</span>
            <span className="text-[10px] text-slate-500 block font-mono">{(plan.summary.macroSplit.proteinGrams / profile.weight).toFixed(1)}g / kg</span>
          </div>

          <div className="p-3.5 rounded-2xl glass-input text-center flex flex-col items-center justify-center">
            <NutritionPlanIcon size={32} className="mb-1" />
            <span className="text-[11px] text-slate-400 font-semibold block">کربوهیدرات</span>
            <span className="text-base sm:text-lg font-black text-amber-300">{plan.summary.macroSplit.carbsGrams}g</span>
            <span className="text-[10px] text-slate-500 block font-mono">سوخت هایپرتروفی</span>
          </div>

          <div className="p-3.5 rounded-2xl glass-input text-center flex flex-col items-center justify-center">
            <WaterIntakeIcon size={32} className="mb-1" />
            <span className="text-[11px] text-slate-400 font-semibold block">آب مصرفی</span>
            <span className="text-base sm:text-lg font-black text-cyan-400">{plan.summary.macroSplit.waterLiters} L</span>
            <span className="text-[10px] text-slate-500 block font-mono">هیدراتاسیون عضلانی</span>
          </div>

          <div className="p-3.5 rounded-2xl glass-input text-center col-span-2 sm:col-span-1 flex flex-col items-center justify-center">
            <BodyRatioIcon size={32} className="mb-1" />
            <span className="text-[11px] text-slate-400 font-semibold block">شاخص BMI</span>
            <span className="text-base sm:text-lg font-black text-emerald-400">{plan.summary.bmi.toFixed(1)}</span>
            <span className="text-[10px] text-slate-500 block font-mono">{plan.summary.bmiCategory}</span>
          </div>
        </div>
      </div>

      {/* Daily Check-in & Adherence Widget */}
      <DailyCheckInWidget profile={profile} />

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5 no-print no-scrollbar scroll-smooth">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-[#FF6B00] text-black shadow-glow font-black'
                  : 'glass-input text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.key === 'workout' && <Dumbbell className="w-4 h-4" />}
              {tab.key === 'diet' && <Utensils className="w-4 h-4" />}
              {tab.key === 'safety' && <ShieldAlert className="w-4 h-4" />}
              {tab.key === 'supplements' && <Pill className="w-4 h-4" />}
              {tab.key === 'metrics' && <TrendingUp className="w-4 h-4" />}
              {tab.key === 'chat' && <MessageSquare className="w-4 h-4" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: WORKOUT PLAN */}
      {activeTab === 'workout' && (
        <motion.div key="tab-workout" variants={tabContentVariants} initial="hidden" animate="visible" className="space-y-6">
          {/* Weak Muscle Strategy Banner */}
          {plan.workoutPlan.weakMuscleStrategy && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-amber-300">
                  استراتژی تقویت عضلات ضعیف ({Array.isArray(profile.weakMuscles) && profile.weakMuscles.length > 0 ? profile.weakMuscles.join('، ') : 'عضلات هدف'})
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {plan.workoutPlan.weakMuscleStrategy}
                </p>
              </div>
            </div>
          )}

          {/* Days Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {plan.workoutPlan.days.map((day, idx) => {
              const isSelected = selectedDayIndex === idx;
              return (
                <button
                  key={day.dayNumber}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#FF6B00]/20 border-[#FF6B00] text-white shadow-glow'
                      : 'glass-panel text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[11px] font-bold">روز {day.dayNumber}</span>
                    {day.isRestDay ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-900/40 text-blue-300 font-semibold border border-blue-800/40">
                        استراحت
                      </span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FF6B00]/20 text-[#FF6B00] font-semibold border border-[#FF6B00]/30">
                        تمرین
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-black text-slate-200 line-clamp-1">
                    {day.dayName}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Previous / Next Day Quick Navigation Bar */}
          <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-3xl glass-panel text-xs">
            <button
              type="button"
              onClick={() => setSelectedDayIndex((prev) => Math.max(0, prev - 1))}
              disabled={selectedDayIndex === 0}
              className="px-3.5 py-2 rounded-2xl glass-input text-slate-200 font-bold flex items-center gap-1.5 transition-all disabled:opacity-20 disabled:pointer-events-none active:scale-95"
            >
              <ChevronRight className="w-4 h-4 text-[#FF6B00] stroke-[3]" />
              <span>روز قبل {selectedDayIndex > 0 ? `(${currentPlan.workoutPlan.days[selectedDayIndex - 1].dayName})` : ''}</span>
            </button>

            <div className="text-center">
              <span className="text-xs font-black text-[#FF6B00]">روز {currentWorkoutDay.dayNumber} از {currentPlan.workoutPlan.days.length}</span>
              <span className="text-[11px] text-slate-300 block font-bold">{currentWorkoutDay.dayName}</span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDayIndex((prev) => Math.min(currentPlan.workoutPlan.days.length - 1, prev + 1))}
              disabled={selectedDayIndex === currentPlan.workoutPlan.days.length - 1}
              className="px-3.5 py-2 rounded-2xl glass-input text-slate-200 font-bold flex items-center gap-1.5 transition-all disabled:opacity-20 disabled:pointer-events-none active:scale-95"
            >
              <span>روز بعد {selectedDayIndex < currentPlan.workoutPlan.days.length - 1 ? `(${currentPlan.workoutPlan.days[selectedDayIndex + 1].dayName})` : ''}</span>
              <ChevronLeft className="w-4 h-4 text-[#FF6B00] stroke-[3]" />
            </button>
          </div>

          {/* Current Selected Day View */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#FF6B00] text-black">
                    روز {currentWorkoutDay.dayNumber}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white">{currentWorkoutDay.dayName}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-xs text-slate-400">عضلات هدف:</span>
                  {currentWorkoutDay.targetMuscles.map((m, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-xl text-xs font-semibold glass-input text-[#FF6B00] border border-[#FF6B00]/20"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {!currentWorkoutDay.isRestDay && (
                <div className="text-xs text-slate-400 glass-input px-3.5 py-2 rounded-xl">
                  تعداد حرکات: <strong className="text-white">{currentWorkoutDay.exercises.length} حرکت</strong>
                </div>
              )}
            </div>

            {/* REST DAY NOTICE */}
            {currentWorkoutDay.isRestDay ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                  <Moon className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-white">امروز روز ریکاوری و رشد عضلات است</h4>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                  رشد واقعی عضلات در زمان استراحت و خواب عمیق اتفاق می‌افتد. به پروتئین مصرفی و هیدراتاسیون خود پایبند بمانید و از استرس دوری کنید. پیاده‌روی سبک و کشش برای بهبود گردش خون توصیه می‌شود.
                </p>
              </div>
            ) : (
              <>
                {/* WARM UP */}
                {currentWorkoutDay.warmup && currentWorkoutDay.warmup.length > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40">
                    <h4 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-2">
                      <Flame className="w-4 h-4" />
                      پروتکل گرم کردن اختصاصی و موبیلیتی مفاصل (۵ تا ۱۰ دقیقه):
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      {currentWorkoutDay.warmup.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* EXERCISES LIST */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    حرکات اصلی تمرین
                  </h4>

                  <motion.div
                    key={`day-${currentWorkoutDay.dayNumber}-exercises`}
                    variants={listContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    {currentWorkoutDay.exercises.map((exercise, exIndex) => {
                      const isDone = !!completedExercises[exercise.id || String(exIndex)];
                      return (
                        <motion.div
                          key={exercise.id || exIndex}
                          variants={listItemVariants}
                          className={`rounded-3xl border transition-all p-5 sm:p-6 ${
                            isDone
                              ? 'bg-[#090e1a]/60 border-emerald-900/30 opacity-75'
                              : 'bg-[#0e1526] border-[#1e2a42] hover:border-[#2a3a5e] shadow-xl'
                          }`}
                        >
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#1c273e]">
                          <div className="flex items-start gap-3.5">
                            <button
                              onClick={() => toggleExerciseComplete(exercise.id || String(exIndex))}
                              className={`mt-1 w-6 h-6 rounded-xl border flex items-center justify-center transition-all shrink-0 active:scale-90 ${
                                isDone
                                  ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                                  : 'border-[#2d3f62] hover:border-amber-400 text-transparent'
                              }`}
                              title={isDone ? 'علامت‌گذاری به عنوان انجام نشده' : 'علامت‌گذاری به عنوان انجام شده'}
                            >
                              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                            </button>

                            <div className="space-y-1">
                              <div className="flex flex-wrap items-baseline gap-2">
                                <span className="text-xs font-mono font-bold text-amber-400">
                                  #{exIndex + 1}
                                </span>
                                <h5 className="text-base sm:text-lg font-black text-white">
                                  {exercise.nameFa}
                                </h5>
                                <span className="text-xs text-slate-400 font-mono">
                                  ({exercise.nameEn})
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span>عضله هدف: <strong className="text-slate-200">{exercise.targetMuscle}</strong></span>
                                <span className="text-slate-600">·</span>
                                <span>پروتکل: <strong className="text-amber-400 font-mono font-bold">{exercise.sets} ست × {exercise.reps}</strong></span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end no-print">
                            <button
                              onClick={() => setSelectedExerciseForAnimation(exercise)}
                              className="flex items-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all active:scale-95 shadow-sm"
                              title="مشاهده شبیه‌ساز ویدیویی و زوایای مفاصل"
                            >
                              <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>شبیه‌ساز بیومکانیک</span>
                            </button>

                            <button
                              onClick={() => startRestTimer(exercise.restSeconds || 60)}
                              className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-[#090e1a] hover:bg-[#131b2e] text-slate-300 border border-[#1a253a] transition-all active:scale-95"
                              title="تایمر استراحت بین ست"
                            >
                              <Clock className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{exercise.restSeconds} ثانیه</span>
                            </button>

                            <button
                              onClick={() =>
                                setSelectedExerciseForAlternative({
                                  exercise,
                                  dayNumber: currentWorkoutDay.dayNumber,
                                })
                              }
                              className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl bg-[#090e1a] hover:bg-[#131b2e] text-slate-400 hover:text-slate-200 border border-[#1a253a] transition-all active:scale-95"
                              title="جایگزینی حرکت با دستگاه دیگر"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                              <span>جایگزین</span>
                            </button>
                          </div>
                        </div>

                        {/* Cues, Target Focus, and Injury Adaptation */}
                        <div className="mt-3 space-y-2 text-xs">
                          {/* Biomechanical execution cue */}
                          <div className="text-slate-300 flex items-start gap-2">
                            <span className="text-amber-400 font-bold shrink-0">نکته اجرایی:</span>
                            <span className="leading-relaxed">{exercise.cue}</span>
                          </div>

                          {/* Target focus reason (weak muscle) */}
                          {exercise.targetFocus && (
                            <div className="text-slate-400 flex items-start gap-2">
                              <span className="text-cyan-400 font-bold shrink-0">هدف تمرینی:</span>
                              <span>{exercise.targetFocus}</span>
                            </div>
                          )}

                          {/* Injury Adaptation (Critical) */}
                          {exercise.injuryAdaptation && (
                            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 flex items-start gap-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <div className="leading-relaxed">
                                <strong className="font-bold">ملاحظه آسیب و ایمنی: </strong>
                                {exercise.injuryAdaptation}
                              </div>
                            </div>
                          )}

                          {/* Exercise Weight & Sets Logger */}
                          <div className="pt-2 no-print">
                            <ExerciseWeightLogger
                              exercise={exercise}
                              userWeight={profile.weight}
                              userGender={profile.gender}
                              userExperience={profile.experienceLevel}
                              isCompact={true}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

                {/* COOLDOWN */}
                {currentWorkoutDay.cooldown && currentWorkoutDay.cooldown.length > 0 && (
                  <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-900/40">
                    <h4 className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      سرد کردن و کشش ایستا (Cooldown):
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      {currentWorkoutDay.cooldown.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* TAB 2: DIET & NUTRITION PLAN */}
      {activeTab === 'diet' && (
        <motion.div key="tab-diet" variants={tabContentVariants} initial="hidden" animate="visible" className="space-y-6">
          {/* Reader Optimizer Controls Bar */}
          <div className="p-4 rounded-2xl bg-[#0d1424] border border-[#1e2a42] flex flex-wrap items-center justify-between gap-3 text-xs shadow-md no-print">
            <div className="flex items-center gap-2 text-white font-extrabold">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>پالت مطالعه تیره سفارشی (بهینه‌ساز متن‌های طولانی رژیم غذایی):</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDietTextSize(dietTextSize === 'normal' ? 'large' : 'normal')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border transition-all active:scale-95 ${
                  dietTextSize === 'large'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-[#080d18] text-slate-400 border-[#1a253a] hover:text-white'
                }`}
                title="تغییر اندازه فونت برای مطالعه آسان"
              >
                <span>اندازه قلم: {dietTextSize === 'large' ? 'درشت و خوانا (A+)' : 'استاندارد (A)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsHighContrastDiet(!isHighContrastDiet)}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border transition-all active:scale-95 ${
                  isHighContrastDiet
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-[#080d18] text-slate-400 border-[#1a253a] hover:text-white'
                }`}
                title="فعال‌سازی کنتراست فوق‌العاده ضد خستگی چشم"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>کنتراست مطالعه: {isHighContrastDiet ? 'حداکثر (ضد خستگی)' : 'معمولی'}</span>
              </button>
            </div>
          </div>

          {/* Summary Box with Custom Dark Palette */}
          <div className="p-6 sm:p-7 rounded-3xl diet-reading-card space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c273e] pb-3">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-400" />
                راهنمای رژیم غذایی و اهداف درشت‌مغذی‌ها
              </h3>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                پالت تیره با کنتراست بالا
              </span>
            </div>

            <p
              className={`diet-reading-prose transition-all ${
                dietTextSize === 'large' ? 'text-sm sm:text-base leading-[2.2]' : 'text-xs sm:text-sm leading-[1.95]'
              } ${isHighContrastDiet ? 'text-[#f8fafc] font-medium' : 'text-[#e2e8f0]'}`}
            >
              {plan.dietPlan.dailySummary}
            </p>

            {/* Allergy alert */}
            {Array.isArray(profile.allergies) && profile.allergies.length > 0 && (
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/50 text-cyan-200 text-xs flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="leading-relaxed">
                  <strong className="text-cyan-300 font-bold">رعایت کامل حساسیت‌ها: </strong>تمامی مواد غذایی حساسیت‌زای شما ({profile.allergies.join('، ')}) از این رژیم کاملاً حذف شده‌اند.
                </span>
              </div>
            )}
          </div>

          {/* Meals Grid */}
          <motion.div
            key="diet-meals-grid"
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {plan.dietPlan.meals.map((meal, mealIndex) => (
              <motion.div
                key={meal.mealId || mealIndex}
                variants={listItemVariants}
                className="diet-reading-card rounded-3xl p-6 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3.5 border-b border-[#1c273e]">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black shadow-md shadow-amber-500/20">
                        {mealIndex + 1}
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-white">{meal.mealName}</h4>
                    </div>
                    <span className="text-xs text-amber-300 bg-[#090e1a] px-3 py-1 rounded-xl border border-[#1a253a] font-mono font-bold">
                      {meal.timing}
                    </span>
                  </div>

                  {/* Food Items */}
                  <div className="mt-4 space-y-2.5">
                    {meal.foods.map((food, fIdx) => (
                      <div
                        key={fIdx}
                        className="p-3.5 rounded-2xl diet-reading-item flex items-center justify-between text-xs transition-all hover:border-[#283754]"
                      >
                        <div className="space-y-1">
                          <div className="font-extrabold text-white text-xs sm:text-sm">{food.item}</div>
                          <div className="text-[11px] text-slate-300 flex items-center gap-1.5 flex-wrap">
                            <span>مقدار:</span>
                            <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                              {food.amount}
                            </span>
                            {food.tip && (
                              <span className="text-slate-400 font-normal">({food.tip})</span>
                            )}
                          </div>
                        </div>
                        <div className="text-left font-mono">
                          <span className="text-white font-extrabold text-xs block">{food.calories} kcal</span>
                          <span className="text-rose-400 font-bold text-[11px] block font-sans">
                            {food.protein}g پروتئین
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alternatives */}
                {meal.alternatives && meal.alternatives.length > 0 && (
                  <div className="pt-3.5 border-t border-[#1c273e] p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/15">
                    <div className="text-[11px] font-black text-amber-300 mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>جایگزین‌های مناسب ایرانی در صورت تمایل:</span>
                    </div>
                    <div
                      className={`text-slate-200 leading-[2.0] ${
                        dietTextSize === 'large' ? 'text-xs sm:text-sm' : 'text-xs'
                      }`}
                    >
                      {meal.alternatives.join(' • ')}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Hydration & Diet Tips */}
          {plan.dietPlan.hydrationAndTips && plan.dietPlan.hydrationAndTips.length > 0 && (
            <div className="p-6 rounded-3xl diet-reading-card border border-cyan-900/40 space-y-3.5">
              <h4 className="text-sm sm:text-base font-black text-cyan-300 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-cyan-400" />
                اصول هیدراتاسیون، نمک و سوخت‌رسانی عضلانی
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-200">
                {plan.dietPlan.hydrationAndTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5 leading-[2.0]">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Goal & Allergy-Safe Nutrition Supplements Section */}
          <DietSupplementsSection profile={profile} plan={currentPlan} />
        </motion.div>
      )}

      {/* TAB 3: SAFETY, INJURIES & REHAB */}
      {activeTab === 'safety' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              پروتکل ایمنی مفاصل، مدیریت آسیب‌ها و بیماری‌ها
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {plan.summary.injurySafetyOverview}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rehab & Corrective Movements */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <h4 className="text-sm font-black text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                تمرینات اصلاحی و فیزیوتراپی تقویتی
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                این حرکات به تقویت عضلات پایدارکننده (Stabilizers) و پیشگیری از عود آسیب کمک می‌کنند:
              </p>
              <ul className="space-y-2.5 text-xs text-slate-200">
                {plan.recoveryAndRehab.rehabExercises.map((ex, i) => (
                  <li
                    key={i}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-2"
                  >
                    <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{ex}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Warning Signs to Stop */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <h4 className="text-sm font-black text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                علائم هشدار که بلافاصله باید تمرین متوقف شود (Red Flags)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                درد سوزشی یا تیر کشنده در مفاصل به معنی رشد عضله نیست و خطرناک است:
              </p>
              <ul className="space-y-2.5 text-xs text-slate-200">
                {plan.recoveryAndRehab.warningSignsToStop.map((warn, i) => (
                  <li
                    key={i}
                    className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-rose-200 flex items-start gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{warn}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SUPPLEMENTS & RECOVERY */}
      {activeTab === 'supplements' && (
        <div className="space-y-6">
          {/* Overview */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Pill className="w-5 h-5 text-amber-400" />
              راهنمای مکمل‌های ورزشی مجاز و استاندارد
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {plan.supplementPlan.overview}
            </p>
          </div>

          {/* Supplements Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plan.supplementPlan.supplements.map((supp, sIdx) => (
              <div
                key={sIdx}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        supp.isEssential
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {supp.isEssential ? 'پیشنهاد اول / ضروری' : 'اختیاری / پشتیبان'}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white">{supp.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{supp.purpose}</p>

                  <div className="mt-3 space-y-1.5 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>
                      دوز مصرفی: <strong className="text-amber-400">{supp.dosage}</strong>
                    </div>
                    <div>
                      زمان مصرف: <strong className="text-slate-300">{supp.timing}</strong>
                    </div>
                  </div>
                </div>

                {supp.safetyWarning && (
                  <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-900/40 text-[11px] text-rose-300">
                    <strong>نکته ایمنی: </strong>
                    {supp.safetyWarning}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sleep & Hormone optimization */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Moon className="w-4 h-4 text-purple-400" />
              بهینه‌سازی خواب و ترشح هورمون‌های آنابولیک (تستوسترون و هورمون رشد)
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {plan.recoveryAndRehab.sleepGuideline}
            </p>
          </div>
        </div>
      )}

      {/* TAB: BODY METRICS & PROGRESS CHART */}
      {activeTab === 'metrics' && (
        <BodyMetricsChart profile={profile} />
      )}

      {/* TAB 5: AI COACH CHAT */}
      {activeTab === 'chat' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col h-[650px]">
          <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-md">
                AI
              </div>
              <div>
                <h3 className="text-sm font-black text-white">مربی هوش مصنوعی بدنسازی فیت‌ژن</h3>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  آماده پاسخگویی و اعمال تغییرات در برنامه
                </p>
              </div>
            </div>
            <span className="text-xs text-slate-400 hidden sm:block">
              پاسخ مستند به بیومکانیک و تغذیه ورزشی
            </span>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 px-1">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 text-xs sm:text-sm ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                    مربی
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex gap-3 text-xs text-slate-400 items-center animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0">
                  ...
                </div>
                <span>مربی در حال بررسی و نوشتن پاسخ علمی...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="flex gap-2 overflow-x-auto py-2 border-t border-slate-800">
            {[
              'اگر به دستگاه پرس سینه دسترسی نداشتم با چی جایگزین کنم؟',
              'به جای سینه مرغ چه غذایی با همین پروتئین بخورم؟',
              'برای کاهش درد مچ در حرکات چه کنم؟',
              'کراتین رو چطور و چه زمانی مصرف کنم؟',
            ].map((quick, qIdx) => (
              <button
                key={qIdx}
                type="button"
                onClick={() => setChatInput(quick)}
                className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all active:scale-95"
              >
                {quick}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} className="pt-2 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="سوالی درباره حرکات، تغذیه یا درد حین تمرین دارید بپرسید..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              disabled={isChatLoading}
            />
            <button
              type="submit"
              disabled={isChatLoading || !chatInput.trim()}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center active:scale-95 shadow-lg shadow-amber-500/20"
            >
              <Send className="w-4 h-4 ml-1 rotate-180" />
              <span>ارسال</span>
            </button>
          </form>
        </div>
      )}

      {/* Global Tab Navigation (Previous / Next Section Bar) */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0d1424] border border-[#1e2a42] text-xs no-print mt-6">
        {prevTab ? (
          <button
            type="button"
            onClick={() => setActiveTab(prevTab.key)}
            className="px-4 py-2.5 rounded-xl bg-[#090e1a] border border-[#1a253a] hover:border-amber-500/40 text-slate-200 font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            <ChevronRight className="w-4 h-4 text-amber-400 stroke-[3]" />
            <span>بخش قبلی: {prevTab.label}</span>
          </button>
        ) : <div />}

        {nextTab ? (
          <button
            type="button"
            onClick={() => setActiveTab(nextTab.key)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-amber-500/20"
          >
            <span>بخش بعدی: {nextTab.label}</span>
            <ChevronLeft className="w-4 h-4 stroke-[3]" />
          </button>
        ) : <div />}
      </div>

      {/* AI Alternative Exercise Modal */}
      <AlternativeExerciseModal
        isOpen={!!selectedExerciseForAlternative}
        onClose={() => setSelectedExerciseForAlternative(null)}
        exercise={selectedExerciseForAlternative?.exercise || null}
        dayNumber={selectedExerciseForAlternative?.dayNumber || 1}
        userProfile={profile}
        onApplyAlternative={handleApplyAlternative}
      />

      {/* Interactive Kinematic Exercise Animation Modal with Framer Motion & Exercise Navigation */}
      <ExerciseAnimationModal
        isOpen={!!selectedExerciseForAnimation}
        onClose={() => setSelectedExerciseForAnimation(null)}
        exercise={selectedExerciseForAnimation}
        onSkip={() => {
          if (nextExercise) {
            setSelectedExerciseForAnimation(nextExercise);
          } else {
            setSelectedExerciseForAnimation(null);
          }
        }}
        onStartSet={() => {
          if (selectedExerciseForAnimation) {
            startRestTimer(selectedExerciseForAnimation.restSeconds || 60);
          }
          setSelectedExerciseForAnimation(null);
        }}
        onNavigatePrev={prevExercise ? () => setSelectedExerciseForAnimation(prevExercise) : undefined}
        onNavigateNext={nextExercise ? () => setSelectedExerciseForAnimation(nextExercise) : undefined}
        prevExerciseName={prevExercise?.nameFa}
        nextExerciseName={nextExercise?.nameFa}
      />

      {/* Share & Export High-Res Canvas Summary Modal */}
      <SharePlanModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        plan={currentPlan}
        profile={profile}
      />
    </div>
  );
};
