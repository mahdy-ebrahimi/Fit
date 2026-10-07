import React, { useEffect, useState } from 'react';
import { ShieldCheck, HeartPulse, Sparkles, Award } from 'lucide-react';
import { GordMascot } from './GordMascot';
import { GordLogo } from './GordLogo';

const LOADING_STAGES = [
  'گُرد در حال ارزیابی آنتروپومتریک و محاسبه سوخت‌وساز پایه (BMR & TDEE)...',
  'بررسی بیومکانیکی آسیب‌ها و حذف حرکات پرخطر برای ستون فقرات و دیسک کمر...',
  'طراحی سیستم تمرینی اختصاصی و افزایش حجم تمرینی عضلات ضعیف در آغاز جلسه...',
  'محاسبه ماکروهای غذایی (پروتئین، کربوهیدرات و آب) با تطابق کامل بر سفره ایرانی...',
  'تنظیم جدول مکمل‌های بدون عارضه و پروتکل‌های پیشرفته ریکاوری و خواب عمیق...',
  'نهایی‌سازی دستورالعمل‌های پهلوانی و تدوین برنامه جامع توسط مربی هوش مصنوعی گُرد...',
];

export const LoadingScreen: React.FC = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => (prev < LOADING_STAGES.length - 1 ? prev + 1 : prev));
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-8 text-center animate-fadeIn max-w-xl mx-auto">
      {/* Gord Mascot in Coach Tablet Mode */}
      <div className="mb-4">
        <GordMascot
          pose="tablet"
          message="چند لحظه دندون رو جگر بذار پهلوان! دارم تمام زوایای بدنت و سفره غذاییت رو بررسی می‌کنم تا دقیق‌ترین برنامه تاریخ رو برات آماده کنم!"
          coachTip="رعایت فرم صحیح حرکات از اولین جلسه باعث میشه سال‌ها بدون درد و مصدومیت ورزش کنی."
          mode="dialogue"
        />
      </div>

      {/* Main Title & Brand */}
      <div className="mb-6 flex flex-col items-center">
        <GordLogo size="md" showSubtitle={true} withGlow={true} />
        <h2 className="text-lg sm:text-xl font-black text-white mt-3 mb-1">
          مربی گُرد در حال طراحی برنامه اختصاصی شماست
        </h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          تحلیل همزمان سیستم اسکلتی، عضلات نیازمند رشد، آسیب‌دیدگی‌ها و کالری هدف سفره ایرانی.
        </p>
      </div>

      {/* Stage Indicator Card */}
      <div className="w-full bg-[#0c1322] border border-[#FF6B00]/30 rounded-3xl p-5 sm:p-6 shadow-2xl text-right">
        <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-3">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 animate-spin text-[#FF6B00]" />
            <span>گام {currentStageIndex + 1} از {LOADING_STAGES.length}</span>
          </span>
          <span className="font-mono text-white text-xs font-black">
            {Math.round(((currentStageIndex + 1) / LOADING_STAGES.length) * 100)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden mb-4 border border-white/5 p-0.5">
          <div
            className="bg-gradient-to-r from-[#FF6B00] via-amber-400 to-[#FF6B00] h-full rounded-full transition-all duration-700 ease-out shadow-glow"
            style={{ width: `${((currentStageIndex + 1) / LOADING_STAGES.length) * 100}%` }}
          />
        </div>

        {/* Stage text */}
        <p className="text-xs sm:text-sm text-slate-200 font-semibold leading-relaxed min-h-[42px] flex items-center">
          {LOADING_STAGES[currentStageIndex]}
        </p>
      </div>

      {/* Safety highlight badges */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-300">
        <span className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-2xl">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>محافظت بیومکانیکی از مفاصل</span>
        </span>
        <span className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-2xl">
          <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
          <span>تغذیه دقیق متناسب با بیماری‌ها</span>
        </span>
        <span className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-2xl">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>استاندارد مربی‌گری گُرد (GORD)</span>
        </span>
      </div>
    </div>
  );
};
