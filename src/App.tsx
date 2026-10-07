/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProfileForm } from './components/ProfileForm';
import { LoadingScreen } from './components/LoadingScreen';
import { PlanDashboard } from './components/PlanDashboard';
import { UserProfilePanel } from './components/UserProfilePanel';
import { AuthModal } from './components/AuthModal';
import { BottomNav, AppNavTab } from './components/BottomNav';
import { ConfirmModal } from './components/ConfirmModal';
import { GeneratedPlan, UserAccount, UserProfile } from './types/fitness';
import { generateScientificFallbackPlan } from './utils/fallbackPlanGenerator';
import {
  getCurrentUser,
  logoutUser,
  updateUserProfileAndPlan,
} from './utils/userManager';
import { AlertCircle, ShieldAlert, Sparkles, WifiOff } from 'lucide-react';

const LOCAL_STORAGE_KEY_PLAN = 'fitgen_saved_plan_v1';
const LOCAL_STORAGE_KEY_PROFILE = 'fitgen_saved_profile_v1';

export default function App() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Multi-user Account State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    return getCurrentUser();
  });
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Profile & Plan State
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const user = getCurrentUser();
    if (user?.profile) return user.profile;
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [plan, setPlan] = useState<GeneratedPlan | null>(() => {
    const user = getCurrentUser();
    if (user?.activePlan) return user.activePlan;
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PLAN);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Page Views and Navigation History: 'dashboard' | 'form' | 'user-panel'
  const initialView = (plan && profile) ? 'dashboard' : 'form';
  const [currentView, setCurrentView] = useState<'dashboard' | 'form' | 'user-panel'>(initialView);
  const [currentTab, setCurrentTab] = useState<AppNavTab>('workout');
  const [viewHistory, setViewHistory] = useState<Array<'dashboard' | 'form' | 'user-panel'>>([initialView]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [offlineNotice, setOfflineNotice] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const handleSelectTab = (tab: AppNavTab) => {
    setCurrentTab(tab);
    if (tab === 'profile') {
      if (currentUser) {
        navigateTo('user-panel');
      } else {
        setShowAuthModal(true);
      }
    } else {
      if (currentView !== 'dashboard') {
        navigateTo('dashboard');
      }
    }
  };

  // Navigate to view and record history
  const navigateTo = (newView: 'dashboard' | 'form' | 'user-panel') => {
    if (newView === currentView) return;
    const nextHistory = [...viewHistory.slice(0, historyIndex + 1), newView];
    setViewHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setCurrentView(newView);
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
  };

  const handleGoBack = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      setCurrentView(viewHistory[nextIdx]);
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {}
    }
  };

  const handleGoForward = () => {
    if (historyIndex < viewHistory.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setCurrentView(viewHistory[nextIdx]);
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {}
    }
  };

  // Sync to local storage
  useEffect(() => {
    if (plan) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_PLAN, JSON.stringify(plan));
      } catch (e) {
        console.error('Failed to save plan to localStorage:', e);
      }
    }
  }, [plan]);

  useEffect(() => {
    if (profile) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(profile));
      } catch (e) {
        console.error('Failed to save profile to localStorage:', e);
      }
    }
  }, [profile]);

  // Handle plan generation
  const handleGeneratePlan = async (userProfile: UserProfile) => {
    setIsLoading(true);
    setErrorMessage(null);
    setOfflineNotice(null);
    setProfile(userProfile);

    // If completely offline, use the built-in scientific engine immediately
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setTimeout(() => {
        try {
          const offlinePlan = generateScientificFallbackPlan(userProfile);
          setPlan(offlinePlan);
          if (currentUser) {
            const updatedUser = updateUserProfileAndPlan(currentUser.id, userProfile, offlinePlan);
            setCurrentUser(updatedUser);
          }
          setOfflineNotice('برنامه در حالت آفلاین بر اساس محاسبات بیومکانیکی و بالینی داخلی با موفقیت تولید و ذخیره شد.');
          navigateTo('dashboard');
        } catch (e: any) {
          setErrorMessage('خطایی در تولید برنامه آفلاین رخ داد.');
        } finally {
          setIsLoading(false);
        }
      }, 700);
      return;
    }

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userProfile),
      });

      const responseText = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error('پاسخ سرور در قالب استاندارد دریافت نشد. لطفاً مجدداً تلاش فرمایید.');
      }

      if (!response.ok || !data.success || !data.plan) {
        throw new Error(data.error || 'خطایی در پردازش اطلاعات توسط هوش مصنوعی رخ داد.');
      }

      setPlan(data.plan);
      if (currentUser) {
        const updatedUser = updateUserProfileAndPlan(currentUser.id, userProfile, data.plan);
        setCurrentUser(updatedUser);
      }
      navigateTo('dashboard');
    } catch (err: any) {
      console.warn('Network request failed, activating offline scientific generator:', err);
      try {
        const fallbackPlan = generateScientificFallbackPlan(userProfile);
        setPlan(fallbackPlan);
        if (currentUser) {
          const updatedUser = updateUserProfileAndPlan(currentUser.id, userProfile, fallbackPlan);
          setCurrentUser(updatedUser);
        }
        setOfflineNotice('به دلیل قطعی یا کندی اینترنت، برنامه با موتور محاسبات علمی آفلاین تولید شد.');
        navigateTo('dashboard');
      } catch (fallbackErr: any) {
        setErrorMessage(
          err?.message || 'برقراری ارتباط با مربی هوش مصنوعی با مشکل مواجه شد. لطفاً دوباره تلاش کنید.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLoadDemo = () => {
    const demoProfile: UserProfile = {
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
    const demoPlan = generateScientificFallbackPlan(demoProfile);
    setProfile(demoProfile);
    setPlan(demoPlan);
    if (currentUser) {
      const updated = updateUserProfileAndPlan(currentUser.id, demoProfile, demoPlan);
      setCurrentUser(updated);
    }
    navigateTo('dashboard');
  };

  // User auth actions
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    if (user.activePlan && user.profile) {
      setPlan(user.activePlan);
      setProfile(user.profile);
      navigateTo('dashboard');
    } else {
      navigateTo('form');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    navigateTo('form');
  };

  const handleSwitchPlanFromPanel = (switchedPlan: GeneratedPlan, switchedProfile: UserProfile) => {
    setPlan(switchedPlan);
    setProfile(switchedProfile);
    navigateTo('dashboard');
  };

  return (
    <div className="min-h-screen min-h-dvh bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 overflow-x-hidden w-full max-w-full">
      <Header
        onReset={handleReset}
        onPrint={handlePrint}
        onLoadDemo={handleLoadDemo}
        hasPlan={!!plan}
        isOnline={isOnline}
        canGoBack={historyIndex > 0}
        canGoForward={historyIndex < viewHistory.length - 1}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        currentUser={currentUser}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenUserPanel={() => {
          if (currentUser) {
            navigateTo('user-panel');
          } else {
            setShowAuthModal(true);
          }
        }}
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
      />

      {/* Offline Status Top Banner */}
      {!isOnline && (
        <div className="bg-amber-950/80 border-b border-amber-800/60 text-amber-200 px-4 py-2 text-xs flex items-center justify-center gap-2 shadow-sm no-print">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>حالت آفلاین فعال است:</strong> دسترسی به برنامه‌ها، انیمیشن‌های آموزشی و ردیاب وزنه‌ها بدون نیاز به اینترنت کاملاً مهیاست.
          </span>
        </div>
      )}

      {/* Offline generation notice */}
      {offlineNotice && (
        <div className="max-w-4xl mx-auto px-4 mt-4 no-print">
          <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{offlineNotice}</span>
            </div>
            <button
              onClick={() => setOfflineNotice(null)}
              className="text-emerald-400 hover:text-white text-xs font-bold px-2 py-1"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}

      <main className={`flex-1 ${currentView === 'form' ? 'pb-24' : 'pb-32 sm:pb-24'}`}>
        {/* Error notification */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-200 flex items-start gap-3 shadow-lg">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-bold text-sm">خطا در فرآیند تولید برنامه</div>
                <div className="text-xs text-rose-300/90 mt-1">{errorMessage}</div>
              </div>
              <div className="flex items-center gap-2">
                {profile && (
                  <button
                    onClick={() => handleGeneratePlan(profile)}
                    className="text-xs px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md active:scale-95"
                  >
                    تلاش مجدد
                  </button>
                )}
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-white font-semibold transition-all"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Views Routing */}
        {isLoading ? (
          <LoadingScreen />
        ) : currentView === 'user-panel' && currentUser ? (
          <UserProfilePanel
            currentUser={currentUser}
            onSwitchPlan={handleSwitchPlanFromPanel}
            onNewPlanRequest={() => navigateTo('form')}
            onLogout={handleLogout}
            onBackToApp={() => navigateTo(plan ? 'dashboard' : 'form')}
            onUserUpdated={(updated) => setCurrentUser(updated)}
          />
        ) : currentView === 'dashboard' && plan && profile ? (
          <PlanDashboard
            plan={plan}
            profile={profile}
            onEditProfile={() => navigateTo('form')}
            activeTab={currentTab === 'workout' || currentTab === 'diet' || currentTab === 'metrics' ? currentTab : 'workout'}
            onTabChange={(tab) => {
              if (tab === 'workout' || tab === 'diet' || tab === 'metrics') {
                setCurrentTab(tab);
              }
            }}
            onPlanUpdated={(newPlan) => {
              setPlan(newPlan);
              if (currentUser && profile) {
                const updated = updateUserProfileAndPlan(currentUser.id, profile, newPlan);
                setCurrentUser(updated);
              }
            }}
          />
        ) : (
          <ProfileForm
            onSubmit={handleGeneratePlan}
            isLoading={isLoading}
            onLoadDemo={handleLoadDemo}
            onCancel={plan ? () => navigateTo('dashboard') : undefined}
          />
        )}
      </main>

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Confirm Reset Modal */}
      <ConfirmModal
        isOpen={showResetConfirm}
        title="تنظیم مجدد و ساخت برنامه جدید"
        message="آیا مایل به تنظیم مجدد مشخصات و دریافت یک برنامه تمرینی و تغذیه جدید هستید؟"
        confirmText="بله، رفتن به فرم مشخصات"
        cancelText="انصراف و ماندن در برنامه"
        variant="warning"
        onConfirm={() => navigateTo('form')}
        onCancel={() => setShowResetConfirm(false)}
      />

      {/* Native Mobile Bottom Navigation Bar: Only visible when reviewing plan or user profile */}
      {currentView !== 'form' && (
        <BottomNav
          currentTab={currentView === 'user-panel' ? 'profile' : currentTab}
          onSelectTab={handleSelectTab}
          hasPlan={!!plan}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#050505] py-8 pb-24 sm:pb-8 text-center text-xs text-slate-500 no-print">
        <div className="max-w-5xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 text-slate-300 font-bold">
            <Sparkles className="w-4 h-4 text-[#FF6B00]" />
            <span>گُرد (GORD) - سامانه مربی‌گری هوش مصنوعی بدنسازی و تغذیه ورزشی</span>
          </div>
          <p className="text-[11px] text-slate-500 max-w-2xl mx-auto leading-relaxed">
            توجه: این سیستم برای بهینه‌سازی عملکرد و سبک زندگی ورزشی طراحی شده است. در صورت وجود آسیب‌های حاد یا بیماری‌های زمینه‌ای مزمن، توصیه می‌شود برنامه قبل از اجرا به تایید پزشک معالج یا فیزیوتراپیست ورزشی برسد.
          </p>
        </div>
      </footer>
    </div>
  );
}
