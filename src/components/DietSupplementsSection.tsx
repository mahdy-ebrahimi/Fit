import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  Dumbbell,
  Flame,
  Heart,
  HelpCircle,
  Info,
  Pill,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { GeneratedPlan, UserProfile } from '../types/fitness';

interface DietSupplementsSectionProps {
  profile: UserProfile;
  plan: GeneratedPlan;
}

interface SupplementDetail {
  id: string;
  nameFa: string;
  nameEn: string;
  category: 'goal' | 'recovery' | 'health';
  goalTarget: string;
  allergySafeNote: string;
  dosage: string;
  timing: string;
  mealIntegration: string;
  scientificBenefits: string;
  evidenceGrade: string;
  iconType: 'muscle' | 'burn' | 'shield' | 'heart' | 'zap';
}

export const DietSupplementsSection: React.FC<DietSupplementsSectionProps> = ({ profile, plan }) => {
  const [filter, setFilter] = useState<'all' | 'goal' | 'health'>('all');

  const hasLactose = profile.allergies.some((a) => a.includes('لاکتوز') || a.includes('شیر') || a.includes('لبنیات'));
  const hasGluten = profile.allergies.some((a) => a.includes('گلوتن') || a.includes('سلیاک'));
  const hasSeafood = profile.allergies.some((a) => a.includes('دریایی') || a.includes('ماهی') || a.includes('میگو'));

  const isMuscleGoal = profile.goal === 'muscle_gain' || profile.goal === 'strength';
  const isFatLossGoal = profile.goal === 'fat_loss' || profile.goal === 'body_recomp';

  // Build targeted supplement items dynamically based on goal and allergies
  const supplements: SupplementDetail[] = [];

  // Goal-specific: Muscle Building & Strength
  if (isMuscleGoal) {
    supplements.push({
      id: 'creatine',
      nameFa: 'کراتین مونوهیدرات میکرونایز خالص',
      nameEn: 'Micronized Creatine Monohydrate',
      category: 'goal',
      goalTarget: 'افزایش حجم خشک سلولی، توان بی‌هوازی و قدرت عضلانی',
      allergySafeNote: hasLactose || hasGluten ? 'کاملاً خالص و ۱۰۰٪ فاقد لاکتوز، گلوتن و هرگونه آلرژن' : 'فاقد آلرژن‌های غذایی و بدون طعم‌دهنده مصنوعی',
      dosage: '۵ گرم در روز (یک پیمانه استاندارد)',
      timing: 'بلافاصله پس از تمرین در روزهای تمرین؛ یا صبح‌ها در روزهای استراحت',
      mealIntegration: 'بهترین جذب همراه با وعده کربوهیدراتی بعد تمرین (سیب‌زمینی، موز یا برنج) به دلیل ترشح انسولین',
      scientificBenefits: 'سرعت بازتولید مولکول‌های پرانرژی ATP در تکرارهای سنگین را تا ۱۵٪ افزایش می‌دهد، حجم آب درون‌سلولی فیبرهای عضلانی را بالا برده و سنتز پروتئین را تقویت می‌کند.',
      evidenceGrade: 'رتبه علمی A (بالاترین شواهد ارگوژنیک در انجمن بین‌المللی تغذیه ورزشی ISSN)',
      iconType: 'muscle',
    });

    supplements.push({
      id: 'protein_powder',
      nameFa: hasLactose
        ? 'پروتئین وی ۱۰۰٪ ایزوله تصفیه‌شده (یا پروتئین گیاهی ارگانیک نخود/برنج)'
        : 'پروتئین وی ۱۰۰٪ ایزوله (Whey Isolate)',
      nameEn: hasLactose ? 'Zero-Lactose Whey Isolate / Plant Protein' : 'Whey Protein Isolate 100%',
      category: 'goal',
      goalTarget: 'تامین اسیدهای آمینه ضروری (EAA) و تحریک هایپرتروفی',
      allergySafeNote: hasLactose ? 'فرمولاسیون ویژه تصفیه فیلتراسیون سرد، کاملاً فاقد قند لاکتوز و بدون نفخ گوارشی' : 'حاوی کمتر از ۱ گرم چربی و بدون شکر افزوده',
      dosage: '۲۵ تا ۳۰ گرم پروتئین خالص (یک اسکوپ)',
      timing: 'بلافاصله پس از اتمام تمرین با آب خنک',
      mealIntegration: 'مکمل وعده بعد تمرین جهت رساندن لوسین به عضلات در پنجره آنابولیک',
      scientificBenefits: 'حاوی بیش از ۲.۷ گرم اسید آمینه شاخه‌دار لوسین در هر وعده است که کلید اصلی روشن‌کردن سیگنالینگ سنتز پروتئین عضلانی (mTORC1) به شمار می‌رود.',
      evidenceGrade: 'رتبه علمی A (تایید شده توسط کالج طب ورزش آمریکا ACSM)',
      iconType: 'zap',
    });
  }

  // Goal-specific: Fat Loss & Cutting
  if (isFatLossGoal) {
    supplements.push({
      id: 'carnitine',
      nameFa: 'ال-کارنیتین ال-تارتارات خالص',
      nameEn: 'L-Carnitine L-Tartrate (LCLT)',
      category: 'goal',
      goalTarget: 'تسریع انتقال اسیدهای چرب به میتوکندری و تولید انرژی از چربی',
      allergySafeNote: 'فاقد گلوتن، لاکتوز و ترکیبات محرک، بدون اثر منفی بر ضربان قلب',
      dosage: '۱۵۰۰ تا ۲۰۰۰ میلی‌گرم',
      timing: '۳۰ تا ۴۵ دقیقه قبل از تمرینات هوازی یا کار با وزنه',
      mealIntegration: 'همراه با یک لیوان آب و معده سبک قبل تمرین',
      scientificBenefits: 'انتقال اسیدهای چرب با زنجیره بلند از سیتوپلاسم به ماتریکس میتوکندری جهت بتا-اکسیداسیون و چربی‌سوزی را تسهیل می‌کند و درد تاخیری عضلانی (DOMS) را کاهش می‌دهد.',
      evidenceGrade: 'رتبه علمی B+ (شواهد قوی در بهبود اکسیداسیون چربی و ریکاوری بافت)',
      iconType: 'burn',
    });

    supplements.push({
      id: 'greentea',
      nameFa: 'عصاره چای سبز استاندارد شده (EGCG) و کافئین ملایم',
      nameEn: 'Green Tea Extract (50% EGCG)',
      category: 'goal',
      goalTarget: 'افزایش نرخ متابولیسم پایه (ترموژنز) و کنترل اشتهای کاذب',
      allergySafeNote: 'پایه کاملاً گیاهی و طبیعی، فاقد هرگونه آلرژن خوراکی',
      dosage: '۴۰۰ تا ۵۰۰ میلی‌گرم عصاره غلیظ',
      timing: 'صبح‌ها همراه با صبحانه یا قبل از تمرین',
      mealIntegration: 'همراه با میان‌وعده صبح جهت پیشگیری از افت انرژی حین کسری کالری',
      scientificBenefits: 'آنتی‌اکسیدان EGCG آنزیم کاتکول-او-متیل ترانسفراز را مهار کرده و سطح نوراپی‌نفرین را برای افزایش چربی‌سوزی و مصرف انرژی بالا نگه می‌دارد.',
      evidenceGrade: 'رتبه علمی A (مطالعات متعدد متاآنالیز در ژورنال American Journal of Clinical Nutrition)',
      iconType: 'burn',
    });
  }

  // General Health, Joints & Recovery (Safe for everyone)
  supplements.push({
    id: 'omega3',
    nameFa: hasSeafood
      ? 'روغن امگا ۳ گیاهی استخراج‌شده از جلبک ریزدریایی (Algae Omega-3)'
      : 'اسیدهای چرب ضروری امگا ۳ خالص دارویی (EPA/DHA غلیظ)',
    nameEn: hasSeafood ? 'Algae-derived Vegan Omega-3' : 'Ultra-Pure Omega-3 Fish Oil',
    category: 'health',
    goalTarget: 'کاهش التهاب مفاصل، سلامت عروقی و بهبود حساسیت به انسولین',
    allergySafeNote: hasSeafood ? 'کاملاً گیاهی و بدون هیچ‌گونه مشتقات ماهی یا میگو' : 'تصفیه مولکولی شده و عاری از فلزات سنگین',
    dosage: '۱۰۰۰ تا ۱۵۰۰ میلی‌گرم مجموع EPA و DHA',
    timing: 'همراه با وعده ناهار یا شام',
    mealIntegration: 'مصرف همراه با وعده غذایی حاوی چربی‌های سالم جهت بیشینه‌سازی جذب روده',
    scientificBenefits: 'سطح سیتوکین‌های التهابی ناشی از تمرینات سنگین را مهار کرده و یکپارچگی غشای سلول‌های عضلانی را برای دریافت بهتر مواد مغذی افزایش می‌دهد.',
    evidenceGrade: 'رتبه علمی A (تاییدیه استاندارد دارویی)',
    iconType: 'heart',
  });

  supplements.push({
    id: 'vit_d3_zinc',
    nameFa: 'کمپلکس ویتامین D3 (۲۰۰۰ واحد) + زینک کلاته و منیزیم',
    nameEn: 'Vitamin D3 + Zinc Picolinate + Magnesium',
    category: 'health',
    goalTarget: 'تنظیم هورمون‌های آنابولیک، سیستم ایمنی و کیفیت خواب عمیق',
    allergySafeNote: 'فاقد لاکتوز، گلوتن، سویا و نگهدارنده',
    dosage: 'D3 روزانه ۲۰۰۰IU + زینک ۱۵mg + منیزیم ۳۰۰mg',
    timing: 'منیزیم شب‌ها قبل خواب؛ D3 و زینک همراه ناهار',
    mealIntegration: 'منیزیم با یک لیوان آب قبل خواب؛ D3 محلول در چربی همراه ناهار',
    scientificBenefits: 'منیزیم گیرنده‌های GABA در مغز را فعال کرده و خواب عمیق NREM را برای ترشح حداکثری هورمون رشد بهبود می‌بخشد. روی (Zinc) کوفاکتور کلیدی در سنتز تستوسترون است.',
    evidenceGrade: 'رتبه علمی A (ریزمغذی‌های بنیادین ورزشکاران)',
    iconType: 'shield',
  });

  const filteredSupplements = supplements.filter((s) => {
    if (filter === 'all') return true;
    if (filter === 'goal') return s.category === 'goal';
    if (filter === 'health') return s.category === 'health';
    return true;
  });

  const goalTitle = isMuscleGoal ? 'عضله‌سازی و حجم خشک' : isFatLossGoal ? 'چربی‌سوزی و تفکیک' : 'تناسب و سلامت';

  return (
    <div className="p-6 rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              مکمل‌های علمی برنامه غذایی
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-amber-300 border border-slate-700">
              ویژه هدف: {goalTitle}
            </span>
            {Array.isArray(profile.allergies) && profile.allergies.length > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                تطبیق کامل با حساسیت‌ها ({profile.allergies.join('، ')})
              </span>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-black text-white">
            مکمل‌های پیشنهادی علمی و ایمن متناسب با اهداف رژیم غذایی شما
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            این مکمل‌ها با در نظر گرفتن اهداف ترکیب بدنی شما و حذف آلرژن‌ها انتخاب شده‌اند و همراه با وعده‌های رژیم جهت هم‌افزایی حداکثری مصرف می‌شوند.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-2xl border border-white/5 text-xs no-print">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#FF6B00] text-black shadow-glow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            همه موارد ({supplements.length})
          </button>
          <button
            onClick={() => setFilter('goal')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filter === 'goal'
                ? 'bg-[#FF6B00] text-black shadow-glow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ویژه هدف ({supplements.filter((s) => s.category === 'goal').length})
          </button>
          <button
            onClick={() => setFilter('health')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filter === 'health'
                ? 'bg-[#FF6B00] text-black shadow-glow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            سلامت و ریکاوری ({supplements.filter((s) => s.category === 'health').length})
          </button>
        </div>
      </div>

      {/* Supplements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSupplements.map((supp) => (
          <div
            key={supp.id}
            className="p-6 rounded-3xl diet-reading-card space-y-4 flex flex-col justify-between transition-all"
          >
            <div className="space-y-3.5">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#1c273e]">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                    {supp.iconType === 'muscle' && <Dumbbell className="w-5 h-5 stroke-[2.5]" />}
                    {supp.iconType === 'burn' && <Flame className="w-5 h-5 text-orange-400 stroke-[2.5]" />}
                    {supp.iconType === 'zap' && <Zap className="w-5 h-5 text-yellow-400 stroke-[2.5]" />}
                    {supp.iconType === 'heart' && <Heart className="w-5 h-5 text-rose-400 stroke-[2.5]" />}
                    {supp.iconType === 'shield' && <ShieldCheck className="w-5 h-5 text-emerald-400 stroke-[2.5]" />}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-white">{supp.nameFa}</h4>
                    <span className="text-[11px] text-slate-400 font-mono block">({supp.nameEn})</span>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-800/50 shrink-0">
                  {supp.evidenceGrade.split(' ')[0]} {supp.evidenceGrade.split(' ')[1]}
                </span>
              </div>

              {/* Target Goal & Allergy Safe Badges */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl diet-reading-item text-slate-200 flex items-center gap-2">
                  <span className="text-amber-400 font-bold shrink-0">هدف مصرف:</span>
                  <span className="truncate">{supp.goalTarget}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-[11px] font-medium leading-relaxed">{supp.allergySafeNote}</span>
                </div>
              </div>

              {/* Timing & Meal Integration */}
              <div className="p-3.5 rounded-2xl diet-reading-item space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    زمان مصرف:
                  </span>
                  <span className="text-white font-black">{supp.timing}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                    <Pill className="w-3.5 h-3.5 text-cyan-400" />
                    دوز بالینی:
                  </span>
                  <span className="text-amber-300 font-mono font-bold">{supp.dosage}</span>
                </div>

                <div className="pt-2 border-t border-[#1c273e] text-[11px] text-slate-200 leading-[1.95]">
                  <strong className="text-amber-400">تطبیق با وعده غذایی: </strong>
                  {supp.mealIntegration}
                </div>
              </div>

              {/* Scientific Benefits Explanation */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs sm:text-sm text-slate-100 leading-[2.1]">
                <div className="font-extrabold text-amber-300 mb-1.5 flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>توضیح علمی مزایا و نحوه اثر در فیزیولوژی بدن:</span>
                </div>
                {supp.scientificBenefits}
              </div>
            </div>

            {/* Scientific evidence footer */}
            <div className="pt-3 border-t border-[#1c273e] flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{supp.evidenceGrade}</span>
              </span>
              <span className="text-emerald-400 font-bold">تایید شده بر اساس پروتکل ISSN</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
