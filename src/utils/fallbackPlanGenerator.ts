import type { GeneratedPlan, UserProfile } from '../types/fitness.ts';

export function generateScientificFallbackPlan(profile: UserProfile): GeneratedPlan {
  const safeWeakMuscles = Array.isArray(profile.weakMuscles) ? profile.weakMuscles : [];
  const safeStrongMuscles = Array.isArray(profile.strongMuscles) ? profile.strongMuscles : [];
  const safeInjuries = Array.isArray(profile.injuries) ? profile.injuries : [];
  const safeAllergies = Array.isArray(profile.allergies) ? profile.allergies : [];
  const safeMedicalConditions = Array.isArray(profile.medicalConditions) ? profile.medicalConditions : [];

  const heightM = (profile.height || 175) / 100;
  const weight = profile.weight || 75;
  const age = profile.age || 28;
  const bmi = Number((weight / (heightM * heightM)).toFixed(1));
  let bmiCategory = 'وزن نرمال و متناسب';
  if (bmi < 18.5) bmiCategory = 'کمبود وزن';
  else if (bmi >= 25 && bmi < 29.9) bmiCategory = 'اضافه وزن ملایم';
  else if (bmi >= 30) bmiCategory = 'نیاز به مدیریت چربی بدنی';

  // Mifflin-St Jeor BMR calculation
  const bmr = Math.round(
    profile.gender === 'female'
      ? 10 * weight + 6.25 * (profile.height || 175) - 5 * age - 161
      : 10 * weight + 6.25 * (profile.height || 175) - 5 * age + 5
  );

  // Activity multipliers
  const actMap: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  const factor = actMap[profile.activityLevel || 'moderate'] || 1.55;
  const tdee = Math.round(bmr * factor);

  let targetCalories = tdee;
  let strategy = 'حفظ تناسب و رکمپوزیسیون بدنی';
  let strategyExplanation = 'تامین کالری متعادل همراه با پروتئین کافی برای عضله‌سازی و چربی‌سوزی همزمان.';

  if (profile.goal === 'muscle_gain') {
    targetCalories = Math.round(tdee + 350);
    strategy = 'افزایش حجم خالص عضلانی (Lean Bulk)';
    strategyExplanation = `ایجاد مازاد کالری کنترل‌شده حدود ۳۵۰ کیلوکالری بالاتر از مصرف روزانه جهت بیشینه‌سازی سنتز پروتئین عضلانی با حداقل چربی. تمرکز ویژه بر عضلات ضعیف (${safeWeakMuscles.join('، ') || 'بالاتنه'}) اعمال شده است.`;
  } else if (profile.goal === 'fat_loss') {
    targetCalories = Math.round(tdee - 450);
    strategy = 'چربی‌سوزی، کات و تفکیک عضلانی (Cutting)';
    strategyExplanation = `ایجاد کسری کالری پایدار حدود ۴۵۰ کیلوکالری برای چربی‌سوزی مستمر بدون از دست رفتن بافت عضلانی، همراه با پروتئین بالا و مدیریت الکترولیت‌ها.`;
  } else if (profile.goal === 'strength') {
    targetCalories = Math.round(tdee + 200);
    strategy = 'افزایش قدرت و سازگاری عصبی-عضلانی';
    strategyExplanation = 'تامین سوخت کربوهیدراتی کافی قبل تمرین جهت بهبود رکوردهای حرکات چندمفصلی.';
  }

  // Protein grams: 2.0 to 2.2 g per kg
  const proteinGrams = Math.round(weight * (profile.goal === 'fat_loss' ? 2.2 : 2.0));
  const fatGrams = Math.round((targetCalories * 0.25) / 9);
  const carbsGrams = Math.max(100, Math.round((targetCalories - (proteinGrams * 4 + fatGrams * 9)) / 4));
  const waterLiters = Number((weight * 0.04).toFixed(1));

  const hasBackInjury = safeInjuries.some((inj) => inj.includes('کمر') || inj.includes('دیسک'));
  const hasKneeInjury = safeInjuries.some((inj) => inj.includes('زانو') || inj.includes('مینیسک'));
  const hasShoulderInjury = safeInjuries.some((inj) => inj.includes('شانه') || inj.includes('روتاتور'));
  const hasLactoseAllergy = safeAllergies.some((a) => a.includes('لاکتوز') || a.includes('شیر'));

  const injurySafetyOverview = safeInjuries.length > 0
    ? `با توجه به سابقه ${safeInjuries.join(' و ')}، تمام تمرینات با فشار محوری آسیب‌رسان و دامنه‌های غیر ایمن حذف و با حرکات محافظت‌کننده مفاصل و دارای تکیه‌گاه جایگزین شدند.`
    : 'سیستم بیومکانیکی ایمن برای پیشگیری از هرگونه آسیب مفصلی لحاظ شده است.';

  return {
    summary: {
      bmi,
      bmiCategory,
      bmr,
      tdee,
      targetCalories,
      strategy,
      strategyExplanation,
      macroSplit: {
        proteinGrams,
        carbsGrams,
        fatGrams,
        waterLiters,
      },
      injurySafetyOverview,
    },
    workoutPlan: {
      splitName: profile.trainingDaysPerWeek === 3 ? 'اسپلیت تخصصی ۳ روزه فول بادی اصلاحی' : 'اسپلیت ۴ روزه تخصصی با تمرکز بر عضلات ضعیف',
      weeklyOverview: 'چیدمان هفتگی با رعایت ۷۲ ساعت ریکاوری بین گروه‌های عضلانی یکسان و تقدم عضلات نیازمند رشد در آغاز جلسات.',
      weakMuscleStrategy: `عضلات ضعیف (${safeWeakMuscles.join('، ') || 'عضلات هدف'}) در اولویت شروع تمرینات قرار گرفته و با زوایای بیومکانیکی ایزوله و ست‌های استراحت-توقف (Rest-Pause) تحریک می‌شوند.`,
      days: [
        {
          dayNumber: 1,
          dayName: 'روز اول: سینه، سرشانه و پشت بازو (Push Focus)',
          isRestDay: false,
          targetMuscles: ['سینه بالا', 'سرشانه میانی', 'پشت بازو'],
          warmup: [
            '۵ دقیقه گرم کردن عمومی موبیلیتی مفصل شانه و کتف',
            '۲ ست گرم‌کردن با کش تمرینی (Band Pull-aparts)',
            'چرخش‌های ملایم روتاتور کاف با دمبل سبک',
          ],
          exercises: [
            {
              id: 'ex-1-1',
              nameFa: hasShoulderInjury ? 'پرس سینه دمبل موازی روی میز شیبدار ملایم' : 'پرس بالاسینه دمبل کنترل‌شده',
              nameEn: hasShoulderInjury ? 'Neutral Grip Incline Dumbbell Press' : 'Incline Dumbbell Press',
              targetMuscle: 'بالا سینه',
              sets: 4,
              reps: '10-12',
              restSeconds: 75,
              targetFocus: 'تمرکز بر تار‌های ترقوه‌ای و عضلات ضعیف بالاسینه',
              cue: 'کتف‌ها به عقب قفل شده، دمبل‌ها با زاویه ۴۵ درجه نسبت به بدن پایین آیند.',
              injuryAdaptation: hasShoulderInjury ? 'گرفتن موازی دمبل‌ها جهت حذف سندروم گیرافتادگی شانه' : 'دامنه ایمن بدون هایپراکستنشن',
            },
            {
              id: 'ex-1-2',
              nameFa: 'فلای سینه با سیم‌کش از پایین به بالا',
              nameEn: 'Low to High Cable Fly',
              targetMuscle: 'بالا سینه و میان‌سینه',
              sets: 3,
              reps: '12-15',
              restSeconds: 60,
              targetFocus: 'ایجاد تنش مداوم و پمپ عضلانی بدون فشار استخوانی',
              cue: 'در اوج حرکت ۱ ثانیه انقباض ایستا حفظ شود.',
              injuryAdaptation: 'سیم‌کش فشار ناگهانی را از روی تاندون سینه برمی‌دارد.',
            },
            {
              id: 'ex-1-3',
              nameFa: 'نشر جانب با دمبل در حالت نشسته با تکیه‌گاه',
              nameEn: 'Seated Dumbbell Lateral Raise',
              targetMuscle: 'سرشانه میانی (عرض شانه)',
              sets: 4,
              reps: '12-15',
              restSeconds: 60,
              targetFocus: 'پهن‌تر شدن بالاتنه و فرم V شکل',
              cue: 'حرکت با آرنج هدایت شود، بدون تکان دادن تنه.',
              injuryAdaptation: hasBackInjury ? 'حالت نشسته تکیه‌دار فشار را از فیله کمر کاملاً حذف می‌کند.' : 'فرم استاندارد بدون تقلب',
            },
            {
              id: 'ex-1-4',
              nameFa: 'پشت بازو سیم‌کش با طناب',
              nameEn: 'Cable Rope Triceps Pushdown',
              targetMuscle: 'پشت بازو (سر جانبی و بلند)',
              sets: 3,
              reps: '12-15',
              restSeconds: 60,
              targetFocus: 'تقویت قطر بازو',
              cue: 'آرنج‌ها کاملاً چسبیده به پهلو و مچ در انتها به بیرون باز شود.',
              injuryAdaptation: 'فشار نرمال و ایمن برای مفاصل آرنج و مچ دست',
            },
          ],
          cooldown: ['کشش عضلات سینه با تکیه به دیوار', 'کشش پشت بازو و تنفس عمیق دیافراگمی'],
        },
        {
          dayNumber: 2,
          dayName: 'روز دوم: زیربغل، عضلات پشت و جلو بازو (Pull Focus)',
          isRestDay: false,
          targetMuscles: ['زیربغل (لت)', 'بخش میانی پشت', 'جلو بازو'],
          warmup: [
            'موبیلیتی ستون فقرات توراسیک (حرکت گربه-شتر)',
            'آویزان شدن منفعل از بارفیکس به مدت ۳۰ ثانیه',
          ],
          exercises: [
            {
              id: 'ex-2-1',
              nameFa: 'لت زیربغل سیم‌کش دست باز از جلو',
              nameEn: 'Wide-Grip Lat Pulldown',
              targetMuscle: 'عضلات لت و پهنای پشت',
              sets: 4,
              reps: '10-12',
              restSeconds: 75,
              targetFocus: 'تقویت بالاتنه و باریک نشان دادن کمر',
              cue: 'میله تا استخوان جناغ سینه پایین کشیده شود، سینه بیرون.',
              injuryAdaptation: hasBackInjury ? 'جایگزین ایمن بارفیکس بدون فشار گرانشی بر مهره‌های کمری' : 'ایمن و استاندارد',
            },
            {
              id: 'ex-2-2',
              nameFa: 'قایقی سیم‌کش با دسته دوبل نشسته',
              nameEn: 'Seated Cable Row',
              targetMuscle: 'بخش میانی پشت و رومبوئیدها',
              sets: 4,
              reps: '10-12',
              restSeconds: 75,
              targetFocus: 'ضخامت عضلات پشت و اصلاح قوز کتف',
              cue: 'کمر کاملاً صاف و جمع‌کردن استخوان‌های کتف در انتهای دامنه.',
              injuryAdaptation: 'تکیه‌گاه محکم پاها و زاویه زانوها مانع از فشار بر دیسک کمر می‌شود.',
            },
            {
              id: 'ex-2-3',
              nameFa: 'فیس‌پول با سیم‌کش و طناب',
              nameEn: 'Cable Face Pull',
              targetMuscle: 'سرشانه خلفی و عضلات تثبیت‌کننده کتف',
              sets: 3,
              reps: '15',
              restSeconds: 60,
              targetFocus: 'تقویت نقطه ضعف سرشانه پشتی و سلامت مفصل شانه',
              cue: 'طناب به سمت چشم‌ها کشیده شده و چرخش خارجی مچ صورت گیرد.',
              injuryAdaptation: 'بهترین حرکت پیشگیری و درمان دردهای شانه و روتاتور کاف',
            },
            {
              id: 'ex-2-4',
              nameFa: 'جلو بازو دمبل روی میز بالاسینه شیبدار',
              nameEn: 'Incline Dumbbell Biceps Curl',
              targetMuscle: 'جلو بازو (سر بلند)',
              sets: 3,
              reps: '10-12',
              restSeconds: 60,
              targetFocus: 'ایجاد پیک عضلانی جلو بازو با کشش اولیه کامل',
              cue: 'بدون تاب دادن دمبل و با تمرکز بر انقباض اوج.',
              injuryAdaptation: 'تکیه دادن پشت از هرگونه قوز و فشار کمر جلوگیری می‌کند.',
            },
          ],
          cooldown: ['کشش عضلات لت با میله عمودی', 'کشش مچ دست و ساعد'],
        },
        {
          dayNumber: 3,
          dayName: 'روز سوم: ریکاوری فعال، آب‌رسانی و بازسازی بافت',
          isRestDay: true,
          targetMuscles: ['ریکاوری عمومی سیستم عصبی و عضلانی'],
          warmup: ['پیاده‌روی سبک ۲۰ دقیقه', 'کشش‌های پویای مفاصل'],
          exercises: [],
          cooldown: ['دوش آب گرم و تنفس آرام'],
        },
        {
          dayNumber: 4,
          dayName: 'روز چهارم: عضلات پا و شکم (Lower Body Focus)',
          isRestDay: false,
          targetMuscles: ['چهارسر ران', 'همسترینگ', 'عضلات باسن و شکم'],
          warmup: [
            'گرم‌کردن مچ پا و زانو با وزن بدن',
            'حرکت پل باسن بدون وزنه ۲ ست ۱۵ تکرار',
          ],
          exercises: [
            {
              id: 'ex-4-1',
              nameFa: hasBackInjury ? 'پرس پا با دستگاه با تکیه‌گاه زاویه ۴۵ درجه' : 'گابلت اسکات با دمبل و پاشنه بالاتر از سطح',
              nameEn: hasBackInjury ? 'Leg Press Machine 45°' : 'Goblet Squat (Heel Elevated)',
              targetMuscle: 'چهارسر ران و گلوتز',
              sets: 4,
              reps: '10-12',
              restSeconds: 90,
              targetFocus: 'رشد عضلانی پا بدون فشار محوری به ستون فقرات',
              cue: 'کمر کاملاً به تکیه‌گاه چسبیده باشد، زانوها در راستای نوک انگشتان پا.',
              injuryAdaptation: hasBackInjury ? 'حذف کامل فشار گرانشی از روی مهره‌های L4-L5 کمر' : 'حفظ ستون فقرات در راستای عمودی',
            },
            {
              id: 'ex-4-2',
              nameFa: 'پشت پا دستگاه خوابیده یا نشسته',
              nameEn: 'Lying or Seated Leg Curl',
              targetMuscle: 'همسترینگ (پشت ران)',
              sets: 4,
              reps: '12',
              restSeconds: 60,
              targetFocus: 'تعادل عضلانی جلو و پشت ران',
              cue: 'حرکت در فاز منفی با کنترل ۳ ثانیه‌ای پایین برود.',
              injuryAdaptation: hasKneeInjury ? 'دامنه کنترل شده بدون قفل کردن مفصل زانو' : 'ایمن و ایزوله',
            },
            {
              id: 'ex-4-3',
              nameFa: 'ساق پا ایستاده با دستگاه یا لبه پله',
              nameEn: 'Standing Calf Raise',
              targetMuscle: 'عضلات دوقلوی ساق پا',
              sets: 4,
              reps: '15-20',
              restSeconds: 45,
              targetFocus: 'تقویت نقطه ضعف ساق پا',
              cue: 'مکث ۱ ثانیه‌ای در بالاترین نقطه کشش.',
              injuryAdaptation: 'تقویت تاندون آشیل و پایداری مچ پا',
            },
            {
              id: 'ex-4-4',
              nameFa: 'پلانک روی ساعد با انقباض شکم',
              nameEn: 'Forearm Plank',
              targetMuscle: 'عضلات عرضی شکم (Core)',
              sets: 3,
              reps: '40-60 ثانیه',
              restSeconds: 60,
              targetFocus: 'ایجاد ثبات کمری و باریک شدن شکم',
              cue: 'بدن در یک خط کاملاً مستقیم، باسن منقبض و شکم سفت.',
              injuryAdaptation: 'برخلاف درازنشست هیچ‌گونه فشار برشی بر مهره‌های کمری وارد نمی‌کند.',
            },
          ],
          cooldown: ['کشش عضلات چهارسر و همسترینگ', 'کشش عضلات باسن و چرخاننده‌های لگن'],
        },
      ],
    },
    dietPlan: {
      dailySummary: `رژیم بر پایه ${targetCalories} کیلوکالری و ${proteinGrams} گرم پروتئین به همراه کربوهیدرات‌های پیچیده ایرانی تنظیم شده است.${hasLactoseAllergy ? ' محصولات لبنی معمولی کاملاً با گزینه‌های فاقد لاکتوز جایگزین شده‌اند.' : ''}`,
      meals: [
        {
          mealId: 'm-1',
          mealName: 'صبحانه مقوی و آنابولیک',
          timing: 'ساعت ۸:۰۰ صبح',
          foods: [
            { item: 'سفیده تخم‌مرغ به همراه ۱ عدد تخم‌مرغ کامل', amount: '۴ عدد سفیده + ۱ کامل', calories: 170, protein: 22, tip: 'آب‌پز یا نیمرو با اسپری روغن زیتون' },
            { item: 'جو دوسر پرک یا نان جو سبوس‌دار', amount: '۶۰ گرم', calories: 220, protein: 7, tip: 'تامین انرژی پایدار روزانه' },
            { item: hasLactoseAllergy ? 'شیر بادام یا شیر بدون لاکتوز' : 'شیر کم‌چرب غنی‌شده', amount: '۱ لیوان (۲۰۰ میلی‌لیتر)', calories: 90, protein: 6 },
            { item: 'گردو یا بادام درختی خام', amount: '۴ عدد', calories: 100, protein: 3, tip: 'چربی غیراشباع امگا ۳' },
          ],
          alternatives: ['نان سنگک سنتی سبوس‌دار ۵۰ گرم', 'کره بادام زمینی طبیعی ۱ قاشق غذاخوری'],
        },
        {
          mealId: 'm-2',
          mealName: 'میان‌وعده صبح / سوخت‌گیری اولیه',
          timing: 'ساعت ۱۱:۰۰ صبح',
          foods: [
            { item: 'سیب درختی یا موز متوسط', amount: '۱ عدد', calories: 95, protein: 1 },
            { item: 'فیله مرغ گریل شده یا عدسی کم‌روغن', amount: '۱۰۰ گرم', calories: 140, protein: 24, tip: 'حفظ مثبت بودن تعادل نیتروژن' },
          ],
          alternatives: ['یک کاسه ماست یونانی بدون لاکتوز با دارچین'],
        },
        {
          mealId: 'm-3',
          mealName: 'ناهار اصلی پرپروتئین ایرانی',
          timing: 'ساعت ۱۳:۳۰',
          foods: [
            { item: 'سینه مرغ یا راسته گوساله بدون چربی', amount: '۱۵۰ گرم', calories: 230, protein: 38, tip: 'گریل، کبابی یا پخته با زعفران و لیمو' },
            { item: 'برنج کته ایرانی با روغن زیتون خالص', amount: '۱۰ تا ۱۲ قاشق غذاخوری (حدود ۱۸۰ گرم پخته)', calories: 260, protein: 5 },
            { item: 'سالاد فصل (کاهو، خیار، گوجه، کلم)', amount: '۱ کاسه بزرگ', calories: 50, protein: 2, tip: 'همراه با ۱ قاشق روغن زیتون و آبغوره طبیعی' },
          ],
          alternatives: ['خوراک عدس و فیله بوقلمون', 'ماهی قزل‌آلا کبابی ۱۸۰ گرم'],
        },
        {
          mealId: 'm-4',
          mealName: 'وعده قبل و بعد تمرین (Pre/Post Workout)',
          timing: '۱ ساعت قبل و بلافاصله بعد تمرین',
          foods: [
            { item: 'سیب‌زمینی تنوری یا موز (قبل تمرین)', amount: '۱ عدد متوسط', calories: 120, protein: 3, tip: 'گلیکوژن‌سازی سریع برای تمرین سنگین' },
            { item: hasLactoseAllergy ? 'پودر پروتئین ایزوله بدون لاکتوز یا فیله مرغ' : 'پروتئین وی ایزوله با آب خنک', amount: '۱ اسکوپ (۳۰ گرم)', calories: 120, protein: 25, tip: 'جذب سریع و مهار کورتیزول' },
          ],
          alternatives: ['۲ عدد خرما + ۳ عدد سفیده تخم‌مرغ'],
        },
        {
          mealId: 'm-5',
          mealName: 'شام سبک با هضم آسان جهت خواب عمیق',
          timing: 'ساعت ۲۱:۰۰',
          foods: [
            { item: 'فیله ماهی یا مرغ بخارپز', amount: '۱۴۰ گرم', calories: 190, protein: 32 },
            { item: 'سبزیجات بخارپز (کلم بروکلی، هویج، کدو)', amount: '۱ بشقاب', calories: 60, protein: 3, tip: 'آنتی‌اکسیدان و فیبر محلول' },
            { item: 'نان تست جو یا سیب‌زمینی کوچک', amount: '۱ عدد', calories: 80, protein: 3 },
          ],
          alternatives: ['خوراک لوبیا چیتی کم‌نمک خانگی', 'املت سبزیجات با روغن زیتون'],
        },
      ],
      hydrationAndTips: [
        `حداقل ${waterLiters} لیتر آب در طول روز بنوشید (۱ لیوان بلافاصله پس از بیداری).`,
        'در حین تمرین هر ۱۵ دقیقه چند جرعه کوچک آب همراه با چند قطره لیموترش مصرف کنید.',
        'شام حداقل ۲ ساعت قبل از زمان خواب مصرف شود تا ترشح هورمون رشد در خواب مهار نشود.',
      ],
    },
    supplementPlan: {
      overview: 'مکمل‌ها صرفاً برای تکمیل رژیم غذایی و بر پایه بالاترین سطح شواهد علمی (Category A) توصیه شده‌اند.',
      supplements: [
        {
          name: 'کراتین مونوهیدرات میکرونایز (Creatine Monohydrate)',
          purpose: 'افزایش ذخایر فسفوکراتین عضلانی، بهبود قدرت و تسریع ریکاوری بدون عوارض',
          dosage: '۵ گرم در روز',
          timing: 'همراه با وعده کربوهیدراتی بعد از تمرین یا صبح‌ها در روز استراحت',
          safetyWarning: 'نوشیدن آب کافی در طول مصرف الزامی است. برای افراد سالم با کلیه طبیعی کاملاً ایمن است.',
          isEssential: true,
        },
        {
          name: hasLactoseAllergy ? 'پروتئین وی ۱۰۰٪ ایزوله بدون لاکتوز (یا پروتئین گیاهی ارگانیک)' : 'پروتئین وی کنسانتره/ایزوله',
          purpose: 'تامین سریع اسیدهای آمینه ضروری (EAA) و لوسین برای فعال‌سازی مسیر mTOR',
          dosage: '۱ پیمانه (۲۵ تا ۳۰ گرم)',
          timing: 'بلافاصله بعد از تمرین با آب سرد',
          safetyWarning: hasLactoseAllergy ? 'حتماً برچسب بدون لاکتوز (Lactose Free) یا پایه گیاهی تهیه شود.' : 'مصرف بیش از حد نیاز پروتئین توصیه نمی‌شود.',
          isEssential: true,
        },
        {
          name: 'ویتامین D3 + K2 و زینک',
          purpose: 'تقویت سیستم ایمنی، تولید هورمون تستوسترون و تثبیت کلسیم در استخوان',
          dosage: 'D3 روزانه ۲۰۰۰ واحد و زینک ۱۵ میلی‌گرم',
          timing: 'همراه با ناهار (وعده حاوی چربی سالم)',
          safetyWarning: 'در صورت مصرف مکمل‌های دیگر دوز کل بررسی شود.',
          isEssential: false,
        },
      ],
    },
    recoveryAndRehab: {
      sleepGuideline: '۷.۵ تا ۸.۵ ساعت خواب شبانه پیوسته در اتاق کاملاً تاریک و خنک. اوج ترشح سوماتوتروپین (GH) در فاز خواب عمیق اتفاق می‌افتد.',
      rehabExercises: [
        'حرکت موبیلیتی گربه-شتر (Cat-Camel) برای نرمی ستون فقرات کمری',
        'حرکت Bird-Dog برای تقویت عضلات عمقی مولتی‌فیدوس کمر',
        'تمرین دوران ملایم شانه با کش پیلاتس (Dislocations with band)',
      ],
      warningSignsToStop: [
        'درد تیز و ناگهانی در مهره‌های کمر یا انتشار حس برق‌گرفتگی در پاها',
        'درد تیر کشنده در جلوی مفصل شانه حین پرس‌ها',
        'سرگیجه یا تپش نامنظم قلب حین تمرینات پرفشار',
      ],
    },
  };
}
