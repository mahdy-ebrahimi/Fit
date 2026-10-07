import { GeneratedPlan, SavedPlanItem, UserAccount, UserProfile } from '../types/fitness';
import { generateScientificFallbackPlan } from './fallbackPlanGenerator';

const USERS_STORAGE_KEY = 'fitgen_users_registry_v1';
const CURRENT_USER_ID_KEY = 'fitgen_active_user_id_v1';

const DEFAULT_DEMO_PROFILE: UserProfile = {
  gender: 'male',
  age: 26,
  weight: 78,
  height: 180,
  targetWeight: 82,
  activityLevel: 'moderate',
  goal: 'muscle_gain',
  experienceLevel: 'intermediate',
  trainingDaysPerWeek: 4,
  location: 'gym',
  weakMuscles: ['بالا سینه', 'سرشانه خلفی (پشت سرشانه)'],
  strongMuscles: ['جلو بازو (دو سر بازویی)'],
  injuries: ['درد خفیف در مچ دست چپ'],
  allergies: [],
  medicalConditions: [],
  dietaryPreference: 'رژیم سنتی ایرانی سالم (برنج کته، فیله مرغ، خوراک‌های کم‌روغن)',
  mealsPerDay: 4,
  extraNotes: 'تمرکز بر هایپرتروفی، یادگیری انیمیشن حرکات و ثبت دقیق وزنه‌ها',
};

// Generate initial demo user
function createInitialDemoUser(): UserAccount {
  const demoPlan = generateScientificFallbackPlan(DEFAULT_DEMO_PROFILE);
  const now = new Date().toISOString();
  return {
    id: 'user_demo_1',
    name: 'علی رضایی',
    email: 'ali@fitgen.ir',
    avatar: '🏋️‍♂️',
    createdAt: now,
    lastLogin: now,
    profile: DEFAULT_DEMO_PROFILE,
    activePlan: demoPlan,
    savedPlans: [
      {
        id: 'plan_demo_1',
        savedAt: now,
        title: 'برنامه هایپرتروفی ۴ روزه اختصاصی (عضلات ضعیف: بالا سینه)',
        plan: demoPlan,
        profile: DEFAULT_DEMO_PROFILE,
      },
    ],
  };
}

export function getAllUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      const demo = createInitialDemoUser();
      saveAllUsers([demo]);
      return [demo];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const demo = createInitialDemoUser();
      saveAllUsers([demo]);
      return [demo];
    }
    return parsed;
  } catch (e) {
    console.error('Failed to load users:', e);
    const demo = createInitialDemoUser();
    return [demo];
  }
}

export function saveAllUsers(users: UserAccount[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users:', e);
  }
}

export function getCurrentUser(): UserAccount | null {
  const users = getAllUsers();
  const currentId = localStorage.getItem(CURRENT_USER_ID_KEY);
  if (!currentId) {
    // Default to first user if available
    if (users.length > 0) {
      setCurrentUserId(users[0].id);
      return users[0];
    }
    return null;
  }
  const user = users.find((u) => u.id === currentId);
  if (!user && users.length > 0) {
    setCurrentUserId(users[0].id);
    return users[0];
  }
  return user || null;
}

export function setCurrentUserId(userId: string): void {
  try {
    localStorage.setItem(CURRENT_USER_ID_KEY, userId);
  } catch (e) {
    console.error('Failed to set current user ID:', e);
  }
}

export function registerUser(name: string, email: string, password?: string): UserAccount {
  const users = getAllUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error('این ایمیل قبلاً ثبت‌نام شده است. لطفاً وارد شوید.');
  }

  const now = new Date().toISOString();
  const avatars = ['🏋️‍♂️', '💪', '🏃‍♂️', '🥊', '🚴‍♂️', '🧘‍♂️', '🏆', '⭐'];
  const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

  const newUser: UserAccount = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password || '123456',
    avatar: randomAvatar,
    createdAt: now,
    lastLogin: now,
    profile: null,
    activePlan: null,
    savedPlans: [],
  };

  users.unshift(newUser);
  saveAllUsers(users);
  setCurrentUserId(newUser.id);
  return newUser;
}

export function loginUser(email: string, _password?: string): UserAccount {
  const users = getAllUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    // If not found, let's create it seamlessly or throw error
    throw new Error('کاربری با این مشخصات یافت نشد. لطفاً ابتدا ثبت‌نام کنید.');
  }

  user.lastLogin = new Date().toISOString();
  saveAllUsers(users);
  setCurrentUserId(user.id);
  return user;
}

export function logoutUser(): void {
  try {
    localStorage.removeItem(CURRENT_USER_ID_KEY);
  } catch (e) {
    console.error(e);
  }
}

export function updateUserProfileAndPlan(
  userId: string,
  profile: UserProfile,
  plan: GeneratedPlan
): UserAccount {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    throw new Error('کاربر یافت نشد');
  }

  const user = users[index];
  user.profile = profile;
  user.activePlan = plan;

  // Add to saved plans if not duplicate
  const planTitle = `${plan.workoutPlan.splitName} (${profile.goal === 'muscle_gain' ? 'عضله‌سازی' : 'کاهش چربی'})`;
  const existingSavedIndex = user.savedPlans.findIndex(
    (p) => p.title === planTitle || p.plan.workoutPlan.splitName === plan.workoutPlan.splitName
  );

  const newSavedItem: SavedPlanItem = {
    id: `plan_${Date.now()}`,
    savedAt: new Date().toISOString(),
    title: planTitle,
    plan,
    profile,
  };

  if (existingSavedIndex >= 0) {
    user.savedPlans[existingSavedIndex] = newSavedItem;
  } else {
    user.savedPlans.unshift(newSavedItem);
  }

  users[index] = user;
  saveAllUsers(users);
  return user;
}

export function switchActivePlan(userId: string, planId: string): UserAccount {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) throw new Error('کاربر یافت نشد');

  const user = users[index];
  const targetPlanItem = user.savedPlans.find((p) => p.id === planId);
  if (!targetPlanItem) throw new Error('برنامه مورد نظر یافت نشد');

  user.activePlan = targetPlanItem.plan;
  user.profile = targetPlanItem.profile;

  users[index] = user;
  saveAllUsers(users);
  return user;
}

export function deleteSavedPlan(userId: string, planId: string): UserAccount {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) throw new Error('کاربر یافت نشد');

  const user = users[index];
  user.savedPlans = user.savedPlans.filter((p) => p.id !== planId);
  users[index] = user;
  saveAllUsers(users);
  return user;
}
