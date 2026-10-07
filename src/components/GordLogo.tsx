import React from 'react';

interface GordLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'header';
  showSubtitle?: boolean;
  withGlow?: boolean;
}

/**
 * GordLogo: Ultra-faithful vector recreation of the official "گُرد / GORD" Emblem (IMG_5174.png)
 * - Heraldic Persian Arch Crest Shield in deep midnight royal blue
 * - Double ornate bevel gold border with royal Persian architectural styling
 * - Athletic Persian hero silhouette with pompadour hair, gold meander headband, and heroic beard
 * - Majestic Persian calligraphy "گُرد" with gold metallic gradient
 * - Bold Latin "GORD" athletic typography
 */
export const GordLogo: React.FC<GordLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  withGlow = true,
}) => {
  // Dimension presets
  const sizeMap = {
    sm: { width: 36, height: 36, textClass: 'text-xs' },
    md: { width: 48, height: 48, textClass: 'text-sm' },
    header: { width: 44, height: 44, textClass: 'text-sm sm:text-base' },
    lg: { width: 80, height: 80, textClass: 'text-xl' },
    hero: { width: 120, height: 120, textClass: 'text-2xl' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Crest Icon SVG */}
      <div className="relative shrink-0 flex items-center justify-center">
        {withGlow && (
          <div className="absolute inset-0 bg-[#FF6B00]/30 rounded-2xl blur-lg scale-125 pointer-events-none" />
        )}

        <svg
          width={currentSize.width}
          height={currentSize.height}
          viewBox="0 0 160 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 transition-transform hover:scale-105 duration-300 filter drop-shadow(0_6px_16px_rgba(255,107,0,0.3))"
        >
          <defs>
            {/* Outer Gold Gradient */}
            <linearGradient id="gordGoldOuter" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="30%" stopColor="#FFA000" />
              <stop offset="70%" stopColor="#FF6B00" />
              <stop offset="100%" stopColor="#C45000" />
            </linearGradient>

            {/* Inner Metallic Gold Rim */}
            <linearGradient id="gordGoldRim" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B45309" />
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#FFFBEB" />
            </linearGradient>

            {/* Shield Deep Royal Blue Field */}
            <radialGradient id="gordShieldBg" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="45%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#040812" />
            </radialGradient>

            {/* Hero Body / Muscle Shading */}
            <linearGradient id="gordHeroBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#F8FAFC" />
              <stop offset="80%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>

            {/* Gold Headband & Accents */}
            <linearGradient id="gordHeroGold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#FFB800" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Shield Drop Shadow */}
            <filter id="gordShieldShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* 1. Outer Ornate Shield Outline (Heraldic Persian Crest with curved arch top) */}
          <path
            d="M80 6 C105 6, 142 16, 148 48 C152 78, 134 116, 80 166 C26 116, 8 78, 12 48 C18 16, 55 6, 80 6 Z"
            fill="url(#gordGoldOuter)"
            filter="url(#gordShieldShadow)"
          />

          {/* 2. Middle Gold Rim Inset */}
          <path
            d="M80 12 C101 12, 134 20, 139 49 C143 75, 126 109, 80 155 C34 109, 17 75, 21 49 C26 20, 59 12, 80 12 Z"
            fill="url(#gordGoldRim)"
          />

          {/* 3. Deep Midnight Blue Shield Core */}
          <path
            d="M80 18 C99 18, 128 25, 132 50 C136 73, 120 103, 80 146 C40 103, 24 73, 28 50 C32 25, 61 18, 80 18 Z"
            fill="url(#gordShieldBg)"
          />

          {/* 4. Subtle Radial Laurel / Starburst Accent Rays */}
          <g opacity="0.18">
            <path d="M80 30 L80 135" stroke="#FBBF24" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M35 55 L125 110" stroke="#FBBF24" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M125 55 L35 110" stroke="#FBBF24" strokeWidth="1" strokeDasharray="3 3" />
          </g>

          {/* 5. Central Muscular Persian Hero Champion (Gord Bust) */}
          <g id="hero-bust">
            {/* Trapezius and Muscular Broad Neck */}
            <path d="M66 66 C70 60, 90 60, 94 66 L98 84 C88 88, 72 88, 62 84 Z" fill="url(#gordHeroBody)" />

            {/* Broad Deltoid Shoulders and Chest Armor Pectorals */}
            <path
              d="M40 92 C46 80, 60 76, 70 78 C76 86, 84 86, 90 78 C100 76, 114 80, 120 92 C124 104, 118 118, 102 120 C88 122, 72 122, 58 120 C42 118, 36 104, 40 92 Z"
              fill="url(#gordHeroBody)"
            />

            {/* Pectoral Cut Definition Lines */}
            <path d="M80 82 V112" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M54 98 C66 102, 76 102, 80 96" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
            <path d="M106 98 C94 102, 84 102, 80 96" stroke="#475569" strokeWidth="2" strokeLinecap="round" />

            {/* Gold Armor Trim on Pectorals */}
            <path d="M52 110 C68 114, 92 114, 108 110" stroke="url(#gordHeroGold)" strokeWidth="3" strokeLinecap="round" />

            {/* Hero Head, Jawline and Face */}
            <ellipse cx="80" cy="50" rx="15" ry="17" fill="url(#gordHeroBody)" />

            {/* Flowing Styled Hair (Pompadour) */}
            <path
              d="M62 46 C60 30, 72 24, 80 24 C88 24, 100 30, 98 46 C94 36, 88 32, 80 32 C72 32, 66 36, 62 46 Z"
              fill="#0F172A"
            />
            <path
              d="M58 48 C56 56, 60 62, 64 66 C64 58, 62 52, 64 46 Z"
              fill="#0F172A"
            />
            <path
              d="M102 48 C104 56, 100 62, 96 66 C96 58, 98 52, 96 46 Z"
              fill="#0F172A"
            />

            {/* Ancient Persian Gold Headband across Forehead */}
            <path d="M64 42 C72 40, 88 40, 96 42 L96 47 C88 45, 72 45, 64 47 Z" fill="url(#gordHeroGold)" />
            {/* Geometric Meander Dots on Headband */}
            <circle cx="70" cy="44.5" r="1" fill="#78350F" />
            <circle cx="75" cy="44" r="1" fill="#78350F" />
            <circle cx="80" cy="44" r="1" fill="#78350F" />
            <circle cx="85" cy="44" r="1" fill="#78350F" />
            <circle cx="90" cy="44.5" r="1" fill="#78350F" />

            {/* Heroic Full Beard and Mustache */}
            <path
              d="M66 52 C72 50, 77 50, 80 53 C83 50, 88 50, 94 52 C96 64, 90 74, 80 77 C70 74, 64 64, 66 52 Z"
              fill="#0F172A"
            />
          </g>

          {/* 6. Gold Plaque Banner for Latin "GORD" */}
          <rect
            x="48"
            y="126"
            width="64"
            height="18"
            rx="4"
            fill="url(#gordGoldOuter)"
            stroke="#FFFBEB"
            strokeWidth="0.8"
          />
          <text
            x="80"
            y="139"
            textAnchor="middle"
            fill="#091224"
            fontSize="11"
            fontWeight="900"
            letterSpacing="2.5"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            GORD
          </text>

          {/* 7. Crown/Top Jewel Accent */}
          <polygon points="80,1 84,6 80,10 76,6" fill="url(#gordGoldRim)" />
        </svg>
      </div>

      {/* Typography Block */}
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
