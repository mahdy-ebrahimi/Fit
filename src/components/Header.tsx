import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Dumbbell,
  FolderDown,
  Printer,
  Smartphone,
  Sparkles,
  TrendingUp,
  User,
  Utensils,
  X,
} from 'lucide-react';
import { UserAccount } from '../types/fitness';
import { AppNavTab } from './BottomNav';
import { GordLogo } from './GordLogo';

interface HeaderProps {
  onReset?: () => void;
  onPrint?: () => void;
  onLoadDemo?: () => void;
  hasPlan?: boolean;
  isOnline?: boolean;
  canGoBack?: boolean;
  canGoForward?: boolean;
  onGoBack?: () => void;
  onGoForward?: () => void;
  currentUser?: UserAccount | null;
  onOpenAuthModal?: () => void;
  onOpenUserPanel?: () => void;
  currentTab?: AppNavTab;
  onSelectTab?: (tab: AppNavTab) => void;
  onOpenForm?: () => void;
  currentView?: 'dashboard' | 'form' | 'user-panel';
}

export const Header: React.FC<HeaderProps> = ({
  onPrint,
  hasPlan,
  canGoBack = false,
  canGoForward = false,
  onGoBack,
  onGoForward,
  currentUser,
  onOpenAuthModal,
  onOpenUserPanel,
  currentTab = 'workout',
  onSelectTab,
  onOpenForm,
  currentView = 'form',
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass-panel border-b-0 rounded-b-3xl pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-3 px-[max(0.85rem,env(safe-area-inset-right,0px))] pl-[max(0.85rem,env(safe-area-inset-left,0px))] sm:px-6 flex justify-between items-center mb-4 sm:mb-5 max-w-7xl mx-auto no-print backdrop-blur-2xl">
        {/* Actions & History Navigation */}
        <div className="flex items-center gap-2">
          {/* History Back/Forward */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onGoBack}
              disabled={!canGoBack}
              className="w-10 h-10 rounded-full glass-input flex items-center justify-center hover:bg-white/10 transition disabled:opacity-20 disabled:pointer-events-none active:scale-95"
              title="صفحه قبل"
            >
              <ChevronRight className="w-4 h-4 text-gray-300 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={onGoForward}
              disabled={!canGoForward}
              className="w-10 h-10 rounded-full glass-input flex items-center justify-center hover:bg-white/10 transition disabled:opacity-20 disabled:pointer-events-none active:scale-95"
              title="صفحه بعد"
            >
              <ChevronLeft className="w-4 h-4 text-gray-300 stroke-[2.5]" />
            </button>
          </div>

          {/* Print PDF Button */}
          {hasPlan && onPrint && (
            <button
              type="button"
              onClick={onPrint}
              className="w-10 h-10 rounded-full glass-input flex items-center justify-center hover:bg-white/10 transition active:scale-95"
              title="چاپ یا خروجی PDF"
            >
              <Printer className="w-4 h-4 text-gray-300" />
            </button>
          )}

          {/* Download App Button */}
          {!isStandalone && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="w-10 h-10 rounded-full glass-input flex items-center justify-center hover:bg-white/10 transition active:scale-95"
              title="نصب اپلیکیشن"
            >
              <Download className="w-4 h-4 text-gray-300" />
            </button>
          )}

          {/* Download cPanel PHP Package */}
          <a
            href="/fitgen-cpanel.zip"
            download="fitgen-cpanel.zip"
            className="w-10 h-10 rounded-full glass-input flex items-center justify-center hover:bg-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 transition active:scale-95"
            title="دانلود پکیج کامل هاست سی‌پنل (PHP + Zip)"
          >
            <FolderDown className="w-4 h-4" />
          </a>

          {/* User Profile avatar */}
          {currentUser ? (
            <button
              type="button"
              onClick={onOpenUserPanel}
              className="flex items-center gap-2 py-1.5 px-3 rounded-2xl glass-input hover:bg-white/10 transition active:scale-95 mr-1"
            >
              <span className="text-base">{currentUser.avatar || '🏋️‍♂️'}</span>
              <span className="text-xs font-bold text-white hidden md:inline">{currentUser.name}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="px-3 py-1.5 rounded-2xl bg-[#FF6B00]/15 hover:bg-[#FF6B00]/25 border border-[#FF6B00]/30 text-[#FF6B00] text-xs font-bold transition active:scale-95 mr-1"
            >
              ورود
            </button>
          )}
          {/* Quick Switch to Gord Coach Questionnaire or Active Plan */}
          {currentView !== 'form' && onOpenForm ? (
            <button
              type="button"
              onClick={onOpenForm}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-[#FF6B00] via-orange-500 to-amber-500 text-black text-xs font-black shadow-glow hover:scale-105 active:scale-95 transition-all mr-1"
              title="طراحی و دریافت برنامه جدید با مربی گُرد"
            >
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>فرم مربی گُرد</span>
            </button>
          ) : hasPlan && onSelectTab ? (
            <button
              type="button"
              onClick={() => onSelectTab('workout')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl glass-input text-amber-400 text-xs font-bold hover:bg-white/10 active:scale-95 transition-all mr-1"
              title="مشاهده برنامه تمرینی فعلی"
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>برنامه جاری</span>
            </button>
          ) : null}
        </div>

        {/* Center: Desktop Tabs */}
        {hasPlan && onSelectTab && (
          <div className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/5">
            <button
              type="button"
              onClick={() => onSelectTab('workout')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'workout'
                  ? 'bg-[#FF6B00] text-black shadow-glow font-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>تمرین</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('diet')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'diet'
                  ? 'bg-[#FF6B00] text-black shadow-glow font-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>تغذیه</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('metrics')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'metrics'
                  ? 'bg-[#FF6B00] text-black shadow-glow font-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>پیشرفت</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('profile')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'profile'
                  ? 'bg-[#FF6B00] text-black shadow-glow font-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>پروفایل</span>
            </button>
          </div>
        )}

        {/* Official GORD (گُرد) Brand Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => {
            if (currentView === 'form' && hasPlan && onSelectTab) {
              onSelectTab('workout');
            } else if (onOpenForm) {
              onOpenForm();
            } else if (onSelectTab) {
              onSelectTab('workout');
            }
          }}
          title="گُرد (GORD) - مربی هوش مصنوعی بدنسازی و تغذیه"
        >
          <GordLogo size="header" showSubtitle={true} withGlow={true} />
        </div>
      </header>

      {/* PWA Install modal */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel rounded-3xl max-w-md w-full p-6 shadow-glass space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FF6B00]/20 text-[#FF6B00]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-white">نصب اپلیکیشن روی گوشی</h3>
              </div>
              <button
                onClick={() => setShowInstallModal(false)}
                className="p-1.5 rounded-lg glass-input text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              این برنامه یک Progressive Web App است و می‌توانید بدون نیاز به دانلود از بازار یا گوگل‌پلی، آن را روی صفحه اصلی گوشی خود نصب کنید:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl glass-input space-y-1">
                <div className="font-bold text-[#FF6B00]">📱 در اندروید (Chrome):</div>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  روی منوی سه نقطه بالای مرورگر کلیک کرده و <strong>«نصب برنامه» (Install app)</strong> یا <strong>«افزودن به صفحه اصلی»</strong> را لمس کنید.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl glass-input space-y-1">
                <div className="font-bold text-sky-400">🍏 در آیفون (Safari):</div>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  روی دکمه Share در پایین صفحه کلیک کرده و گزینه <strong>Add to Home Screen</strong> را انتخاب کنید.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#FF6B00] hover:bg-orange-500 text-black font-black text-xs shadow-glow transition-all"
              >
                متوجه شدم، بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
