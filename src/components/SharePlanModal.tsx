import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Check,
  Copy,
  Download,
  Eye,
  Image as ImageIcon,
  Share2,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { GeneratedPlan, UserProfile } from '../types/fitness';

interface SharePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: GeneratedPlan;
  profile: UserProfile;
}

export const SharePlanModal: React.FC<SharePlanModalProps> = ({
  isOpen,
  onClose,
  plan,
  profile,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);

  const generateCanvasImage = useCallback(() => {
    setIsGenerating(true);
    const canvas = document.createElement('canvas');
    const width = 1200;
    const height = 1600;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsGenerating(false);
      return;
    }

    // 1. Dark Athletic Background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0a0d14');
    bgGrad.addColorStop(0.5, '#06080d');
    bgGrad.addColorStop(1, '#030407');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Energetic Accent Radial Glows
    const radialOrange = ctx.createRadialGradient(width - 150, 150, 50, width - 150, 150, 450);
    radialOrange.addColorStop(0, 'rgba(255, 107, 0, 0.22)');
    radialOrange.addColorStop(1, 'rgba(255, 107, 0, 0)');
    ctx.fillStyle = radialOrange;
    ctx.fillRect(0, 0, width, height);

    const radialBlue = ctx.createRadialGradient(150, height - 200, 50, 150, height - 200, 500);
    radialBlue.addColorStop(0, 'rgba(59, 130, 246, 0.14)');
    radialBlue.addColorStop(1, 'rgba(59, 130, 246, 0)');
    ctx.fillStyle = radialBlue;
    ctx.fillRect(0, 0, width, height);

    // Subtle Grid pattern overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1;
    for (let x = 60; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 60; y < height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Rounded rectangle helper
    const drawRoundedRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
      fill: string,
      stroke?: string,
      lineWidth: number = 1
    ) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
    };

    // Text helper with RTL support
    ctx.direction = 'rtl';
    ctx.textAlign = 'right';

    // 3. Header Container
    drawRoundedRect(60, 60, width - 120, 140, 28, 'rgba(20, 20, 25, 0.7)', 'rgba(255, 107, 0, 0.35)', 1.5);

    // GORD (گُرد) Logo Badge
    drawRoundedRect(width - 240, 90, 140, 36, 12, 'rgba(255, 107, 0, 0.2)', '#FF6B00', 1.5);
    ctx.font = '900 18px "Vazirmatn", sans-serif';
    ctx.fillStyle = '#FF6B00';
    ctx.fillText('گُرد | GORD', width - 110, 114);

    // Title & Subtitle
    ctx.font = '900 32px "Vazirmatn", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('برنامه اختصاصی مربی هوش مصنوعی گُرد', width - 260, 118);

    ctx.font = '500 16px "Vazirmatn", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(
      `ورزشکار: ${profile.gender === 'female' ? 'بانو' : 'آقا'} • سابقه: ${
        profile.experienceLevel === 'beginner' ? 'مبتدی' : profile.experienceLevel === 'advanced' ? 'پیشرفته' : 'متوسط'
      } • ${profile.trainingDaysPerWeek} روز تمرین در هفته`,
      width - 90,
      165
    );

    // 4. Quick Metrics Strip (4 cards)
    const cardY = 230;
    const cardW = (width - 120 - 45) / 4;
    const cardH = 110;

    const metrics = [
      { label: 'کالری هدف روزانه', value: `${plan.summary.targetCalories}`, unit: 'kcal', color: '#FF6B00' },
      { label: 'پروتئین هدف', value: `${plan.summary.macroSplit.proteinGrams}`, unit: 'g / روز', color: '#f43f5e' },
      { label: 'آب مصرفی', value: `${plan.summary.macroSplit.waterLiters}`, unit: 'لیتر / روز', color: '#06b6d4' },
      { label: 'وزن فعلی ➔ هدف', value: `${profile.weight} ➔ ${profile.targetWeight}`, unit: 'kg', color: '#10b981' },
    ];

    metrics.forEach((m, idx) => {
      const cx = width - 60 - (idx + 1) * cardW - idx * 15;
      drawRoundedRect(cx, cardY, cardW, cardH, 20, 'rgba(255, 255, 255, 0.04)', 'rgba(255, 255, 255, 0.08)');

      ctx.font = '700 14px "Vazirmatn", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(m.label, cx + cardW - 20, cardY + 36);

      ctx.font = '900 24px "Vazirmatn", sans-serif';
      ctx.fillStyle = m.color;
      ctx.fillText(m.value, cx + cardW - 20, cardY + 74);

      ctx.font = '600 12px "Vazirmatn", sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(m.unit, cx + cardW - 20, cardY + 95);
    });

    // 5. System Strategy Banner
    const stratY = 365;
    drawRoundedRect(60, stratY, width - 120, 95, 22, 'rgba(255, 107, 0, 0.08)', 'rgba(255, 107, 0, 0.25)');

    ctx.font = '900 20px "Vazirmatn", sans-serif';
    ctx.fillStyle = '#FF6B00';
    ctx.fillText(`سیستم تمرینی: ${plan.workoutPlan.splitName}`, width - 90, stratY + 40);

    ctx.font = '500 15px "Vazirmatn", sans-serif';
    ctx.fillStyle = '#e2e8f0';
    const stratText = plan.summary.strategyExplanation.slice(0, 115) + (plan.summary.strategyExplanation.length > 115 ? '...' : '');
    ctx.fillText(stratText, width - 90, stratY + 72);

    // 6. Workout Days Grid (Show up to 4 days)
    const daysY = 485;
    const displayedDays = plan.workoutPlan.days.slice(0, 4);
    const dayCardW = (width - 120 - 20) / 2;
    const dayCardH = 215;

    displayedDays.forEach((day, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const dx = width - 60 - (col + 1) * dayCardW - col * 20;
      const dy = daysY + row * (dayCardH + 20);

      drawRoundedRect(dx, dy, dayCardW, dayCardH, 22, 'rgba(20, 20, 26, 0.75)', 'rgba(255, 255, 255, 0.08)', 1);

      // Day Badge
      drawRoundedRect(dx + dayCardW - 130, dy + 18, 110, 32, 10, 'rgba(255, 107, 0, 0.15)', 'rgba(255, 107, 0, 0.4)');
      ctx.font = '900 14px "Vazirmatn", sans-serif';
      ctx.fillStyle = '#FF6B00';
      ctx.fillText(`روز ${day.dayNumber}`, dx + dayCardW - 35, dy + 39);

      // Focus / Day Name
      ctx.font = '900 18px "Vazirmatn", sans-serif';
      ctx.fillStyle = '#ffffff';
      const dayTitle = day.dayName || (day.targetMuscles ? day.targetMuscles.join('، ') : 'تمرین اختصاصی');
      ctx.fillText(dayTitle.slice(0, 22), dx + dayCardW - 145, dy + 40);

      // Exercises (Top 3)
      let exY = dy + 78;
      const topExs = day.exercises.slice(0, 3);
      topExs.forEach((ex, exIdx) => {
        // Dot bullet
        ctx.beginPath();
        ctx.arc(dx + dayCardW - 25, exY - 5, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#FF6B00';
        ctx.fill();

        ctx.font = '700 14px "Vazirmatn", sans-serif';
        ctx.fillStyle = '#f1f5f9';
        ctx.fillText(ex.nameFa.slice(0, 26), dx + dayCardW - 38, exY);

        ctx.font = '600 13px "Vazirmatn", sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`${ex.sets} ست × ${ex.reps}`, dx + 30, exY);

        exY += 34;
      });

      if (day.exercises.length > 3) {
        ctx.font = '600 12px "Vazirmatn", sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`+ ${day.exercises.length - 3} حرکت تکمیلی دیگر`, dx + dayCardW - 38, exY + 5);
      }
    });

    // 7. Safety, Weak Muscle & Nutrition Bottom Highlights
    const bottomY = 980;
    drawRoundedRect(60, bottomY, width - 120, 210, 24, 'rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.08)');

    // Column 1: Injury & Safety
    ctx.font = '900 16px "Vazirmatn", sans-serif';
    ctx.fillStyle = '#10b981';
    ctx.fillText('🛡️ ایمنی مفاصل و پیشگیری از آسیب:', width - 90, bottomY + 40);

    ctx.font = '500 14px "Vazirmatn", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    const injuryText =
      profile.injuries.length > 0
        ? `حفاظت از ${profile.injuries.join('، ')} با حذف حرکات پرفشار محوری و جایگزینی بیومکانیکی.`
        : 'مفاصل کاملاً سالم؛ رعایت دقیق ریتم تنفس و فاز منفی کنترل‌شده ۳ ثانیه‌ای.';
    ctx.fillText(injuryText, width - 90, bottomY + 68);

    // Column 2: Weak Muscle Focus
    ctx.font = '900 16px "Vazirmatn", sans-serif';
    ctx.fillStyle = '#FF6B00';
    ctx.fillText('⚡ تمرکز بر نقاط ضعف و هایپرتروفی:', width - 90, bottomY + 112);

    ctx.font = '500 14px "Vazirmatn", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    const weakText =
      profile.weakMuscles.length > 0
        ? `اولویت‌دهی به ${profile.weakMuscles.join(' و ')} در شروع جلسات تمرینی با تکنیک افزایش فشار هوشمند.`
        : 'رشد متقارن تمام گروه‌های عضلانی بالاتنه و پایین‌تنه با تقسیم حجم بهینه.';
    ctx.fillText(weakText, width - 90, bottomY + 140);

    // Column 3: Diet Tip
    ctx.font = '900 16px "Vazirmatn", sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('🥗 ساختار تغذیه و درشت‌مغذی‌ها:', width - 90, bottomY + 184);

    ctx.font = '500 14px "Vazirmatn", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(
      `${profile.mealsPerDay} وعده در روز • کربوهیدرات ${plan.summary.macroSplit.carbsGrams}g • چربی سالم ${plan.summary.macroSplit.fatGrams}g • ${profile.dietaryPreference}`,
      width - 90,
      bottomY + 212
    );

    // 8. Visual High-Impact Footer
    const footerY = 1480;
    ctx.strokeStyle = 'rgba(255, 107, 0, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, footerY);
    ctx.lineTo(width - 60, footerY);
    ctx.stroke();

    ctx.font = '900 18px "Vazirmatn", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('گُرد (GORD) | سامانه مربی‌گری هوش مصنوعی', width - 90, footerY + 45);

    ctx.font = '500 14px "Vazirmatn", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left';
    ctx.fillText('Designed by Coach GORD (گُرد) • Iranian Pahlavan & Clinical Nutrition Coach', 90, footerY + 45);

    // Convert Canvas to High Quality Image URL
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    setImageUrl(dataUrl);
    setIsGenerating(false);
  }, [plan, profile]);

  useEffect(() => {
    if (isOpen) {
      // Delay slightly for font loading
      const t = setTimeout(() => {
        generateCanvasImage();
      }, 100);
      return () => clearTimeout(t);
    }
  }, [isOpen, generateCanvasImage]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `gord-${profile.gender === 'female' ? 'female' : 'male'}-plan.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    if (!imageUrl) return;
    try {
      // Convert data URL to Blob for Web Share API
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], 'fitgen-workout-plan.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'برنامه اختصاصی فیت‌ژن من',
          text: `برنامه ورزشی و تغذیه اختصاصی من با هوش مصنوعی فیت‌ژن (${plan.workoutPlan.splitName})`,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } else {
        // Fallback to clipboard
        await handleCopyImage();
      }
    } catch (e) {
      console.warn('Share API failed or cancelled:', e);
      handleDownload();
    }
  };

  const handleCopyImage = async () => {
    if (!imageUrl) return;
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      if ((window as any).ClipboardItem && navigator.clipboard) {
        await navigator.clipboard.write([
          new (window as any).ClipboardItem({
            'image/png': blob,
          }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        handleDownload();
      }
    } catch (e) {
      console.warn('Clipboard write failed:', e);
      handleDownload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-glass border border-white/10 overflow-hidden relative">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30 shadow-glow">
              <Share2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                اشتراک و دانلود کارت خلاصه برنامه
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FF6B00]/20 text-[#FF6B00] font-mono font-bold">
                  CANVAS HD
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                تصویر باکیفیت و طراحی حرفه‌ای جهت اشتراک‌گذاری در اینستاگرام، تلگرام یا ذخیره در گالری
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl glass-input text-slate-400 hover:text-white transition-colors"
            title="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Image Preview */}
        <div className="p-5 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-black/30">
          {isGenerating ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl border-2 border-[#FF6B00] border-t-transparent animate-spin" />
              <div className="text-sm font-bold text-slate-200">در حال تولید تصویر با موتور Canvas...</div>
              <div className="text-xs text-slate-500">رندرینگ هایپرتروفی، درشت‌مغذی‌ها و چیدمان برنامه</div>
            </div>
          ) : imageUrl ? (
            <div className="w-full flex flex-col items-center gap-3">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl max-h-[58vh]">
                <img
                  src={imageUrl}
                  alt="کارت خلاصه برنامه تمرینی فیت‌ژن"
                  className="w-full h-auto object-contain max-h-[58vh] rounded-2xl"
                />
              </div>
              <span className="text-[11px] text-slate-400">
                وضوح تصویر: ۱۲۰۰ در ۱۶۰۰ پیکسل (فرمت PNG بدون افت کیفیت)
              </span>
            </div>
          ) : (
            <div className="py-12 text-slate-400 text-xs">خطا در تولید تصویر</div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyImage}
              disabled={isGenerating || !imageUrl}
              className="px-4 py-2.5 rounded-2xl glass-input text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'کپی شد!' : 'کپی تصویر'}</span>
            </button>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleShare}
                disabled={isGenerating || !imageUrl}
                className="px-4 py-2.5 rounded-2xl glass-input text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#FF6B00]" />
                <span>اشتراک‌گذاری مستقیم</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl glass-input text-slate-400 hover:text-slate-200 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              بستن
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating || !imageUrl}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-orange-400 hover:from-orange-500 hover:to-orange-400 text-black font-black text-xs flex items-center gap-2 shadow-glow transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[3]" />
              <span>دانلود تصویر (PNG)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
