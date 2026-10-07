import React from 'react';
import {
  Dumbbell,
  TrendingUp,
  User,
  Utensils,
} from 'lucide-react';

export type AppNavTab = 'workout' | 'diet' | 'metrics' | 'profile';

interface BottomNavProps {
  currentTab: AppNavTab;
  onSelectTab: (tab: AppNavTab) => void;
  hasPlan: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
}) => {
  return (
    <div
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))' }}
      className="fixed bottom-3 sm:bottom-4 left-3 right-3 sm:left-4 sm:right-4 z-50 glass-card rounded-3xl py-2 px-3 sm:px-5 flex justify-between items-center max-w-md mx-auto shadow-glass no-print border border-white/10 backdrop-blur-2xl"
    >
      {/* Profile */}
      <button
        type="button"
        onClick={() => onSelectTab('profile')}
        className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-300 ${
          currentTab === 'profile' ? 'text-[#FF6B00]' : 'text-gray-400 hover:text-white'
        }`}
      >
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            currentTab === 'profile'
              ? 'bg-[#FF6B00]/10 shadow-glow border border-[#FF6B00]/30'
              : 'hover:bg-white/5'
          }`}
        >
          <User className={`w-6 h-6 ${currentTab === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        </div>
        <span className="text-[10px] font-medium">پروفایل</span>
      </button>

      {/* Progress / Metrics */}
      <button
        type="button"
        onClick={() => onSelectTab('metrics')}
        className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-300 ${
          currentTab === 'metrics' ? 'text-[#FF6B00]' : 'text-gray-400 hover:text-white'
        }`}
      >
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            currentTab === 'metrics'
              ? 'bg-[#FF6B00]/10 shadow-glow border border-[#FF6B00]/30'
              : 'hover:bg-white/5'
          }`}
        >
          <TrendingUp className={`w-6 h-6 ${currentTab === 'metrics' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        </div>
        <span className="text-[10px] font-medium">پیشرفت</span>
      </button>

      {/* Nutrition / Diet */}
      <button
        type="button"
        onClick={() => onSelectTab('diet')}
        className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-300 ${
          currentTab === 'diet' ? 'text-[#FF6B00]' : 'text-gray-400 hover:text-white'
        }`}
      >
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            currentTab === 'diet'
              ? 'bg-[#FF6B00]/10 shadow-glow border border-[#FF6B00]/30'
              : 'hover:bg-white/5'
          }`}
        >
          <Utensils className={`w-6 h-6 ${currentTab === 'diet' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        </div>
        <span className="text-[10px] font-medium">تغذیه</span>
      </button>

      {/* Workout */}
      <button
        type="button"
        onClick={() => onSelectTab('workout')}
        className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-300 ${
          currentTab === 'workout' ? 'text-[#FF6B00]' : 'text-gray-400 hover:text-white'
        }`}
      >
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            currentTab === 'workout'
              ? 'bg-[#FF6B00]/10 shadow-glow border border-[#FF6B00]/30'
              : 'hover:bg-white/5'
          }`}
        >
          <Dumbbell className={`w-6 h-6 ${currentTab === 'workout' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        </div>
        <span className="text-[10px] font-medium">تمرین</span>
      </button>
    </div>
  );
};
