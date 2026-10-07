/**
 * Weight & Sets Tracking Utility
 * Stores and manages progressive overload workout logs in localStorage
 */

export interface ExerciseSetLog {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
  timestamp?: number;
}

export interface ExerciseSessionLog {
  exerciseId: string;
  exerciseName: string;
  sets: ExerciseSetLog[];
  date: string;
  notes?: string;
}

const STORAGE_PREFIX = 'fitgen_exercise_logs_';
const LAST_RECORDS_PREFIX = 'fitgen_last_record_';

/**
 * Calculate estimated One Rep Max (1RM) using the Epley formula:
 * 1RM = Weight * (1 + Reps / 30)
 */
export function calculate1RM(weightKg: number, reps: number): number {
  if (!weightKg || weightKg <= 0 || !reps || reps <= 0) return 0;
  if (reps === 1) return weightKg;
  return Math.round(weightKg * (1 + reps / 30));
}

/**
 * Calculate total volume load (Weight * Reps) for all completed sets
 */
export function calculateTotalVolume(sets: ExerciseSetLog[]): number {
  return sets
    .filter((s) => s.completed && s.weightKg > 0 && s.reps > 0)
    .reduce((sum, s) => sum + s.weightKg * s.reps, 0);
}

/**
 * Estimate safe recommended starting weight based on exercise target muscle and user stats
 */
export function getRecommendedStartingWeight(
  targetMuscle: string,
  gender: string = 'male',
  userWeight: number = 75,
  experience: string = 'intermediate'
): number {
  const isFemale = gender === 'female';
  const muscle = targetMuscle.toLowerCase();
  let baseFactor = 0.2; // default 20% of body weight for smaller muscles

  if (muscle.includes('سینه') || muscle.includes('chest')) {
    baseFactor = isFemale ? 0.35 : 0.6;
  } else if (muscle.includes('چهارسر') || muscle.includes('اسکات') || muscle.includes('quad') || muscle.includes('پا')) {
    baseFactor = isFemale ? 0.45 : 0.75;
  } else if (muscle.includes('زیربغل') || muscle.includes('پشت') || muscle.includes('لت') || muscle.includes('back')) {
    baseFactor = isFemale ? 0.35 : 0.55;
  } else if (muscle.includes('سرشانه') || muscle.includes('shoulder')) {
    baseFactor = isFemale ? 0.15 : 0.3;
  } else if (muscle.includes('جلو بازو') || muscle.includes('پشت بازو') || muscle.includes('arm')) {
    baseFactor = isFemale ? 0.12 : 0.25;
  }

  const expMulti = experience === 'beginner' ? 0.75 : experience === 'advanced' ? 1.25 : 1.0;
  const estimated = Math.round((userWeight * baseFactor * expMulti) / 2.5) * 2.5;
  return Math.max(5, estimated);
}

/**
 * Retrieve saved set logs for an exercise
 */
export function getSavedSetLogs(exerciseId: string, defaultSetsCount: number = 4): ExerciseSetLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + exerciseId);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to read exercise logs from storage:', e);
  }

  // Initialize empty template matching planned sets count
  const initialSets: ExerciseSetLog[] = [];
  for (let i = 1; i <= defaultSetsCount; i++) {
    initialSets.push({
      setNumber: i,
      weightKg: 0,
      reps: 10,
      completed: false,
    });
  }
  return initialSets;
}

/**
 * Save set logs for an exercise and update personal best record
 */
export function saveSetLogs(exerciseId: string, sets: ExerciseSetLog[]): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + exerciseId, JSON.stringify(sets));

    // Determine max weight performed in completed sets
    const maxCompleted = sets
      .filter((s) => s.completed && s.weightKg > 0)
      .reduce((max, s) => (s.weightKg > max.weightKg ? s : max), { weightKg: 0, reps: 0 });

    if (maxCompleted.weightKg > 0) {
      localStorage.setItem(
        LAST_RECORDS_PREFIX + exerciseId,
        JSON.stringify({
          maxWeight: maxCompleted.weightKg,
          reps: maxCompleted.reps,
          date: new Date().toLocaleDateString('fa-IR'),
          oneRepMax: calculate1RM(maxCompleted.weightKg, maxCompleted.reps),
        })
      );
    }
  } catch (e) {
    console.error('Failed to save exercise logs to storage:', e);
  }
}

/**
 * Retrieve personal best record for an exercise
 */
export function getExerciseRecord(exerciseId: string): { maxWeight: number; reps: number; date: string; oneRepMax: number } | null {
  try {
    const raw = localStorage.getItem(LAST_RECORDS_PREFIX + exerciseId);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
