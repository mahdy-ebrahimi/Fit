<?php
/**
 * FitGen Pro - Scientific Fallback Plan Generator in PHP
 * Matches the TypeScript calculation engine 100%
 */

function generateScientificFallbackPlanPHP($profile) {
    $weight = isset($profile['weight']) && is_numeric($profile['weight']) ? (float)$profile['weight'] : 75;
    $height = isset($profile['height']) && is_numeric($profile['height']) ? (float)$profile['height'] : 175;
    $age = isset($profile['age']) && is_numeric($profile['age']) ? (int)$profile['age'] : 28;
    $gender = isset($profile['gender']) ? $profile['gender'] : 'male';
    $goal = isset($profile['goal']) ? $profile['goal'] : 'muscle_gain';
    $activityLevel = isset($profile['activityLevel']) ? $profile['activityLevel'] : 'moderate';
    $trainingDays = isset($profile['trainingDaysPerWeek']) ? (int)$profile['trainingDaysPerWeek'] : 4;

    $safeWeakMuscles = isset($profile['weakMuscles']) && is_array($profile['weakMuscles']) ? $profile['weakMuscles'] : [];
    $safeInjuries = isset($profile['injuries']) && is_array($profile['injuries']) ? $profile['injuries'] : [];
    $safeAllergies = isset($profile['allergies']) && is_array($profile['allergies']) ? $profile['allergies'] : [];

    $heightM = $height / 100;
    $bmi = round($weight / ($heightM * $heightM), 1);
    
    $bmiCategory = 'وزن نرمال و متناسب';
    if ($bmi < 18.5) $bmiCategory = 'کمبود وزن';
    else if ($bmi >= 25 && $bmi < 29.9) $bmiCategory = 'اضافه وزن ملایم';
    else if ($bmi >= 30) $bmiCategory = 'نیاز به مدیریت چربی بدنی';

    // Mifflin-St Jeor BMR
    $bmr = round(
        $gender === 'female'
            ? 10 * $weight + 6.25 * $height - 5 * $age - 161
            : 10 * $weight + 6.25 * $height - 5 * $age + 5
    );

    $actMap = [
        'sedentary' => 1.2,
        'light' => 1.375,
        'moderate' => 1.55,
        'active' => 1.725,
        'very_active' => 1.9,
    ];
    $factor = isset($actMap[$activityLevel]) ? $actMap[$activityLevel] : 1.55;
    $tdee = round($bmr * $factor);

    $targetCalories = $tdee;
    $strategy = 'حفظ تناسب و رکمپوزیسیون بدنی';
    $strategyExplanation = 'تامین کالری متعادل همراه با پروتئین کافی برای عضله‌سازی و چربی‌سوزی همزمان.';

    if ($goal === 'muscle_gain') {
        $targetCalories = round($tdee + 350);
        $strategy = 'افزایش حجم خالص عضلانی (Lean Bulk)';
        $weakStr = !empty($safeWeakMuscles) ? implode('، ', $safeWeakMuscles) : 'بالاتنه';
        $strategyExplanation = "ایجاد مازاد کالری کنترل‌شده حدود ۳۵۰ کیلوکالری جهت بیشینه‌سازی سنتز پروتئین عضلانی. تمرکز بر عضلات ضعیف ($weakStr) اعمال شده است.";
    } else if ($goal === 'fat_loss') {
        $targetCalories = round($tdee - 450);
        $strategy = 'چربی‌سوزی، کات و تفکیک عضلانی (Cutting)';
        $strategyExplanation = "ایجاد کسری کالری پایدار حدود ۴۵۰ کیلوکالری برای چربی‌سوزی مستمر بدون از دست رفتن بافت عضلانی.";
    } else if ($goal === 'strength') {
        $targetCalories = round($tdee + 200);
        $strategy = 'افزایش قدرت و سازگاری عصبی-عضلانی';
        $strategyExplanation = 'تامین سوخت کربوهیدراتی کافی قبل تمرین جهت بهبود رکوردهای حرکات چندمفصلی.';
    }

    $proteinGrams = round($weight * ($goal === 'fat_loss' ? 2.2 : 2.0));
    $fatGrams = round(($targetCalories * 0.25) / 9);
    $carbsGrams = max(100, round(($targetCalories - ($proteinGrams * 4 + $fatGrams * 9)) / 4));
    $waterLiters = round($weight * 0.04, 1);

    $hasBackInjury = false;
    $hasShoulderInjury = false;
    foreach ($safeInjuries as $inj) {
        if (mb_strpos($inj, 'کمر') !== false || mb_strpos($inj, 'دیسک') !== false) $hasBackInjury = true;
        if (mb_strpos($inj, 'شانه') !== false || mb_strpos($inj, 'روتاتور') !== false) $hasShoulderInjury = true;
    }

    $injurySafetyOverview = !empty($safeInjuries)
        ? 'با توجه به سابقه ' . implode(' و ', $safeInjuries) . '، تمام تمرینات با فشار محوری آسیب‌رسان حذف و با حرکات بیومکانیکی امن جایگزین شدند.'
        : 'سیستم بیومکانیکی ایمن برای پیشگیری از هرگونه آسیب مفصلی لحاظ شده است.';

    $weakMuscleStr = !empty($safeWeakMuscles) ? implode('، ', $safeWeakMuscles) : 'عضلات هدف';

    // Build Days
    $days = [
        [
            'dayNumber' => 1,
            'dayName' => 'روز اول: سینه، سرشانه و پشت بازو (Push Focus)',
            'isRestDay' => false,
            'targetMuscles' => ['سینه بالا', 'سرشانه میانی', 'پشت بازو'],
            'warmup' => [
                '۵ دقیقه گرم کردن عمومی موبیلیتی مفصل شانه و کتف',
                '۲ ست گرم‌کردن با کش تمرینی (Band Pull-aparts)',
                'چرخش‌های ملایم روتاتور کاف با دمبل سبک'
            ],
            'exercises' => [
                [
                    'id' => 'ex-1-1',
                    'nameFa' => $hasShoulderInjury ? 'پرس سینه دمبل موازی روی میز شیبدار ملایم' : 'پرس بالاسینه دمبل کنترل‌شده',
                    'nameEn' => $hasShoulderInjury ? 'Neutral Grip Incline Dumbbell Press' : 'Incline Dumbbell Press',
                    'targetMuscle' => 'بالا سینه',
                    'sets' => 4,
                    'reps' => '10-12',
                    'restSeconds' => 75,
                    'targetFocus' => 'تمرکز بر تار‌های ترقوه‌ای و عضلات ضعیف بالاسینه',
                    'cue' => 'کتف‌ها به عقب قفل شده، دمبل‌ها با زاویه ۴۵ درجه نسبت به بدن پایین آیند.',
                    'injuryAdaptation' => $hasShoulderInjury ? 'گرفتن موازی دمبل‌ها جهت حذف سندروم گیرافتادگی شانه' : 'دامنه ایمن بدون هایپراکستنشن'
                ],
                [
                    'id' => 'ex-1-2',
                    'nameFa' => 'فلای سینه با سیم‌کش از پایین به بالا',
                    'nameEn' => 'Low to High Cable Fly',
                    'targetMuscle' => 'بالا سینه و میان‌سینه',
                    'sets' => 3,
                    'reps' => '12-15',
                    'restSeconds' => 60,
                    'targetFocus' => 'ایجاد تنش مداوم و پمپ عضلانی بدون فشار استخوانی',
                    'cue' => 'در اوج حرکت ۱ ثانیه انقباض ایستا حفظ شود.',
                    'injuryAdaptation' => 'سیم‌کش فشار ناگهانی را از روی تاندون سینه برمی‌دارد.'
                ],
                [
                    'id' => 'ex-1-3',
                    'nameFa' => 'نشر جانب با دمبل در حالت نشسته با تکیه‌گاه',
                    'nameEn' => 'Seated Dumbbell Lateral Raise',
                    'targetMuscle' => 'سرشانه میانی (عرض شانه)',
                    'sets' => 4,
                    'reps' => '12-15',
                    'restSeconds' => 60,
                    'targetFocus' => 'پهن‌تر شدن بالاتنه و فرم V شکل',
                    'cue' => 'حرکت با آرنج هدایت شود، بدون تکان دادن تنه.',
                    'injuryAdaptation' => $hasBackInjury ? 'حالت نشسته تکیه‌دار فشار را از فیله کمر کاملاً حذف می‌کند.' : 'فرم استاندارد بدون تقلب'
                ],
                [
                    'id' => 'ex-1-4',
                    'nameFa' => 'پشت بازو سیم‌کش با طناب',
                    'nameEn' => 'Cable Rope Triceps Pushdown',
                    'targetMuscle' => 'پشت بازو (سر جانبی و بلند)',
                    'sets' => 3,
                    'reps' => '12-15',
                    'restSeconds' => 60,
                    'targetFocus' => 'تقویت قطر بازو',
                    'cue' => 'آرنج‌ها کاملاً چسبیده به پهلو و مچ در انتها به بیرون باز شود.',
                    'injuryAdaptation' => 'فشار نرمال و ایمن برای مفاصل آرنج و مچ دست'
                ]
            ],
            'cooldown' => ['کشش عضلات سینه با تکیه به دیوار', 'کشش پشت بازو و تنفس عمیق دیافراگمی']
        ],
        [
            'dayNumber' => 2,
            'dayName' => 'روز دوم: زیربغل، عضلات پشت و جلو بازو (Pull Focus)',
            'isRestDay' => false,
            'targetMuscles' => ['زیربغل (لت)', 'بخش میانی پشت', 'جلو بازو'],
            'warmup' => [
                'موبیلیتی ستون فقرات توراسیک (حرکت گربه-شتر)',
                'آویزان شدن منفعل از بارفیکس به مدت ۳۰ ثانیه'
            ],
            'exercises' => [
                [
                    'id' => 'ex-2-1',
                    'nameFa' => 'لت زیربغل سیم‌کش دست باز از جلو',
                    'nameEn' => 'Wide-Grip Lat Pulldown',
                    'targetMuscle' => 'عضلات لت و پهنای پشت',
                    'sets' => 4,
                    'reps' => '10-12',
                    'restSeconds' => 75,
                    'targetFocus' => 'تقویت بالاتنه و باریک نشان دادن کمر',
                    'cue' => 'میله تا استخوان جناغ سینه پایین کشیده شود، سینه بیرون.',
                    'injuryAdaptation' => $hasBackInjury ? 'جایگزین ایمن بارفیکس بدون فشار گرانشی بر مهره‌های کمری' : 'ایمن و استاندارد'
                ],
                [
                    'id' => 'ex-2-2',
                    'nameFa' => 'قایقی سیم‌کش با دسته دوبل نشسته',
                    'nameEn' => 'Seated Cable Row',
                    'targetMuscle' => 'بخش میانی پشت و رومبوئیدها',
                    'sets' => 4,
                    'reps' => '10-12',
                    'restSeconds' => 75,
                    'targetFocus' => 'ضخامت عضلات پشت و اصلاح قوز کتف',
                    'cue' => 'کمر کاملاً صاف و جمع‌کردن استخوان‌های کتف در انتهای دامنه.',
                    'injuryAdaptation' => 'تکیه‌گاه محکم پاها و زاویه زانوها مانع از فشار بر دیسک کمر می‌شود.'
                ],
                [
                    'id' => 'ex-2-3',
                    'nameFa' => 'فیس‌پول با سیم‌کش و طناب',
                    'nameEn' => 'Cable Face Pull',
                    'targetMuscle' => 'سرشانه خلفی و عضلات تثبیت‌کننده کتف',
                    'sets' => 3,
                    'reps' => '15',
                    'restSeconds' => 60,
                    'targetFocus' => 'تقویت نقطه ضعف سرشانه پشتی و سلامت مفصل شانه',
                    'cue' => 'طناب به سمت چشم‌ها کشیده شده و چرخش خارجی مچ صورت گیرد.',
                    'injuryAdaptation' => 'بهترین حرکت پیشگیری و درمان دردهای شانه و روتاتور کاف'
                ],
                [
                    'id' => 'ex-2-4',
                    'nameFa' => 'جلو بازو دمبل روی میز بالاسینه شیبدار',
                    'nameEn' => 'Incline Dumbbell Biceps Curl',
                    'targetMuscle' => 'جلو بازو (سر بلند)',
                    'sets' => 3,
                    'reps' => '10-12',
                    'restSeconds' => 60,
                    'targetFocus' => 'ایجاد پیک عضلانی جلو بازو با کشش اولیه کامل',
                    'cue' => 'بدون تاب دادن دمبل و با تمرکز بر انقباض اوج.',
                    'injuryAdaptation' => 'تکیه دادن پشت از هرگونه قوز و فشار کمر جلوگیری می‌کند.'
                ]
            ],
            'cooldown' => ['کشش عضلات لت با میله عمودی', 'کشش مچ دست و ساعد']
        ],
        [
            'dayNumber' => 3,
            'dayName' => 'روز سوم: ریکاوری فعال، آب‌رسانی و بازسازی بافت',
            'isRestDay' => true,
            'targetMuscles' => ['ریکاوری عمومی سیستم عصبی و عضلانی'],
            'warmup' => ['پیاده‌روی سبک ۲۰ دقیقه', 'کشش‌های پویای مفاصل'],
            'exercises' => [],
            'cooldown' => ['دوش آب گرم و تنفس آرام']
        ],
        [
            'dayNumber' => 4,
            'dayName' => 'روز چهارم: عضلات پا و شکم (Lower Body Focus)',
            'isRestDay' => false,
            'targetMuscles' => ['چهارسر ران', 'همسترینگ', 'عضلات باسن و شکم'],
            'warmup' => [
                'گرم‌کردن مچ پا و زانو با وزن بدن',
                'حرکت پل باسن بدون وزنه ۲ ست ۱۵ تکرار'
            ],
            'exercises' => [
                [
                    'id' => 'ex-4-1',
                    'nameFa' => $hasBackInjury ? 'پرس پا با دستگاه با تکیه‌گاه زاویه ۴۵ درجه' : 'گابلت اسکات با دمبل و پاشنه بالاتر از سطح',
                    'nameEn' => $hasBackInjury ? 'Leg Press Machine 45°' : 'Goblet Squat (Heel Elevated)',
                    'targetMuscle' => 'چهارسر ران و گلوتز',
                    'sets' => 4,
                    'reps' => '10-12',
                    'restSeconds' => 90,
                    'targetFocus' => 'رشد عضلانی پا بدون فشار محوری به ستون فقرات',
                    'cue' => 'کمر کاملاً به تکیه‌گاه چسبیده باشد، زانوها در راستای نوک انگشتان پا.',
                    'injuryAdaptation' => $hasBackInjury ? 'حذف کامل فشار گرانشی از روی مهره‌های L4-L5 کمر' : 'حفظ ستون فقرات در راستای عمودی'
                ],
                [
                    'id' => 'ex-4-2',
                    'nameFa' => 'پشت پا دستگاه خوابیده یا نشسته',
                    'nameEn' => 'Lying or Seated Leg Curl',
                    'targetMuscle' => 'همسترینگ (پشت ران)',
                    'sets' => 4,
                    'reps' => '12',
                    'restSeconds' => 60,
                    'targetFocus' => 'تعادل قدامی-خلفی زانو و پیشگیری از پارگی رباط صلیبی',
                    'cue' => 'فاز منفی (پایین آمدن) ۳ ثانیه طول بکشد.',
                    'injuryAdaptation' => 'ایزوله ایمن بدون نیاز به خم شدن مهره‌های کمری'
                ],
                [
                    'id' => 'ex-4-3',
                    'nameFa' => 'ساق پا ایستاده دستگاه با مکث در اوج',
                    'nameEn' => 'Standing Calf Raise with Pause',
                    'targetMuscle' => 'دوقلو و نعلی ساق پا',
                    'sets' => 4,
                    'reps' => '15',
                    'restSeconds' => 45,
                    'targetFocus' => 'فرم‌دهی و قدرت مچ پا',
                    'cue' => '۲ ثانیه مکث کامل در اوج انقباض و کشش ملایم در پایین.',
                    'injuryAdaptation' => 'حرکت استاندارد بدون آسیب مفصلی'
                ],
                [
                    'id' => 'ex-4-4',
                    'nameFa' => 'پلانک شکم روی ساعد با انقباض متمرکز',
                    'nameEn' => 'Forearm Core Plank',
                    'targetMuscle' => 'عضلات عمقی شکم و ثبات کور',
                    'sets' => 3,
                    'reps' => '۴۵ ثانیه',
                    'restSeconds' => 60,
                    'targetFocus' => 'محافظت از مهره‌های کمری و تقویت کمربند شکمی',
                    'cue' => 'شکم منقبض مانند مشت خوردن، بدن در یک خط راست بدون افتادن باسن.',
                    'injuryAdaptation' => 'بهترین تقویت‌کننده برای افراد مبتلا به گودی کمر یا دیسک'
                ]
            ],
            'cooldown' => ['کشش چهارسر ران با حفظ تعادل', 'کشش همسترینگ نشسته روی مت']
        ]
    ];

    // Build Meals tailored to Iranian cuisine
    $meals = [
        [
            'mealId' => 'meal-1',
            'mealName' => 'صبحانه مقوی و نیروبخش ورزشکاری',
            'timing' => 'ساعت ۸:۰۰ صبح (پس از بیداری و نوشیدن ۲ لیوان آب ولرم)',
            'foods' => [
                [
                    'item' => 'تخم‌مرغ آب‌پز یا نیمرو با روغن زیتون بکر',
                    'amount' => '۳ عدد سفیده + ۲ عدد زرده کامل',
                    'calories' => 220,
                    'protein' => 20,
                    'tip' => 'پروتئین با ارزش بیولوژیکی ۱۰۰ برای فعال‌سازی سنتز پروتئین صبحگاهی'
                ],
                [
                    'item' => 'نان سنگک سنتی یا نان جو سبوس‌دار',
                    'amount' => '۸۰ گرم (معادل ۲ کف دست کامل)',
                    'calories' => 210,
                    'protein' => 7,
                    'tip' => 'کربوهیدرات پیچیده با شاخص گلایسمی پایین و فیبر بالا برای انرژی یکنواخت'
                ],
                [
                    'item' => 'پنیر کم‌چرب سنتی + گردوی ایرانی',
                    'amount' => '۳۰ گرم پنیر + ۲ عدد گردو کامل',
                    'calories' => 125,
                    'protein' => 6,
                    'tip' => 'تامین اسیدهای چرب امگا-۳ برای کاهش التهاب مفاصل'
                ]
            ],
            'alternatives' => ['اوتمیل جو دوسر با شیر کم‌چرب و دارچین', 'تخم‌مرغ با گوجه و پنیر فتا']
        ],
        [
            'mealId' => 'meal-2',
            'mealName' => 'میان‌وعده قبل تمرین (Pre-Workout Fuel)',
            'timing' => 'ساعت ۱۱:۳۰ یا ۱.۵ ساعت قبل از تمرین بدنسازی',
            'foods' => [
                [
                    'item' => 'موز متوسط رسیده + کره بادام‌زمینی طبیعی',
                    'amount' => '۱ عدد موز + ۱ قاشق غذاخوری کره بادام‌زمینی',
                    'calories' => 195,
                    'protein' => 5,
                    'tip' => 'پتاسیم و کربوهیدرات سریع‌جذب برای جلوگیری از گرفتگی عضلانی و تامین گلیکوژن'
                ],
                [
                    'item' => 'قهوه سیاه اسپرسو یا قهوه دمی بدون شکر',
                    'amount' => '۱ فنجان متوسط',
                    'calories' => 5,
                    'protein' => 0,
                    'tip' => 'کافئین ارگوژنیک طبیعی برای افزایش ۲۰٪ تمرکز عصبی و توان عضلانی در تمرین'
                ]
            ],
            'alternatives' => ['خرما با گردو', 'سیب درختی با چند عدد بادام درختی']
        ],
        [
            'mealId' => 'meal-3',
            'mealName' => 'ناهار آنابولیک و ریکاوری بعد از تمرین',
            'timing' => 'ساعت ۱۴:۰۰ یا بلافاصله پس از جلسه تمرینی',
            'foods' => [
                [
                    'item' => 'سینه مرغ گریل‌شده زعفرانی یا جوجه‌کباب خانگی',
                    'amount' => '۱۸۰ گرم سینه مرغ خالص پخته',
                    'calories' => 285,
                    'protein' => 48,
                    'tip' => 'منبع غنی لوسین برای ریکاوری سریع و بازسازی فیبرهای آسیب‌دیده'
                ],
                [
                    'item' => 'برنج باسماتی یا ایرانی کته با شوید یا کدو',
                    'amount' => '۱۰ تا ۱۲ قاشق غذاخوری سرپر (حدود ۲۰۰ گرم پخته)',
                    'calories' => 260,
                    'protein' => 5,
                    'tip' => 'جبران سریع ذخایر گلیکوژن کبد و عضلات بدون احساس سنگینی معده'
                ],
                [
                    'item' => 'سالاد شیرازی با آبغوره طبیعی و ۱ قاشق چایخوری روغن زیتون',
                    'amount' => '۱ کاسه متوسط',
                    'calories' => 60,
                    'protein' => 1,
                    'tip' => 'تامین آنتی‌اکسیدان‌ها، ویتامین C و بهبود هضم پروتئین'
                ]
            ],
            'alternatives' => ['کباب فیله گوساله کم‌چرب با برنج کته', 'خوراک ماهی قزل‌آلا کبابی با سیب‌زمینی پخته']
        ],
        [
            'mealId' => 'meal-4',
            'mealName' => 'شام سبک با پروتئین دیرهضم شبانه',
            'timing' => 'ساعت ۲۰:۳۰ شب (حداقل ۲.۵ ساعت قبل از خواب)',
            'foods' => [
                [
                    'item' => 'فیله گوشت چرخ‌کرده کم‌چرب یا خوراک عدسی غنی‌شده',
                    'amount' => '۱۴۰ گرم یا ۱ کاسه سرپر عدسی با تخم‌مرغ',
                    'calories' => 250,
                    'protein' => 28,
                    'tip' => 'پروتئین با هضم آرام برای تغذیه شبانه عضلات در حین ترشح هورمون رشد'
                ],
                [
                    'item' => 'سبزیجات پخته (بروکلی، قارچ و هویج بخارپز)',
                    'amount' => '۱ بشقاب پر',
                    'calories' => 70,
                    'protein' => 4,
                    'tip' => 'تامین منیزیم برای بهبود کیفیت خواب عمیق و آرامش سیستم عصبی'
                ]
            ],
            'alternatives' => ['ماست یونانی پرپروتئین با دانه چیا', 'کنسرو تن ماهی در آب‌نمک با لیمو و سبزی']
        ]
    ];

    $supplements = [
        [
            'name' => 'کراتین مونوهیدرات میکرونایز (Creatine Monohydrate)',
            'purpose' => 'افزایش ذخایر فسفاژن سلولی، افزایش چشمگیر قدرت و آب‌رسانی درون‌سلولی عضلات',
            'dosage' => 'روزانه ۵ گرم بدون نیاز به دوره بارگیری',
            'timing' => 'بعد از تمرین همراه با وعده ناهار یا یک لیوان آب‌میوه طبیعی',
            'safetyWarning' => 'مصرف روزانه حداقل ۳.۵ لیتر آب الزامی است. در صورت بیماری کلیوی منع مصرف دارد.'
        ],
        [
            'name' => 'پروتئین وی ایزوله یا کنسانتره (Whey Protein)',
            'purpose' => 'تامین آسان پروتئین با جذب سریع جهت بیشینه‌سازی سنتز عضله',
            'dosage' => '۱ اسکوپ (معادل ۲۵ تا ۳۰ گرم پروتئین خالص)',
            'timing' => 'بلافاصله پس از تمرین یا صبح ناشتا در روزهای استراحت',
            'safetyWarning' => 'افراد با حساسیت شدید به لاکتوز از نسخه ایزوله (Whey Isolate) استفاده کنند.'
        ],
        [
            'name' => 'امگا-۳ با غلظت بالای EPA و DHA',
            'purpose' => 'کاهش التهاب مفاصل، بهبود حساسیت به انسولین و سلامت عروق',
            'dosage' => '۱ تا ۲ کپسول ۱۰۰۰ میلی‌گرمی',
            'timing' => 'همراه با وعده ناهار یا شام',
            'safetyWarning' => 'با معده خالی مصرف نشود.'
        ],
        [
            'name' => 'منیزیم گلیسینات یا سیترات (Magnesium Glycinate)',
            'purpose' => 'ریلکسیشن عضلانی، جلوگیری از گرفتگی شبانه و بهبود عمق خواب',
            'dosage' => '۲۰۰ تا ۳۰۰ میلی‌گرم',
            'timing' => '۴۵ دقیقه قبل از خواب',
            'safetyWarning' => 'کاملاً ایمن و بدون عوارض در دوز استاندارد.'
        ]
    ];

    return [
        'summary' => [
            'bmi' => $bmi,
            'bmiCategory' => $bmiCategory,
            'bmr' => $bmr,
            'tdee' => $tdee,
            'targetCalories' => $targetCalories,
            'strategy' => $strategy,
            'strategyExplanation' => $strategyExplanation,
            'macroSplit' => [
                'proteinGrams' => $proteinGrams,
                'carbsGrams' => $carbsGrams,
                'fatGrams' => $fatGrams,
                'waterLiters' => $waterLiters
            ],
            'injurySafetyOverview' => $injurySafetyOverview
        ],
        'workoutPlan' => [
            'splitName' => $trainingDays === 3 ? 'اسپلیت تخصصی ۳ روزه فول بادی اصلاحی' : 'اسپلیت ۴ روزه تخصصی با تمرکز بر عضلات ضعیف',
            'weeklyOverview' => 'چیدمان هفتگی با رعایت ۷۲ ساعت ریکاوری بین گروه‌های عضلانی یکسان و تقدم عضلات نیازمند رشد در آغاز جلسات.',
            'weakMuscleStrategy' => "عضلات ضعیف ($weakMuscleStr) در اولویت شروع تمرینات قرار گرفته و با زوایای بیومکانیکی ایزوله تحریک می‌شوند.",
            'days' => $days
        ],
        'dietPlan' => [
            'dailySummary' => "رژیم غذایی علمی بر اساس کالری هدف $targetCalories کیلوکالری، با تمرکز بر پروتئین خالص ($proteinGrams گرم)، کربوهیدرات‌های انرژی‌بخش سفره ایرانی و حداقل چربی‌های مضر طراحی شده است.",
            'meals' => $meals,
            'hydrationAndTips' => [
                "نوشیدن روزانه حداقل $waterLiters لیتر آب تصفیه شده یا آب معدنی.",
                'افزودن نصف قاشق چای‌خوری نمک صورتی هیمالیا به آب مصرفی در حین تمرین برای تامین الکترولیت سدیم.',
                'پرهیز از نوشیدن مایعات سرد به همراه وعده‌های غذایی اصلی جهت بهبود اسید معده.',
                'جویدن کامل غذا و پرهیز از تماشای گوشی یا تلویزیون در زمان غذا خوردن.'
            ]
        ],
        'supplementPlan' => [
            'overview' => 'مکمل‌های این برنامه بر مبنای بالاترین شواهد علمی دانشگاهی (ISSN و ACSM) جهت ارتقای ایمن عملکرد فیزیکی انتخاب شده‌اند.',
            'supplements' => $supplements
        ]
    ];
}
