import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Target,
  Flame,
  Award,
  ShieldAlert,
  ShieldCheck,
  Utensils,
  Dumbbell,
  Check,
  X,
  Plus,
  Volume2,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { UserProfile } from '../types/fitness';
import { GordMascotFigure, GordActionPose } from './GordMascotFigure';
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

interface GordInteractiveCoachFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
  onCancel?: () => void;
  onLoadDemo?: () => void;
}

interface StepConfig {
  step: number;
  title: string;
  pose: GordActionPose;
  coachDialogue: string;
  coachSubtext: string;
  proTip: string;
}

const COACH_STEPS: StepConfig[] = [
  {
    step: 1,
    title: 'مشخصات بدنی',
    pose: 'pointing',
    coachDialogue:
      'درود بر تو پهلوان! من مربی تواَم. اول از همه باید مشخصات پایه‌ای بدنت رو دقیق بسنجم. قد، وزن و سن‌ت چقدره تا نرخ متابولیسم پایه (BMR) و کالری روزانه‌ت رو مو‌به‌مو حساب کنم؟',
    coachSubtext: 'جنسیت، قد، وزن فعلی و سن خود را با دقت مشخص کنید.',
    proTip: 'اگر وزن صبحگاهی به صورت ناشتا باشد، دقت محاسبات در بالاترین حد ممکن خواهد بود.',
  },
  {
    step: 2,
    title: 'هدف و سابقه',
    pose: 'thumbs_up',
    coachDialogue:
      'ماشالله به همتت! حالا هدف اصلیت توی این دوره چیه پهلوان؟ می‌خوای حجم عضلانی خالص بسازی؟ چربی‌سوزی و کات شش‌تکه می‌خوای؟ یا افزایش توان و قدرت انفجاری؟',
    coachSubtext: 'هدف ورزشی، وزن دلخواه و سابقه تمرینی خود را انتخاب کنید.',
    proTip: 'تعیین یک وزن هدف واقع‌بینانه به محاسبه شیب کالری مثبت یا منفی بهینه کمک می‌کند.',
  },
  {
    step: 3,
    title: 'عضلات هدف',
    pose: 'flexing',
    coachDialogue:
      'صادقانه بگو پهلوان؛ کدوم عضلاتت حس می‌کنی عقب موندن و دوست داری توی آینه بیشتر خودنمایی کنن و پرتر بشن؟ سینه؟ زیربغل؟ سرشانه یا پاها؟ بهم بگو تا اول جلسه و با تکنیک‌های پیشرفته شوک بهشون بدم!',
    coachSubtext: 'عضلات نیازمند رشد و عضلات قوی خود را مشخص کنید.',
    proTip: 'عضلات ضعیف در آغاز جلسه زمانی که انرژی عصبی و گلیکوژن در بالاترین حد است تمرین داده می‌شوند.',
  },
  {
    step: 4,
    title: 'سلامت و مفاصل',
    pose: 'explaining',
    coachDialogue:
      'گوش بده پهلوان؛ سلامتی مفاصل و ستون فقراتت خط قرمز منه! اگر درد کمر، دیسک، زانو یا شانه داری حتماً انتخاب کن تا حرکات پرفشار گرانشی رو کلاً حذف کنم و گزینه‌های بیومکانیکی امن برات بچینم.',
    coachSubtext: 'آسیب‌های فیزیکی یا بیماری‌های زمینه‌ای خود را جهت ایمن‌سازی مشخص کنید.',
    proTip: 'هیچ رکوردی ارزش درد مفصل را ندارد؛ اول زاویه ایمن و سلامت مهره‌ها، بعد افزایش وزنه!',
  },
  {
    step: 5,
    title: 'رژیم و سفره ایرانی',
    pose: 'holding_tablet',
    coachDialogue:
      'رسیدیم به بخش خوشمزه داستان! چه سبک رژیمی با ذائقه‌ت جوره و چند روز در هفته می‌تونی وقت بذاری؟ برنامه غذاییت رو با غذاهای در دسترس، لذیذ و سالم سفره ایرانی تنظیم می‌کنم تا با لذت به هدفت برسی.',
    coachSubtext: 'الگوی رژیم، تعداد وعده‌ها، روزهای تمرین و حساسیت‌های غذایی را وارد کنید.',
    proTip: 'رژیم سخت‌گیرانه محکوم به شکست است؛ پایبندی با غذاهای لذیذ سفره ایرانی کلید ساخت بدن ایده‌آل است.',
  },
];

export const GordInteractiveCoachForm: React.FC<GordInteractiveCoachFormProps> = ({
  onSubmit,
  isLoading,
  onCancel,
  onLoadDemo,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Profile Form State
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

  // Custom Tag Input States
  const [customInjury, setCustomInjury] = useState('');
  const [showAddInjury, setShowAddInjury] = useState(false);
  const [customAllergy, setCustomAllergy] = useState('');
  const [showAddAllergy, setShowAddAllergy] = useState(false);

  const stepInfo = COACH_STEPS.find((s) => s.step === currentStep) || COACH_STEPS[0];

  const handleNext = () => {
    if (currentStep === 1) {
      if (!profile.weight || !profile.height || !profile.age) {
        setValidationError('لطفاً قد، وزن و سن خود را مشخص کنید پهلوان!');
        return;
      }
    }
    setValidationError(null);
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onSubmit(profile);
    }
  };

  const handlePrev = () => {
    setValidationError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (onCancel) {
      onCancel();
    }
  };

  const toggleArrayItem = (key: 'weakMuscles' | 'strongMuscles' | 'injuries' | 'allergies' | 'medicalConditions', value: string) => {
    const list = profile[key] as string[];
    const exists = list.includes(value);
    setProfile({
      ...profile,
      [key]: exists ? list.filter((item) => item !== value) : [...list, value],
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-2 pb-32 animate-fadeIn">
      {/* Top Stepper Indicator */}
      <div className="glass-panel rounded-3xl p-4 mb-6 border border-white/10 shadow-glass">
        <div className="flex items-center justify-between max-w-xl mx-auto relative px-2">
          {COACH_STEPS.map((s) => (
            <div
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className="flex flex-col items-center gap-1.5 cursor-pointer select-none relative z-10"
            >
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center font-black text-xs transition-all ${
                  currentStep === s.step
                    ? 'bg-gradient-to-tr from-[#FF6B00] to-amber-400 text-black shadow-glow scale-110'
                    : currentStep > s.step
                    ? 'bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/40'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}
              >
                {s.step}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-bold transition-colors whitespace-nowrap ${
                  currentStep === s.step ? 'text-white' : 'text-slate-500'
                }`}
              >
                {s.title}
              </span>
            </div>
          ))}

          {/* Progress Connecting Line */}
          <div className="absolute top-4 left-6 right-6 h-1 bg-white/10 rounded-full z-0 pointer-events-none">
            <div
              className="h-full bg-gradient-to-r from-[#FF6B00] to-amber-400 rounded-full transition-all duration-500 shadow-glow"
              style={{ width: `${((currentStep - 1) / (COACH_STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: Split Screen (Character on one side, questions on the other) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* CHARACTER COACH STAGE (Host on Screen) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          {/* Coach Dialogue Card with Audio Glow */}
          <div className="w-full relative rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#0c1833] via-[#091225] to-[#040812] border border-[#FF6B00]/40 shadow-2xl mb-4 backdrop-blur-xl">
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-black text-white">مربی گُرد (GORD):</h3>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                <Volume2 className="w-3.5 h-3.5" />
                <span>گفت‌وگوی زنده</span>
              </div>
            </div>

            {/* Coach Speech Text */}
            <p className="text-xs sm:text-sm font-bold text-slate-100 leading-relaxed sm:leading-loose text-right">
              {stepInfo.coachDialogue}
            </p>

            {/* Pro-Tip Box */}
            <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2 text-right">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-200 leading-relaxed">
                <strong className="text-amber-300 ml-1">توصیه گُرد:</strong>
                <span>{stepInfo.proTip}</span>
              </div>
            </div>
          </div>

          {/* Large Hero Character Figure in Current Pose */}
          <div className="relative py-2">
            <GordMascotFigure pose={stepInfo.pose} size="hero" showShadow={true} />
          </div>
        </div>

        {/* INTERACTIVE QUESTION CARD */}
        <div className="lg:col-span-7 space-y-5">
          {/* Validation Alert */}
          {validationError && (
            <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-2 shadow-glow-red animate-shake">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* STEP 1: PHYSICAL STATS */}
          {currentStep === 1 && (
            <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-glass space-y-6 border border-white/10">
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  مشخصات فیزیکی و جنسیت
                </h2>
                <p className="text-xs text-slate-400 mt-1">{stepInfo.coachSubtext}</p>
              </div>

              {/* Gender Switch */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2.5 text-right">
                  جنسیت شما
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, gender: 'male' })}
                    className={`py-3.5 px-4 rounded-2xl border font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      profile.gender === 'male'
                        ? 'bg-[#FF6B00] border-[#FF6B00] text-black shadow-glow'
                        : 'glass-input text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>آقا (ورزشکار مرد)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, gender: 'female' })}
                    className={`py-3.5 px-4 rounded-2xl border font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      profile.gender === 'female'
                        ? 'bg-[#FF6B00] border-[#FF6B00] text-black shadow-glow'
                        : 'glass-input text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>بانو (ورزشکار زن)</span>
                  </button>
                </div>
              </div>

              {/* Height, Weight, Age Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Height */}
                <div className="glass-input p-3.5 rounded-2xl space-y-1">
                  <label className="block text-[11px] font-bold text-slate-400 text-right">
                    قد شما (سانتی‌متر)
                  </label>
                  <input
                    type="number"
                    value={profile.height || ''}
                    onChange={(e) =>
                      setProfile({ ...profile, height: Number(normalizePersianDigits(e.target.value)) })
                    }
                    placeholder="مثال: ۱۷۸"
                    className="w-full bg-transparent text-xl font-black text-white text-right focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-500 font-mono text-left">cm</div>
                </div>

                {/* Weight */}
                <div className="glass-input p-3.5 rounded-2xl space-y-1">
                  <label className="block text-[11px] font-bold text-slate-400 text-right">
                    وزن فعلی (کیلوگرم)
                  </label>
                  <input
                    type="number"
                    value={profile.weight || ''}
                    onChange={(e) =>
                      setProfile({ ...profile, weight: Number(normalizePersianDigits(e.target.value)) })
                    }
                    placeholder="مثال: ۷۸"
                    className="w-full bg-transparent text-xl font-black text-white text-right focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-500 font-mono text-left">kg</div>
                </div>

                {/* Age */}
                <div className="glass-input p-3.5 rounded-2xl space-y-1">
                  <label className="block text-[11px] font-bold text-slate-400 text-right">
                    سن شما (سال)
                  </label>
                  <input
                    type="number"
                    value={profile.age || ''}
                    onChange={(e) =>
                      setProfile({ ...profile, age: Number(normalizePersianDigits(e.target.value)) })
                    }
                    placeholder="مثال: ۲۸"
                    className="w-full bg-transparent text-xl font-black text-white text-right focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-500 font-mono text-left">سال</div>
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2.5 text-right">
                  میزان تحرک و فعالیت روزمره (خارج از باشگاه)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ACTIVITY_LEVELS.map((act) => (
                    <div
                      key={act.value}
                      onClick={() => setProfile({ ...profile, activityLevel: act.value as any })}
                      className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        profile.activityLevel === act.value
                          ? 'bg-[#FF6B00]/20 border-[#FF6B00] text-white font-bold shadow-glow'
                          : 'glass-input text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{act.label}</span>
                      {profile.activityLevel === act.value && <Check className="w-4 h-4 text-[#FF6B00]" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: GOALS & EXPERIENCE */}
          {currentStep === 2 && (
            <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-glass space-y-6 border border-white/10">
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  هدف ورزشی و سابقه تمرینی
                </h2>
                <p className="text-xs text-slate-400 mt-1">{stepInfo.coachSubtext}</p>
              </div>

              {/* Goal Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-3 text-right">
                  هدف اصلی شما در این دوره
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GOALS.map((g) => (
                    <div
                      key={g.value}
                      onClick={() => setProfile({ ...profile, goal: g.value as any })}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1 text-right ${
                        profile.goal === g.value
                          ? 'bg-gradient-to-r from-[#FF6B00]/20 to-amber-500/10 border-[#FF6B00] shadow-glow'
                          : 'glass-input hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-black ${profile.goal === g.value ? 'text-[#FF6B00]' : 'text-white'}`}>
                          {g.title}
                        </span>
                        {profile.goal === g.value && <Check className="w-4 h-4 text-[#FF6B00]" />}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{g.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Weight & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-input p-3.5 rounded-2xl space-y-1">
                  <label className="block text-[11px] font-bold text-slate-400 text-right">
                    وزن دلخواه و هدف (کیلوگرم)
                  </label>
                  <input
                    type="number"
                    value={profile.targetWeight || ''}
                    onChange={(e) =>
                      setProfile({ ...profile, targetWeight: Number(normalizePersianDigits(e.target.value)) })
                    }
                    placeholder="مثال: ۸۲"
                    className="w-full bg-transparent text-xl font-black text-white text-right focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-500 font-mono text-left">kg</div>
                </div>

                <div className="glass-input p-3.5 rounded-2xl space-y-1">
                  <label className="block text-[11px] font-bold text-slate-400 text-right">
                    سطح و سابقه بدنسازی
                  </label>
                  <select
                    value={profile.experienceLevel}
                    onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value as any })}
                    className="w-full bg-transparent text-sm font-bold text-white text-right focus:outline-none pt-2"
                  >
                    <option value="beginner" className="bg-slate-900">مبتدی (کمتر از ۶ ماه سابقه)</option>
                    <option value="intermediate" className="bg-slate-900">متوسط (۶ ماه تا ۲ سال)</option>
                    <option value="advanced" className="bg-slate-900">پیشرفته (بیش از ۲ سال تمرین مداوم)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: WEAK MUSCLES */}
          {currentStep === 3 && (
            <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-glass space-y-6 border border-white/10">
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  عضلات نیازمند رشد و عضلات قوی
                </h2>
                <p className="text-xs text-slate-400 mt-1">{stepInfo.coachSubtext}</p>
              </div>

              {/* Weak Muscles Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-[#FF6B00] font-black text-xs sm:text-sm">
                    <Target className="w-4 h-4" />
                    <span>عضلات ضعیف (اولویت رشد در آغاز جلسات)</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {profile.weakMuscles.length} مورد انتخاب شده
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 justify-end">
                  {MUSCLE_OPTIONS.map((m) => {
                    const isSelected = profile.weakMuscles.includes(m.label);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleArrayItem('weakMuscles', m.label)}
                        className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-[#FF6B00] text-black shadow-glow font-black'
                            : 'glass-input text-slate-300 hover:text-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Strong Muscles Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-black text-xs sm:text-sm">
                    <Award className="w-4 h-4" />
                    <span>عضلات نقطه قوت و ژنتیکی شما</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {profile.strongMuscles.length} مورد
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 justify-end">
                  {MUSCLE_OPTIONS.map((m) => {
                    const isSelected = profile.strongMuscles.includes(m.label);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleArrayItem('strongMuscles', m.label)}
                        className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500 text-black shadow-md font-black'
                            : 'glass-input text-slate-300 hover:text-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: HEALTH & INJURIES */}
          {currentStep === 4 && (
            <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-glass space-y-6 border border-white/10">
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  سلامت مفاصل، آسیب‌ها و بیماری‌ها
                </h2>
                <p className="text-xs text-slate-400 mt-1">{stepInfo.coachSubtext}</p>
              </div>

              {/* Injuries */}
              <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-red-400 font-black text-xs sm:text-sm">
                    <ShieldAlert className="w-4 h-4" />
                    <span>آسیب‌های فیزیکی و مفاصل تحت حفاظت مربی گُرد</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {profile.injuries.length} مورد
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 justify-end">
                  {INJURY_OPTIONS.map((inj) => {
                    const isSelected = profile.injuries.includes(inj);
                    return (
                      <button
                        key={inj}
                        type="button"
                        onClick={() => toggleArrayItem('injuries', inj)}
                        className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-red-500 text-white shadow-glow-red font-black'
                            : 'glass-input text-slate-300 hover:text-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        <span>{inj}</span>
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setShowAddInjury(!showAddInjury)}
                    className="px-3 py-2 rounded-2xl text-xs font-bold text-red-400 border border-dashed border-red-500/40 flex items-center gap-1 hover:bg-red-500/10"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن آسیب دیگر</span>
                  </button>
                </div>

                {showAddInjury && (
                  <div className="flex gap-2 pt-2 border-t border-red-500/20">
                    <input
                      type="text"
                      value={customInjury}
                      onChange={(e) => setCustomInjury(e.target.value)}
                      placeholder="مثال: پارگی رباط مچ دست یا مینیسک زانو"
                      className="flex-1 glass-input px-3 py-2 rounded-xl text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customInjury.trim()) {
                          toggleArrayItem('injuries', customInjury.trim());
                          setCustomInjury('');
                          setShowAddInjury(false);
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-red-500 text-white text-xs font-bold"
                    >
                      ثبت
                    </button>
                  </div>
                )}
              </div>

              {/* Medical Conditions */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2.5 text-right">
                  بیماری‌های زمینه‌ای (دیابت، کبد چرب، فشار خون، تیروئید و...)
                </label>
                <div className="flex flex-wrap gap-2 justify-end">
                  {MEDICAL_CONDITIONS.map((cond) => {
                    const isSelected = profile.medicalConditions.includes(cond);
                    return (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => toggleArrayItem('medicalConditions', cond)}
                        className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-md font-black'
                            : 'glass-input text-slate-300 hover:text-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        <span>{cond}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: IRANIAN DIET & TRAINING DAYS */}
          {currentStep === 5 && (
            <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-glass space-y-6 border border-white/10">
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  رژیم غذایی سفره ایرانی و برنامه زمانی
                </h2>
                <p className="text-xs text-slate-400 mt-1">{stepInfo.coachSubtext}</p>
              </div>

              {/* Diet Preference */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2.5 text-right">
                  الگوی غذایی مورد علاقه شما
                </label>
                <div className="space-y-2">
                  {DIET_PREFERENCES.map((d) => (
                    <div
                      key={d.value}
                      onClick={() => setProfile({ ...profile, dietaryPreference: d.label })}
                      className={`p-3.5 rounded-2xl border text-xs sm:text-sm cursor-pointer transition-all flex items-center justify-between ${
                        profile.dietaryPreference === d.label
                          ? 'bg-[#FF6B00]/20 border-[#FF6B00] text-white font-bold shadow-glow'
                          : 'glass-input text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{d.label}</span>
                      {profile.dietaryPreference === d.label && <Check className="w-4 h-4 text-[#FF6B00]" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Training Days and Meals per day */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-input p-3.5 rounded-2xl space-y-1">
                  <label className="block text-[11px] font-bold text-slate-400 text-right">
                    تعداد روزهای تمرین در هفته
                  </label>
                  <select
                    value={profile.trainingDaysPerWeek}
                    onChange={(e) =>
                      setProfile({ ...profile, trainingDaysPerWeek: Number(e.target.value) })
                    }
                    className="w-full bg-transparent text-sm font-bold text-white text-right focus:outline-none pt-2"
                  >
                    <option value={3} className="bg-slate-900">۳ روز در هفته (اسپلیت فول‌بادی اصلاحی)</option>
                    <option value={4} className="bg-slate-900">۴ روز در هفته (استاندارد پوش-پول-لگ)</option>
                    <option value={5} className="bg-slate-900">۵ روز در هفته (پیشرفته با تمرکز عضلات ضعیف)</option>
                    <option value={6} className="bg-slate-900">۶ روز در هفته (حرفه‌ای فشرده)</option>
                  </select>
                </div>

                <div className="glass-input p-3.5 rounded-2xl space-y-1">
                  <label className="block text-[11px] font-bold text-slate-400 text-right">
                    تعداد وعده‌های غذایی در روز
                  </label>
                  <select
                    value={profile.mealsPerDay}
                    onChange={(e) => setProfile({ ...profile, mealsPerDay: Number(e.target.value) })}
                    className="w-full bg-transparent text-sm font-bold text-white text-right focus:outline-none pt-2"
                  >
                    <option value={3} className="bg-slate-900">۳ وعده (صبحانه، ناهار، شام)</option>
                    <option value={4} className="bg-slate-900">۴ وعده (همراه میان‌وعده قبل/بعد تمرین)</option>
                    <option value={5} className="bg-slate-900">۵ وعده (پروتکل آنابولیک متناوب)</option>
                  </select>
                </div>
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 text-right">
                  حساسیت‌های غذایی (حذف کامل از برنامه)
                </label>
                <div className="flex flex-wrap gap-2 justify-end">
                  {ALLERGY_OPTIONS.map((a) => {
                    const isSelected = profile.allergies.includes(a);
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => toggleArrayItem('allergies', a)}
                        className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-black font-black shadow-sm'
                            : 'glass-input text-slate-300 hover:text-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{a}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Navigation Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="py-3.5 px-6 rounded-2xl glass-input text-white font-bold text-xs sm:text-sm hover:bg-white/10 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ChevronRight className="w-4 h-4" />
                <span>مرحله قبل</span>
              </button>
            )}

            <button
              type="button"
              disabled={isLoading}
              onClick={handleNext}
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF6B00] via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-glow hover:scale-[1.01] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>مربی گُرد در حال طراحی برنامه اختصاصی شماست...</span>
              ) : currentStep < 5 ? (
                <>
                  <span>تایید و مرحله بعد</span>
                  <ChevronLeft className="w-4 h-4 stroke-[3]" />
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>تولید برنامه بدنسازی و تغذیه اختصاصی توسط مربی گُرد</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
