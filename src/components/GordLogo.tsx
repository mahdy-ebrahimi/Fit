import React from 'react';

interface GordLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'header';
  showSubtitle?: boolean;
  withGlow?: boolean;
}

export const GordLogo: React.FC<GordLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  withGlow = true,
}) => {
  // Dimension presets
  const sizeMap = {
    sm: { width: 34, height: 34, textScale: 'text-base' },
    md: { width: 44, height: 44, textScale: 'text-xl' },
    header: { width: 42, height: 42, textScale: 'text-xl' },
    lg: { width: 72, height: 72, textScale: 'text-3xl' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Visual Emblem Shield from IMG_5174 */}
      <div className="relative shrink-0 flex items-center justify-center">
        {withGlow && (
          <div className="absolute inset-0 bg-[#FF6B00]/25 rounded-2xl blur-md scale-110 pointer-events-none" />
        )}

        <svg
          width={currentSize.width}
          height={currentSize.height}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 transition-transform hover:scale-105 duration-300 filter drop-shadow(0_4px_12px_rgba(255,107,0,0.25))"
        >
          <defs>
            {/* Outer Gold Border Gradient */}
            <linearGradient id="goldBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFA000" />
              <stop offset="50%" stopColor="#FF6B00" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Shield Royal Blue Background */}
            <linearGradient id="shieldBlueGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="60%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#030712" />
            </linearGradient>

            {/* Champion Muscle Shading Gradient */}
            <linearGradient id="heroBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            {/* Gold Headband Gradient */}
            <linearGradient id="headbandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Persian Navy Calligraphy Gradient */}
            <linearGradient id="calligraphyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="40%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
          </defs>

          {/* Persian Arch Shield Base */}
          <path
            d="M60 4 C76 4, 102 14, 106 36 C108 58, 96 82, 60 114 C24 82, 12 58, 14 36 C18 14, 44 4, 60 4 Z"
            fill="url(#goldBorderGrad)"
          />
          {/* Inner Persian Shield */}
          <path
            d="M60 9 C73 9, 97 18, 100 38 C102 57, 91 78, 60 108 C29 78, 18 57, 20 38 C23 18, 47 9, 60 9 Z"
            fill="url(#shieldBlueGrad)"
          />

          {/* Damask / Persian Floral Accent Marks in background */}
          <path
            d="M60 22 C64 26 66 30 60 36 C54 30 56 26 60 22 Z"
            fill="#38BDF8"
            opacity="0.25"
          />
          <circle cx="48" cy="38" r="3.5" fill="#F59E0B" opacity="0.3" />
          <circle cx="72" cy="38" r="3.5" fill="#F59E0B" opacity="0.3" />

          {/* Athletic Hero Champion Silhouette (Gord) */}
          {/* Head & Wavy Hair */}
          <path
            d="M56 25 C50 25, 45 29, 44 36 C43 43, 46 47, 49 50 C48 53, 51 55, 54 55 C58 55, 63 52, 66 47 C72 47, 76 42, 75 35 C74 27, 65 25, 56 25 Z"
            fill="#0F172A"
          />
          {/* Hero Profile Face & Beard */}
          <path
            d="M58 29 C63 29, 68 33, 68 38 C68 41, 66 44, 64 45 C64 47, 61 50, 56 50 C52 50, 50 47, 50 44 C50 41, 52 38, 54 35 C55 31, 56 29, 58 29 Z"
            fill="url(#heroBodyGrad)"
          />
          {/* Beard Profile */}
          <path
            d="M64 42 C67 44, 69 47, 66 52 C63 56, 57 56, 54 53 C58 52, 61 49, 61 46 C62 44, 63 43, 64 42 Z"
            fill="#0F172A"
          />

          {/* Ancient Persian Gold Headband with Meander Marks */}
          <path
            d="M52 32 C58 31, 67 33, 72 36 L70 40 C65 37, 57 35, 51 36 Z"
            fill="url(#headbandGrad)"
          />
          {/* Headband Greek/Persian key pattern lines */}
          <path
            d="M54 34 H57 V36 H55 M59 34.5 H62 V36.5 H60 M64 35 H67 V37 H65"
            stroke="#92400E"
            strokeWidth="0.8"
            strokeLinecap="round"
          />

          {/* Massive Traps, Chest and Deltoids */}
          {/* Left Deltoid */}
          <path
            d="M32 60 C32 50, 42 47, 48 52 C45 60, 41 72, 38 84 C34 78, 32 69, 32 60 Z"
            fill="url(#heroBodyGrad)"
          />
          {/* Right Deltoid & Chest */}
          <path
            d="M88 60 C88 50, 78 47, 72 52 C75 60, 79 72, 82 84 C86 78, 88 69, 88 60 Z"
            fill="url(#heroBodyGrad)"
          />
          {/* Powerful Pectoral Muscles */}
          <path
            d="M47 54 C53 50, 67 50, 73 54 C74 65, 71 80, 60 92 C49 80, 46 65, 47 54 Z"
            fill="url(#heroBodyGrad)"
          />
          {/* Muscle Contour Lines */}
          <path
            d="M60 52 V86 M48 64 C53 68, 58 68, 60 67 M72 64 C67 68, 62 68, 60 67 M52 75 C56 78, 59 78, 60 78 M68 75 C64 78, 61 78, 60 78"
            stroke="#0F172A"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Stylized Golden Accents on Collar/Traps */}
          <path
            d="M48 48 C54 44, 66 44, 72 48"
            stroke="url(#goldBorderGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Lower Dynamic Persian Calligraphy Splash on Crest Base */}
          <path
            d="M36 94 C46 90, 74 90, 84 94 C76 104, 66 110, 60 114 C54 110, 44 104, 36 94 Z"
            fill="url(#goldBorderGrad)"
          />
        </svg>
      </div>

      {/* Typography: گُرد / GORD */}
      <div className="flex flex-col text-right">
        <div className="flex items-center gap-1.5">
          <span className="font-black text-white tracking-tight leading-none font-sans drop-shadow-sm flex items-center">
            <span className={`${currentSize.textScale} text-transparent bg-clip-text bg-gradient-to-l from-white via-amber-100 to-white font-extrabold`}>
              گُـرد
            </span>
            <span className="text-[#FF6B00] mr-1 text-xs font-black px-1.5 py-0.5 rounded-md bg-[#FF6B00]/15 border border-[#FF6B00]/30 font-mono tracking-normal">
              PRO
            </span>
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="w-2.5 h-[1.5px] bg-[#FF6B00]/60 rounded-full" />
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.22em] text-[#FF6B00] font-mono uppercase">
              G O R D
            </span>
            <span className="w-2.5 h-[1.5px] bg-[#FF6B00]/60 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
