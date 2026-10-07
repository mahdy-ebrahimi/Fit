import React, { useState, useRef } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  Check,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Flame,
  Heart,
  HelpCircle,
  Info,
  Layers,
  MapPin,
  Pill,
  Plus,
  RotateCcw,
  Scale,
  ShieldAlert,
  Sparkles,
  Target,
  User,
  Utensils,
  X,
  Zap,
} from 'lucide-react';
import { UserProfile } from '../types/fitness';
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
  BodyRatioIcon,
  CaloriesBurnedIcon,
  MuscleMassIcon,
  UserProfileIcon,
  WeightTrendIcon,
  ChestMuscleIcon,
  BackLatsIcon,
  BicepsMuscleIcon,
  AbsCoreIcon,
  LegsQuadsIcon,
  ShouldersIcon,
  MedicalCrossIcon,
  AnkleBandageIcon,
  KneeJointIcon,
  GlutenFreeIcon,
  NutFreeIcon,
  SpineVertebraeIcon,
  DairyFreeIcon,
  StopwatchIcon,
  GymDumbbellIcon,
  HeartPulseIcon,
  AnalyticsReportIcon,
} from './FitGenIconPack';
import { GordMascot } from './GordMascot';
import { normalizePersianDigits } from '../utils/numberUtils';

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
  onLoadDemo?: () => void;
  onCancel?: () => void;
}

const STEPS = [
  { id: 1, title: 'مشخصات و هدف' },
  { id: 2, title: 'تمرکز عضلانی' },
  { id: 3, title: 'سلامت و مفاصل' },
  { id: 4, title: 'سبک رژیم' },
];

// Glass Card container
const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`glass-card p-5 mb-4 shadow-glass transition-all ${className}`}>
    {children}
  </div>
);

// Floating Input with Unit (Strictly right-aligned, seamless typing/deleting, 3D icon pack integration)
interface FloatingInputProps {
  label: string;
  type?: string;
  inputMode?: 'decimal' | 'numeric' | 'text';
  value: string;
  onChange: (val: string) => void;
  onClear?: () => void;
  unit?: string;
  icon?: React.ReactNode;
  placeholder?: string;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  type = 'text',
  inputMode = 'decimal',
  value,
  onChange,
  onClear,
  unit,
  icon,
  placeholder = '۰',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const normalized = normalizePersianDigits(raw);
    onChange(normalized);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (onClear) onClear();
    inputRef.current?.focus();
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="relative w-full glass-input rounded-2xl pt-6 pb-2.5 px-4 cursor-text transition-all focus-within:border-[#FF6B00] focus-within:shadow-glow group flex items-center justify-between gap-3"
    >
      <label className="absolute right-4 top-2 text-xs text-slate-400 pointer-events-none font-medium group-focus-within:text-[#FF6B00] transition-colors select-none text-right">
        {label}
      </label>

      {/* Left side: 3D Glass Icon & Unit badge */}
      <div className="flex items-center gap-2 shrink-0">
        {icon && <div className="shrink-0">{icon}</div>}
        {unit && (
          <span className="text-slate-300 font-bold text-xs font-mono select-none px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 group-focus-within:border-[#FF6B00]/40 group-focus-within:text-white transition-colors">
            {unit}
          </span>
        )}
      </div>

      {/* Right side: Input and Clear button */}
      <div className="flex-1 flex items-center justify-end gap-2">
        {value && value !== '' && (
          <button
            type="button"
            onClick={handleClear}
            className="w-5 h-5 rounded-full bg-white/10 hover:bg-[#FF6B00]/30 hover:text-white text-slate-400 flex items-center justify-center text-[10px] font-bold transition-all shrink-0 active:scale-90 cursor-pointer"
            title="پاک کردن و بازنویسی"
          >
            ✕
          </button>
        )}

        <input
          ref={inputRef}
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={handleInputChange}
          onFocus={(e) => e.target.select()}
          className="w-full bg-transparent text-white text-xl font-black text-right font-mono focus:outline-none p-0 m-0"
          placeholder={placeholder}
          dir="rtl"
          style={{ textAlign: 'right' }}
        />
      </div>
    </div>
  );
};

// Anatomical Muscle Icon Resolver (IMG_5163)
const getMuscleIcon = (label: string, size = 22) => {
  if (label.includes('سینه')) return <ChestMuscleIcon size={size} />;
  if (label.includes('زیربغل') || label.includes('پشت')) return <BackLatsIcon size={size} />;
  if (label.includes('بازو') || label.includes('ساعد')) return <BicepsMuscleIcon size={size} />;
  if (label.includes('شکم') || label.includes('Core')) return <AbsCoreIcon size={size} />;
  if (label.includes('پا') || label.includes('ران') || label.includes('چهارسر') || label.includes('همسترینگ') || label.includes('ساق') || label.includes('باسن')) return <LegsQuadsIcon size={size} />;
  if (label.includes('سرشانه') || label.includes('شانه')) return <ShouldersIcon size={size} />;
  return null;
};

// Injury & Biomechanical Protection Icon Resolver (IMG_5163)
const getInjuryIcon = (label: string, size = 22) => {
  if (label.includes('دیسک') || label.includes('کمر') || label.includes('ستون') || label.includes('فیله')) return <SpineVertebraeIcon size={size} />;
  if (label.includes('زانو') || label.includes('مینیسک') || label.includes('صلیبی')) return <KneeJointIcon size={size} />;
  if (label.includes('مچ پا') || label.includes('آشیل') || label.includes('پا')) return <AnkleBandageIcon size={size} />;
  return <MedicalCrossIcon size={size} />;
};

// Dietary Allergy & Restriction Icon Resolver (IMG_5163)
const getAllergyIcon = (label: string, size = 22) => {
  if (label.includes('گلوتن') || label.includes('سلیاک') || label.includes('گندم')) return <GlutenFreeIcon size={size} />;
  if (label.includes('بادام زمینی') || label.includes('آجیل')) return <NutFreeIcon size={size} />;
  if (label.includes('لاکتوز') || label.includes('لبنیات') || label.includes('شیر')) return <DairyFreeIcon size={size} />;
  return <MedicalCrossIcon size={size} />;
};

// Selectable Tag Pill with 3D Glowing Icon integration
const SelectableTag: React.FC<{
  label: string;
  selected: boolean;
  onClick: () => void;
  variant?: 'primary' | 'danger' | 'info';
  icon?: React.ReactNode;
}> = ({ label, selected, onClick, variant = 'primary', icon }) => {
  const baseStyle =
    'px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 text-center select-none active:scale-95';
  let activeStyle = '';
  const inactiveStyle = 'glass-input text-slate-300 hover:bg-white/10 hover:text-white';

  if (variant === 'primary') {
    activeStyle =
      'bg-[#FF6B00]/20 border-[#FF6B00] text-[#FF6B00] shadow-[0_0_15px_rgba(255,107,0,0.3)] border font-bold';
  } else if (variant === 'danger') {
    activeStyle =
      'bg-red-500/15 border-red-500 text-red-400 shadow-glow-red border font-bold';
  } else if (variant === 'info') {
    activeStyle =
      'bg-blue-500/15 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)] border font-bold';
  }

  return (
    <div onClick={onClick} className={`${baseStyle} ${selected ? activeStyle : inactiveStyle}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </div>
  );
};

export const ProfileForm: React.FC<ProfileFormProps> = ({
  onSubmit,
  isLoading,
  onLoadDemo,
  onCancel,
}) => {
  const [step, setStep] = useState<number>(1);

  const [profile, setProfile] = useState<UserProfile>({
    gender: 'male',
    age: 26,
    weight: 75,
    height: 178,
    targetWeight: 80,
    activityLevel: 'moderate',
    goal: 'muscle_gain',
    experienceLevel: 'intermediate',
    trainingDaysPerWeek: 4,
    location: 'gym',
    weakMuscles: ['بالا سینه', 'سرشانه خلفی (پشت سرشانه)'],
    strongMuscles: ['جلو بازو (دو سر بازویی)'],
    injuries: [],
    allergies: [],
    medicalConditions: [],
    dietaryPreference: 'رژیم سنتی ایرانی سالم (برنج کته، فیله مرغ، خوراک‌های کم‌روغن)',
    mealsPerDay: 4,
    extraNotes: '',
  });

  const [customInjury, setCustomInjury] = useState('');
  const [customCondition, setCustomCondition] = useState('');
  const [showAddInjury, setShowAddInjury] = useState(false);
  const [showAddCondition, setShowAddCondition] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // String state for fluid typing, backspacing and decimals without resets
  const [ageStr, setAgeStr] = useState<string>(String(profile.age || '26'));
  const [weightStr, setWeightStr] = useState<string>(String(profile.weight || '75'));
  const [heightStr, setHeightStr] = useState<string>(String(profile.height || '178'));
  const [targetWeightStr, setTargetWeightStr] = useState<string>(String(profile.targetWeight || '80'));

  const handleAgeChange = (val: string) => {
    setAgeStr(val);
    const parsed = parseInt(val);
    setProfile((prev) => ({ ...prev, age: isNaN(parsed) ? 0 : parsed }));
  };

  const handleWeightChange = (val: string) => {
    setWeightStr(val);
    const parsed = parseFloat(val);
    setProfile((prev) => ({ ...prev, weight: isNaN(parsed) ? 0 : parsed }));
  };

  const handleHeightChange = (val: string) => {
    setHeightStr(val);
    const parsed = parseFloat(val);
    setProfile((prev) => ({ ...prev, height: isNaN(parsed) ? 0 : parsed }));
  };

  const handleTargetWeightChange = (val: string) => {
    setTargetWeightStr(val);
    const parsed = parseFloat(val);
    setProfile((prev) => ({ ...prev, targetWeight: isNaN(parsed) ? 0 : parsed }));
  };

  const toggleArrayItem = (
    field: 'weakMuscles' | 'strongMuscles' | 'injuries' | 'allergies' | 'medicalConditions',
    value: string
  ) => {
    setProfile((prev) => {
      const exists = prev[field].includes(value);
      if (exists) {
        return { ...prev, [field]: prev[field].filter((item) => item !== value) };
      } else {
        return { ...prev, [field]: [...prev[field], value] };
      }
    });
  };

  const addCustomItem = (
    field: 'weakMuscles' | 'injuries' | 'allergies' | 'medicalConditions',
    value: string,
    clearFn: (val: string) => void
  ) => {
    const trimmed = value.trim();
    if (trimmed && !profile[field].includes(trimmed)) {
      setProfile((prev) => ({ ...prev, [field]: [...prev[field], trimmed] }));
      clearFn('');
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const w = parseFloat(weightStr);
    const h = parseFloat(heightStr);
    if (!w || !h || w <= 20 || h <= 50) {
      setValidationError('لطفاً قد و وزن خود را به صورت معتبر وارد فرمایید.');
      setStep(1);
      return;
    }
    setValidationError(null);
    onSubmit({
      ...profile,
      age: parseInt(ageStr) || 26,
      weight: w,
      height: h,
      targetWeight: parseFloat(targetWeightStr) || w,
    });
  };

  const handleNextStep = () => {
    if (step === 1) {
      const w = parseFloat(weightStr);
      const h = parseFloat(heightStr);
      if (!w || !h || w <= 20 || h <= 50) {
        setValidationError('لطفاً قد و وزن خود را مشخص فرمایید.');
        return;
      }
    }
    setValidationError(null);
    if (step < 4) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  return (
    <div className="max-w-md mx-auto w-full px-3.5 sm:px-4 pt-1 sm:pt-2 flex flex-col relative pb-40 sm:pb-36 animate-fadeIn overflow-x-hidden">
      {/* Quick Demo Plan trigger link */}
      {onLoadDemo && (
        <div className="text-center mb-3">
          <button
            type="button"
            onClick={onLoadDemo}
            className="text-xs text-[#FF6B00] hover:text-orange-400 font-bold underline underline-offset-4 transition-colors inline-flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>مشاهده فوری برنامه نمونه و انیمیشن‌ها (بدون نیاز به ثبت فرم)</span>
          </button>
        </div>
      )}

      {/* Progress Stepper Bar with Connecting Track */}
      <GlassCard className="py-3 sm:py-4 px-2.5 sm:px-4 relative overflow-hidden">
        <div className="flex justify-between relative z-10 mb-2 px-1">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className="flex flex-col items-center gap-1.5 cursor-pointer select-none"
              onClick={() => setStep(s.id)}
            >
              <span
                className={`text-[9px] sm:text-[10px] font-bold transition-colors whitespace-nowrap ${
                  step >= s.id ? 'text-white' : 'text-slate-500'
                }`}
              >
                {s.title}
              </span>
              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold border-2 transition-all cursor-pointer ${
                  step === s.id
                    ? 'bg-[#FF6B00] border-[#FF6B00] text-black shadow-glow scale-110'
                    : step > s.id
                    ? 'bg-[#FF6B00]/20 border-[#FF6B00] text-[#FF6B00]'
                    : 'bg-[#0a0a0c] border-slate-700 text-slate-500'
                }`}
              >
                {s.id}
              </div>
            </div>
          ))}
        </div>

        {/* Track Line behind steps */}
        <div className="absolute top-10 left-6 right-6 h-1 bg-white/10 rounded-full z-0">
          <div
            className="h-full bg-[#FF6B00] rounded-full transition-all duration-500 ease-out shadow-glow"
            style={{
              width: `${((step - 1) / (STEPS.length - 1)) * 100}%`,
              transformOrigin: 'right',
            }}
          />
        </div>
      </GlassCard>

      {/* Validation alert */}
      {validationError && (
        <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-2 mb-3 shadow-glow-red">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* STEP 1: PHYSICAL STATS & GOAL */}
      {step === 1 && (
        <div className="animate-fadeIn space-y-4">
          {/* Gord Coach Character Dialogue */}
          <GordMascot
            pose="pointing"
            message="درود بر تو پهلوان! من «گُرد» مربی ارشد و رفیق مسیر تواَم. اول از همه بگو مشخصات فیزیکی اولیه‌ت چقدره و چه هدفی توی سر داری؟"
            subMessage="قد، وزن، سن و هدف ورزشی‌ت رو با دقت مشخص کن تا محاسبات متابولیسم پایه (BMR و TDEE) رو مو‌به‌مو دقیق دربیارم."
            coachTip="اگر وزن ناشتای صبحت رو وارد کنی، دقیق‌ترین کالری هدف و تقسیم پروتئین برای عضله‌سازی بدون چربی محاسبه میشه."
          />

          <GlassCard>
            {/* Gender Toggle */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-400 mb-2.5 text-right">
                جنسیت
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, gender: 'female' })}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${
                    profile.gender === 'female'
                      ? 'bg-[#FF6B00]/20 border border-[#FF6B00] text-[#FF6B00] shadow-glow'
                      : 'glass-input text-slate-400'
                  }`}
                >
                  خانم
                </button>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, gender: 'male' })}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg ${
                    profile.gender === 'male'
                      ? 'bg-[#FF6B00]/20 border border-[#FF6B00] text-[#FF6B00] shadow-glow'
                      : 'glass-input text-slate-400'
                  }`}
                >
                  آقا
                </button>
              </div>
            </div>

            {/* Float Inputs: Age, Weight, Height, TargetWeight with 3D Icons & RTL Alignment */}
            <div className="space-y-3.5">
              <FloatingInput
                label="سن (سال)"
                inputMode="numeric"
                value={ageStr}
                onChange={handleAgeChange}
                onClear={() => handleAgeChange('')}
                icon={<UserProfileIcon size={30} />}
                placeholder="۲۶"
              />
              <FloatingInput
                label="وزن فعلی"
                inputMode="decimal"
                value={weightStr}
                onChange={handleWeightChange}
                onClear={() => handleWeightChange('')}
                unit="kg"
                icon={<WeightTrendIcon size={30} />}
                placeholder="۷۵"
              />
              <FloatingInput
                label="قد"
                inputMode="decimal"
                value={heightStr}
                onChange={handleHeightChange}
                onClear={() => handleHeightChange('')}
                unit="cm"
                icon={<BodyRatioIcon size={30} />}
                placeholder="۱۷۸"
              />
              <FloatingInput
                label="وزن دلخواه (هدف)"
                inputMode="decimal"
                value={targetWeightStr}
                onChange={handleTargetWeightChange}
                onClear={() => handleTargetWeightChange('')}
                unit="kg"
                icon={<MuscleMassIcon size={30} />}
                placeholder="۸۰"
              />
            </div>
          </GlassCard>

          {/* Goal Selector */}
          <GlassCard className="border-[#FF6B00]/30 relative overflow-hidden">
            <div className="absolute -left-10 -top-10 w-32 h-32 bg-[#FF6B00]/10 rounded-full blur-2xl pointer-events-none" />
            <label className="block text-xs font-bold text-slate-400 mb-3 text-right">
              هدف اصلی شما در بدنسازی
            </label>
            <div className="space-y-2.5">
              {GOALS.map((g) => {
                const isSelected = profile.goal === g.value;
                return (
                  <div
                    key={g.value}
                    onClick={() => setProfile({ ...profile, goal: g.value as any })}
                    className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-[#FF6B00]/15 border-[#FF6B00] shadow-glow'
                        : 'bg-black/30 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-white">{g.title}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-bold shrink-0 ${
                          isSelected
                            ? 'bg-[#FF6B00] text-black font-black'
                            : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        {g.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {g.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Location & Days per week */}
          <GlassCard>
            <label className="block text-xs font-bold text-slate-400 mb-2.5 text-right">
              محل و امکانات تمرینی
            </label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { id: 'gym', label: 'باشگاه کامل' },
                { id: 'home_dumbbells', label: 'دمبل و منزل' },
                { id: 'bodyweight', label: 'وزن بدن' },
              ].map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setProfile({ ...profile, location: loc.id as any })}
                  className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all ${
                    profile.location === loc.id
                      ? 'bg-[#FF6B00]/20 border border-[#FF6B00] text-[#FF6B00] shadow-glow'
                      : 'glass-input text-slate-400'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            <label className="block text-xs font-bold text-slate-400 mb-2.5 text-right">
              تعداد روزهای تمرین در هفته
            </label>
            <div className="flex justify-between gap-1.5">
              {[2, 3, 4, 5, 6].map((dayCount) => (
                <button
                  key={dayCount}
                  type="button"
                  onClick={() => setProfile({ ...profile, trainingDaysPerWeek: dayCount })}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                    profile.trainingDaysPerWeek === dayCount
                      ? 'bg-[#FF6B00] text-black shadow-glow'
                      : 'glass-input text-slate-300'
                  }`}
                >
                  {dayCount} روز
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* STEP 2: MUSCLE FOCUS & WEAK POINTS */}
      {step === 2 && (
        <div className="animate-fadeIn space-y-4">
          {/* Gord Coach Character Dialogue - Flexing Pose */}
          <GordMascot
            pose="flexing"
            message="ماشالله به اراده و همتت! حالا بگو ببینم کدوم عضلاتت عقب موندن و دوست داری توی آینه بیشتر خودنمایی کنن و پرتر بشن؟"
            subMessage="برای عضلات ضعیفت حجم تمرینی ویژه، اولویت در شروع جلسه و تکنیک‌های شدت‌دهنده مدرن مثل رست-پاز و دراپ‌ست لحاظ می‌کنم."
            coachTip="عضلات هدف و ضعیفت رو اول تمرین می‌چینم چون بالاترین سطح تمرکز عصبی و گلیکوژن رو داری!"
          />

          <GlassCard>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-[#FF6B00] font-black text-xs sm:text-sm">
                <Target className="w-4 h-4" />
                <span>عضلات ضعیف (اولویت رشد در برنامه)</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {profile.weakMuscles.length} عضله انتخاب شده
              </span>
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              {MUSCLE_OPTIONS.map((muscle) => (
                <SelectableTag
                  key={muscle.id}
                  label={muscle.label}
                  selected={profile.weakMuscles.includes(muscle.label)}
                  onClick={() => toggleArrayItem('weakMuscles', muscle.label)}
                  variant="primary"
                  icon={getMuscleIcon(muscle.label, 22)}
                />
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-cyan-400 font-black text-xs sm:text-sm">
                <Award className="w-4 h-4" />
                <span>عضلات قوی و ژنتیکی شما (رشد آسان‌تر)</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {profile.strongMuscles.length} عضله
              </span>
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              {MUSCLE_OPTIONS.map((muscle) => (
                <SelectableTag
                  key={muscle.id}
                  label={muscle.label}
                  selected={profile.strongMuscles.includes(muscle.label)}
                  onClick={() => toggleArrayItem('strongMuscles', muscle.label)}
                  variant="info"
                  icon={getMuscleIcon(muscle.label, 22)}
                />
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* STEP 3: HEALTH, INJURIES & MEDICAL */}
      {step === 3 && (
        <div className="animate-fadeIn space-y-4">
          {/* Gord Coach Character Dialogue - Explaining Pose */}
          <GordMascot
            pose="explaining"
            message="سلامتی ستون فقرات و مفاصلت خط قرمز منه پهلوان! هر درد یا محدودیتی تو کمر، زانو یا شونه‌ت داری بی تعارف انتخاب کن."
            subMessage="با علم بیومکانیک، تمام تمرینات پرفشار محوری (مثل اسکات سنگین با هالتر یا ددلیفت در دیسک کمر) رو حذف می‌کنم و حرکات امن و جایگزین برات می‌چینم."
            coachTip="هیچ رکوردی ارزش آسیب دیدن مهره یا مفصل رو نداره؛ اول فرم صحیح و زاویه ایمن، بعد وزنه سنگین!"
          />

          {/* Injuries Card */}
          <GlassCard className="border-red-500/20 bg-red-950/10">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-red-400 font-black text-xs sm:text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>آسیب‌های فیزیکی و مفاصل تحت حفاظت</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {profile.injuries.length} مورد
              </span>
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              {INJURY_OPTIONS.map((injury) => (
                <SelectableTag
                  key={injury}
                  label={injury}
                  variant="danger"
                  selected={profile.injuries.includes(injury)}
                  onClick={() => toggleArrayItem('injuries', injury)}
                  icon={getInjuryIcon(injury, 22)}
                />
              ))}

              <button
                type="button"
                onClick={() => setShowAddInjury(!showAddInjury)}
                className="glass-input px-3.5 py-2.5 rounded-2xl text-xs font-bold text-red-400 flex items-center gap-1.5 hover:bg-red-500/10 border-red-500/30 border border-dashed transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن آسیب دیگر</span>
              </button>
            </div>

            {showAddInjury && (
              <div className="mt-3 flex gap-2 pt-2 border-t border-red-500/20">
                <input
                  type="text"
                  value={customInjury}
                  onChange={(e) => setCustomInjury(e.target.value)}
                  placeholder="مثال: پارگی مینیسک زانوی چپ"
                  className="flex-1 glass-input px-3 py-2 rounded-xl text-xs text-white placeholder-slate-500"
                />
                <button
                  type="button"
                  onClick={() =>
                    addCustomItem('injuries', customInjury, setCustomInjury)
                  }
                  className="px-3 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-400"
                >
                  ثبت
                </button>
              </div>
            )}
          </GlassCard>

          {/* Diseases Card */}
          <GlassCard>
            <div className="flex items-center gap-2 text-blue-400 font-black text-xs sm:text-sm mb-4">
              <MedicalCrossIcon size={24} />
              <span>بیماری‌های خاص و سوابق پزشکی</span>
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              {MEDICAL_CONDITIONS.map((cond) => (
                <SelectableTag
                  key={cond}
                  label={cond}
                  selected={profile.medicalConditions.includes(cond)}
                  onClick={() => toggleArrayItem('medicalConditions', cond)}
                  variant="info"
                  icon={<MedicalCrossIcon size={20} />}
                />
              ))}

              <button
                type="button"
                onClick={() => setShowAddCondition(!showAddCondition)}
                className="glass-input px-3.5 py-2.5 rounded-2xl text-xs font-bold text-blue-400 flex items-center gap-1.5 hover:bg-blue-500/10 border-blue-500/30 border border-dashed transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن مورد دیگر</span>
              </button>
            </div>

            {showAddCondition && (
              <div className="mt-3 flex gap-2 pt-2 border-t border-blue-500/20">
                <input
                  type="text"
                  value={customCondition}
                  onChange={(e) => setCustomCondition(e.target.value)}
                  placeholder="مثال: رفلاکس معده یا سنگ کلیه"
                  className="flex-1 glass-input px-3 py-2 rounded-xl text-xs text-white placeholder-slate-500"
                />
                <button
                  type="button"
                  onClick={() =>
                    addCustomItem('medicalConditions', customCondition, setCustomCondition)
                  }
                  className="px-3 py-2 bg-blue-500 text-white rounded-xl text-xs font-bold hover:bg-blue-400"
                >
                  ثبت
                </button>
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* STEP 4: NUTRITION & LIFESTYLE */}
      {step === 4 && (
        <div className="animate-fadeIn space-y-4">
          {/* Gord Coach Character Dialogue - Holding Tablet Pose */}
          <GordMascot
            pose="tablet"
            message="رسیدیم به بخش خوشمزه داستان! چه سبک رژیمی با ذائقه‌ت جوره و چند روز در هفته می‌تونی وقت بذاری؟"
            subMessage="برنامه غذاییت رو دقیقاً با غذاهای لذیذ، در دسترس و اقتصادی سفره ایرانی هماهنگ می‌کنم تا راحت به هدفت برسی."
            coachTip="تغذیه ۸۰ درصد راهه! ماکرونوترینت‌ها (پروتئین، کربوهیدرات و چربی‌های سالم) رو دقیق برای قد و وزنت حساب می‌کنم."
          />

          <GlassCard>
            <label className="block text-xs font-bold text-slate-400 mb-3 text-right">
              الگوی رژیم غذایی شما
            </label>
            <div className="space-y-2">
              {DIET_PREFERENCES.map((diet) => (
                <div
                  key={diet.value}
                  onClick={() => setProfile({ ...profile, dietaryPreference: diet.label })}
                  className={`p-3.5 rounded-2xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${
                    profile.dietaryPreference === diet.label
                      ? 'bg-[#FF6B00]/20 border-[#FF6B00] text-white font-bold shadow-glow'
                      : 'glass-input text-slate-300'
                  }`}
                >
                  <span>{diet.label}</span>
                  {profile.dietaryPreference === diet.label && (
                    <Check className="w-4 h-4 text-[#FF6B00]" />
                  )}
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <label className="block text-xs font-bold text-slate-400 mb-2.5 text-right">
              تعداد وعده‌های غذایی در روز
            </label>
            <div className="flex gap-2 justify-between">
              {[3, 4, 5, 6].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setProfile({ ...profile, mealsPerDay: count })}
                  className={`flex-1 py-2.5 rounded-2xl text-xs font-black transition-all ${
                    profile.mealsPerDay === count
                      ? 'bg-[#FF6B00] text-black shadow-glow'
                      : 'glass-input text-slate-300'
                  }`}
                >
                  {count} وعده
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Dietary Allergies & Sensitivities (IMG_5163 Gluten, Nuts, Dairy) */}
          <GlassCard>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 text-amber-400 font-black text-xs sm:text-sm">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>حساسیت‌ها و پرهیزهای غذایی (حذف کامل از رژیم)</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {profile.allergies.length} مورد
              </span>
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              {ALLERGY_OPTIONS.map((allergy) => (
                <SelectableTag
                  key={allergy}
                  label={allergy}
                  selected={profile.allergies.includes(allergy)}
                  onClick={() => toggleArrayItem('allergies', allergy)}
                  variant="primary"
                  icon={getAllergyIcon(allergy, 22)}
                />
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <label className="block text-xs font-bold text-slate-400 mb-2 text-right">
              توضیحات تکمیلی یا درخواست خاص از مربی هوش مصنوعی (اختیاری)
            </label>
            <textarea
              rows={3}
              value={profile.extraNotes}
              onChange={(e) => setProfile({ ...profile, extraNotes: e.target.value })}
              placeholder="مثال: من صبح‌ها ساعت ۷ تمرین می‌کنم و به تخم‌مرغ حساسیت دارم..."
              className="glass-input w-full p-3 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6B00]"
            />
          </GlassCard>
        </div>
      )}

      {/* Docked Mobile-First Bottom Navigation Controls Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#070b14]/95 backdrop-blur-2xl border-t border-white/10 px-[max(1rem,env(safe-area-inset-right,0px))] pl-[max(1rem,env(safe-area-inset-left,0px))] pt-3 pb-[max(1rem,calc(0.75rem+env(safe-area-inset-bottom,0px)))] shadow-2xl safe-dock-bottom">
        <div className="max-w-md mx-auto flex gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
              className="flex-1 glass-input py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-1.5 hover:bg-white/10 transition-all active:scale-95 text-xs sm:text-sm cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
              <span>مرحله قبل</span>
            </button>
          ) : onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 glass-input py-3.5 rounded-2xl font-bold text-[#FF6B00] flex items-center justify-center gap-1.5 hover:bg-white/10 transition-all active:scale-95 text-xs sm:text-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#FF6B00]" />
              <span>برنامه جاری</span>
            </button>
          ) : null}

          <button
            type="button"
            disabled={isLoading}
            onClick={handleNextStep}
            className="flex-[2] bg-gradient-to-r from-[#FF6B00] to-orange-400 py-3.5 rounded-2xl font-black text-black flex items-center justify-center gap-2 shadow-glow hover:scale-[1.01] active:scale-95 transition-all text-xs sm:text-sm disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span>در حال پردازش هوشمند...</span>
            ) : step < 4 ? (
              <>
                <span>مرحله بعد</span>
                <ChevronLeft className="w-4 h-4 stroke-[3]" />
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-black" />
                <span>تولید برنامه اختصاصی توسط مربی گُرد</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
