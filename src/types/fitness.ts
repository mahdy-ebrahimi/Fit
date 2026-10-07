export interface UserProfile {
  // Physical stats
  gender: 'male' | 'female';
  age: number;
  weight: number; // kg
  height: number; // cm
  targetWeight: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'muscle_gain' | 'fat_loss' | 'body_recomp' | 'strength' | 'general_fitness';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  trainingDaysPerWeek: number;
  location: 'gym' | 'home_dumbbells' | 'bodyweight';

  // Specific muscular focus
  weakMuscles: string[];
  strongMuscles: string[];

  // Health and limitations
  injuries: string[];
  allergies: string[];
  medicalConditions: string[];

  // Nutrition
  dietaryPreference: string;
  mealsPerDay: number;

  // Extra notes
  extraNotes?: string;
}

export interface MacroSplit {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  waterLiters: number;
}

export interface PlanSummary {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  targetCalories: number;
  strategy: string;
  strategyExplanation: string;
  macroSplit: MacroSplit;
  injurySafetyOverview: string;
}

export interface Exercise {
  id: string;
  nameFa: string;
  nameEn: string;
  targetMuscle: string;
  sets: number;
  reps: string;
  restSeconds: number;
  targetFocus: string;
  cue: string;
  injuryAdaptation: string;
}

export interface WorkoutDay {
  dayNumber: number;
  dayName: string;
  isRestDay: boolean;
  targetMuscles: string[];
  warmup: string[];
  exercises: Exercise[];
  cooldown: string[];
}

export interface WorkoutPlan {
  splitName: string;
  weeklyOverview: string;
  weakMuscleStrategy: string;
  days: WorkoutDay[];
}

export interface FoodItem {
  item: string;
  amount: string;
  calories: number;
  protein: number;
  tip?: string;
}

export interface Meal {
  mealId: string;
  mealName: string;
  timing: string;
  foods: FoodItem[];
  alternatives: string[];
}

export interface DietPlan {
  dailySummary: string;
  meals: Meal[];
  hydrationAndTips: string[];
}

export interface Supplement {
  name: string;
  purpose: string;
  dosage: string;
  timing: string;
  safetyWarning: string;
  isEssential: boolean;
}

export interface SupplementPlan {
  overview: string;
  supplements: Supplement[];
}

export interface RecoveryAndRehab {
  sleepGuideline: string;
  rehabExercises: string[];
  warningSignsToStop: string[];
}

export interface BodyMetricLog {
  id: string;
  date: string;
  timestamp: number;
  weight: number;
  targetWeight: number;
  bodyFatPercentage?: number;
  waistCircumference?: number;
  chestCircumference?: number;
  armCircumference?: number;
  bmi: number;
  notes?: string;
}

export interface DailyCheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  weight?: number; // optional daily weight
  workoutCompleted: 'completed' | 'rest_day' | 'partial' | 'skipped';
  workoutAdherencePercent: number; // 0 to 100
  dietAdherencePercent: number; // 0 to 100
  waterLiters: number;
  energyLevel: 1 | 2 | 3 | 4 | 5; // 1 = very low, 5 = peak
  notes?: string;
}

export interface GeneratedPlan {
  summary: PlanSummary;
  workoutPlan: WorkoutPlan;
  dietPlan: DietPlan;
  supplementPlan: SupplementPlan;
  recoveryAndRehab: RecoveryAndRehab;
}

export interface SavedPlanItem {
  id: string;
  savedAt: string;
  title: string;
  plan: GeneratedPlan;
  profile: UserProfile;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  createdAt: string;
  lastLogin: string;
  profile: UserProfile | null;
  activePlan: GeneratedPlan | null;
  savedPlans: SavedPlanItem[];
}
