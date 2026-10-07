import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  Copy,
  Dumbbell,
  Edit3,
  ExternalLink,
  Flame,
  Heart,
  LogOut,
  Plus,
  RotateCcw,
  Save,
  Scale,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
  Users,
  Utensils,
  Zap,
} from 'lucide-react';
import { GeneratedPlan, UserAccount, UserProfile } from '../types/fitness';
import { deleteSavedPlan, switchActivePlan, updateUserProfileAndPlan } from '../utils/userManager';
import { ConfirmModal } from './ConfirmModal';
import { normalizePersianDigits } from '../utils/numberUtils';
import {
  BodyRatioIcon,
  CaloriesBurnedIcon,
  HeartRateIcon,
  MuscleMassIcon,
  NutritionPlanIcon,
  SleepRecoveryIcon,
  UserProfileIcon,
  WaterIntakeIcon,
  WeightTrendIcon,
  WorkoutDurationIcon,
} from './FitGenIconPack';

interface UserProfilePanelProps {
  currentUser: UserAccount;
  onSwitchPlan: (plan: GeneratedPlan, profile: UserProfile) => void;
  onNewPlanRequest: () => void;
  onLogout: () => void;
  onBackToApp: () => void;
  onUserUpdated: (user: UserAccount) => void;
}

export const UserProfilePanel: React.FC<UserProfilePanelProps> = ({
  currentUser,
  onSwitchPlan,
  onNewPlanRequest,
  onLogout,
  onBackToApp,
  onUserUpdated,
}) => {
  const profile = currentUser.profile;
  const activePlan = currentUser.activePlan;
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Coach Direct Macro Overrides State
  const [isEditingMacros, setIsEditingMacros] = useState<boolean>(false);
  const [editCalories, setEditCalories] = useState<number>(
    activePlan?.summary?.targetCalories || 2500
  );
  const [editProtein, setEditProtein] = useState<number>(
    activePlan?.summary?.macroSplit?.proteinGrams || 160
  );
  const [editCarbs, setEditCarbs] = useState<number>(
    activePlan?.summary?.macroSplit?.carbsGrams || 280
  );
  const [editFat, setEditFat] = useState<number>(
    activePlan?.summary?.macroSplit?.fatGrams || 70
  );
  const [editWater, setEditWater] = useState<number>(
    activePlan?.summary?.macroSplit?.waterLiters || 3.5
  );

  const publicAppUrl = 'https://ais-pre-2ixmcjo3kcnalt5rlbstbk-204126201412.europe-west3.run.app';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicAppUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    } catch {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    }
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'فیت‌ژن پرو | دستیار هوشمند بدنسازی و تغذیه',
          text: 'برنامه بدنسازی و رژیم اختصاصی من با هوش مصنوعی فیت‌ژن پرو. شما هم می‌توانید برنامه شخصی خود را رایگان دریافت کنید:',
          url: publicAppUrl,
        });
      } catch (err) {
        console.warn('Share cancelled', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleActivatePlan = (planId: string) => {
    try {
      const updatedUser = switchActivePlan(currentUser.id, planId);
      onUserUpdated(updatedUser);
      if (updatedUser.activePlan && updatedUser.profile) {
        onSwitchPlan(updatedUser.activePlan, updatedUser.profile);
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'خطا در فعال‌سازی برنامه');
    }
  };

  const confirmDeletePlan = () => {
    if (!planToDelete) return;
    try {
      const updatedUser = deleteSavedPlan(currentUser.id, planToDelete);
      onUserUpdated(updatedUser);
      setPlanToDelete(null);
    } catch (e: any) {
      setErrorMessage(e.message || 'خطا در حذف برنامه');
    }
  };

  const handleDeletePlan = (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlanToDelete(planId);
  };

  const handleSaveMacroOverrides = () => {
    if (!activePlan || !profile) return;
    const updatedPlan: GeneratedPlan = {
      ...activePlan,
      summary: {
        ...activePlan.summary,
        targetCalories: editCalories,
        macroSplit: {
          proteinGrams: editProtein,
          carbsGrams: editCarbs,
          fatGrams: editFat,
          waterLiters: editWater,
        },
      },
    };

    const updatedUser = updateUserProfileAndPlan(currentUser.id, profile, updatedPlan);
    onUserUpdated(updatedUser);
    onSwitchPlan(updatedPlan, profile);
    setIsEditingMacros(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-2 pb-36 sm:pb-24 space-y-6 sm:space-y-8 animate-fadeIn w-full overflow-x-hidden">
      {/* Top Bar with Navigation & Coach Profile */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl glass-card shadow-glass border border-white/10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <UserProfileIcon size={56} className="shrink-0" />
            <span className="absolute -bottom-1 -right-1 text-lg">{currentUser.avatar}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">{currentUser.name}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30 font-mono">
                پنل مدیریت مربی / کاربر
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{currentUser.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
          <button
            onClick={onBackToApp}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-orange-400 hover:from-orange-500 hover:to-orange-400 text-black font-black text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-glow cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 stroke-[3]" />
            <span>بازگشت به داشبورد برنامه</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2.5 rounded-2xl glass-input hover:bg-rose-950/40 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="خروج از این حساب"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">خروج از حساب</span>
          </button>
        </div>
      </div>

      {/* Public App Share Card */}
      <div className="p-6 rounded-3xl glass-card border border-[#FF6B00]/30 shadow-glass relative overflow-hidden">
        <div className="absolute -left-12 -top-12 w-48 h-48 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B00]/20 text-[#FF6B00] text-[11px] font-black font-mono">
                PUBLIC TEST LINK
              </span>
              <h3 className="text-base font-black text-white">
                لینک عمومی و آماده اشتراک اپلیکیشن فیت‌ژن پرو
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              این لینک به صورت عمومی در دسترس است و می‌توانید آن را برای دوستان، شاگردان یا مربیان بفرستید تا بدون نیاز به ورود، برنامه را تست کرده و برنامه اختصاصی خود را بسازند.
            </p>
            <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-slate-300 select-all break-all flex items-center justify-between gap-2 mt-2">
              <span>{publicAppUrl}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={handleCopyLink}
              className="flex-1 md:flex-none px-4 py-3 rounded-2xl glass-input hover:border-[#FF6B00]/50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              {linkCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span className="text-emerald-400">لینک کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#FF6B00]" />
                  <span>کپی لینک برنامه</span>
                </>
              )}
            </button>

            <button
              onClick={handleShareApp}
              className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-orange-400 hover:from-orange-500 hover:to-orange-400 text-black font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-glow cursor-pointer"
            >
              <Share2 className="w-4 h-4 stroke-[3]" />
              <span>اشتراک‌گذاری مستقیم</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3D Glassmorphic Profile Stats Strip */}
      {profile && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Weight */}
          <div className="p-4 rounded-3xl glass-card flex items-center gap-3.5 border border-white/5 hover:border-white/15 transition-all">
            <WeightTrendIcon size={46} className="shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 font-semibold">وزن فعلی ➔ هدف</div>
              <div className="text-base sm:text-lg font-black text-white font-mono">
                {profile.weight} <span className="text-xs text-[#FF6B00]">→ {profile.targetWeight} kg</span>
              </div>
            </div>
          </div>

          {/* Body Height / BMI */}
          <div className="p-4 rounded-3xl glass-card flex items-center gap-3.5 border border-white/5 hover:border-white/15 transition-all">
            <BodyRatioIcon size={46} className="shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 font-semibold">قد و شاخص BMI</div>
              <div className="text-base sm:text-lg font-black text-white font-mono">
                {profile.height} cm{' '}
                <span className="text-xs text-emerald-400 font-normal">
                  (BMI {activePlan?.summary?.bmi || (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)})
                </span>
              </div>
            </div>
          </div>

          {/* Training Duration & Days */}
          <div className="p-4 rounded-3xl glass-card flex items-center gap-3.5 border border-white/5 hover:border-white/15 transition-all">
            <WorkoutDurationIcon size={46} className="shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 font-semibold">فرکانس و مکان تمرین</div>
              <div className="text-base sm:text-lg font-black text-white">
                {profile.trainingDaysPerWeek} روز در هفته{' '}
                <span className="text-xs text-slate-400 font-normal">
                  ({profile.location === 'gym' ? 'باشگاه' : 'منزل'})
                </span>
              </div>
            </div>
          </div>

          {/* Calories Burned Target */}
          <div className="p-4 rounded-3xl glass-card flex items-center gap-3.5 border border-white/5 hover:border-white/15 transition-all">
            <CaloriesBurnedIcon size={46} className="shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 font-semibold">کالری هدف روزانه</div>
              <div className="text-base sm:text-lg font-black text-[#FF6B00] font-mono">
                {activePlan?.summary?.targetCalories || 2500}{' '}
                <span className="text-xs text-slate-400 font-normal">kcal</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coach Direct Macro & Nutrition Overrides Section */}
      {activePlan && (
        <div className="p-6 rounded-3xl glass-card border border-white/10 shadow-glass space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <NutritionPlanIcon size={40} className="shrink-0" />
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  تنظیم دستی کالری و درشت‌مغذی‌ها (امکانات مربی)
                  {saveSuccess && (
                    <span className="text-xs text-emerald-400 font-bold animate-fadeIn">
                      ✓ با موفقیت ذخیره شد
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400">
                  می‌توانید مقادیر تغذیه و مایعات را بدون بازتولید کل برنامه به طور مستقیم تغییر دهید
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditingMacros(!isEditingMacros)}
              className="px-3.5 py-2 rounded-xl glass-input text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>{isEditingMacros ? 'انصراف' : 'ویرایش مقادیر'}</span>
            </button>
          </div>

          {isEditingMacros ? (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 pt-2">
              <div className="p-3.5 rounded-2xl glass-input space-y-1">
                <label className="text-[11px] font-bold text-slate-400 block text-right">کالری (kcal)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={editCalories === 0 ? '' : String(editCalories)}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const norm = normalizePersianDigits(e.target.value);
                    setEditCalories(norm === '' ? 0 : Number(norm));
                  }}
                  className="w-full bg-transparent text-white font-mono font-black text-lg focus:outline-none text-right"
                  dir="rtl"
                />
              </div>

              <div className="p-3.5 rounded-2xl glass-input space-y-1">
                <label className="text-[11px] font-bold text-slate-400 block text-right">پروتئین (g)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={editProtein === 0 ? '' : String(editProtein)}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const norm = normalizePersianDigits(e.target.value);
                    setEditProtein(norm === '' ? 0 : Number(norm));
                  }}
                  className="w-full bg-transparent text-white font-mono font-black text-lg focus:outline-none text-right"
                  dir="rtl"
                />
              </div>

              <div className="p-3.5 rounded-2xl glass-input space-y-1">
                <label className="text-[11px] font-bold text-slate-400 block text-right">کربوهیدرات (g)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={editCarbs === 0 ? '' : String(editCarbs)}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const norm = normalizePersianDigits(e.target.value);
                    setEditCarbs(norm === '' ? 0 : Number(norm));
                  }}
                  className="w-full bg-transparent text-white font-mono font-black text-lg focus:outline-none text-right"
                  dir="rtl"
                />
              </div>

              <div className="p-3.5 rounded-2xl glass-input space-y-1">
                <label className="text-[11px] font-bold text-slate-400 block text-right">چربی سالم (g)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={editFat === 0 ? '' : String(editFat)}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const norm = normalizePersianDigits(e.target.value);
                    setEditFat(norm === '' ? 0 : Number(norm));
                  }}
                  className="w-full bg-transparent text-white font-mono font-black text-lg focus:outline-none text-right"
                  dir="rtl"
                />
              </div>

              <div className="p-3.5 rounded-2xl glass-input space-y-1">
                <label className="text-[11px] font-bold text-slate-400 block text-right">آب (لیتر)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={editWater === 0 ? '' : String(editWater)}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const norm = normalizePersianDigits(e.target.value);
                    setEditWater(norm === '' ? 0 : Number(norm));
                  }}
                  className="w-full bg-transparent text-white font-mono font-black text-lg focus:outline-none text-right"
                  dir="rtl"
                />
              </div>

              <div className="col-span-2 sm:col-span-5 flex justify-end pt-2">
                <button
                  onClick={handleSaveMacroOverrides}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-orange-400 hover:from-orange-500 hover:to-orange-400 text-black font-black text-xs flex items-center gap-2 shadow-glow transition-all active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4 stroke-[3]" />
                  <span>ذخیره مقادیر جدید در برنامه فعال</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
              <div className="p-3 rounded-2xl glass-input text-center">
                <span className="text-[11px] text-slate-400 font-semibold block">کالری روزانه</span>
                <span className="text-base font-black text-[#FF6B00] font-mono">
                  {activePlan.summary.targetCalories} kcal
                </span>
              </div>
              <div className="p-3 rounded-2xl glass-input text-center">
                <span className="text-[11px] text-slate-400 font-semibold block">پروتئین</span>
                <span className="text-base font-black text-rose-400 font-mono">
                  {activePlan.summary.macroSplit.proteinGrams}g
                </span>
              </div>
              <div className="p-3 rounded-2xl glass-input text-center">
                <span className="text-[11px] text-slate-400 font-semibold block">کربوهیدرات</span>
                <span className="text-base font-black text-amber-400 font-mono">
                  {activePlan.summary.macroSplit.carbsGrams}g
                </span>
              </div>
              <div className="p-3 rounded-2xl glass-input text-center">
                <span className="text-[11px] text-slate-400 font-semibold block">چربی سالم</span>
                <span className="text-base font-black text-emerald-400 font-mono">
                  {activePlan.summary.macroSplit.fatGrams}g
                </span>
              </div>
              <div className="p-3 rounded-2xl glass-input text-center">
                <span className="text-[11px] text-slate-400 font-semibold block">آب هدف</span>
                <span className="text-base font-black text-cyan-400 font-mono">
                  {activePlan.summary.macroSplit.waterLiters} L
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Saved Plans Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <MuscleMassIcon size={32} className="shrink-0" />
              برنامه‌های ورزشی و رژیم‌های ذخیره‌شده
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              می‌توانید بین برنامه‌های مختلف خود جا‌به‌جا شوید یا برنامه جدید طراحی کنید
            </p>
          </div>

          <button
            onClick={onNewPlanRequest}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-orange-400 hover:from-orange-500 hover:to-orange-400 text-black font-black text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-glow cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>طراحی برنامه تمرینی جدید</span>
          </button>
        </div>

        {currentUser.savedPlans && currentUser.savedPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentUser.savedPlans.map((item) => {
              const isActive =
                activePlan &&
                activePlan.workoutPlan.splitName === item.plan.workoutPlan.splitName;
              return (
                <div
                  key={item.id}
                  onClick={() => handleActivatePlan(item.id)}
                  className={`p-5 rounded-3xl cursor-pointer transition-all border flex flex-col justify-between space-y-4 shadow-glass ${
                    isActive
                      ? 'glass-card border-[#FF6B00] shadow-glow ring-1 ring-[#FF6B00]/40'
                      : 'glass-card border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isActive ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#FF6B00] text-black flex items-center gap-1 shadow-glow">
                            <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                            برنامه فعال کنونی
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold glass-input text-slate-300">
                            برنامه آرشیو شده
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(item.savedAt).toLocaleDateString('fa-IR')}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-white">{item.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {item.plan.summary.strategyExplanation}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                      <span>{item.plan.workoutPlan.days.length} جلسه تمرین</span>
                      <span>•</span>
                      <span>{item.plan.summary.targetCalories} kcal</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {currentUser.savedPlans.length > 1 && !isActive && (
                        <button
                          onClick={(e) => handleDeletePlan(item.id, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                          title="حذف این برنامه"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-3xl glass-card text-center space-y-3">
            <Dumbbell className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm text-slate-400">برنامه‌ای ذخیره نشده است.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {planToDelete && (
        <ConfirmModal
          isOpen={true}
          title="حذف برنامه ذخیره‌شده"
          message="آیا مطمئن هستید که می‌خواهید این برنامه را از آرشیو حساب خود حذف کنید؟ این عمل غیرقابل بازگشت است."
          confirmText="بله، حذف کن"
          cancelText="انصراف"
          variant="danger"
          onConfirm={confirmDeletePlan}
          onCancel={() => setPlanToDelete(null)}
        />
      )}
    </div>
  );
};
