import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { generateScientificFallbackPlan } from "./src/utils/fallbackPlanGenerator.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));

// Health Check Endpoint
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", time: new Date().toISOString() });
});

// Initialize Google Gen AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Endpoint: Generate Full Bodybuilding & Nutrition Program
app.post("/api/generate-plan", async (req, res) => {
  try {
    const profile = req.body;

    if (!profile.weight || !profile.height) {
      return res.status(400).json({ error: "وزن و قد الزامی هستند." });
    }

    const systemInstruction = `تو «گُرد» (GORD)، مربی ارشد، مقتدر و دلسوز بدنسازی (IFBB Pro Coach)، متخصص تغذیه ورزشی بالینی و فیزیوتراپیست با روحیه پهلوانی، انگیزه‌بخش و ۲۰ سال سابقه علمی هستی.
وظیفه تو طراحی یک برنامه فوق‌العاده دقیق، علمی، حرفه‌ای و شخصی‌سازی شده برای بدنسازی و تغذیه کاربر است.

ویژگی‌های اساسی که باید در طراحی برنامه رعایت شوند:
۱. تحلیل دقیق فیزیکی (BMI, BMR, TDEE، کالری هدف، گرم پروتئین، کربوهیدرات و چربی، آب روزانه).
۲. تمرکز ویژه بر عضلات ضعیف (Weak Muscles): برای این عضلات حجم تمرینی هوشمند، اولویت در شروع جلسه، زوایای گوناگون و تکنیک‌های شدت‌دهنده مانند رست-پاز یا سوپرست مناسب لحاظ شود.
۳. مراقبت کامل و اکید از آسیب‌دیدگی‌ها (Injuries) و محدودیت‌های فیزیکی:
   - اگر فرد دیسک کمر دارد، حرکات با فشار محوری سنگین (مانند اسکات سنگین با هالتر یا ددلیفت پرفشار) به هیچ عنوان داده نشود و جایگزین‌های امن مانند پرس پا اصلاح شده، لگ اکسپنشن یا گابلت اسکات با تکیه‌گاه داده شود.
   - اگر آسیب شانه دارد، حرکات پشت گردن یا پرس بالاسینه زاویه تند حذف و جایگزین‌های بیومکانیکی داده شود.
   - در فیلد injuryAdaptation هر حرکت دقیقاً ذکر شود چرا و چگونه امن است.
۴. در نظر گرفتن بیماری‌های خاص (Medical conditions) مانند کبد چرب، دیابت، فشار خون، تیروئید و... در رژیم غذایی و ضربان تمرینی.
۵. حذف کامل غذاهای آلرژی‌زا (Allergies) برای کاربر و ارائه گزینه‌های مغذی در دسترس در سفره ایرانی.
۶. احترام به ترجیحات غذایی (سنتی ایرانی، پرپروتئین، اقتصادی، کتو، گیاهی و...).
۷. تمامی متون و توضیحات به زبان فارسی روان، علمی، انگیزه‌بخش و دقیق باشد.

خروجی باید دقیقاً ساختار JSON معتبر داشته باشد.`;

    const heightM = (profile.height || 175) / 100;
    const weight = profile.weight || 75;
    const age = profile.age || 28;
    const bmiVal = Number((weight / (heightM * heightM)).toFixed(1));
    const bmrVal = Math.round(
      profile.gender === "female"
        ? 10 * weight + 6.25 * (profile.height || 175) - 5 * age - 161
        : 10 * weight + 6.25 * (profile.height || 175) - 5 * age + 5
    );
    const actMap: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    const factor = actMap[profile.activityLevel || "moderate"] || 1.55;
    const tdeeVal = Math.round(bmrVal * factor);
    let targetCalVal = tdeeVal;
    if (profile.goal === "muscle_gain") targetCalVal = tdeeVal + 350;
    else if (profile.goal === "fat_loss") targetCalVal = tdeeVal - 450;
    else if (profile.goal === "strength") targetCalVal = tdeeVal + 200;

    const proteinGramsVal = Math.round(weight * (profile.goal === "fat_loss" ? 2.2 : 2.0));
    const fatGramsVal = Math.round((targetCalVal * 0.25) / 9);
    const carbsGramsVal = Math.max(100, Math.round((targetCalVal - (proteinGramsVal * 4 + fatGramsVal * 9)) / 4));
    const waterLitersVal = Number((weight * 0.04).toFixed(1));

    const userPrompt = `مشخصات متقاضی برای طراحی برنامه بدنسازی و تغذیه با هوش مصنوعی Google Gemini:
- جنسیت: ${profile.gender === "female" ? "خانم" : "آقا"}
- سن: ${profile.age || "۳۰"} سال
- وزن فعلی: ${profile.weight} کیلوگرم
- قد: ${profile.height} سانتی‌متر
- وزن دلخواه: ${profile.targetWeight ? profile.targetWeight + " کیلوگرم" : "متناسب با هدف"}
- هدف ورزشی: ${profile.goal || "عضله‌سازی و فرم‌دهی بدنی"}
- میزان فعالیت روزانه: ${profile.activityLevel || "متوسط"}
- سابقه و سطح تمرینی: ${profile.experienceLevel || "متوسط"}
- روزهای تمرین در هفته: ${profile.trainingDaysPerWeek || 4} روز در هفته
- محل تمرین و تجهیزات: ${profile.location || "باشگاه کامل بدنسازی"}
- ترجیح رژیم غذایی: ${profile.dietaryPreference || "متعادل با غذای ایرانی"}
- تعداد وعده‌های غذایی در روز: ${profile.mealsPerDay || 4} وعده
- محاسبات بالینی:
  * BMI: ${bmiVal}
  * BMR پایه: ${bmrVal} kcal
  * TDEE کل: ${tdeeVal} kcal
  * کالری هدف: ${targetCalVal} kcal
  * درشت‌مغذی‌ها: پروتئین ${proteinGramsVal}g، کربوهیدرات ${carbsGramsVal}g، چربی ${fatGramsVal}g، آب ${waterLitersVal} لیتر
- عضلات ضعیف که نیاز به توجه و تقویت دارند: ${
      Array.isArray(profile.weakMuscles) && profile.weakMuscles.length > 0
        ? profile.weakMuscles.join("، ")
        : "تمام عضلات به صورت متوازن"
    }
- عضلات نقطه قوت که می‌خواهد بهتر شوند: ${
      Array.isArray(profile.strongMuscles) && profile.strongMuscles.length > 0
        ? profile.strongMuscles.join("، ")
        : "عضلات متوازن"
    }
- آسیب‌دیدگی‌ها و محدودیت‌های بدنی: ${
      Array.isArray(profile.injuries) && profile.injuries.length > 0
        ? profile.injuries.join("، ")
        : "بدون آسیب‌دیدگی گزارش شده"
    }
- حساسیت‌های غذایی: ${
      Array.isArray(profile.allergies) && profile.allergies.length > 0
        ? profile.allergies.join("، ")
        : "بدون حساسیت خاص"
    }
- بیماری‌های خاص: ${
      Array.isArray(profile.medicalConditions) && profile.medicalConditions.length > 0
        ? profile.medicalConditions.join("، ")
        : "سالم / بدون بیماری زمینه‌ای"
    }
- توضیحات تکمیلی متقاضی: ${profile.extraNotes || "ندارد"}

لطفاً برنامه کامل بدنسازی و تغذیه را با دقت بسیار بالا به فرمت JSON تولید کن.`;

    const planSchema = {
      type: Type.OBJECT,
      properties: {
        summary: {
          type: Type.OBJECT,
          properties: {
            bmi: { type: Type.NUMBER, description: "شاخص توده بدنی" },
            bmiCategory: { type: Type.STRING, description: "دسته‌بندی BMI" },
            bmr: { type: Type.NUMBER, description: "متابولیسم پایه کالری" },
            tdee: { type: Type.NUMBER, description: "کالری مصرفی کل روزانه" },
            targetCalories: { type: Type.NUMBER, description: "کالری هدف روزانه" },
            strategy: { type: Type.STRING, description: "استراتژی برنامه (مثلا افزایش حجم عضلانی خشک با شیب ملایم)" },
            strategyExplanation: { type: Type.STRING, description: "توضیح تفصیلی علت انتخاب این استراتژی بر اساس شرایط بدنی فرد" },
            macroSplit: {
              type: Type.OBJECT,
              properties: {
                proteinGrams: { type: Type.NUMBER, description: "گرم پروتئین روزانه" },
                carbsGrams: { type: Type.NUMBER, description: "گرم کربوهیدرات روزانه" },
                fatGrams: { type: Type.NUMBER, description: "گرم چربی سالم روزانه" },
                waterLiters: { type: Type.NUMBER, description: "لیتر آب روزانه" },
              },
              required: ["proteinGrams", "carbsGrams", "fatGrams", "waterLiters"],
            },
            injurySafetyOverview: {
              type: Type.STRING,
              description: "توضیحات کلیدی در مورد نحوه ایمن‌سازی تمرینات با توجه به آسیب‌ها و بیماری‌های فرد",
            },
          },
          required: [
            "bmi",
            "bmiCategory",
            "bmr",
            "tdee",
            "targetCalories",
            "strategy",
            "strategyExplanation",
            "macroSplit",
            "injurySafetyOverview",
          ],
        },
        workoutPlan: {
          type: Type.OBJECT,
          properties: {
            splitName: { type: Type.STRING, description: "نام سیستم تمرینی" },
            weeklyOverview: { type: Type.STRING, description: "مرور ساختار هفتگی" },
            weakMuscleStrategy: { type: Type.STRING, description: "راهبرد اختصاصی اعمال شده برای رشد عضلات ضعیف" },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  dayName: { type: Type.STRING, description: "عنوان روز تمرینی یا استراحت فعال" },
                  isRestDay: { type: Type.BOOLEAN },
                  targetMuscles: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  warmup: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "پروتکل گرم کردن اختصاصی و موبیلیتی مفصلی",
                  },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        nameFa: { type: Type.STRING, description: "نام فارسی حرکت" },
                        nameEn: { type: Type.STRING, description: "نام انگلیسی استاندارد حرکت" },
                        targetMuscle: { type: Type.STRING, description: "عضله هدف" },
                        sets: { type: Type.INTEGER, description: "تعداد ست" },
                        reps: { type: Type.STRING, description: "دامنه تکرار مثلا 8-10 یا 12-15" },
                        restSeconds: { type: Type.INTEGER, description: "زمان استراحت بین ست به ثانیه" },
                        targetFocus: { type: Type.STRING, description: "دلیل و تمرکز حرکت (مثلا تقویت نقطه ضعف)" },
                        cue: { type: Type.STRING, description: "نکته بیومکانیکی و فرم اجرای صحیح" },
                        injuryAdaptation: {
                          type: Type.STRING,
                          description: "نکته ایمنی یا تطبیق با آسیب‌های فرد (یا تایید بی‌خطر بودن)",
                        },
                      },
                      required: [
                        "id",
                        "nameFa",
                        "nameEn",
                        "targetMuscle",
                        "sets",
                        "reps",
                        "restSeconds",
                        "targetFocus",
                        "cue",
                        "injuryAdaptation",
                      ],
                    },
                  },
                  cooldown: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "سرد کردن و کشش ایستا",
                  },
                },
                required: ["dayNumber", "dayName", "isRestDay", "targetMuscles", "warmup", "exercises", "cooldown"],
              },
            },
          },
          required: ["splitName", "weeklyOverview", "weakMuscleStrategy", "days"],
        },
        dietPlan: {
          type: Type.OBJECT,
          properties: {
            dailySummary: { type: Type.STRING, description: "خلاصه اصول تغذیه این برنامه" },
            meals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  mealId: { type: Type.STRING },
                  mealName: { type: Type.STRING, description: "نام وعده (مثلا صبحانه مقوی، قبل تمرین، ناهار...)" },
                  timing: { type: Type.STRING, description: "زمان پیشنهادی مصرف" },
                  foods: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        item: { type: Type.STRING, description: "نام ماده غذایی" },
                        amount: { type: Type.STRING, description: "مقدار دقیق (مثلا ۱۲۰ گرم، ۲ عدد)" },
                        calories: { type: Type.NUMBER, description: "کالری تقریبی" },
                        protein: { type: Type.NUMBER, description: "پروتئین تقریبی به گرم" },
                        tip: { type: Type.STRING, description: "نکته پخت یا مصرف" },
                      },
                      required: ["item", "amount", "calories", "protein"],
                    },
                  },
                  alternatives: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "جایگزین‌های هم‌ارز و در دسترس ایرانی",
                  },
                },
                required: ["mealId", "mealName", "timing", "foods", "alternatives"],
              },
            },
            hydrationAndTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "نکات نوشیدن آب، الکترولیت‌ها و مدیریت اشتها",
            },
          },
          required: ["dailySummary", "meals", "hydrationAndTips"],
        },
        supplementPlan: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING, description: "رویکرد مصرف مکمل بر اساس سلامت فرد" },
            supplements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "نام مکمل" },
                  purpose: { type: Type.STRING, description: "علت تجویز" },
                  dosage: { type: Type.STRING, description: "دوز و نحوه مصرف" },
                  timing: { type: Type.STRING, description: "زمان دقیق مصرف" },
                  safetyWarning: {
                    type: Type.STRING,
                    description: "نکات ایمنی با توجه به بیماری‌ها یا حساسیت‌های فرد",
                  },
                  isEssential: { type: Type.BOOLEAN, description: "آیا ضروری است یا اختیاری" },
                },
                required: ["name", "purpose", "dosage", "timing", "safetyWarning", "isEssential"],
              },
            },
          },
          required: ["overview", "supplements"],
        },
        recoveryAndRehab: {
          type: Type.OBJECT,
          properties: {
            sleepGuideline: { type: Type.STRING, description: "راهنمای خواب و ترشح هورمون رشد" },
            rehabExercises: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "تمرینات فیزیوتراپی و اصلاحی سبک برای آسیب‌ها و نقاط ضعف",
            },
            warningSignsToStop: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "علائم هشدار که در صورت احساس باید تمرین متوقف شود",
            },
          },
          required: ["sleepGuideline", "rehabExercises", "warningSignsToStop"],
        },
      },
      required: ["summary", "workoutPlan", "dietPlan", "supplementPlan", "recoveryAndRehab"],
    };

    let planData: any = null;
    let attempts = 0;
    const maxAttempts = 1;

    while (attempts < maxAttempts && !planData) {
      try {
        attempts++;
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: userPrompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: planSchema,
          },
        });
        if (response.text) {
          planData = JSON.parse(response.text);
        }
      } catch (genErr: any) {
        console.warn(`Gemini generation error:`, genErr?.message || genErr);
      }
    }

    if (!planData || !planData.summary || !planData.workoutPlan) {
      console.log("Serving scientific tailored fallback plan for profile:", profile.goal);
      planData = generateScientificFallbackPlan(profile);
    } else {
      // Guarantee numerical precision for UI display
      if (!planData.summary.bmi) planData.summary.bmi = bmiVal;
      if (!planData.summary.bmr) planData.summary.bmr = bmrVal;
      if (!planData.summary.tdee) planData.summary.tdee = tdeeVal;
      if (!planData.summary.targetCalories) planData.summary.targetCalories = targetCalVal;
      if (!planData.summary.macroSplit) {
        planData.summary.macroSplit = {
          proteinGrams: proteinGramsVal,
          carbsGrams: carbsGramsVal,
          fatGrams: fatGramsVal,
          waterLiters: waterLitersVal,
        };
      } else {
        if (!planData.summary.macroSplit.proteinGrams) planData.summary.macroSplit.proteinGrams = proteinGramsVal;
        if (!planData.summary.macroSplit.carbsGrams) planData.summary.macroSplit.carbsGrams = carbsGramsVal;
        if (!planData.summary.macroSplit.fatGrams) planData.summary.macroSplit.fatGrams = fatGramsVal;
        if (!planData.summary.macroSplit.waterLiters) planData.summary.macroSplit.waterLiters = waterLitersVal;
      }
    }

    return res.json({ success: true, plan: planData });
  } catch (error: any) {
    console.error("Error generating bodybuilding plan:", error);
    try {
      const fallback = generateScientificFallbackPlan(req.body || {});
      return res.json({ success: true, plan: fallback });
    } catch {
      return res.status(500).json({
        error: "خطا در برقراری ارتباط با مدل هوش مصنوعی. لطفاً مجدداً تلاش کنید.",
        details: error?.message || String(error),
      });
    }
  }
});

// Endpoint: AI Coach Chat for follow-up questions
app.post("/api/chat-coach", async (req, res) => {
  try {
    const { message, planSummary, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "پیام ارسال نشده است." });
    }

    const systemInstruction = `تو مربی بدنسازی هوشمند و حرفه‌ای (AI Coach) کاربر هستی.
کاربر قبلاً برنامه بدنسازی و تغذیه اختصاصی خود را دریافت کرده و اکنون سوالی درباره تمرینات، جایگزین کردن حرکات، تغذیه، مکمل‌ها، اصلاح فرم یا آسیب‌دیدگی‌های خود دارد.
با لحنی حرفه‌ای، انگیزه‌بخش، دلسوزانه و مستند به علم روز ورزشی به زبان فارسی پاسخ بده.
پاسخ‌هایت باید مختصر، کاربردی و دقیق باشد. از ایجاد سردرگمی خودداری کن.`;

    const prompt = `خلاصه اطلاعات برنامه و مشخصات کاربر:
${planSummary ? JSON.stringify(planSummary) : "اطلاعات کلی بدنسازی"}

تاریخچه مکالمه اخیر:
${
  Array.isArray(history)
    ? history.map((h: any) => `${h.role === "user" ? "کاربر" : "مربی"}: ${h.text}`).join("\n")
    : ""
}

پیام جدید کاربر:
${message}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "هم‌اکنون پیام شما دریافت شد. در اجرای حرکات بر فاز منفی کنترل‌شده ۳ ثانیه‌ای و حفظ وضعیت ستون فقرات تمرکز فرمایید.";
    return res.json({ reply });
  } catch (error: any) {
    console.error("Error in coach chat:", error);
    return res.json({
      reply: "هم‌اکنون ارتباط هوش مصنوعی با ترافیک موقت مواجه شد. به عنوان اصل بنیادین، از افزایش ناگهانی وزنه بدون تسلط بر فرم صحیح پرهیز کنید و استراحت کافی بین ست‌ها داشته باشید.",
    });
  }
});

// Endpoint: AI Alternative Exercise Suggestion
app.post("/api/suggest-alternative", async (req, res) => {
  const { exercise, reason, customReason, injuries, location } = req.body || {};

  try {
    if (!exercise || !exercise.nameFa) {
      return res.status(400).json({ error: "اطلاعات حرکت ارسال نشده است." });
    }

    const systemInstruction = `تو یک مربی بدنسازی ارشد و متخصص بیومکانیک حرکتی هستی.
کاربر می‌خواهد برای حرکت فعلی خود یک حرکت جایگزین مناسب (Alternative Exercise) دریافت کند.
دلایل ممکن است نبود دستگاه/تجهیزات، درد و آسیب‌دیدگی در مفاصل، شلوغی باشگاه، یا نیاز به تنوع باشد.
حرکت جایگزین باید دقیقاً همان عضله هدف (${exercise.targetMuscle || "عضله هدف"}) را به طور موثر و بیومکانیکی هدف قرار دهد.
اگر کاربر آسیب خاصی دارد، حرکت جایگزین باید فشار را از روی مفصل آسیب‌دیده بردارد.
پاسخ باید در قالب JSON معتبر طبق ساختار تعیین‌شده برگردد.`;

    const userPrompt = `اطلاعات حرکت فعلی:
- نام فارسی: ${exercise.nameFa}
- نام انگلیسی: ${exercise.nameEn || ""}
- عضله هدف: ${exercise.targetMuscle}
- ست و تکرار فعلی: ${exercise.sets} ست × ${exercise.reps} تکرار
- علت درخواست جایگزینی: ${reason || "نبود تجهیزات یا درد مفصل"} ${customReason ? `(${customReason})` : ""}
- آسیب‌های احتمالی کاربر: ${Array.isArray(injuries) && injuries.length > 0 ? injuries.join("، ") : "بدون آسیب"}
- محل تمرین: ${location || "باشگاه بدنسازی"}

لطفاً یک حرکت جایگزین عالی، علمی، با همان تحریک عضلانی و ایمن به همراه نکات فرمی ارائه کن.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            alternative: {
              type: Type.OBJECT,
              properties: {
                nameFa: { type: Type.STRING, description: "نام فارسی حرکت جایگزین" },
                nameEn: { type: Type.STRING, description: "نام انگلیسی استاندارد حرکت جایگزین" },
                targetMuscle: { type: Type.STRING, description: "عضله هدف" },
                equipmentNeeded: { type: Type.STRING, description: "تجهیزات مورد نیاز مثلا دمبل، سیمکش، هالتر یا وزن بدن" },
                sets: { type: Type.INTEGER, description: "تعداد ست پیشنهادی" },
                reps: { type: Type.STRING, description: "دامنه تکرار پیشنهادی" },
                restSeconds: { type: Type.INTEGER, description: "زمان استراحت به ثانیه" },
                cue: { type: Type.STRING, description: "نکته بیومکانیکی و فرم صحیح اجرای حرکت جدید" },
                whyItsBetter: { type: Type.STRING, description: "توضیح کوتاه اینکه چرا این جایگزین برای شرایط فرد مناسب و امن است" },
                safetyNote: { type: Type.STRING, description: "ملاحظه ایمنی یا پیشگیری از درد مفصل" },
              },
              required: [
                "nameFa",
                "nameEn",
                "targetMuscle",
                "equipmentNeeded",
                "sets",
                "reps",
                "restSeconds",
                "cue",
                "whyItsBetter",
                "safetyNote",
              ],
            },
          },
          required: ["alternative"],
        },
      },
    });

    let alt = null;
    try {
      const parsed = JSON.parse(response.text || "{}");
      alt = parsed.alternative;
    } catch {}

    if (!alt) {
      alt = {
        nameFa: `دمبل ایزوله جایگزین ${exercise.targetMuscle}`,
        nameEn: `Dumbbell Alternative for ${exercise.nameEn || exercise.targetMuscle}`,
        targetMuscle: exercise.targetMuscle,
        equipmentNeeded: "دمبل با وزن قابل کنترل",
        sets: exercise.sets || 3,
        reps: exercise.reps || "10-12",
        restSeconds: exercise.restSeconds || 60,
        cue: "دامنه کنترل‌شده با مکث ۱ ثانیه‌ای در اوج انقباض و فاز منفی ۳ ثانیه‌ای",
        whyItsBetter: "کاهش فشار اهرمی بر روی تاندون‌ها و آزادی بیشتر مفاصل",
        safetyNote: "در صورت احساس هرگونه تیر کشیدن غیرطبیعی، وزنه را سبک‌تر کنید.",
      };
    }

    return res.json({ success: true, alternative: alt });
  } catch (error: any) {
    console.error("Error in alternative suggestion:", error);
    const fallbackAlt = {
      nameFa: `حرکت جایگزین اصلاحی ${exercise?.targetMuscle || "هدف"}`,
      nameEn: `Modified Alternative for ${exercise?.nameEn || "Exercise"}`,
      targetMuscle: exercise?.targetMuscle || "عضله هدف",
      equipmentNeeded: "دمبل یا وزن بدن",
      sets: exercise?.sets || 3,
      reps: exercise?.reps || "10-12",
      restSeconds: exercise?.restSeconds || 60,
      cue: "اجرای آهسته با تنفس منظم بدون قفل کردن مفاصل",
      whyItsBetter: "ایمنی بالاتر و تطبیق با شرایط فیزیکی کاربر",
      safetyNote: "دامنه حرکتی را در حد راحتی مفاصل خود حفظ کنید.",
    };
    return res.json({ success: true, alternative: fallbackAlt });
  }
});

// Serve frontend in production or setup vite in dev
async function setupServer() {
  const distPath = path.resolve(__dirname, "dist");
  const hasDist = fs.existsSync(path.join(distPath, "index.html"));
  const isProd = process.env.NODE_ENV === "production" || hasDist;

  if (isProd && hasDist) {
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn("Vite middleware failed, falling back to static:", e);
      if (hasDist) {
        app.use(express.static(distPath));
        app.get("*", (_req, res) => {
          res.sendFile(path.join(distPath, "index.html"));
        });
      }
    }
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`FitGen AI server listening on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
