import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dumbbell,
  Eye,
  FastForward,
  Flame,
  Info,
  Layers,
  Pause,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Wind,
  X,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Exercise } from '../types/fitness';
import { ExerciseWeightLogger } from './ExerciseWeightLogger';

interface ExerciseAnimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
  onSkip?: () => void;
  onStartSet?: () => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  prevExerciseName?: string;
  nextExerciseName?: string;
}

export const ExerciseAnimationModal: React.FC<ExerciseAnimationModalProps> = ({
  isOpen,
  onClose,
  exercise,
  onSkip,
  onStartSet,
  onNavigatePrev,
  onNavigateNext,
  prevExerciseName,
  nextExerciseName,
}) => {
  if (!isOpen || !exercise) return null;

  const [activeTab, setActiveTab] = useState<'simulator' | 'checklist' | 'mistakes' | 'weightLog'>('simulator');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1); // 0.6x (slow biomechanics), 1x (standard), 1.4x (fast)
  const [timerTick, setTimerTick] = useState<number>(0);
  const [manualPhase, setManualPhase] = useState<'auto' | 'start' | 'stretch' | 'peak'>('auto');

  // Animation cycle loop
  useEffect(() => {
    if (!isPlaying || manualPhase !== 'auto') return;
    const intervalTime = speed === 1 ? 40 : speed === 0.6 ? 65 : 28;
    const timer = setInterval(() => {
      setTimerTick((prev) => (prev + 1) % 100);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, speed, manualPhase]);

  // Determine motion phase & progress (0 to 1)
  let progress = 0;
  let phaseName = 'فاز انقباض کانسنتریک (بالا بردن)';
  let breathingText = 'بازدم قدرتی (تخلیه نفس)';
  let breathingIsExhale = true;

  if (manualPhase === 'start') {
    progress = 0;
    phaseName = 'وضعیت شروع و استقرار اسکلتی';
    breathingText = 'تنفس آماده‌سازی و مهار شکمی';
    breathingIsExhale = false;
  } else if (manualPhase === 'stretch') {
    progress = 0.95;
    phaseName = 'فاز اکسنتریک (کشش عمیق عضله)';
    breathingText = 'دم عمیق شکمی (حفظ اکسیژن)';
    breathingIsExhale = false;
  } else if (manualPhase === 'peak') {
    progress = 0.05;
    phaseName = 'اوج انقباض ایزومتریک (Peak Contraction)';
    breathingText = 'تخلیه کامل بازدم و سفت کردن عضله';
    breathingIsExhale = true;
  } else {
    if (timerTick < 45) {
      progress = timerTick / 45;
      phaseName = 'فاز اکسنتریک / منفی (پایین بردن با کنترل)';
      breathingText = 'دم عمیق دیافراگمی (تثبیت قفسه سینه)';
      breathingIsExhale = false;
    } else if (timerTick < 55) {
      progress = 1.0;
      phaseName = 'نقطه عطف بیومکانیکی (کشش بدون رهاسازی مفصل)';
      breathingText = 'نگه‌داشتن تنفس برای جلوگیری از لرزش ستون فقرات';
      breathingIsExhale = false;
    } else if (timerTick < 90) {
      progress = 1 - (timerTick - 55) / 35;
      phaseName = 'فاز صعودی کانسنتریک (انقباض هدفمند)';
      breathingText = 'بازدم قدرتی با عبور از نقطه گیر (Sticking Point)';
      breathingIsExhale = true;
    } else {
      progress = 0.0;
      phaseName = 'اوج انقباض عضلانی و مکث ایزومتریک';
      breathingText = 'تخلیه هوای باقیمانده و آماده‌سازی تکرار بعد';
      breathingIsExhale = true;
    }
  }

  // Detect Movement Category for Biomechanical Engine
  const exName = (exercise.nameFa + ' ' + (exercise.nameEn || '')).toLowerCase();
  let category: 'bench_press' | 'incline_press' | 'lat_pulldown' | 'row' | 'squat' | 'leg_press' | 'lateral_raise' | 'biceps_curl' | 'triceps_pushdown' | 'core_plank' = 'bench_press';

  if (exName.includes('بالا سینه') || exName.includes('incline')) {
    category = 'incline_press';
  } else if (exName.includes('سینه') || exName.includes('پرس') || exName.includes('شنا') || exName.includes('bench') || exName.includes('chest')) {
    category = 'bench_press';
  } else if (exName.includes('لت') || exName.includes('زیربغل سیمکش') || exName.includes('lat') || exName.includes('pulldown') || exName.includes('بارفیکس')) {
    category = 'lat_pulldown';
  } else if (exName.includes('قایقی') || exName.includes('روینگ') || exName.includes('هالتر خم') || exName.includes('دمبل خم') || exName.includes('row')) {
    category = 'row';
  } else if (exName.includes('اسکات') || exName.includes('squat')) {
    category = 'squat';
  } else if (exName.includes('پرس پا') || exName.includes('leg press') || exName.includes('هاگ')) {
    category = 'leg_press';
  } else if (exName.includes('نشر') || exName.includes('سرشانه') || exName.includes('lateral') || exName.includes('shoulder')) {
    category = 'lateral_raise';
  } else if (exName.includes('جلو بازو') || exName.includes('biceps') || exName.includes('curl')) {
    category = 'biceps_curl';
  } else if (exName.includes('پشت بازو') || exName.includes('triceps') || exName.includes('دیپ') || exName.includes('پوش داون')) {
    category = 'triceps_pushdown';
  } else if (exName.includes('پلانک') || exName.includes('شکم') || exName.includes('کرانچ') || exName.includes('core')) {
    category = 'core_plank';
  }

  // Form Checklist Map
  const formChecklistMap: Record<string, { title: string; desc: string; cue: string }[]> = {
    bench_press: [
      { title: 'جمع کردن و قفل کتف‌ها (Scapular Retraction)', desc: 'کتف‌ها را به سمت هم جمع کرده و به تشک بچسبانید تا مفصل شانه محافظت شود.', cue: 'شانه را از گوش دور کنید' },
      { title: 'زاویه ۴۵ تا ۶۰ درجه آرنج‌ها', desc: 'از باز کردن آرنج‌ها به زاویه ۹۰ درجه خودداری کنید تا از سندروم گیرافتادگی تاندون شانه پیشگیری شود.', cue: 'آرنج‌ها زاویه فلش مانند بسازند' },
      { title: 'فاز منفی ۳ ثانیه‌ای با کنترل', desc: 'میله را روی سینه پرتاب نکنید؛ میله را آرام و با درگیری عضله تا استخوان جناغ پایین بیاورید.', cue: 'لمس نرم استخوان جناغ' },
      { title: 'پرس صعودی بدون قفل کردن مفصل آرنج', desc: 'در بالاترین نقطه، آرنج‌ها را با ضربه قفل نکنید تا تنش مداوم روی عضلات سینه حفظ شود.', cue: 'فشار از پاشنه دست‌ها' },
    ],
    incline_press: [
      { title: 'تنظیم زاویه میز (Incline Angle)', desc: 'زاویه میز را بین ۳۰ تا ۴۵ درجه تنظیم کنید. زوایای تندتر فشار را از بالاسینه به سرشانه جلویی منتقل می‌کنند.', cue: 'زاویه ۳۰ درجه ایده‌آل‌ترین برای بالاسینه' },
      { title: 'پایدار کردن پاها و لگن', desc: 'کف پاها محکم روی زمین قفل شده و باسن از روی نشیمن‌گاه بلند نشود.', cue: 'پل زدن بیش از حد قوس کمر را ممنوع کنید' },
      { title: 'کشش کنترل‌شده بالاسینه', desc: 'دمبل‌ها یا میله تا نزدیکی استخوان ترقوه پایین آید و کشش عضلانی احساس شود.', cue: 'دم عمیق حین پایین آمدن' },
      { title: 'فشار با انقباض تار‌های ترقوه‌ای', desc: 'با تمرکز بر جمع کردن بازوها به سمت داخل، انقباض عمیق در بالای سینه ایجاد کنید.', cue: 'مکث ۱ ثانیه‌ای در انتهای تکرار' },
    ],
    lat_pulldown: [
      { title: 'تنظیم تشک ران‌ها (Thigh Pad)', desc: 'پد پا را طوری محکم کنید که زانوها تحت زاویه ۹۰ درجه قفل شوند و بدن از صندلی کنده نشود.', cue: 'کمر کاملاً صاف و کمی تمایل به عقب (۱۰ درجه)' },
      { title: 'پیش‌انقباض کتف‌ها (Scapular Depression)', desc: 'قبل از خم کردن آرنج‌ها، ابتدا کتف‌ها را به سمت پایین بکشید.', cue: 'فکر کنید می‌خواهید شانه‌ها را از گوش‌ها دور کنید' },
      { title: 'کشیدن میله با آرنج‌ها (Elbow Drive)', desc: 'میله را با نیروی آرنج‌ها به سمت استخوان جناغ سینه هدایت کنید، نه با کشش دست و مچ.', cue: 'سینه را بالا نگه دارید و به میله برسانید' },
      { title: 'کشش منفی و بازگشت آرام', desc: 'در برگشت، اجازه دهید عضلات لت کش بیایند اما تنه را به جلو پرتاب نکنید.', cue: 'فاز منفی ۲ تا ۳ ثانیه طول بکشد' },
    ],
    row: [
      { title: 'حفظ انحنای طبیعی ستون فقرات', desc: 'کمر کاملاً صاف و فیله‌ها منقبض باشند تا هیچ فشاری به دیسک مهره‌های کمری وارد نشود.', cue: 'سینه بیرون، شکم منقبض و سفت' },
      { title: 'مسیر کشش به سمت ناف', desc: 'دسته یا هالتر را به سمت زیر شکم و ناف بکشید تا بیشترین فعال‌سازی در لت‌ها ایجاد شود.', cue: 'آرنج‌ها چسبیده به پهلو حرکت کنند' },
      { title: 'انقباض رومبوئیدها و عضلات پشتی', desc: 'در اوج حرکت، کتف‌ها را از پشت به هم بچسبانید و ۱ ثانیه مکث کنید.', cue: 'تصور کنید گردویی بین دو کتف شما قرار دارد' },
      { title: 'کنترل وزن بدون تاب دادن تنه', desc: 'از تاب دادن بالا‌تنه یا مومنتوم خودداری کنید؛ تمام نیرو باید از عضلات پشت تامین شود.', cue: 'بدن در تمام دامنه ثابت بماند' },
    ],
    squat: [
      { title: 'استقرار پاها و فاصله عرض شانه', desc: 'پاها به اندازه عرض شانه با زاویه ۱۰ تا ۲۰ درجه مایل به بیرون قرار گیرند.', cue: 'وزن بدن بر سه نقطه کف پا (مثلث تعادل) توزیع شود' },
      { title: 'شروع حرکت با شکستن باسن (Hip Hinge)', desc: 'ابتدا باسن را کمی به عقب داده و همزمان زانوها را به سمت بیرون هدایت کنید.', cue: 'زانوها در راستای نوک انگشتان پا خم شوند' },
      { title: 'عمق دامنه استاندارد و امن', desc: 'تا نقطه‌ای پایین بروید که ران‌ها موازی با زمین شوند بدون اینکه لگن دچار پیچش (Butt Wink) شود.', cue: 'کمر صاف و نگاه مستقیم به جلو' },
      { title: 'فشار از پاشنه و بازدم صعودی', desc: 'با فشار پاشنه‌ها و انقباض چهارسر و باسن بالا آمده و در اوج باسن را منقبض کنید.', cue: 'بدون قفل ناگهانی مفصل زانو' },
    ],
    leg_press: [
      { title: 'چسبیدن کامل باسن و کمر به صندلی', desc: 'هرگز اجازه ندهید باسن در انتهای فاز پایین آمدن از تشک جدا شود چون به دیسک L4-L5 فشار می‌آورد.', cue: 'دسته‌ها را محکم بگیرید تا بالاتنه قفل بماند' },
      { title: 'قرارگیری پاها روی صفحه', desc: 'پاها در میانه صفحه به اندازه عرض شانه قرار گیرند (برای درگیری چهارسر ران).', cue: 'زانوها در مسیر برگشت به سمت داخل جمع نشوند' },
      { title: 'زاویه ۹۰ درجه در زانو', desc: 'صفحه را تا رسیدن زانو به زاویه ۹۰ درجه با کنترل پایین بیاورید.', cue: 'سرعت فرود آرام و بدون ضربه' },
      { title: 'صعود بدون قفل کردن زانو', desc: 'در بالاترین نقطه، زانوها را کاملاً صاف و قفل نکنید؛ همیشه یک انحنای میلی‌متری محافظتی حفظ شود.', cue: 'حفظ تنش مداوم روی عضلات چهارسر' },
    ],
    lateral_raise: [
      { title: 'تراز آرنج و مچ دست', desc: 'آرنج‌ها باید همیشه کمی بالاتر از مچ دست باشند؛ تصور کنید در حال ریختن پارچ آب هستید.', cue: 'شست کمی متمایل به پایین' },
      { title: 'مسیر حرکت در صفحه کتف (Scaption)', desc: 'دست‌ها نه کاملاً از کنار، بلکه حدود ۱۵ تا ۲۰ درجه جلوتر از خط پهلو بالا بیایند.', cue: 'جلوگیری از ساییدگی تاندون فوق‌خاری' },
      { title: 'توقف در موازات شانه', desc: 'دست‌ها را بالاتر از خط افقی شانه نبرید تا فشار به کول و عضله ذوزنقه منتقل نشود.', cue: 'مکث نیم ثانیه‌ای در اوج ارتفاع' },
      { title: 'حذف تکان دادن بدن', desc: 'زانوهارا کمی خم کرده و تنه را کاملاً ثابت نگه دارید؛ وزنه‌های سبک‌تر با اجرای ایزوله موثرترند.', cue: 'آرام پایین بردن در ۳ ثانیه' },
    ],
    biceps_curl: [
      { title: 'تثبیت آرنج‌ها در کنار پهلو', desc: 'آرنج‌ها مانند لولا در کنار بدن قفل شوند و با بالا آمدن وزنه به جلو حرکت نکنند.', cue: 'جلو آوردن آرنج فشار را از بازو به سرشانه می‌دهد' },
      { title: 'چرخش مچ دست (Supination)', desc: 'حین بالا آوردن دمبل، مچ را به بیرون بچرخانید تا انقباض هر دو سر بازویی کامل شود.', cue: 'انگشت کوچک در اوج بالاتر از شست قرار گیرد' },
      { title: 'کشش کامل در پایین‌ترین نقطه', desc: 'دست را تا انتها باز کنید تا کشش کامل بافت عضلانی محقق شود اما بدون شل کردن کنترل.', cue: '۱ ثانیه انقباض ایزومتریک در بالای حرکت' },
      { title: 'پرهیز از پرتاب وزنه به عقب', desc: 'هیچ‌گونه قوس دادن به کمر یا تاب دادن بالاتنه مجاز نیست.', cue: 'اگر کمرتان تکان می‌خورد وزنه را سبک کنید' },
    ],
    triceps_pushdown: [
      { title: 'موقعیت آرنج چسبیده به دنده‌ها', desc: 'آرنج‌ها در تمام طول حرکت ثابت و چسبیده به دنده‌ها باقی می‌مانند.', cue: 'فقط ساعدها باز و بسته می‌شوند' },
      { title: 'قفل انقباضی در پایین‌ترین نقطه', desc: 'طناب یا میله را تا انتهای دامنه صاف کنید و طناب را در انتها به طرفین باز کنید.', cue: 'مکث ۱ ثانیه‌ای برای سر جانبی پشت بازو' },
      { title: 'بالا آمدن ساعد تا زاویه ۹۰ درجه', desc: 'در فاز منفی، اجازه دهید ساعد تا سینه یا زاویه ۹۰ درجه بالا آید تا کشش کامل شود.', cue: 'آرنج‌ها به جلو حرکت نکنند' },
      { title: 'مچ‌ها در راستای ساعد', desc: 'مچ دست‌ها نباید خم شوند؛ مچ‌ها را در راستای محکم و مستقیم ساعد قفل نگه دارید.', cue: 'تنفس روان و منظم' },
    ],
    core_plank: [
      { title: 'تراز مستقیم سر، ستون فقرات و باسن', desc: 'بدن باید مانند خط‌کش صاف باشد؛ نه باسن را بالا بدهید و نه کمر را آویزان رها کنید.', cue: 'نگاه مستقیم به زمین بین دست‌ها' },
      { title: 'انقباض شکم و باسن (Posterior Pelvic Tilt)', desc: 'باسن را منقبض کرده و ناف را به سمت ستون فقرات داخل بکشید.', cue: 'فعال‌سازی عمیق عضله عرضی شکم' },
      { title: 'فشار ساعدها به زمین', desc: 'شانه‌ها را فعال نگه دارید و نگذارید استخوان‌های کتف در پشت جمع و گود شوند.', cue: 'تنفس مداوم و بدون حبس هوا' },
      { title: 'توزیع فشار در کل زنجیره خلفی', desc: 'عضلات چهارسر و ران‌ها را سفت منقبض کنید تا فشار بین کل بدن تقسیم شود.', cue: 'توقف بلافاصله پس از احساس افت در گودی کمر' },
    ],
  };

  const currentChecklist = formChecklistMap[category] || formChecklistMap['bench_press'];

  // Critical Mistakes
  const mistakesMap: Record<string, { mistake: string; danger: string; solution: string }[]> = {
    bench_press: [
      { mistake: 'باز کردن آرنج‌ها با زاویه ۹۰ درجه (Flare)', danger: 'سندروم گیرافتادگی تاندون شانه و پارگی روتاتور کاف', solution: 'آرنج‌ها را به زاویه ۴۵ تا ۶۰ درجه نسبت به پهلوها نزدیک کنید.' },
      { mistake: 'پرتاب کردن میله روی استخوان سینه (Bounce)', danger: 'شکستگی ترقوه و استخوان جناغ و آسیب مفصل مچ', solution: 'میله را با کنترل ۳ ثانیه‌ای پایین آورید و روی سینه لمس نرم داشته باشید.' },
      { mistake: 'بلند کردن باسن از روی میز پرس', danger: 'فشار مخرب روی مهره‌های کمری L5-S1 و ابطال بیومکانیک حرکت', solution: 'باسن و شانه‌ها همیشه چسبیده به تشک باشند؛ نیرو را از کف پاها بگیرید.' },
    ],
    lat_pulldown: [
      { mistake: 'کشیدن میله به پشت گردن', danger: 'آسیب شدید به مهره‌های گردن C6-C7 و کشیدگی غیرعادی کپسول شانه', solution: 'میله همیشه از جلو تا استخوان جناغ سینه پایین کشیده شود.' },
      { mistake: 'پرتاب کردن بالاتنه به عقب حین کشش', danger: 'کاهش فعال‌سازی عضلات لت و تبدیل حرکت به قایقی پرفشار روی فیله کمر', solution: 'بالاتنه حداکثر ۱۰ درجه تمایل به عقب داشته باشد و کاملاً قفل بماند.' },
      { mistake: 'استفاده صرف از ساعد و مچ', danger: 'خستگی زودرس عضلات ساعد قبل از تحریک واقعی لت‌ها', solution: 'از گیره قلابی (Hook Grip) استفاده کنید و کشیدن را از آرنج آغاز نمایید.' },
    ],
    squat: [
      { mistake: 'جلو رفتن بیش از حد زانوها بدون نشستن باسن', danger: 'فشار برشی شدید بر تاندون کشکک و مینیسک زانو', solution: 'حرکت را با بردن باسن به سمت عقب آغاز کنید و وزن را روی پاشنه‌ها حفظ نمایید.' },
      { mistake: 'گرد شدن کمر در پایین‌ترین نقطه (Butt Wink)', danger: 'بیرون‌زدگی و پارگی دیسک مهره‌های کمری', solution: 'عمق اسکات را تا جایی که انحنای کمر حفظ می‌شود محدود کرده و موبیلیتی مچ را تقویت کنید.' },
      { mistake: 'جمع شدن زانوها به سمت داخل (Knee Valgus)', danger: 'پارگی رباط صلیبی قدامی (ACL) و تخریب غضروف زانو', solution: 'زانوها را در تمام طول حرکت به سمت جهت انگشتان پا به بیرون برانید.' },
    ],
    biceps_curl: [
      { mistake: 'تاب دادن تنه و استفاده از شتاب وزنه', danger: 'فشار بر دیسک‌های کمری و صفر شدن فعال‌سازی جلو بازو', solution: 'پشت به دیوار بایستید یا زانوها را کمی خم کرده و فقط با انقباض بازو بالا آورید.' },
      { mistake: 'جلو آوردن آرنج‌ها در انتهای حرکت', danger: 'انتقال فشار از جلو بازو به دلتوئید قدامی (سرشانه)', solution: 'آرنج‌ها را به پهلو بچسبانید و نگذارید به سمت جلو تاب بخورند.' },
    ],
  };

  const currentMistakes = mistakesMap[category] || mistakesMap['bench_press'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn no-print overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="glass-panel rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-glass space-y-4 max-h-[94vh] flex flex-col justify-between"
      >
        {/* MODAL HEADER WITH EXERCISE PREV/NEXT NAVIGATION */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B00] flex items-center justify-center text-black font-black shadow-glow shrink-0">
              <Dumbbell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">{exercise.nameFa}</h3>
                <span className="text-xs text-slate-400 font-mono">({exercise.nameEn})</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                <span>عضله هدف: <strong className="text-[#FF6B00]">{exercise.targetMuscle}</strong></span>
                <span>•</span>
                <span>توصیه ست: <strong className="text-white">{exercise.sets} ست × {exercise.reps}</strong></span>
              </div>
            </div>
          </div>

          {/* Navigation Between Exercises Buttons */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            {onNavigatePrev && (
              <button
                type="button"
                onClick={onNavigatePrev}
                className="px-2.5 py-1.5 rounded-xl glass-input text-slate-300 hover:text-white flex items-center gap-1 text-xs font-bold transition-all active:scale-95"
                title={prevExerciseName ? `حرکت قبلی: ${prevExerciseName}` : 'حرکت قبل'}
              >
                <ChevronRight className="w-4 h-4 text-[#FF6B00] stroke-[3]" />
                <span className="hidden xs:inline">حرکت قبل</span>
              </button>
            )}

            {onNavigateNext && (
              <button
                type="button"
                onClick={onNavigateNext}
                className="px-2.5 py-1.5 rounded-xl glass-input text-slate-300 hover:text-white flex items-center gap-1 text-xs font-bold transition-all active:scale-95"
                title={nextExerciseName ? `حرکت بعدی: ${nextExerciseName}` : 'حرکت بعد'}
              >
                <span className="hidden xs:inline">حرکت بعد</span>
                <ChevronLeft className="w-4 h-4 text-[#FF6B00] stroke-[3]" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl glass-input text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/5 rounded-2xl text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'bg-[#FF6B00] text-black shadow-glow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>شبیه‌ساز آناتومی و اجرای حرکت</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'checklist'
                ? 'bg-[#FF6B00] text-black shadow-glow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>چک‌لیست بیومکانیک</span>
          </button>

          <button
            onClick={() => setActiveTab('mistakes')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'mistakes'
                ? 'bg-rose-500 text-white shadow-glow-red font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>اشتباهات خطرناک</span>
          </button>

          <button
            onClick={() => setActiveTab('weightLog')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'weightLog'
                ? 'bg-[#FF6B00] text-black shadow-glow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>ثبت وزنه‌ها و تکرارها</span>
          </button>
        </div>

        {/* TAB 1: KINEMATIC SIMULATOR WITH FRAMER MOTION */}
        {activeTab === 'simulator' && (
          <div className="space-y-4">
            {/* Visual Canvas Area */}
            <div className="relative rounded-3xl bg-gradient-to-b from-[#070b14] via-[#0d1424] to-[#070b14] border border-[#1e2a42] p-5 flex flex-col items-center justify-center min-h-[300px] overflow-hidden shadow-inner">
              {/* Background Biomechanical Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415518_1px,transparent_1px),linear-gradient(to_bottom,#33415518_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

              {/* Status Header Overlay */}
              <div className="absolute top-3 inset-x-4 flex items-center justify-between z-10 text-xs">
                <span className="px-3 py-1 rounded-xl bg-[#090e1a]/90 border border-[#1e2a42] text-amber-300 font-extrabold flex items-center gap-1.5 shadow-md">
                  <motion.span
                    animate={{ scale: [1, 1.35, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className={`w-2 h-2 rounded-full ${breathingIsExhale ? 'bg-amber-400' : 'bg-cyan-400'}`}
                  />
                  {phaseName}
                </span>

                {/* Breathing Diaphragm Gauge */}
                <div className="px-3 py-1 rounded-xl bg-[#090e1a]/90 border border-[#1e2a42] text-cyan-300 font-bold flex items-center gap-2 shadow-md">
                  <motion.div
                    animate={{ scale: breathingIsExhale ? [1.25, 0.9] : [0.9, 1.25] }}
                    transition={{ duration: speed === 0.6 ? 2.8 : 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-3 h-3 rounded-full bg-cyan-400 flex items-center justify-center"
                  />
                  <span className="text-[11px]">{breathingText}</span>
                </div>
              </div>

              {/* HIGH FIDELITY BIOMECHANICAL VECTOR SIMULATOR WITH MOTION */}
              <div className="w-full max-w-[290px] h-[225px] flex items-center justify-center my-3 relative">
                <svg className="w-full h-full" viewBox="0 0 240 200">
                  {/* Ground reference */}
                  <line x1="20" y1="180" x2="220" y2="180" stroke="#1e2a42" strokeWidth="3" strokeDasharray="4 4" />

                  {/* SQUAT / LEG MOVEMENTS SIMULATION */}
                  {(category === 'squat' || category === 'leg_press') && (() => {
                    const hipY = 115 + progress * 35;
                    const kneeX = 90 + progress * 24;
                    const kneeY = 145 + progress * 10;
                    const chestX = 115 - progress * 15;
                    const chestY = hipY - 45;
                    const headY = chestY - 20;

                    return (
                      <g className="transition-all duration-75">
                        <line x1={chestX} y1="30" x2={chestX} y2="170" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
                        <line x1={chestX - 45} y1={chestY} x2={chestX + 45} y2={chestY} stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
                        <rect x={chestX - 45} y={chestY - 14} width="10" height="28" rx="2" fill="#ea580c" />
                        <rect x={chestX + 35} y={chestY - 14} width="10" height="28" rx="2" fill="#ea580c" />
                        <circle cx={chestX} cy={headY} r="12" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
                        <circle cx={chestX + 6} cy={headY - 2} r="2" fill="#0f172a" />
                        <line x1={chestX} y1={chestY} x2="115" y2={hipY} stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
                        
                        {/* Muscle Highlight with Motion Pulse */}
                        <line
                          x1="115"
                          y1={hipY}
                          x2={kneeX}
                          y2={kneeY}
                          stroke="#f43f5e"
                          strokeWidth="10"
                          strokeLinecap="round"
                          className={progress < 0.25 ? 'filter drop-shadow-[0_0_10px_#f43f5e]' : ''}
                        />

                        <circle cx={kneeX} cy={kneeY} r="5" fill="#f59e0b" />
                        <text x={kneeX + 8} y={kneeY} fill="#f59e0b" fontSize="9" fontWeight="bold">
                          {Math.round(85 + (1 - progress) * 80)}°
                        </text>
                        <line x1={kneeX} y1={kneeY} x2="110" y2="180" stroke="#e2e8f0" strokeWidth="7" strokeLinecap="round" />
                        <line x1="95" y1="180" x2="135" y2="180" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
                      </g>
                    );
                  })()}

                  {/* BENCH PRESS & INCLINE PRESS SIMULATION */}
                  {(category === 'bench_press' || category === 'incline_press') && (() => {
                    const isIncline = category === 'incline_press';
                    const barY = (isIncline ? 60 : 70) + progress * 45;
                    const elbowX = (isIncline ? 90 : 95) + progress * 18;
                    const elbowY = (isIncline ? 115 : 120) + progress * 10;
                    const chestY = isIncline ? 115 : 125;

                    return (
                      <g className="transition-all duration-75">
                        {isIncline ? (
                          <line x1="45" y1="145" x2="140" y2="95" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
                        ) : (
                          <line x1="50" y1="130" x2="150" y2="130" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
                        )}
                        <line x1="60" y1="130" x2="60" y2="180" stroke="#1e2a42" strokeWidth="4" />
                        <line x1="140" y1="130" x2="140" y2="180" stroke="#1e2a42" strokeWidth="4" />
                        <line x1="70" y1={chestY} x2="130" y2={chestY} stroke="#f8fafc" strokeWidth="10" strokeLinecap="round" />
                        <circle cx="58" cy={chestY - 2} r="11" fill="#e2e8f0" />
                        
                        {/* Muscle Glow */}
                        <ellipse
                          cx="90"
                          cy={chestY - 4}
                          rx="15"
                          ry="8"
                          fill="#f43f5e"
                          opacity={0.4 + (1 - progress) * 0.6}
                          className={progress < 0.2 ? 'filter drop-shadow-[0_0_12px_#f43f5e]' : ''}
                        />

                        <polyline
                          points={`80,${chestY} ${elbowX},${elbowY} 95,${barY}`}
                          fill="none"
                          stroke="#f8fafc"
                          strokeWidth="7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <line x1="95" y1="65" x2="95" y2="120" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="45" y1={barY} x2="145" y2={barY} stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
                        <rect x="42" y={barY - 14} width="8" height="28" rx="2" fill="#ea580c" />
                        <rect x="135" y={barY - 14} width="8" height="28" rx="2" fill="#ea580c" />

                        <circle cx={elbowX} cy={elbowY} r="4" fill="#38bdf8" />
                        <text x={elbowX - 5} y={elbowY + 16} fill="#38bdf8" fontSize="8" fontWeight="bold">
                          زاویه {Math.round(45 + progress * 25)}°
                        </text>
                      </g>
                    );
                  })()}

                  {/* LAT PULLDOWN / ROW */}
                  {(category === 'lat_pulldown' || category === 'row') && (() => {
                    const isRow = category === 'row';
                    const barY = isRow ? 100 : 50 + progress * 40;
                    const barX = isRow ? 85 + progress * 45 : 120;
                    const elbowY = isRow ? 100 : 75 + progress * 25;
                    const elbowX = isRow ? 115 + progress * 20 : 100 - progress * 15;

                    return (
                      <g className="transition-all duration-75">
                        <line x1="120" y1="90" x2="120" y2="175" stroke="#f8fafc" strokeWidth="9" strokeLinecap="round" />
                        <circle cx="120" cy="72" r="11" fill="#e2e8f0" />
                        
                        {/* Latissimus Dorsi muscle */}
                        <path
                          d="M 120,95 Q 105,115 120,135 Q 135,115 120,95"
                          fill="#f43f5e"
                          opacity={0.4 + (1 - progress) * 0.6}
                          className={progress < 0.2 ? 'filter drop-shadow-[0_0_12px_#f43f5e]' : ''}
                        />

                        <polyline
                          points={`120,85 ${elbowX},${elbowY} ${barX},${barY}`}
                          fill="none"
                          stroke="#f8fafc"
                          strokeWidth="7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <line x1="120" y1="15" x2={barX} y2={barY} stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                        <line x1={barX - 45} y1={barY} x2={barX + 45} y2={barY} stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
                        <circle cx={barX - 45} cy={barY} r="4" fill="#ea580c" />
                        <circle cx={barX + 45} cy={barY} r="4" fill="#ea580c" />
                      </g>
                    );
                  })()}

                  {/* ARMS (BICEPS, TRICEPS, LATERAL RAISE) */}
                  {(category === 'biceps_curl' || category === 'triceps_pushdown' || category === 'lateral_raise' || category === 'core_plank') && (() => {
                    const isBiceps = category === 'biceps_curl';
                    const isTriceps = category === 'triceps_pushdown';
                    const isRaise = category === 'lateral_raise';

                    const armAngle = (1 - progress);
                    const handX = isRaise ? 70 + armAngle * 55 : 120;
                    const handY = isBiceps ? 140 - armAngle * 50 : isTriceps ? 95 + armAngle * 45 : 130 - armAngle * 40;
                    const elbowX = isRaise ? 85 + armAngle * 25 : 100;
                    const elbowY = isRaise ? 115 - armAngle * 20 : 120;

                    return (
                      <g className="transition-all duration-75">
                        <circle cx="120" cy="65" r="11" fill="#e2e8f0" />
                        <line x1="120" y1="76" x2="120" y2="135" stroke="#f8fafc" strokeWidth="9" strokeLinecap="round" />
                        <line x1="120" y1="135" x2="110" y2="180" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
                        <line x1="120" y1="135" x2="130" y2="180" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />

                        <circle
                          cx={isRaise ? 105 : 110}
                          cy={isRaise ? 85 : 105}
                          r="8"
                          fill="#f43f5e"
                          opacity={0.4 + armAngle * 0.6}
                          className={armAngle > 0.8 ? 'filter drop-shadow-[0_0_12px_#f43f5e]' : ''}
                        />

                        <polyline
                          points={`115,80 ${elbowX},${elbowY} ${handX},${handY}`}
                          fill="none"
                          stroke="#f8fafc"
                          strokeWidth="7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <circle cx={handX} cy={handY} r="7" fill="#f59e0b" />
                        <rect x={handX - 4} y={handY - 12} width="8" height="24" rx="2" fill="#ea580c" />
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Progress Bar */}
              <div className="w-full space-y-1 mt-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>وضعیت شروع</span>
                  <span className="text-amber-400">{phaseName}</span>
                  <span>اوج انقباض</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#18233c] overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 via-amber-500 to-rose-500 rounded-full"
                    style={{ width: `${Math.round((1 - progress) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* CONTROLS BAR: Play/Pause, Speeds, and Phase Scrubber */}
            <div className="p-3.5 rounded-3xl glass-input flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    if (manualPhase !== 'auto') setManualPhase('auto');
                  }}
                  className="px-3.5 py-2 rounded-2xl bg-[#FF6B00] hover:bg-orange-500 text-black font-black flex items-center gap-1.5 shadow-glow active:scale-95 transition-all"
                >
                  {isPlaying && manualPhase === 'auto' ? <Pause className="w-4 h-4 fill-current stroke-[2.5]" /> : <Play className="w-4 h-4 fill-current stroke-[2.5]" />}
                  <span>{isPlaying && manualPhase === 'auto' ? 'توقف' : 'پخش انیمیشن'}</span>
                </button>

                {/* Speed buttons */}
                <div className="flex items-center gap-1 bg-black/40 border border-white/5 p-1 rounded-2xl">
                  <button
                    onClick={() => { setSpeed(0.6); setManualPhase('auto'); setIsPlaying(true); }}
                    className={`px-2.5 py-1 rounded-xl font-bold text-[11px] transition-colors ${speed === 0.6 ? 'bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30 shadow-glow' : 'text-slate-400 hover:text-white'}`}
                  >
                    ۰.۶x (آنالیز دقیق)
                  </button>
                  <button
                    onClick={() => { setSpeed(1); setManualPhase('auto'); setIsPlaying(true); }}
                    className={`px-2.5 py-1 rounded-xl font-bold text-[11px] transition-colors ${speed === 1 ? 'bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30 shadow-glow' : 'text-slate-400 hover:text-white'}`}
                  >
                    ۱.۰x (طبیعی)
                  </button>
                </div>
              </div>

              {/* Phase Scrubber Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setManualPhase('start'); setIsPlaying(false); }}
                  className={`px-2.5 py-1.5 rounded-2xl font-bold text-[11px] transition-all ${manualPhase === 'start' ? 'bg-[#FF6B00]/20 border border-[#FF6B00] text-white shadow-glow' : 'glass-input text-slate-400 hover:text-white'}`}
                >
                  استقرار اولیه
                </button>
                <button
                  onClick={() => { setManualPhase('stretch'); setIsPlaying(false); }}
                  className={`px-2.5 py-1.5 rounded-2xl font-bold text-[11px] transition-all ${manualPhase === 'stretch' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'glass-input text-slate-400 hover:text-white'}`}
                >
                  فاز منفی (کشش)
                </button>
                <button
                  onClick={() => { setManualPhase('peak'); setIsPlaying(false); }}
                  className={`px-2.5 py-1.5 rounded-2xl font-bold text-[11px] transition-all ${manualPhase === 'peak' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'glass-input text-slate-400 hover:text-white'}`}
                >
                  اوج انقباض
                </button>
              </div>
            </div>

            {/* Professional Tempo Cadence Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-2xl glass-input text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-[#FF6B00]" />
                <span className="font-bold">ریتم تمپو علمی تکرار (Tempo Cadence):</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 font-bold" title="فاز منفی (پایین آمدن)">۳ ثانیه منفی</span>
                <span>-</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 font-bold" title="مکث در انتهای کشش">۱ ثانیه مکث</span>
                <span>-</span>
                <span className="px-2 py-0.5 rounded bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30 font-bold" title="فاز صعودی (بالا بردن)">۱ ثانیه مثبت</span>
              </div>
            </div>

            {/* Scientific Biomechanical Cue Box */}
            <div className="p-3.5 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/25 flex items-start gap-3 text-xs">
              <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-amber-300 font-bold block mb-1">نکته طلایی فرم و بیومکانیک حرکتی:</strong>
                <p className="text-slate-300 leading-relaxed">{exercise.cue}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STEP-BY-STEP CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="space-y-3 py-1 max-h-[380px] overflow-y-auto pr-1">
            <div className="text-xs text-slate-400 mb-2">
              برای دریافت حداکثر رشد عضلانی و عدم آسیب مفاصل، این ۴ مرحله را در تک‌تک تکرارها رعایت کنید:
            </div>
            {currentChecklist.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                key={index}
                className="p-3.5 rounded-2xl bg-[#090e1a] border border-[#1a253a] flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <div className="space-y-1">
                  <div className="font-extrabold text-white text-xs sm:text-sm">{item.title}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                  <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 mt-1">
                    <Zap className="w-3 h-3" />
                    <span>رمز بیومکانیکی: {item.cue}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* TAB 3: COMMON MISTAKES & INJURY RISKS */}
        {activeTab === 'mistakes' && (
          <div className="space-y-3 py-1 max-h-[380px] overflow-y-auto pr-1">
            <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>این اشتباهات متداول‌ترین علل پارگی تاندون، دیسک کمر و سندروم گیرافتادگی شانه در باشگاه هستند:</span>
            </div>

            {currentMistakes.map((m, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                key={idx}
                className="p-3.5 rounded-2xl bg-[#090e1a] border border-rose-900/40 space-y-2 text-xs"
              >
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>اشتباه {idx + 1}: {m.mistake}</span>
                </div>
                <div className="text-slate-300 bg-rose-950/20 p-2 rounded-xl border border-rose-900/30">
                  <strong className="text-rose-300">خطر آناتومیک: </strong>{m.danger}
                </div>
                <div className="text-emerald-300 bg-emerald-950/20 p-2 rounded-xl border border-emerald-900/30">
                  <strong className="text-emerald-400">راهکار اصلاحی: </strong>{m.solution}
                </div>
              </motion.div>
            ))}

            {exercise.injuryAdaptation && (
              <div className="p-3.5 rounded-2xl bg-sky-950/30 border border-sky-800/40 text-xs space-y-1">
                <div className="font-bold text-sky-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  تطبیق اختصاصی برای آسیب‌دیدگی‌های شما:
                </div>
                <p className="text-slate-300 leading-relaxed">{exercise.injuryAdaptation}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: QUICK WEIGHT LOGGER */}
        {activeTab === 'weightLog' && (
          <div className="py-1">
            <ExerciseWeightLogger exercise={exercise} isCompact={false} />
          </div>
        )}

        {/* FOOTER ACTIONS WITH EXERCISE NAVIGATION */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl glass-input text-slate-300 hover:text-white font-bold text-xs transition-all active:scale-95"
            >
              بستن راهنما
            </button>

            {onNavigatePrev && (
              <button
                type="button"
                onClick={onNavigatePrev}
                className="px-3.5 py-2.5 rounded-2xl glass-input text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1 active:scale-95 transition-all"
              >
                <ChevronRight className="w-4 h-4 text-[#FF6B00] stroke-[3]" />
                <span>حرکت قبلی</span>
              </button>
            )}

            {onNavigateNext && (
              <button
                type="button"
                onClick={onNavigateNext}
                className="px-3.5 py-2.5 rounded-2xl glass-input text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1 active:scale-95 transition-all"
              >
                <span>حرکت بعدی</span>
                <ChevronLeft className="w-4 h-4 text-[#FF6B00] stroke-[3]" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onSkip && (
              <button
                onClick={onSkip}
                className="px-3.5 py-2.5 rounded-2xl glass-input hover:bg-white/10 text-slate-400 hover:text-white text-xs font-medium transition-all"
              >
                رد کردن
              </button>
            )}

            <button
              onClick={() => {
                if (onStartSet) onStartSet();
                setActiveTab('weightLog');
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-orange-400 hover:from-orange-500 hover:to-orange-400 text-black font-black text-xs flex items-center gap-1.5 shadow-glow transition-all active:scale-95"
            >
              <Dumbbell className="w-4 h-4 fill-black text-black" />
              <span>شروع و ثبت وزنه‌ها</span>
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
