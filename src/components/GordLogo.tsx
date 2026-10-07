import React from 'react';

interface GordLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'header';
  showSubtitle?: boolean;
  withGlow?: boolean;
}

/**
 * GordLogo: Uses the official logo image (IMG_5174.png) directly
 */
export const GordLogo: React.FC<GordLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  withGlow = true,
}) => {
  const sizeMap = {
    sm: { width: 'w-9 h-9', textClass: 'text-xs' },
    md: { width: 'w-12 h-12', textClass: 'text-sm' },
    header: { width: 'w-11 h-11', textClass: 'text-sm sm:text-base' },
    lg: { width: 'w-20 h-20', textClass: 'text-xl' },
    hero: { width: 'w-28 h-28', textClass: 'text-2xl' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Logo Image (IMG_5174.png) */}
      <div className="relative shrink-0 flex items-center justify-center">
        {withGlow && (
          <div className="absolute inset-0 bg-[#FF6B00]/30 rounded-2xl blur-md scale-125 pointer-events-none" />
        )}
        <img
          src="/IMG_5174.png"
          alt="لوگوی گُرد (GORD)"
          className={`${currentSize.width} object-contain rounded-2xl relative z-10 border border-[#FF6B00]/40 shadow-glow filter drop-shadow(0_4px_12px_rgba(255,107,0,0.35)) transition-transform hover:scale-105`}
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-right leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight text-white ${currentSize.textClass}`}>
            گُــــرد
          </span>
          <span className="text-[10px] font-mono font-black text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded-md">
            GORD
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-normal">
            مربی هوش مصنوعی بدنسازی و تغذیه
          </span>
        )}
      </div>
    </div>
  );
};
