import { UserProfile } from '../types/fitness';

export const MUSCLE_OPTIONS = [
  { id: 'chest_upper', label: 'بالا سینه', group: 'سینه' },
  { id: 'chest_lower', label: 'زیر سینه و میان سینه', group: 'سینه' },
  { id: 'lats', label: 'عضلات زیربغل (لت و پهنای کمر)', group: 'پشت' },
  { id: 'rhomboids', label: 'بخش میانی پشت و فیله کمر', group: 'پشت' },
  { id: 'delts_side', label: 'سرشانه میانی (بخش جانبی)', group: 'سرشانه' },
  { id: 'delts_rear', label: 'سرشانه خلفی (پشت سرشانه)', group: 'سرشانه' },
  { id: 'delts_front', label: 'سرشانه قدامی (جلوی شانه)', group: 'سرشانه' },
  { id: 'biceps', label: 'جلو بازو (دو سر بازویی)', group: 'بازو' },
  { id: 'triceps', label: 'پشت بازو (سه سر بازویی)', group: 'بازو' },
  { id: 'forearms', label: 'ساعد و پنجه', group: 'بازو' },
  { id: 'quads', label: 'چهارسر ران (جلوی ران)', group: 'پا' },
  { id: 'hamstrings', label: 'همسترینگ (پشت ران)', group: 'پا' },
  { id: 'glutes', label: 'باسن و بافت گلوتئال', group: 'پا' },
  { id: 'calves', label: 'ساق پا', group: 'پا' },
  { id: 'abs_core', label: 'عضلات شکم و پهلو (Core)', group: 'میان‌تنه' },
];

export const INJURY_OPTIONS = [
  'دیسک کمر (L4-L5 یا L5-S1)',
  'دیسک گردن / تنگی کانال',
  'درد و آسیب شانه (روتاتور کاف / گیرافتادگی)',
  'زانودرد / آسیب مینیسک و رباط صلیبی',
  'درد مچ دست / سندرم تونل کارپال',
  'گرفتگی و اسپاسم مکرر فیله کمر',
  'درد مچ پا / تاندونیت آشیل',
  'آسیب و کشیدگی کشاله ران',
];

export const ALLERGY_OPTIONS = [
  'حساسیت به لاکتوز (شیر و لبنیات معمولی)',
  'حساسیت به گلوتن (بیماری سلیاک یا حساسیت غیر سلیاکی)',
  'آلرژی به بادام زمینی و انواع آجیل',
  'آلرژی به تخم‌مرغ',
  'آلرژی به سویا',
  'آلرژی به غذاهای دریایی و میگو',
  'نفخ شدید با حبوبات',
];

export const MEDICAL_CONDITIONS = [
  'کبد چرب (گرید ۱ یا ۲)',
  'دیابت نوع ۲ یا مقاومت به انسولین',
  'فشار خون بالا',
  'کم‌کاری تیروئید',
  'پرکاری تیروئید',
  'سندرم روده تحریک‌پذیر (IBS)',
  'آسم ورزشی یا مشکلات تنفسی',
  'کاهش تراکم استخوان (استئوپنی)',
];

export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'بی‌تحرک (پشت‌میز نشین، بدون ورزش روزمره)', factor: 1.2 },
  { value: 'light', label: 'فعالیت کم (۱ تا ۳ روز پیاده‌روی یا ورزش سبک)', factor: 1.375 },
  { value: 'moderate', label: 'فعالیت متوسط (۳ تا ۵ روز فعالیت یا کار متوسط)', factor: 1.55 },
  { value: 'active', label: 'بسیار فعال (۶ تا ۷ روز تمرین ورزشی منظم)', factor: 1.725 },
  { value: 'very_active', label: 'فوق‌العاده فعال (ورزشکار حرفه‌ای یا شغل بدنی سخت)', factor: 1.9 },
];

export const GOALS = [
  {
    value: 'muscle_gain',
    title: 'عضله‌سازی و افزایش حجم خالص (Lean Bulk)',
    desc: 'افزایش وزن عضلانی با کمترین میزان تجمع چربی',
    badge: 'حجم خشک',
  },
  {
    value: 'fat_loss',
    title: 'چربی‌سوزی، کات و تفکیک عضلانی (Cutting)',
    desc: 'کاهش درصد چربی بدن با حفظ حداکثری بافت عضلانی',
    badge: 'کات و لاغری',
  },
  {
    value: 'body_recomp',
    title: 'رکمپوزیسیون بدنی (تغییر همزمان ترکیب بدن)',
    desc: 'چربی‌سوزی و عضله‌سازی هم‌زمان مناسب افراد مبتدی یا بازگشت به ورزش',
    badge: 'فرم‌دهی همزمان',
  },
  {
    value: 'strength',
    title: 'افزایش قدرت و رکورد حرکات چندمفصلی',
    desc: 'تمرکز بر سیستم‌های قدرتی و سیستم عصبی-عضلانی',
    badge: 'قدرتی',
  },
  {
    value: 'general_fitness',
    title: 'سلامت عمومی، تندرستی و انرژی روزانه',
    desc: 'بهبود سیستم قلبی‌عروقی، چابکی و تناسب اندام متوازن',
    badge: 'فیتنس عمومی',
  },
];

export const DIET_PREFERENCES = [
  { value: 'balanced_persian', label: 'رژیم سنتی ایرانی سالم (برنج کته، فیله مرغ، خوراک‌های کم‌روغن)' },
  { value: 'high_protein', label: 'رژیم پرپروتئین اختصاصی بدنسازی (High Protein)' },
  { value: 'budget_friendly', label: 'رژیم اقتصادی و در دسترس (تخم‌مرغ، عدسی، سینه مرغ، سیب‌زمینی)' },
  { value: 'low_carb', label: 'رژیم کم کربوهیدرات (Low Carb / کتو سبک)' },
  { value: 'vegetarian', label: 'رژیم گیاه‌خواری ورزشی (پروتئین‌های گیاهی، حبوبات، لبنیات/سویا)' },
];

export const PRESET_PROFILES: { label: string; profile: UserProfile }[] = [
  {
    label: 'نمونه ۱: آقا | حجم خشک با ضعف در سرشانه و دیسک کمر',
    profile: {
      gender: 'male',
      age: 28,
      weight: 78,
      height: 182,
      targetWeight: 84,
      activityLevel: 'moderate',
      goal: 'muscle_gain',
      experienceLevel: 'intermediate',
      trainingDaysPerWeek: 4,
      location: 'gym',
      weakMuscles: ['سرشانه خلفی (پشت سرشانه)', 'عضلات زیربغل (لت و پهنای کمر)', 'بالا سینه'],
      strongMuscles: ['چهارسر ران (جلوی ران)', 'جلو بازو (دو سر بازویی)'],
      injuries: ['دیسک کمر (L4-L5 یا L5-S1)'],
      allergies: ['حساسیت به لاکتوز (شیر و لبنیات معمولی)'],
      medicalConditions: ['کبد چرب (گرید ۱ یا ۲)'],
      dietaryPreference: 'رژیم پرپروتئین اختصاصی بدنسازی (High Protein)',
      mealsPerDay: 5,
      extraNotes: 'می‌خواهم بدون فشار بر کمر و مهره‌ها، بالا تنه‌ام پهن‌تر شود و چربی کبد هم اصلاح شود.',
    },
  },
  {
    label: 'نمونه ۲: خانم | چربی‌سوزی و فرم‌دهی با حساسیت گلوتن',
    profile: {
      gender: 'female',
      age: 32,
      weight: 71,
      height: 165,
      targetWeight: 62,
      activityLevel: 'light',
      goal: 'fat_loss',
      experienceLevel: 'beginner',
      trainingDaysPerWeek: 4,
      location: 'gym',
      weakMuscles: ['باسن و بافت گلوتئال', 'پشت بازو (سه سر بازویی)', 'عضلات شکم و پهلو (Core)'],
      strongMuscles: ['چهارسر ران (جلوی ران)'],
      injuries: ['زانودرد / آسیب مینیسک و رباط صلیبی'],
      allergies: ['حساسیت به گلوتن (بیماری سلیاک یا حساسیت غیر سلیاکی)'],
      medicalConditions: ['کم‌کاری تیروئید'],
      dietaryPreference: 'رژیم سنتی ایرانی سالم (برنج کته، فیله مرغ، خوراک‌های کم‌روغن)',
      mealsPerDay: 4,
      extraNotes: 'هدفم لیفت باسن و باریک شدن دور کمر بدون درد زانو در حین تمرینات پایینی است.',
    },
  },
];
