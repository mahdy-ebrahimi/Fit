import React, { useState } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Target,
  Flame,
  Award,
  ShieldCheck,
  ShieldAlert,
  Utensils,
  Dumbbell,
  Check,
  CheckCircle2,
  HeartPulse,
  Play,
  Volume2,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { UserProfile } from '../types/fitness';
import { GordMascotFigure, GordActionPose } from './GordMascotFigure';
import { GordLogo } from './GordLogo';
import {
  ACTIVITY_LEVELS,
  ALLERGY_OPTIONS,
  DIET_PREFERENCES,
  GOALS,
  INJURY_OPTIONS,
  MEDICAL_CONDITIONS,
  MUSCLE_OPTIONS,
} from '../constants/fitnessData';
import {
  ChestMuscleIcon,
  BackLatsIcon,
  BicepsMuscleIcon,
  AbsCoreIcon,
  LegsQuadsIcon,
  ShouldersIcon,
  SpineVertebraeIcon,
  KneeJointIcon,
  AnkleBandageIcon,
  GymDumbbellIcon,
} from './FitGenIconPack';
import { normalizePersianDigits } from '../utils/numberUtils';

interface GordLandingPageProps {
  onStartCoaching?: () => void;
  onViewDemo: () => void;
  hasExistingPlan?: boolean;
  onViewExistingPlan?: () => void;
  onSubmitProfile: (profile: UserProfile) => void;
  isLoading: boolean;
}

interface CoachStepDialogue {
  step: number;
  title: string;
  pose: GordActionPose;
  coachHeadline: string;
  coachDialogue: string;
  coachFeedbackMap?: Record<string, string>;
  proTip: string;
}

const COACH_DIALOGUES: CoachStepDialogue[] = [
  {
    step: 1,
    title: 'مشخصات بدنی',
    pose: 'pointing',
    coachHeadline: 'قدم اول: سنجش فیزیکی و متابولیسم',
    coachDialogue:
      'درود بر تو پهلوان! من گُرد هستم، مربی و همراهت. اول از همه باید وزن، قد و سنت رو دقیق بسنجم تا نرخ متابولیسم پایه (BMR) و نیاز واقعی کالریت رو مو‌به‌مو محاسبه کنم.',
    proTip: 'اگر وزن را ناشتا اول صبح اندازه بگیری، دقت محاسبات در بالاترین حد خواهد بود.',
  },
  {
    step: 2,
    title: 'هدف دوره',
    pose: 'flexing',
    coachHeadline: 'قدم دوم: هدف‌گذاری و وزن دلخواه',
    coachDialogue:
      'ماشالله به همت و اراده‌ت! بگو ببینم هدف اصلیت از این دوره چیه؟ حجم عضلانی خالص و درشت شدن؟ کات عضلانی و شش‌تکه شدن؟ یا افزایش توان و قدرت انفجاری؟',
    coachFeedbackMap: {
      muscle_gain: 'ایولا! هدف فوق‌العاده‌ایه. روی هایپرتروفی تار عضلانی و شیب کالری مثبت پاک تمرکز می‌کنیم!',
      fat_loss: 'عالیه! چربی‌سوزی علمی بدون افت حجم عضلات و حفظ کامل متابولیسم رو برات می‌چینم.',
      strength: 'درود به قدرتت! تمرکز بر دستگاه عصبی عضلانی، حرکات مادر و افزایش رکوردها خواهد بود.',
      maintenance: 'احسنت! تثبیت فیزیک و فرم بدنی، اصلاح پاسچر و نشاط کامل هدف ماست.',
    },
    proTip: 'تعیین یک وزن هدف واقع‌بینانه به محاسبه شیب کالری بهینه برای بدنت کمک شایانی می‌کند.',
  },
  {
    step: 3,
    title: 'عضلات هدف',
    pose: 'flexing',
    coachHeadline: 'قدم سوم: نقاط ضعف و اولویت رشد',
    coachDialogue:
      'صادقانه بگو پهلوان؛ حس می‌کنی کدوم عضلاتت عقب موندن و دوست داری توی آینه پرتر و برجسته‌تر به چشم بیان؟ بهم بگو تا اول جلسه و با تکنیک‌های شوک پیشرفته بهشون حجم بدم!',
    proTip: 'عضلات دارای اولویت همیشه در آغاز جلسه و با سیستم‌های شدت‌دهنده مانند رست-پاز تحریک می‌شوند.',
  },
  {
    step: 4,
    title: 'سلامت مفاصل',
    pose: 'explaining',
    coachHeadline: 'قدم چهارم: مراقبت از دیسک، زانو و شانه',
    coachDialogue:
      'گوش بده پهلوان؛ سلامتی مفاصل و ستون فقراتت خط قرمز منه! اگر درد کمر، دیسک، زانو یا شانه داری حتماً انتخاب کن تا حرکات پرفشار گرانشی رو حذف کنم و زوایای بیومکانیکی امن برات بذارم.',
    coachFeedbackMap: {
      'دیسک کمر': 'حواسم کاملاً به مهره‌هات هست! اسکات سنگین و ددلیفت محوری حذف و گزینه‌های ایزوله امن می‌ذارم.',
      'درد زانو': 'نگران نباش پهلوان! زاویه خمش زانو اصلاح و پرس‌های ایمن برای تقویت چهارسر داده می‌شود.',
      'آسیب سرشانه': 'حرکات پشت گردن و پرس‌های زاویه تند حذف و زوایای صفحه کتف استاندارد لحاظ می‌شود.',
    },
    proTip: 'هیچ رکوردی ارزش درد مفصل را ندارد؛ اول سلامت مهره‌ها و مفاصل، بعد افزایش وزنه!',
  },
  {
    step: 5,
    title: 'سفره ایرانی و تمرین',
    pose: 'holding_tablet',
    coachHeadline: 'قدم پنجم: رژیم خوشمزه و روزهای تمرین',
    coachDialogue:
      'رسیدیم به بخش خوشمزه داستان! چه سبک رژیمی با ذائقه‌ت جوره و چند روز در هفته باشگاه می‌ری؟ برنامه غذاییت رو با غذاهای در دسترس، لذیذ و سالم سفره ایرانی تنظیم می‌کنم تا با لذت به هدفت برسی.',
    proTip: 'رژیم سخت‌گیرانه محکوم به شکست است؛ پایبندی با غذاهای لذیذ سفره ایرانی کلید ساخت بدن ایده‌آل است.',
  },
  {
    step: 6,
    title: 'آماده‌سازی نهایی',
    pose: 'thumbs_up',
    coachHeadline: 'پایان سنجش: آماده دریافت برنامه!',
    coachDialogue:
      'عالی و بی‌نقص بود پهلوان! تمام مشخصات، آسیب‌ها، عضلات هدف و ذائقه غذاییت رو تحلیل کردم. الان با زدن دکمه زیر، برنامه بدنسازی و تغذیه اختصاصیت با هوش مصنوعی و انیمیشن‌های حرکات تولید می‌شه!',
    proTip: 'برنامه تولیدی شامل جدول سیستم تمرینی، کالری دقیق، گزینه‌های جایگزین حرکات و انیمیشن است.',
  },
];

export const GordLandingPage: React.FC<GordLandingPageProps> = ({
  onViewDemo,
  hasExistingPlan = false,
  onViewExistingPlan,
  onSubmitProfile,
  isLoading,
}) => {
  // Stepper State for the In-Landing Coach Consultation
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  // User Profile State
  const [profile, setProfile] = useState<UserProfile>({
    gender: 'male',
    age: 28,
    weight: 78,
    height: 178,
    targetWeight: 82,
    activityLevel: 'moderate',
    goal: 'muscle_gain',
    experienceLevel: 'intermediate',
    trainingDaysPerWeek: 4,
    location: 'gym',
    weakMuscles: ['بالا سینه', 'سرشانه میانی (بخش کناری)'],
    strongMuscles: ['جلو بازو (دو سر بازویی)'],
    injuries: [],
    allergies: [],
    medicalConditions: [],
    dietaryPreference: 'رژیم سنتی ایرانی سالم (برنج کته، فیله مرغ، خوراک‌های کم‌روغن)',
    mealsPerDay: 4,
    extraNotes: '',
  });

  const stepInfo = COACH_DIALOGUES.find((s) => s.step === currentStep) || COACH_DIALOGUES[0];

  const handleNext = () => {
    if (currentStep === 1) {
      if (!profile.weight || !profile.height || !profile.age) {
        setValidationError('پهلوان عزیز! لطفاً قد، وزن و سن خود را تکمیل بفرمایید.');
        return;
      }
    }
    setValidationError(null);
    if (currentStep < COACH_DIALOGUES.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onSubmitProfile(profile);
    }
  };

  const handlePrev = () => {
    setValidationError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const toggleArrayItem = (
    key: 'weakMuscles' | 'strongMuscles' | 'injuries' | 'allergies' | 'medicalConditions',
    value: string
  ) => {
    const list = profile[key] as string[];
    const exists = list.includes(value);
    setProfile({
      ...profile,
      [key]: exists ? list.filter((item) => item !== value) : [...list, value],
    });
  };

  // Dynamic Gord Coach Feedback based on selections
  const getDynamicCoachFeedback = () => {
    if (currentStep === 2 && profile.goal && stepInfo.coachFeedbackMap?.[profile.goal]) {
      return stepInfo.coachFeedbackMap[profile.goal];
    }
    if (currentStep === 4 && profile.injuries.length > 0) {
      const firstInjury = profile.injuries[0];
      if (stepInfo.coachFeedbackMap?.[firstInjury]) {
        return stepInfo.coachFeedbackMap[firstInjury];
      }
      return `آسیب‌های (${profile.injuries.join('، ')}) ثبت شد پهلوان. فشار محوری روی این بخش‌ها کاملاً مهار می‌شود.`;
    }
    return stepInfo.coachDialogue;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-2 pb-24 animate-fadeIn">
      {/* Existing Plan Top Access Banner */}
      {hasExistingPlan && onViewExistingPlan && (
        <div className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-blue-900/30 border border-amber-500/40 shadow-glow flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-right">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md shrink-0">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-amber-300">
                برنامه ورزشی فعال شما در حافظه آماده است!
              </div>
              <div className="text-xs text-slate-300">
                می‌توانید برنامه و انیمیشن‌های خود را بررسی کنید یا همین‌جا با مربی گُرد برنامه جدیدی بسازید.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onViewExistingPlan}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>ورود به داشبورد برنامه فعلی</span>
            <ChevronLeft className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      )}

      {/* =========================================================================
          HERO STAGE: THE INTERACTIVE COACH GORD CONSULTATION
          This is where Coach Gord stands front-and-center and asks the questions!
         ========================================================================= */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#0c1833] via-[#081226] to-[#030611] border border-[#FF6B00]/40 shadow-2xl overflow-hidden p-5 sm:p-8 lg:p-12 mb-12">
        {/* Ambient Glowing Background Orbs */}
        <div className="absolute top-0 right-1/4 w-[32rem] h-[32rem] bg-[#FF6B00]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[28rem] h-[28rem] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Header inside Hero: Brand Emblem & Quick Switch */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-6 mb-6 border-b border-white/10 gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <GordLogo size="lg" showSubtitle={true} withGlow={true} />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onViewDemo}
              className="px-4 py-2 rounded-2xl glass-input text-xs font-bold text-amber-300 hover:text-white flex items-center gap-2 hover:bg-white/10 transition-all cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 text-[#FF6B00]" />
              <span>مشاهده برنامه نمونه و انیمیشن‌ها</span>
            </button>
          </div>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="relative z-10 max-w-2xl mx-auto mb-8 px-2">
          <div className="flex items-center justify-between relative">
            {COACH_DIALOGUES.map((s) => (
              <div
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                className="flex flex-col items-center gap-1.5 cursor-pointer select-none relative z-10"
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all ${
                    currentStep === s.step
                      ? 'bg-gradient-to-tr from-[#FF6B00] to-amber-400 text-slate-950 shadow-glow scale-110'
                      : currentStep > s.step
                      ? 'bg-[#FF6B00]/25 text-[#FF6B00] border border-[#FF6B00]/50'
                      : 'bg-slate-900/90 text-slate-500 border border-slate-800'
                  }`}
                >
                  {s.step}
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-bold transition-colors whitespace-nowrap hidden sm:inline ${
                    currentStep === s.step ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            ))}

            {/* Connecting Progress Line */}
            <div className="absolute top-4 sm:top-5 left-4 right-4 h-1 bg-white/10 rounded-full z-0 pointer-events-none">
              <div
                className="h-full bg-gradient-to-r from-[#FF6B00] to-amber-400 rounded-full transition-all duration-500 shadow-glow"
                style={{
                  width: `${((currentStep - 1) / (COACH_DIALOGUES.length - 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* MAIN STAGE GRID: Character Asking Questions Live */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* RIGHT / TOP (RTL): Coach Gord Figure with Live Speech Balloon */}
          <div className="lg:col-span-5 flex flex-col items-center text-center order-1 lg:order-1">
            {/* Live Coach Dialogue Card */}
            <div className="w-full relative rounded-3xl p-5 sm:p-6 bg-[#071124]/95 border border-[#FF6B00]/50 shadow-2xl mb-4 backdrop-blur-2xl text-right">
              {/* Dialogue Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs sm:text-sm font-black text-white">مربی گُرد (GORD):</span>
                </div>
                <span className="text-[10px] text-amber-300 font-bold bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md">
                  {stepInfo.coachHeadline}
                </span>
              </div>

              {/* Dynamic Coach Voice */}
              <p className="text-xs sm:text-sm font-bold text-slate-100 leading-relaxed sm:leading-loose">
                «{getDynamicCoachFeedback()}»
              </p>

              {/* Pro Tip Callout */}
              <div className="mt-3.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-200 leading-relaxed">
                  <strong className="text-amber-300 ml-1">توصیه گُرد:</strong>
                  <span>{stepInfo.proTip}</span>
                </div>
              </div>
            </div>

            {/* Official Character Mascot in Active Pose */}
            <div className="relative py-2 flex flex-col items-center">
              <GordMascotFigure pose={stepInfo.pose} size="hero" showShadow={true} withGlow={true} />

              {/* Character Identity Badge */}
              <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a1630] border border-[#FF6B00]/40 text-xs font-black text-amber-300 shadow-md">
                <Award className="w-4 h-4 text-[#FF6B00]" />
                <span>گُرد | مربی رسمی فیتنس و تغذیه هوشمند</span>
              </div>
            </div>
          </div>

          {/* LEFT / BOTTOM (RTL): Interactive Question Card */}
          <div className="lg:col-span-7 order-2 lg:order-2 space-y-5">
            {/* Validation Error Alert */}
            {validationError && (
              <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-2 shadow-glow-red animate-shake">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* QUESTION STEP 1: PHYSICAL STATS */}
            {currentStep === 1 && (
              <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-glass space-y-6 border border-white/10">
                <div className="border-b border-white/10 pb-3 text-right">
                  <h3 className="text-lg sm:text-xl font-black text-white">مشخصات فیزیکی شما</h3>
                  <p className="text-xs text-slate-400 mt-1">جنسیت، قد، وزن و سن خود را مشخص کنید.</p>
                </div>

                {/* Gender */}
                <div className="space-y-2 text-right">
                  <label className="text-xs font-bold text-slate-300">جنسیت:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, gender: 'male' })}
                      className={`p-3.5 rounded-2xl border font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        profile.gender === 'male'
                          ? 'bg-[#FF6B00] text-slate-950 border-[#FF6B00] shadow-glow'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span>آقا (مرد)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, gender: 'female' })}
                      className={`p-3.5 rounded-2xl border font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        profile.gender === 'female'
                          ? 'bg-[#FF6B00] text-slate-950 border-[#FF6B00] shadow-glow'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span>خانم (زن)</span>
                    </button>
                  </div>
                </div>

                {/* Numeric Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-right">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">وزن فعلی (کیلوگرم):</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={profile.weight || ''}
                      onChange={(e) => {
                        const val = normalizePersianDigits(e.target.value);
                        setProfile({ ...profile, weight: Number(val) || 0 });
                      }}
                      placeholder="مثلاً ۷۸"
                      className="w-full p-3.5 rounded-2xl glass-input text-white text-center font-black text-base focus:border-[#FF6B00] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">قد (سانتی‌متر):</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={profile.height || ''}
                      onChange={(e) => {
                        const val = normalizePersianDigits(e.target.value);
                        setProfile({ ...profile, height: Number(val) || 0 });
                      }}
                      placeholder="مثلاً ۱۷۸"
                      className="w-full p-3.5 rounded-2xl glass-input text-white text-center font-black text-base focus:border-[#FF6B00] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">سن (سال):</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={profile.age || ''}
                      onChange={(e) => {
                        const val = normalizePersianDigits(e.target.value);
                        setProfile({ ...profile, age: Number(val) || 0 });
                      }}
                      placeholder="مثلاً ۲۸"
                      className="w-full p-3.5 rounded-2xl glass-input text-white text-center font-black text-base focus:border-[#FF6B00] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* QUESTION STEP 2: GOAL & EXPERIENCE */}
            {currentStep === 2 && (
              <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-glass space-y-6 border border-white/10 text-right">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-lg sm:text-xl font-black text-white">هدف اصلی و سطح سابقه</h3>
                  <p className="text-xs text-slate-400 mt-1">هدف ورزشی و سابقه تمرینی خود را انتخاب کنید.</p>
                </div>

                {/* Goals */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">هدف ورزشی:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {GOALS.map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => setProfile({ ...profile, goal: g.value as any })}
                        className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                          profile.goal === g.value
                            ? 'bg-[#FF6B00]/20 border-[#FF6B00] text-white shadow-glow'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <div className="font-black text-xs sm:text-sm flex items-center justify-between">
                          <span>{g.title}</span>
                          {profile.goal === g.value && <Check className="w-4 h-4 text-[#FF6B00]" />}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">{g.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Weight & Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">وزن هدف دلخواه (کیلوگرم):</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={profile.targetWeight || ''}
                      onChange={(e) => {
                        const val = normalizePersianDigits(e.target.value);
                        setProfile({ ...profile, targetWeight: Number(val) || 0 });
                      }}
                      placeholder="مثلاً ۸۲"
                      className="w-full p-3 rounded-2xl glass-input text-white text-center font-bold text-sm focus:border-[#FF6B00] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">سطح تجربه در بدنسازی:</label>
                    <select
                      value={profile.experienceLevel}
                      onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value as any })}
                      className="w-full p-3 rounded-2xl glass-input text-white text-xs font-bold focus:border-[#FF6B00] outline-none bg-slate-900"
                    >
                      <option value="beginner">مبتدی (زیر ۶ ماه تمرین)</option>
                      <option value="intermediate">متوسط (۶ ماه تا ۲ سال)</option>
                      <option value="advanced">پیشرفته (بیش از ۲ سال تمرین پیوسته)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* QUESTION STEP 3: TARGET MUSCLES */}
            {currentStep === 3 && (
              <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-glass space-y-6 border border-white/10 text-right">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-lg sm:text-xl font-black text-white">عضلات نیازمند رشد و اولویت</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    عضلاتی که می‌خواهید حجم بیشتری بگیرند را انتخاب کنید تا اول جلسه تمرین داده شوند.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-amber-300">
                    عضلات نیازمند تقویت و شوک (حداکثر ۳ مورد):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {MUSCLE_OPTIONS.map((m) => {
                      const isSelected = profile.weakMuscles.includes(m.label);
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => toggleArrayItem('weakMuscles', m.label)}
                          className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-[#FF6B00] text-slate-950 border-[#FF6B00] shadow-glow font-black'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <span>{m.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* QUESTION STEP 4: HEALTH & JOINTS */}
            {currentStep === 4 && (
              <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-glass space-y-6 border border-white/10 text-right">
                <div className="border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-red-400" />
                    <h3 className="text-lg sm:text-xl font-black text-white">سلامت مفاصل و ستون فقرات</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    اگر آسیب یا دردی دارید حتماً مشخص کنید تا حرکات پرفشار گرانشی حذف شوند.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-red-300">آسیب‌دیدگی‌های فعلی یا سابقه درد:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {INJURY_OPTIONS.map((inj) => {
                      const isSelected = profile.injuries.includes(inj);
                      return (
                        <button
                          key={inj}
                          type="button"
                          onClick={() => toggleArrayItem('injuries', inj)}
                          className={`p-3 rounded-2xl border text-xs font-bold transition-all text-right flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-red-500/20 border-red-500 text-red-200 shadow-glow-red font-black'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <span>{inj}</span>
                          {isSelected && <ShieldAlert className="w-4 h-4 text-red-400" />}
                        </button>
                      );
                    })}
                  </div>
                  {profile.injuries.length === 0 && (
                    <div className="text-[11px] text-emerald-400 font-bold bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40">
                      ✓ در صورت عدم انتخاب، فیزیک شما کاملاً سالم در نظر گرفته شده و دامنه کامل حرکتی تجویز می‌شود.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* QUESTION STEP 5: DIET & SCHEDULE */}
            {currentStep === 5 && (
              <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-glass space-y-6 border border-white/10 text-right">
                <div className="border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg sm:text-xl font-black text-white">سفره غذایی و برنامه تمرین</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    سبک رژیم ایرانی و روزهای قابل تمرین در هفته را مشخص کنید.
                  </p>
                </div>

                {/* Diet Preferences */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">الگوی رژیم غذایی:</label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {DIET_PREFERENCES.map((dp) => (
                      <button
                        key={dp.value}
                        type="button"
                        onClick={() => setProfile({ ...profile, dietaryPreference: dp.label })}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all text-right flex items-center justify-between cursor-pointer ${
                          profile.dietaryPreference === dp.label
                            ? 'bg-[#FF6B00]/20 border-[#FF6B00] text-white shadow-glow'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span>{dp.label}</span>
                        {profile.dietaryPreference === dp.label && <Check className="w-4 h-4 text-[#FF6B00]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Training Days */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">روزهای تمرین در هفته:</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[3, 4, 5, 6].map((days) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => setProfile({ ...profile, trainingDaysPerWeek: days })}
                          className={`p-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                            profile.trainingDaysPerWeek === days
                              ? 'bg-[#FF6B00] text-slate-950 border-[#FF6B00]'
                              : 'bg-white/5 text-slate-300 border-white/10'
                          }`}
                        >
                          {days} روز
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">تعداد وعده‌های غذایی در روز:</label>
                    <select
                      value={profile.mealsPerDay}
                      onChange={(e) => setProfile({ ...profile, mealsPerDay: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl glass-input text-white text-xs font-bold focus:border-[#FF6B00] outline-none bg-slate-900"
                    >
                      <option value={3}>۳ وعده اصلی</option>
                      <option value={4}>۴ وعده (۳ اصلی + ۱ میان‌وعده)</option>
                      <option value={5}>۵ وعده (۳ اصلی + ۲ میان‌وعده)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* QUESTION STEP 6: READY TO LAUNCH */}
            {currentStep === 6 && (
              <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-glass space-y-6 border border-amber-500/40 text-right bg-gradient-to-br from-amber-500/10 via-transparent to-blue-900/20">
                <div className="border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg sm:text-xl font-black text-white">مرور مشخصات و آماده‌سازی برنامه</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    اطلاعات شما با موفقیت ثبت شد. آماده تحلیل نهایی و تولید برنامه توسط مربی گُرد هستید.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-[10px] text-slate-400">وزن / قد</div>
                    <div className="text-xs sm:text-sm font-black text-white mt-1">
                      {profile.weight} kg / {profile.height} cm
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-[10px] text-slate-400">هدف دوره</div>
                    <div className="text-xs sm:text-sm font-black text-amber-300 mt-1">
                      {GOALS.find((g) => g.value === profile.goal)?.title || profile.goal}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-[10px] text-slate-400">عضلات اولویت</div>
                    <div className="text-xs font-bold text-cyan-300 mt-1 truncate">
                      {profile.weakMuscles.join('، ') || 'متوازن'}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-[10px] text-slate-400">روزهای تمرین</div>
                    <div className="text-xs sm:text-sm font-black text-emerald-300 mt-1">
                      {profile.trainingDaysPerWeek} روز در هفته
                    </div>
                  </div>
                </div>

                {/* Extra Notes Box */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    توضیحات اختیاری به مربی گُرد (درخواست‌های خاص):
                  </label>
                  <textarea
                    rows={2}
                    value={profile.extraNotes}
                    onChange={(e) => setProfile({ ...profile, extraNotes: e.target.value })}
                    placeholder="مثلاً: تمرکز بیشتر روی حجم بازو، تمرین بعدازظهر..."
                    className="w-full p-3 rounded-2xl glass-input text-white text-xs font-bold focus:border-[#FF6B00] outline-none"
                  />
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between gap-3 pt-3">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-5 py-3.5 rounded-2xl glass-input text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>مرحله قبل</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 sm:flex-initial px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-amber-500 hover:from-orange-500 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-glow hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <span>ثبت و پاسخ به سوال بعد مربی</span>
                  <ChevronLeft className="w-4 h-4 stroke-[3]" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                  className="flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF6B00] via-orange-500 to-amber-400 hover:from-orange-500 hover:to-amber-300 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-glow hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>تولید برنامه اختصاصی با مربی گُرد</span>
                  <ChevronLeft className="w-5 h-5 stroke-[3]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: THE 4 SCIENTIFIC PILLARS OF GORD (گُرد)
         ========================================================================= */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-amber-400 text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
            <span>استانداردهای علمی و فیزیولوژی مدرن</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">
            چرا مربی «گُرد» متفاوت‌ترین سامانه بدنسازی ایران است؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            ترکیب دانش روز بیومکانیک و علوم تمرینی با شناخت بومی از سفره غذایی و نیازهای فیزیکی ورزشکاران ایرانی.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pillar 1: Biomechanics & Spine Protection */}
          <div className="glass-card rounded-3xl p-6 border border-red-500/20 hover:border-red-500/50 transition-all text-right">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center text-red-400 mb-4 shadow-glow-red">
              <HeartPulse className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-black text-white mb-2">محافظت قطعی از دیسک کمر و مفاصل</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              در صورت وجود آسیب در مهره‌های کمر، زانو یا شانه، حرکات پرفشار محوری به صورت خودکار با حرکات ایمن و ایزوله جایگزین می‌شوند.
            </p>
          </div>

          {/* Pillar 2: Persian Traditional Diet */}
          <div className="glass-card rounded-3xl p-6 border border-amber-500/20 hover:border-amber-500/50 transition-all text-right">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-400 mb-4 shadow-glow">
              <Utensils className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-black text-white mb-2">رژیم خوش‌طعم بر پایه سفره ایرانی</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              بدون نیاز به غذاهای گران‌قیمت یا بدمزه؛ برنامه‌های تغذیه با برنج کته، فیله مرغ، تخم‌مرغ و خوراک‌های لذیذ ایرانی تنظیم می‌شوند.
            </p>
          </div>

          {/* Pillar 3: Exercise Animations */}
          <div className="glass-card rounded-3xl p-6 border border-blue-500/20 hover:border-blue-500/50 transition-all text-right">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 flex items-center justify-center text-blue-400 mb-4 shadow-glow">
              <Dumbbell className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-black text-white mb-2">انیمیشن آموزشی تمام حرکات ورزشی</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              هر حرکت دارای شبیه‌سازی انیمیشنی، راهنمای تنفس (دم و بازدم) و عضلات درگیر است تا حرکت را با فرم صددرصد صحیح اجرا کنید.
            </p>
          </div>

          {/* Pillar 4: Progressive Overload Tracker */}
          <div className="glass-card rounded-3xl p-6 border border-emerald-500/20 hover:border-emerald-500/50 transition-all text-right">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 mb-4 shadow-glow">
              <Zap className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-black text-white mb-2">ثبت وزنه‌ها و اصل اضافه بار</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              سیستم هوشمند داخلی برای ثبت ست‌ها و رکوردهای هر جلسه و ارائه نمودارهای رشد فیزیکی و افزایش قدرت هفتگی.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: MEET COACH GORD (IDENTIFICATION SHEET)
         ========================================================================= */}
      <div className="rounded-[2.5rem] bg-gradient-to-br from-[#0c1933] to-[#040812] border border-white/10 p-6 sm:p-10 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center">
            <GordMascotFigure pose="flexing" size="lg" showShadow={true} withGlow={true} />
          </div>

          <div className="lg:col-span-8 text-right space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <Award className="w-4 h-4 text-[#FF6B00]" />
              <span>شناسنامه کاراکتر و مربی ارشد</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white">
              «گُرد»؛ تجلی روح پهلوانی و دانش روز بدنسازی
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              کاراکتر «گُرد» با الهام از اصالت و فتوت پهلوانان ایرانی و با مجهز شدن به به‌روزترین الگوریتم‌های هوش مصنوعی بیومکانیک و علوم تمرینی خلق شده است. او همراه و رفیق همیشگی شما در باشگاه و خانه است؛ کسی که با زبان دلسوزانه اما قاطع، از سلامت مفاصل شما مراقبت کرده و شما را به بهترین فرم بدنی زندگیتان می‌رساند.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-[11px] text-slate-400">نام مربی:</div>
                <div className="text-xs sm:text-sm font-black text-white mt-0.5">گُرد (GORD)</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-[11px] text-slate-400">سبک هدایت:</div>
                <div className="text-xs sm:text-sm font-black text-amber-300 mt-0.5">انگیزشی و علمی</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-[11px] text-slate-400">حفاظت مفصلی:</div>
                <div className="text-xs sm:text-sm font-black text-emerald-400 mt-0.5">۱۰۰٪ تضمین‌شده</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
