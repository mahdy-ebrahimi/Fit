import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * FitGen 3D Glassmorphic Icon Pack
 * Inspired by the official FitGen Report Header assets (IMG_5162)
 * Features frosted glass refraction, specular rim lights, and intense neon amber/orange glows (#FF6B00 / #FFA000).
 */

// 1. Calories Burned: Glass tumbler with internal vibrant flame
export const CaloriesBurnedIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.5)] ${className}`}
  >
    <defs>
      <linearGradient id="calGlassBg" x1="16" y1="12" x2="48" y2="54" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" stopOpacity="0.28" />
        <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.05" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.18" />
      </linearGradient>
      <linearGradient id="calGlassRim" x1="16" y1="12" x2="48" y2="54" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" stopOpacity="0.6" />
        <stop offset="0.7" stopColor="#ffffff" stopOpacity="0.1" />
        <stop offset="1" stopColor="#FF8A00" stopOpacity="0.8" />
      </linearGradient>
      <linearGradient id="calFlame" x1="32" y1="20" x2="32" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFF275" />
        <stop offset="0.3" stopColor="#FF9F1C" />
        <stop offset="0.8" stopColor="#FF4000" />
      </linearGradient>
      <radialGradient id="calFloorGlow" cx="50%" cy="80%" r="50%">
        <stop stopColor="#FF7700" stopOpacity="0.7" />
        <stop offset="1" stopColor="#FF7700" stopOpacity="0" />
      </radialGradient>
      <filter id="calGlowFilter" x="0" y="0" width="64" height="64" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Floor reflection */}
    <ellipse cx="32" cy="53" rx="16" ry="3.5" fill="url(#calFloorGlow)" />
    {/* Glass Cup Base */}
    <path
      d="M18 16L22 49C22.4 51.2 24.2 52.8 26.5 52.8H37.5C39.8 52.8 41.6 51.2 42 49L46 16C46.3 14 44.8 12.2 42.8 12.2H21.2C19.2 12.2 17.7 14 18 16Z"
      fill="url(#calGlassBg)"
      stroke="url(#calGlassRim)"
      strokeWidth="1.5"
    />
    {/* Glass rim thickness */}
    <ellipse cx="32" cy="14" rx="12" ry="2" stroke="rgba(255,255,255,0.7)" strokeWidth="1" fill="rgba(255,255,255,0.12)" />
    {/* Internal Flame */}
    <path
      d="M32 20C32 20 25 28 25 36C25 42 28.5 45 32 45C35.5 45 39 42 39 36C39 28 32 20 32 20Z"
      fill="url(#calFlame)"
      filter="url(#calGlowFilter)"
    />
    <path
      d="M32 28C32 28 28.5 33 28.5 37.5C28.5 41 30.2 43 32 43C33.8 43 35.5 41 35.5 37.5C35.5 33 32 28 32 28Z"
      fill="#FFF9A6"
    />
  </svg>
);

// 2. Heart Rate/BPM: Glass heart with electric neon pulse line
export const HeartRateIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.5)] ${className}`}
  >
    <defs>
      <linearGradient id="hrGlass" x1="16" y1="14" x2="48" y2="50" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" stopOpacity="0.25" />
        <stop offset="0.6" stopColor="#ffffff" stopOpacity="0.04" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="hrPulse" x1="10" y1="32" x2="54" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF9F1C" />
        <stop offset="0.5" stopColor="#FFDD00" />
        <stop offset="1" stopColor="#FF5500" />
      </linearGradient>
    </defs>
    {/* Glass Heart */}
    <path
      d="M32 50C32 50 16 38 16 26C16 19.5 21 15 27 15C30.5 15 32 17.5 32 17.5C32 17.5 33.5 15 37 15C43 15 48 19.5 48 26C48 38 32 50 32 50Z"
      fill="url(#hrGlass)"
      stroke="rgba(255,255,255,0.4)"
      strokeWidth="1.5"
    />
    {/* Specular curved highlight */}
    <path
      d="M21 21C23 18 26 17 28 17"
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.8"
    />
    {/* Glowing Electrocardiogram ECG Line */}
    <path
      d="M10 32H23L27 22L32 42L37 26L41 34L44 32H54"
      stroke="url(#hrPulse)"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="drop-shadow-[0_0_8px_#FF8A00]"
    />
  </svg>
);

// 3. Steps Taken: Glass footprints
export const StepsTakenIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] ${className}`}
  >
    <defs>
      <linearGradient id="stepGlass" x1="20" y1="15" x2="45" y2="50" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" stopOpacity="0.3" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.08" />
      </linearGradient>
    </defs>
    {/* Left Foot */}
    <ellipse cx="26" cy="40" rx="4.5" ry="6.5" transform="rotate(-10 26 40)" fill="url(#stepGlass)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
    <ellipse cx="24" cy="27" rx="6" ry="8" transform="rotate(-10 24 27)" fill="url(#stepGlass)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
    {/* Left Toes */}
    <circle cx="19" cy="17" r="1.5" fill="#ffffff" opacity="0.7" />
    <circle cx="22" cy="15" r="1.6" fill="#ffffff" opacity="0.7" />
    <circle cx="25" cy="15" r="1.6" fill="#ffffff" opacity="0.7" />
    <circle cx="28" cy="16.5" r="1.4" fill="#ffffff" opacity="0.7" />
    <circle cx="30" cy="19" r="1.2" fill="#ffffff" opacity="0.7" />

    {/* Right Foot */}
    <ellipse cx="40" cy="47" rx="4.5" ry="6.5" transform="rotate(10 40 47)" fill="url(#stepGlass)" stroke="rgba(255,107,0,0.5)" strokeWidth="1" />
    <ellipse cx="42" cy="34" rx="6" ry="8" transform="rotate(10 42 34)" fill="url(#stepGlass)" stroke="rgba(255,107,0,0.5)" strokeWidth="1" />
    {/* Right Toes */}
    <circle cx="37" cy="24" r="1.2" fill="#FF8A00" opacity="0.8" />
    <circle cx="39" cy="22" r="1.4" fill="#FF8A00" opacity="0.8" />
    <circle cx="42" cy="21.5" r="1.6" fill="#FF8A00" opacity="0.8" />
    <circle cx="45" cy="22" r="1.6" fill="#FF8A00" opacity="0.8" />
    <circle cx="48" cy="24" r="1.5" fill="#FF8A00" opacity="0.8" />
  </svg>
);

// 4. Workout Duration: Glass hourglass with glowing amber sand
export const WorkoutDurationIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.5)] ${className}`}
  >
    <defs>
      <linearGradient id="hgGlass" x1="16" y1="12" x2="48" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" stopOpacity="0.3" />
        <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.05" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.25" />
      </linearGradient>
      <linearGradient id="hgSand" x1="32" y1="20" x2="32" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFDD00" />
        <stop offset="0.6" stopColor="#FF8A00" />
        <stop offset="1" stopColor="#FF4400" />
      </linearGradient>
    </defs>
    {/* Hourglass Caps */}
    <rect x="18" y="12" width="28" height="4" rx="2" fill="rgba(255,255,255,0.4)" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
    <rect x="18" y="48" width="28" height="4" rx="2" fill="rgba(255,255,255,0.4)" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
    {/* Glass Bulb Body */}
    <path
      d="M21 16H43C43 25 35 30 35 32C35 34 43 39 43 48H21C21 39 29 34 29 32C29 30 21 25 21 16Z"
      fill="url(#hgGlass)"
      stroke="rgba(255,255,255,0.5)"
      strokeWidth="1.5"
    />
    {/* Glowing Amber Light Sands */}
    <path d="M25 20H39C39 24 35 27 33 29H31C29 27 25 24 25 20Z" fill="url(#hgSand)" opacity="0.9" />
    <line x1="32" y1="29" x2="32" y2="42" stroke="#FFDD00" strokeWidth="1.5" strokeDasharray="2 2" className="animate-pulse" />
    <path d="M24 46C24 43 28 40 32 40C36 40 40 43 40 46H24Z" fill="url(#hgSand)" className="drop-shadow-[0_0_8px_#FF8A00]" />
  </svg>
);

// 5. Waist / Body Ratio: Frosted glass waist mannequin with glowing contour lines
export const BodyRatioIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.5)] ${className}`}
  >
    <defs>
      <linearGradient id="bodyGlass" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" stopOpacity="0.3" />
        <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.05" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    {/* Torso/Waist Shape */}
    <path
      d="M20 18C23 23 23 26 21 33C19 39 19 46 22 48H42C45 46 45 39 43 33C41 26 41 23 44 18H20Z"
      fill="url(#bodyGlass)"
      stroke="rgba(255,255,255,0.4)"
      strokeWidth="1.5"
    />
    {/* Glowing Orange Waist Measuring Contour */}
    <ellipse cx="32" cy="33" rx="13" ry="3.5" stroke="#FF8A00" strokeWidth="2.5" fill="none" className="drop-shadow-[0_0_8px_#FF8A00]" />
    {/* Top contour line */}
    <line x1="21" y1="18" x2="43" y2="18" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
    {/* Pelvic curve */}
    <path d="M24 35C28 41 36 41 40 35" stroke="#FFA000" strokeWidth="2" fill="none" opacity="0.8" />
  </svg>
);

// 6. Muscle Mass Progress: 3D frosted glass flexing bicep
export const MuscleMassIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.4)] ${className}`}
  >
    <defs>
      <linearGradient id="muscleGlass" x1="14" y1="16" x2="52" y2="50" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" stopOpacity="0.38" />
        <stop offset="0.4" stopColor="#ffffff" stopOpacity="0.1" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.25" />
      </linearGradient>
    </defs>
    {/* Flexing Bicep & Forearm Silhouette */}
    <path
      d="M26 18C28 15 34 16 38 18C44 21 44 26 42 30C46 31 51 34 51 40C51 45 46 47 41 47H25C20 47 16 42 16 36C16 30 19 28 22 28C22 24 23 20 26 18Z"
      fill="url(#muscleGlass)"
      stroke="rgba(255,255,255,0.6)"
      strokeWidth="1.5"
    />
    {/* Muscle Peak Highlight (Peak Bicep) */}
    <path
      d="M30 20C33 18.5 37 19.5 39 23"
      stroke="#FF9F1C"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="drop-shadow-[0_0_8px_#FF8A00]"
    />
    {/* Forearm definition line */}
    <path
      d="M26 31C30 31 35 34 38 37"
      stroke="rgba(255,255,255,0.7)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Tricep curve */}
    <path
      d="M19 35C20 40 23 44 27 44"
      stroke="#FF6B00"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.8"
    />
  </svg>
);

// 7. Weight Trend: 3D glass digital scale with digital LED '85.00' and amber glow
export const WeightTrendIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.5)] ${className}`}
  >
    <defs>
      <linearGradient id="scaleGlass" x1="14" y1="14" x2="50" y2="50" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" stopOpacity="0.3" />
        <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.06" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.22" />
      </linearGradient>
    </defs>
    {/* Glass Scale Body with rounded corners */}
    <rect
      x="14"
      y="14"
      width="36"
      height="36"
      rx="9"
      fill="url(#scaleGlass)"
      stroke="#FF8A00"
      strokeWidth="1.5"
      className="drop-shadow-[0_0_8px_rgba(255,107,0,0.4)]"
    />
    {/* Center Division Line */}
    <line x1="32" y1="26" x2="32" y2="47" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    {/* Digital LED Display Screen */}
    <rect x="23" y="17" width="18" height="8" rx="2" fill="rgba(0,0,0,0.7)" stroke="#FF8A00" strokeWidth="1" />
    {/* LED 85.00 text */}
    <text
      x="32"
      y="23"
      fontFamily="monospace"
      fontSize="6"
      fontWeight="900"
      fill="#FFA000"
      textAnchor="middle"
      className="drop-shadow-[0_0_4px_#FF8A00]"
    >
      85.00
    </text>
    {/* Standing Foot Pads (Subtle frosted glass accents) */}
    <rect x="18" y="27" width="9" height="18" rx="4" fill="rgba(255,255,255,0.06)" />
    <rect x="37" y="27" width="9" height="18" rx="4" fill="rgba(255,255,255,0.06)" />
  </svg>
);

// 8. Water Intake: 3D glass water droplet with glowing warm liquid swirl
export const WaterIntakeIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.5)] ${className}`}
  >
    <defs>
      <linearGradient id="dropGlass" x1="18" y1="12" x2="46" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" stopOpacity="0.35" />
        <stop offset="0.6" stopColor="#ffffff" stopOpacity="0.05" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.25" />
      </linearGradient>
      <linearGradient id="dropSwirl" x1="22" y1="36" x2="42" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFDD00" />
        <stop offset="0.5" stopColor="#FF9F1C" />
        <stop offset="1" stopColor="#FF4400" />
      </linearGradient>
    </defs>
    {/* Teardrop Silhouette */}
    <path
      d="M32 14C32 14 18 32 18 41C18 48.7 24.3 52 32 52C39.7 52 46 48.7 46 41C46 32 32 14 32 14Z"
      fill="url(#dropGlass)"
      stroke="rgba(255,255,255,0.5)"
      strokeWidth="1.5"
    />
    {/* Inner Glowing Liquid Swirl */}
    <path
      d="M24 43C25 40 28 37 32 37C36 37 38 41 41 42C43 43 44 41 44 41C44 45 39 48 32 48C26 48 24 45 24 43Z"
      fill="url(#dropSwirl)"
      className="drop-shadow-[0_0_8px_#FF8A00]"
    />
    <path
      d="M28 38C30 35 34 36 37 39"
      stroke="#FFE57F"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Glass Edge Specular Highlight */}
    <path
      d="M23 32C21 36 21 40 22 44"
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.8"
    />
  </svg>
);

// 9. Nutrition Plan: 3D glass plate with spoon and fork
export const NutritionPlanIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] ${className}`}
  >
    <defs>
      <linearGradient id="plateGlass" x1="14" y1="14" x2="50" y2="50" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" stopOpacity="0.25" />
        <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.05" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    {/* Glass Plate */}
    <circle cx="32" cy="32" r="19" fill="url(#plateGlass)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
    <circle cx="32" cy="32" r="14" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    
    {/* Fork (Left) */}
    <path d="M23 18V28M25 18V28M27 18V28M23 28C23 31 27 31 27 28M25 31V46" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" strokeLinecap="round" />
    
    {/* Spoon (Right) */}
    <ellipse cx="39" cy="23" rx="3.5" ry="5.5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" fill="rgba(255,255,255,0.1)" />
    <path d="M39 28.5V46" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" strokeLinecap="round" />
    
    {/* Plate Rim Amber Accent */}
    <path d="M43 43C40 47 34 49 28 47" stroke="#FF8A00" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
  </svg>
);

// 10. Sleep/Recovery: Glowing crescent moon with stars
export const SleepRecoveryIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_14px_rgba(255,180,0,0.6)] ${className}`}
  >
    <defs>
      <linearGradient id="moonGrad" x1="20" y1="16" x2="44" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFF4A3" />
        <stop offset="0.5" stopColor="#FFA000" />
        <stop offset="1" stopColor="#FF6B00" />
      </linearGradient>
    </defs>
    {/* Glowing Crescent Moon */}
    <path
      d="M39 18C30 19 24 27 25 36C26 44 33 50 42 48C37 51 28 49 23 44C18 39 18 30 23 24C27 19 34 17 39 18Z"
      fill="url(#moonGrad)"
      stroke="rgba(255,255,255,0.6)"
      strokeWidth="1.2"
      className="drop-shadow-[0_0_10px_#FFA000]"
    />
    {/* Sparkling Stars */}
    <path d="M42 20L43 17L44 20L47 21L44 22L43 25L42 22L39 21L42 20Z" fill="#FFF8C4" />
    <path d="M46 29L46.8 27L47.6 29L50 29.8L47.6 30.6L46.8 33L46 30.6L43.6 29.8L46 29Z" fill="#FFE57F" />
  </svg>
);

// 11. Energy/Flow: Glowing golden wave ribbon
export const EnergyFlowIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,140,0,0.5)] ${className}`}
  >
    <defs>
      <linearGradient id="energyGrad" x1="12" y1="32" x2="52" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF7700" />
        <stop offset="0.5" stopColor="#FFD000" />
        <stop offset="1" stopColor="#FF5500" />
      </linearGradient>
    </defs>
    <path
      d="M12 40C20 40 24 24 34 24C44 24 46 38 52 38"
      stroke="url(#energyGrad)"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="drop-shadow-[0_0_8px_#FFA000]"
    />
    <path
      d="M14 36C22 36 26 28 34 28C42 28 44 34 50 34"
      stroke="#FFF38A"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.8"
    />
    <path
      d="M16 44C24 44 28 32 34 32C40 32 42 42 48 42"
      stroke="#FF8A00"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);

// 12. User Profile: Glass rounded square with glowing avatar silhouette
export const UserProfileIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.5)] ${className}`}
  >
    <defs>
      <linearGradient id="profileGlass" x1="14" y1="14" x2="50" y2="50" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" stopOpacity="0.32" />
        <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.06" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.22" />
      </linearGradient>
    </defs>
    {/* Rounded Glass Card */}
    <rect
      x="14"
      y="14"
      width="36"
      height="36"
      rx="10"
      fill="url(#profileGlass)"
      stroke="rgba(255,255,255,0.35)"
      strokeWidth="1.5"
    />
    {/* Avatar Head */}
    <circle
      cx="32"
      cy="27"
      r="5.5"
      stroke="#FF8A00"
      strokeWidth="2.5"
      fill="none"
      className="drop-shadow-[0_0_6px_#FF8A00]"
    />
    {/* Avatar Shoulders */}
    <path
      d="M24 44C24 38 27.5 35.5 32 35.5C36.5 35.5 40 38 40 44"
      stroke="#FF8A00"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
      className="drop-shadow-[0_0_6px_#FF8A00]"
    />
  </svg>
);

/* ==========================================================================
   IMG_5163 Glowing Glassmorphism & Neon Anatomy Icon Collection
   ========================================================================== */

// 13. Chest Muscle: Glass Torso with Glowing Orange Pectorals (IMG_5163 Row 1, Col 1)
export const ChestMuscleIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.55)] ${className}`}
  >
    <defs>
      <linearGradient id="chestGlass" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e293b" stopOpacity="0.8" />
        <stop offset="0.5" stopColor="#0f172a" stopOpacity="0.9" />
        <stop offset="1" stopColor="#020617" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id="pecGlow" x1="20" y1="20" x2="44" y2="35" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFA000" />
        <stop offset="0.6" stopColor="#FF6B00" />
        <stop offset="1" stopColor="#FF3300" />
      </linearGradient>
    </defs>
    {/* Torso Outline */}
    <path
      d="M26 12C28 14 36 14 38 12C41 14 47 16 50 18C52 20 54 27 53 30C50 32 47 30 46 29C46 36 44 45 42 50C38 52 26 52 22 50C20 45 18 36 18 29C17 30 14 32 11 30C10 27 12 20 14 18C17 16 23 14 26 12Z"
      fill="url(#chestGlass)"
      stroke="#38bdf8"
      strokeWidth="1.5"
      strokeLinejoin="round"
      opacity="0.95"
    />
    {/* Left Pectoral Glowing Plate */}
    <path
      d="M21 21C26 21 30 23 31 29C31 34 26 36 21 34C18 33 17 27 18 24C19 22 20 21 21 21Z"
      stroke="url(#pecGlow)"
      strokeWidth="2.2"
      fill="rgba(255, 107, 0, 0.2)"
      className="drop-shadow-[0_0_8px_#FF6B00]"
    />
    {/* Right Pectoral Glowing Plate */}
    <path
      d="M43 21C38 21 34 23 33 29C33 34 38 36 43 34C46 33 47 27 46 24C45 22 44 21 43 21Z"
      stroke="url(#pecGlow)"
      strokeWidth="2.2"
      fill="rgba(255, 107, 0, 0.2)"
      className="drop-shadow-[0_0_8px_#FF6B00]"
    />
    {/* Abdominal Outline Segments */}
    <rect x="27" y="38" width="4" height="3" rx="1.5" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
    <rect x="33" y="38" width="4" height="3" rx="1.5" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
    <rect x="27" y="43" width="4" height="3" rx="1.5" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
    <rect x="33" y="43" width="4" height="3" rx="1.5" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
    {/* Specular curved chest highlight */}
    <path d="M22 17C26 15 38 15 42 17" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
  </svg>
);

// 14. Back / Lats: Glass Torso with Glowing Orange Latissimus Dorsi (IMG_5163 Row 1, Col 2)
export const BackLatsIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.55)] ${className}`}
  >
    <defs>
      <linearGradient id="backGlass" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e293b" stopOpacity="0.85" />
        <stop offset="0.6" stopColor="#0f172a" stopOpacity="0.9" />
        <stop offset="1" stopColor="#020617" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id="latsGlow" x1="18" y1="26" x2="46" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFAA00" />
        <stop offset="0.5" stopColor="#FF6B00" />
        <stop offset="1" stopColor="#FF2200" />
      </linearGradient>
    </defs>
    {/* Posterior Torso Shape */}
    <path
      d="M26 12C28 14 36 14 38 12C42 14 48 16 52 21C50 25 48 27 46 26C45 32 43 44 41 51C36 53 28 53 23 51C21 44 19 32 18 26C16 27 14 25 12 21C16 16 22 14 26 12Z"
      fill="url(#backGlass)"
      stroke="#38bdf8"
      strokeWidth="1.5"
      strokeLinejoin="round"
      opacity="0.95"
    />
    {/* Spine Groove */}
    <line x1="32" y1="17" x2="32" y2="49" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.6" />
    {/* Trapezius Muscle Lines */}
    <path d="M26 14L32 23L38 14" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
    {/* Left Lat Glowing Wing */}
    <path
      d="M22 28C26 28 30 33 30 43C27 43 25 41 23 37C21 34 21 30 22 28Z"
      stroke="url(#latsGlow)"
      strokeWidth="2.2"
      fill="rgba(255, 107, 0, 0.25)"
      className="drop-shadow-[0_0_8px_#FF6B00]"
    />
    {/* Right Lat Glowing Wing */}
    <path
      d="M42 28C38 28 34 33 34 43C37 43 39 41 41 37C43 34 43 30 42 28Z"
      stroke="url(#latsGlow)"
      strokeWidth="2.2"
      fill="rgba(255, 107, 0, 0.25)"
      className="drop-shadow-[0_0_8px_#FF6B00]"
    />
  </svg>
);

// 15. Biceps Muscle: Flexing Arm with Glowing Bicep Peaks (IMG_5163 Row 1, Col 3)
export const BicepsMuscleIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.55)] ${className}`}
  >
    <defs>
      <linearGradient id="armGlass" x1="14" y1="14" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e293b" stopOpacity="0.85" />
        <stop offset="0.6" stopColor="#0f172a" stopOpacity="0.9" />
        <stop offset="1" stopColor="#020617" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id="bicepGlow" x1="26" y1="28" x2="48" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFB300" />
        <stop offset="0.5" stopColor="#FF6B00" />
        <stop offset="1" stopColor="#FF2200" />
      </linearGradient>
    </defs>
    {/* Flexed Arm Glass Silhouette */}
    <path
      d="M34 16C37 16 41 19 40 24C39 27 36 30 38 32C42 32 49 34 52 38C55 42 53 47 48 48C41 49 29 49 22 47C16 45 14 39 16 34C18 30 22 28 27 28C28 25 30 16 34 16Z"
      fill="url(#armGlass)"
      stroke="#38bdf8"
      strokeWidth="1.5"
      strokeLinejoin="round"
      opacity="0.95"
    />
    {/* Fist Clench detail */}
    <path d="M36 17C35 20 37 23 39 24" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
    {/* Glowing Upper Bicep Peak */}
    <path
      d="M30 31C34 29 42 30 46 34C43 36 38 37 32 35C29 34 29 32 30 31Z"
      stroke="url(#bicepGlow)"
      strokeWidth="2.2"
      fill="rgba(255, 107, 0, 0.25)"
      className="drop-shadow-[0_0_8px_#FF6B00]"
    />
    {/* Glowing Lower Bicep / Brachialis Fiber */}
    <path
      d="M29 38C34 37 42 38 46 41C42 43 36 44 30 42C27 41 27 39 29 38Z"
      stroke="url(#bicepGlow)"
      strokeWidth="2.2"
      fill="rgba(255, 107, 0, 0.2)"
      className="drop-shadow-[0_0_8px_#FF6B00]"
    />
    {/* Specular forearm rim */}
    <path d="M38 23C41 27 42 31 43 33" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// 16. Abs / Core: Torso with Glowing Six-Pack Segments (IMG_5163 Row 1, Col 4)
export const AbsCoreIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.55)] ${className}`}
  >
    <defs>
      <linearGradient id="absGlass" x1="16" y1="12" x2="48" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e293b" stopOpacity="0.85" />
        <stop offset="0.6" stopColor="#0f172a" stopOpacity="0.9" />
        <stop offset="1" stopColor="#020617" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id="absGlow" x1="20" y1="24" x2="44" y2="50" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFAA00" />
        <stop offset="0.6" stopColor="#FF6B00" />
        <stop offset="1" stopColor="#FF2200" />
      </linearGradient>
    </defs>
    {/* Torso Outline */}
    <path
      d="M20 14C23 15 41 15 44 14C47 20 48 30 46 38C44 46 43 51 40 52C36 53 28 53 24 52C21 51 20 46 18 38C16 30 17 20 20 14Z"
      fill="url(#absGlass)"
      stroke="#38bdf8"
      strokeWidth="1.5"
      strokeLinejoin="round"
      opacity="0.95"
    />
    {/* Upper Chest lines */}
    <path d="M22 17C26 21 38 21 42 17" stroke="#38bdf8" strokeWidth="1.2" opacity="0.6" />
    {/* Six-pack Rectus Abdominis glowing segments */}
    <rect x="23" y="24" width="7.5" height="5" rx="2" stroke="url(#absGlow)" strokeWidth="2" fill="rgba(255,107,0,0.2)" className="drop-shadow-[0_0_6px_#FF6B00]" />
    <rect x="33.5" y="24" width="7.5" height="5" rx="2" stroke="url(#absGlow)" strokeWidth="2" fill="rgba(255,107,0,0.2)" className="drop-shadow-[0_0_6px_#FF6B00]" />
    <rect x="23" y="31" width="7.5" height="5.5" rx="2" stroke="url(#absGlow)" strokeWidth="2" fill="rgba(255,107,0,0.2)" className="drop-shadow-[0_0_6px_#FF6B00]" />
    <rect x="33.5" y="31" width="7.5" height="5.5" rx="2" stroke="url(#absGlow)" strokeWidth="2" fill="rgba(255,107,0,0.2)" className="drop-shadow-[0_0_6px_#FF6B00]" />
    {/* Lower V-Taper / Iliac crest lines */}
    <path d="M24 39C28 44 30 49 32 50C34 49 36 44 40 39" stroke="url(#absGlow)" strokeWidth="2" strokeLinecap="round" fill="none" className="drop-shadow-[0_0_6px_#FF6B00]" />
  </svg>
);

// 17. Legs / Quads: Pair of Legs with Glowing Quadriceps (IMG_5163 Row 1, Col 5)
export const LegsQuadsIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.55)] ${className}`}
  >
    <defs>
      <linearGradient id="legGlass" x1="16" y1="12" x2="48" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e293b" stopOpacity="0.85" />
        <stop offset="0.6" stopColor="#0f172a" stopOpacity="0.9" />
        <stop offset="1" stopColor="#020617" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id="quadGlow" x1="20" y1="18" x2="44" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFAA00" />
        <stop offset="0.6" stopColor="#FF6B00" />
        <stop offset="1" stopColor="#FF2200" />
      </linearGradient>
    </defs>
    {/* Left Leg Silhouette */}
    <path
      d="M20 12H30C31 22 30 33 28 39C29 44 29 48 29 53H23C22 48 21 44 22 39C20 33 19 22 20 12Z"
      fill="url(#legGlass)"
      stroke="#38bdf8"
      strokeWidth="1.5"
      strokeLinejoin="round"
      opacity="0.95"
    />
    {/* Right Leg Silhouette */}
    <path
      d="M34 12H44C45 22 44 33 42 39C43 44 43 48 41 53H35C35 48 35 44 36 39C34 33 33 22 34 12Z"
      fill="url(#legGlass)"
      stroke="#38bdf8"
      strokeWidth="1.5"
      strokeLinejoin="round"
      opacity="0.95"
    />
    {/* Left Quad Muscles Glowing Lobes */}
    <path d="M23 17C26 21 26 31 24 35" stroke="url(#quadGlow)" strokeWidth="2.2" strokeLinecap="round" className="drop-shadow-[0_0_6px_#FF6B00]" />
    <path d="M28 17C29 23 28 29 27 34" stroke="url(#quadGlow)" strokeWidth="2.2" strokeLinecap="round" className="drop-shadow-[0_0_6px_#FF6B00]" />
    {/* Right Quad Muscles Glowing Lobes */}
    <path d="M37 17C36 23 37 29 38 34" stroke="url(#quadGlow)" strokeWidth="2.2" strokeLinecap="round" className="drop-shadow-[0_0_6px_#FF6B00]" />
    <path d="M41 17C38 21 38 31 40 35" stroke="url(#quadGlow)" strokeWidth="2.2" strokeLinecap="round" className="drop-shadow-[0_0_6px_#FF6B00]" />
    {/* Knee Patella Rings */}
    <circle cx="25" cy="40" r="2" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />
    <circle cx="39" cy="40" r="2" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />
  </svg>
);

// 18. Shoulders / Deltoids: Torso with Glowing Deltoid Muscle Caps (IMG_5163 Row 2, Col 1)
export const ShouldersIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.55)] ${className}`}
  >
    <defs>
      <linearGradient id="shGlass" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e293b" stopOpacity="0.85" />
        <stop offset="0.6" stopColor="#0f172a" stopOpacity="0.9" />
        <stop offset="1" stopColor="#020617" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id="deltGlow" x1="12" y1="18" x2="52" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFAA00" />
        <stop offset="0.6" stopColor="#FF6B00" />
        <stop offset="1" stopColor="#FF2200" />
      </linearGradient>
    </defs>
    {/* Torso Outline */}
    <path
      d="M26 14C28 16 36 16 38 14C42 16 47 18 51 22C53 26 53 32 50 34C48 35 46 34 45 32C44 38 42 45 40 50C36 52 28 52 24 50C22 45 20 38 19 32C18 34 16 35 14 34C11 32 11 26 13 22C17 18 22 16 26 14Z"
      fill="url(#shGlass)"
      stroke="#38bdf8"
      strokeWidth="1.5"
      strokeLinejoin="round"
      opacity="0.95"
    />
    {/* Chest subtle lines */}
    <path d="M22 25C26 27 30 27 32 29C34 27 38 27 42 25" stroke="#38bdf8" strokeWidth="1.2" opacity="0.6" />
    {/* Left Deltoid Glowing Cap */}
    <path
      d="M14 22C17 19 22 19 24 23C23 27 21 31 16 32C13 30 13 25 14 22Z"
      stroke="url(#deltGlow)"
      strokeWidth="2.2"
      fill="rgba(255,107,0,0.25)"
      className="drop-shadow-[0_0_8px_#FF6B00]"
    />
    {/* Right Deltoid Glowing Cap */}
    <path
      d="M50 22C47 19 42 19 40 23C41 27 43 31 48 32C51 30 51 25 50 22Z"
      stroke="url(#deltGlow)"
      strokeWidth="2.2"
      fill="rgba(255,107,0,0.25)"
      className="drop-shadow-[0_0_8px_#FF6B00]"
    />
  </svg>
);

// 19. Medical / Health Status: Glass Badge with Star of Life & Caduceus (IMG_5163 Row 2, Col 2)
export const MedicalCrossIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] ${className}`}
  >
    <defs>
      <linearGradient id="medGlass" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e293b" stopOpacity="0.9" />
        <stop offset="0.6" stopColor="#0f172a" stopOpacity="0.95" />
        <stop offset="1" stopColor="#020617" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="caduceusGlow" x1="32" y1="18" x2="32" y2="46" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFC107" />
        <stop offset="0.5" stopColor="#FF7700" />
        <stop offset="1" stopColor="#FF3D00" />
      </linearGradient>
    </defs>
    {/* Outer Circular Glass Disc */}
    <circle cx="32" cy="32" r="23" fill="url(#medGlass)" stroke="#38bdf8" strokeWidth="2" opacity="0.95" />
    <circle cx="32" cy="32" r="20" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    {/* 6-Pointed Star of Life Cross */}
    <path
      d="M30 16H34V24.5L41.5 20.2L43.5 23.7L36 28L43.5 32.3L41.5 35.8L34 31.5V40H30V31.5L22.5 35.8L20.5 32.3L28 28L20.5 23.7L22.5 20.2L30 24.5V16Z"
      fill="#0c192c"
      stroke="#38bdf8"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    {/* Central Glowing Asclepius Staff */}
    <line x1="32" y1="19" x2="32" y2="45" stroke="url(#caduceusGlow)" strokeWidth="2.2" strokeLinecap="round" className="drop-shadow-[0_0_6px_#FF8A00]" />
    {/* Entwined Serpent curves */}
    <path
      d="M30 23C34 23 34 27 30 28C26 29 26 33 34 34C37 35 37 39 31 40"
      stroke="url(#caduceusGlow)"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      className="drop-shadow-[0_0_6px_#FF8A00]"
    />
    {/* Specular curved rim */}
    <path d="M19 20C23 15 31 13 36 14" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
  </svg>
);

// 20. Ankle / Foot Injury: Foot Silhouette with Glowing Bandage (IMG_5163 Row 2, Col 3)
export const AnkleBandageIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.55)] ${className}`}
  >
    <defs>
      <linearGradient id="footGlass" x1="18" y1="14" x2="50" y2="50" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e293b" stopOpacity="0.85" />
        <stop offset="0.6" stopColor="#0f172a" stopOpacity="0.9" />
        <stop offset="1" stopColor="#020617" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id="bandageGlow" x1="26" y1="26" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFAA00" />
        <stop offset="0.5" stopColor="#FF6B00" />
        <stop offset="1" stopColor="#FF2200" />
      </linearGradient>
    </defs>
    {/* Lower Leg & Foot Silhouette */}
    <path
      d="M26 14H34C34 23 35 31 38 35C42 38 48 39 52 40C54 42 54 46 51 48C46 50 28 50 24 47C20 43 21 34 22 26L26 14Z"
      fill="url(#footGlass)"
      stroke="#38bdf8"
      strokeWidth="1.5"
      strokeLinejoin="round"
      opacity="0.95"
    />
    {/* Toe ridges */}
    <path d="M47 42C48 44 48 47 46 48" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
    <path d="M43 42C44 44 44 47 42 48" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
    {/* Diagonal Glowing Adhesive Bandage / Plaster on Ankle */}
    <g transform="rotate(-35 34 35)">
      <rect x="23" y="30" width="22" height="10" rx="5" fill="rgba(255,107,0,0.25)" stroke="url(#bandageGlow)" strokeWidth="2.2" className="drop-shadow-[0_0_8px_#FF6B00]" />
      {/* Central gauze pad */}
      <rect x="29" y="31.5" width="10" height="7" rx="2" fill="none" stroke="#FFAA00" strokeWidth="1.2" strokeDasharray="2 1" />
      {/* Bandage breather dots */}
      <circle cx="26" cy="35" r="0.8" fill="#ffffff" />
      <circle cx="42" cy="35" r="0.8" fill="#ffffff" />
    </g>
  </svg>
);

// 21. Knee Joint: Anatomical Knee with Glowing Articular Cartilage (IMG_5163 Row 2, Col 4)
export const KneeJointIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.55)] ${className}`}
  >
    <defs>
      <linearGradient id="kneeGlass" x1="16" y1="12" x2="48" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e293b" stopOpacity="0.85" />
        <stop offset="0.6" stopColor="#0f172a" stopOpacity="0.9" />
        <stop offset="1" stopColor="#020617" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id="kneeGlow" x1="20" y1="24" x2="44" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFB300" />
        <stop offset="0.5" stopColor="#FF6B00" />
        <stop offset="1" stopColor="#FF2200" />
      </linearGradient>
    </defs>
    {/* Femur (Thigh bone) */}
    <path
      d="M26 14H38V24C41 26 43 30 41 33C37 35 34 34 32 32C30 34 27 35 23 33C21 30 23 26 26 24V14Z"
      fill="url(#kneeGlass)"
      stroke="#38bdf8"
      strokeWidth="1.5"
      opacity="0.95"
    />
    {/* Tibia & Fibula (Shin bones) */}
    <path
      d="M24 37C28 35 30 36 32 38C34 36 36 35 40 37C42 41 40 45 38 48V52H26V48C24 45 22 41 24 37Z"
      fill="url(#kneeGlass)"
      stroke="#38bdf8"
      strokeWidth="1.5"
      opacity="0.95"
    />
    {/* Glowing Orange Knee Meniscus / Patella Ring Cartilage */}
    <ellipse
      cx="32"
      cy="34.5"
      rx="9"
      ry="5.5"
      fill="rgba(255,107,0,0.25)"
      stroke="url(#kneeGlow)"
      strokeWidth="2.4"
      className="drop-shadow-[0_0_8px_#FF6B00]"
    />
    {/* Patella kneecap inner oval */}
    <ellipse cx="32" cy="34.5" rx="4.5" ry="2.5" fill="#FFE57F" opacity="0.85" />
    {/* Outer collateral ligaments */}
    <path d="M21 27C18 33 18 38 21 43" stroke="url(#kneeGlow)" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M43 27C46 33 46 38 43 43" stroke="url(#kneeGlow)" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 22. Gluten-Free: Glass Badge with Glowing Crossed Wheat Sheaf (IMG_5163 Row 3, Col 1)
export const GlutenFreeIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.55)] ${className}`}
  >
    <defs>
      <linearGradient id="gfGlass" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e293b" stopOpacity="0.9" />
        <stop offset="0.6" stopColor="#0f172a" stopOpacity="0.95" />
        <stop offset="1" stopColor="#020617" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="wheatGlow" x1="22" y1="18" x2="42" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFC107" />
        <stop offset="0.5" stopColor="#FF7700" />
        <stop offset="1" stopColor="#FF3D00" />
      </linearGradient>
    </defs>
    {/* Outer Circular Glass Badge */}
    <circle cx="32" cy="32" r="23" fill="url(#gfGlass)" stroke="#38bdf8" strokeWidth="2" opacity="0.95" />
    <circle cx="32" cy="32" r="20" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    {/* Central Wheat Stem */}
    <line x1="32" y1="18" x2="32" y2="45" stroke="url(#wheatGlow)" strokeWidth="2" strokeLinecap="round" className="drop-shadow-[0_0_6px_#FF8A00]" />
    {/* Wheat Grains / Ear Lobes */}
    <ellipse cx="28" cy="23" rx="2.5" ry="4" transform="rotate(-30 28 23)" fill="rgba(255,107,0,0.3)" stroke="url(#wheatGlow)" strokeWidth="1.8" />
    <ellipse cx="36" cy="23" rx="2.5" ry="4" transform="rotate(30 36 23)" fill="rgba(255,107,0,0.3)" stroke="url(#wheatGlow)" strokeWidth="1.8" />
    <ellipse cx="28" cy="29" rx="2.5" ry="4" transform="rotate(-30 28 29)" fill="rgba(255,107,0,0.3)" stroke="url(#wheatGlow)" strokeWidth="1.8" />
    <ellipse cx="36" cy="29" rx="2.5" ry="4" transform="rotate(30 36 29)" fill="rgba(255,107,0,0.3)" stroke="url(#wheatGlow)" strokeWidth="1.8" />
    <ellipse cx="28" cy="35" rx="2.5" ry="4" transform="rotate(-30 28 35)" fill="rgba(255,107,0,0.3)" stroke="url(#wheatGlow)" strokeWidth="1.8" />
    <ellipse cx="36" cy="35" rx="2.5" ry="4" transform="rotate(30 36 35)" fill="rgba(255,107,0,0.3)" stroke="url(#wheatGlow)" strokeWidth="1.8" />
    {/* Diagonal Prohibition Slash */}
    <line x1="17" y1="47" x2="47" y2="17" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" className="drop-shadow-[0_0_6px_#38bdf8]" />
  </svg>
);

// 23. Nut-Free: Glass Badge with Glowing Crossed Peanuts (IMG_5163 Row 3, Col 2)
export const NutFreeIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.55)] ${className}`}
  >
    <defs>
      <linearGradient id="nfGlass" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e293b" stopOpacity="0.9" />
        <stop offset="0.6" stopColor="#0f172a" stopOpacity="0.95" />
        <stop offset="1" stopColor="#020617" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="nutGlow" x1="22" y1="20" x2="42" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFC107" />
        <stop offset="0.5" stopColor="#FF7700" />
        <stop offset="1" stopColor="#FF3D00" />
      </linearGradient>
    </defs>
    {/* Outer Circular Glass Badge */}
    <circle cx="32" cy="32" r="23" fill="url(#nfGlass)" stroke="#38bdf8" strokeWidth="2" opacity="0.95" />
    <circle cx="32" cy="32" r="20" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    {/* Peanut Shell Outline */}
    <path
      d="M26 24C27 21 31 20 34 22C37 24 35 27 34 29C35 31 38 34 36 38C34 42 29 42 26 39C23 36 25 32 26 30C25 28 23 26 26 24Z"
      fill="rgba(255,107,0,0.25)"
      stroke="url(#nutGlow)"
      strokeWidth="2.2"
      className="drop-shadow-[0_0_6px_#FF8A00]"
    />
    {/* Peanut shell cross hatch */}
    <circle cx="30" cy="25" r="0.8" fill="#FFAA00" />
    <circle cx="31" cy="35" r="0.8" fill="#FFAA00" />
    <circle cx="28" cy="37" r="0.8" fill="#FFAA00" />
    {/* Second Cashew / Hazelnut shape */}
    <path
      d="M34 38C38 36 43 38 43 42C43 46 38 46 36 44C34 42 34 39 34 38Z"
      fill="rgba(255,107,0,0.25)"
      stroke="url(#nutGlow)"
      strokeWidth="2"
    />
    {/* Diagonal Prohibition Slash */}
    <line x1="17" y1="47" x2="47" y2="17" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" className="drop-shadow-[0_0_6px_#38bdf8]" />
  </svg>
);

// 24. Spine / Vertebrae: Glass Badge with Glowing Vertebral Discs (IMG_5163 Row 3, Col 3)
export const SpineVertebraeIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.55)] ${className}`}
  >
    <defs>
      <linearGradient id="spGlass" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e293b" stopOpacity="0.9" />
        <stop offset="0.6" stopColor="#0f172a" stopOpacity="0.95" />
        <stop offset="1" stopColor="#020617" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="spineGlow" x1="32" y1="16" x2="32" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFC107" />
        <stop offset="0.5" stopColor="#FF7700" />
        <stop offset="1" stopColor="#FF3D00" />
      </linearGradient>
    </defs>
    {/* Outer Circular Glass Badge */}
    <circle cx="32" cy="32" r="23" fill="url(#spGlass)" stroke="#38bdf8" strokeWidth="2" opacity="0.95" />
    <circle cx="32" cy="32" r="20" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    {/* Stacked Vertebral Segment Plates (Cervical to Lumbar) */}
    {[17, 21, 25, 29, 33, 37, 41, 45].map((y, idx) => {
      const width = idx < 2 ? 10 : idx < 5 ? 12 : 14;
      const x = 32 - width / 2;
      return (
        <g key={y}>
          <rect
            x={x}
            y={y}
            width={width}
            height={2.8}
            rx={1.4}
            fill="rgba(255,107,0,0.3)"
            stroke="url(#spineGlow)"
            strokeWidth="1.8"
            className="drop-shadow-[0_0_6px_#FF8A00]"
          />
          {/* Side transverse processes */}
          <line x1={x - 2} y1={y + 1.4} x2={x} y2={y + 1.4} stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
          <line x1={x + width} y1={y + 1.4} x2={x + width + 2} y2={y + 1.4} stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      );
    })}
    {/* Central Spinal Cord Guide */}
    <line x1="32" y1="16" x2="32" y2="48" stroke="#FFE57F" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.7" />
  </svg>
);

// 25. Dairy / Lactose-Free: Glass Badge with Crossed Milk Bottle (IMG_5163 Row 3, Col 4)
export const DairyFreeIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.55)] ${className}`}
  >
    <defs>
      <linearGradient id="dfGlass" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e293b" stopOpacity="0.9" />
        <stop offset="0.6" stopColor="#0f172a" stopOpacity="0.95" />
        <stop offset="1" stopColor="#020617" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="milkGlow" x1="24" y1="20" x2="40" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFC107" />
        <stop offset="0.5" stopColor="#FF7700" />
        <stop offset="1" stopColor="#FF3D00" />
      </linearGradient>
    </defs>
    {/* Outer Circular Glass Badge */}
    <circle cx="32" cy="32" r="23" fill="url(#dfGlass)" stroke="#38bdf8" strokeWidth="2" opacity="0.95" />
    <circle cx="32" cy="32" r="20" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    {/* Milk Bottle Silhouette */}
    <path
      d="M29 18H35V22L38 26V44C38 45.5 36.5 46 35 46H29C27.5 46 26 45.5 26 44V26L29 22V18Z"
      fill="rgba(56,189,248,0.15)"
      stroke="#38bdf8"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* Bottle Cap */}
    <rect x="28" y="16" width="8" height="2.5" rx="1" fill="#38bdf8" />
    {/* Central Glowing Cross Badge on Milk Bottle */}
    <path
      d="M30 31H34V33H36V37H34V39H30V37H28V33H30V31Z"
      fill="rgba(255,107,0,0.3)"
      stroke="url(#milkGlow)"
      strokeWidth="1.8"
      strokeLinejoin="round"
      className="drop-shadow-[0_0_6px_#FF8A00]"
    />
    {/* Diagonal Prohibition Slash */}
    <line x1="17" y1="47" x2="47" y2="17" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" className="drop-shadow-[0_0_6px_#38bdf8]" />
  </svg>
);

// 26. Stopwatch / Chronometer: Glass Timer with Glowing Orange Dial (IMG_5163 Row 4, Col 1)
export const StopwatchIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.55)] ${className}`}
  >
    <defs>
      <linearGradient id="swGlass" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e293b" stopOpacity="0.9" />
        <stop offset="0.6" stopColor="#0f172a" stopOpacity="0.95" />
        <stop offset="1" stopColor="#020617" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="timerGlow" x1="32" y1="20" x2="45" y2="35" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFC107" />
        <stop offset="0.6" stopColor="#FF6B00" />
        <stop offset="1" stopColor="#FF2200" />
      </linearGradient>
    </defs>
    {/* Top Clicker Button & Loop */}
    <rect x="29" y="10" width="6" height="4" rx="1.5" fill="#38bdf8" />
    <path d="M26 12C26 8 38 8 38 12" stroke="#38bdf8" strokeWidth="1.5" fill="none" />
    {/* Side Lap Button */}
    <rect x="44" y="14" width="4" height="4" rx="1" transform="rotate(35 44 14)" fill="#38bdf8" />
    {/* Circular Glass Watch Body */}
    <circle cx="32" cy="35" r="20" fill="url(#swGlass)" stroke="#38bdf8" strokeWidth="2" opacity="0.95" />
    <circle cx="32" cy="35" r="17" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    {/* Outer Tick Marks */}
    <circle cx="32" cy="19" r="1" fill="#38bdf8" />
    <circle cx="48" cy="35" r="1" fill="#38bdf8" />
    <circle cx="32" cy="51" r="1" fill="#38bdf8" />
    <circle cx="16" cy="35" r="1" fill="#38bdf8" />
    {/* Glowing Orange Quadrant Arc */}
    <path
      d="M32 20C40.2 20 47 26.8 47 35"
      stroke="url(#timerGlow)"
      strokeWidth="3.2"
      strokeLinecap="round"
      className="drop-shadow-[0_0_8px_#FF6B00]"
    />
    {/* Stopwatch Indicator Needle */}
    <line x1="32" y1="35" x2="42" y2="25" stroke="url(#timerGlow)" strokeWidth="2.5" strokeLinecap="round" className="drop-shadow-[0_0_6px_#FF8A00]" />
    {/* Center Pivot */}
    <circle cx="32" cy="35" r="3" fill="#FFC107" />
    <circle cx="32" cy="35" r="1.5" fill="#0f172a" />
  </svg>
);

// 27. Gym Dumbbell: Glass Dumbbell with Glowing Orange Knurled Grip & Plates (IMG_5163 Row 4, Col 2)
export const GymDumbbellIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] ${className}`}
  >
    <defs>
      <linearGradient id="dbGlass" x1="12" y1="20" x2="52" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e293b" stopOpacity="0.9" />
        <stop offset="0.6" stopColor="#0f172a" stopOpacity="0.95" />
        <stop offset="1" stopColor="#020617" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="dbGlow" x1="24" y1="32" x2="40" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFC107" />
        <stop offset="0.5" stopColor="#FF7700" />
        <stop offset="1" stopColor="#FF3D00" />
      </linearGradient>
    </defs>
    {/* Left Outer Plate */}
    <rect x="12" y="24" width="4.5" height="16" rx="2.2" fill="url(#dbGlass)" stroke="#38bdf8" strokeWidth="1.6" />
    {/* Left Inner Plate */}
    <rect x="18" y="20" width="5.5" height="24" rx="2.5" fill="url(#dbGlass)" stroke="#38bdf8" strokeWidth="1.6" />
    {/* Left Collar */}
    <rect x="23.5" y="27" width="2.5" height="10" rx="1" fill="#38bdf8" />

    {/* Center Handle Bar with Glowing Orange Knurling */}
    <rect
      x="26"
      y="29"
      width="12"
      height="6"
      rx="2"
      fill="rgba(255,107,0,0.3)"
      stroke="url(#dbGlow)"
      strokeWidth="2.2"
      className="drop-shadow-[0_0_8px_#FF8A00]"
    />
    <line x1="30" y1="30" x2="30" y2="34" stroke="#FFE57F" strokeWidth="1" />
    <line x1="34" y1="30" x2="34" y2="34" stroke="#FFE57F" strokeWidth="1" />

    {/* Right Collar */}
    <rect x="38" y="27" width="2.5" height="10" rx="1" fill="#38bdf8" />
    {/* Right Inner Plate */}
    <rect x="40.5" y="20" width="5.5" height="24" rx="2.5" fill="url(#dbGlass)" stroke="#38bdf8" strokeWidth="1.6" />
    {/* Right Outer Plate */}
    <rect x="47.5" y="24" width="4.5" height="16" rx="2.2" fill="url(#dbGlass)" stroke="#38bdf8" strokeWidth="1.6" />
    {/* Specular curved highlights on plates */}
    <path d="M19 22C21 22 22 25 22 28" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    <path d="M42 22C44 22 45 25 45 28" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// 28. Heart Pulse: 3D Glass Heart with Glowing ECG Pulse Wave (IMG_5163 Row 4, Col 3)
export const HeartPulseIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.55)] ${className}`}
  >
    <defs>
      <linearGradient id="hpGlass" x1="16" y1="14" x2="48" y2="50" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e293b" stopOpacity="0.85" />
        <stop offset="0.6" stopColor="#0f172a" stopOpacity="0.9" />
        <stop offset="1" stopColor="#020617" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id="hpGlow" x1="12" y1="32" x2="52" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFC107" />
        <stop offset="0.5" stopColor="#FF7700" />
        <stop offset="1" stopColor="#FF3300" />
      </linearGradient>
    </defs>
    {/* Glass Heart */}
    <path
      d="M32 50C32 50 16 38 16 26C16 19.5 21 15 27 15C30.5 15 32 17.5 32 17.5C32 17.5 33.5 15 37 15C43 15 48 19.5 48 26C48 38 32 50 32 50Z"
      fill="url(#hpGlass)"
      stroke="#38bdf8"
      strokeWidth="1.8"
      strokeLinejoin="round"
      opacity="0.95"
    />
    {/* Specular curved highlight */}
    <path d="M21 21C23 18 26 17 28 17" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
    {/* Glowing Electrocardiogram ECG Line through heart */}
    <path
      d="M12 33H22L26 23L31 43L36 27L40 35L43 33H52"
      stroke="url(#hpGlow)"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="drop-shadow-[0_0_8px_#FF8A00]"
    />
  </svg>
);

// 29. Analytics / Progress Report: Glass Document with Glowing Pie & Bar Charts (IMG_5163 Row 4, Col 4)
export const AnalyticsReportIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-[0_0_12px_rgba(255,107,0,0.55)] ${className}`}
  >
    <defs>
      <linearGradient id="arGlass" x1="14" y1="12" x2="50" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e293b" stopOpacity="0.9" />
        <stop offset="0.6" stopColor="#0f172a" stopOpacity="0.95" />
        <stop offset="1" stopColor="#020617" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="arGlow" x1="18" y1="18" x2="46" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFC107" />
        <stop offset="0.5" stopColor="#FF7700" />
        <stop offset="1" stopColor="#FF3D00" />
      </linearGradient>
    </defs>
    {/* Glass Document Card */}
    <rect
      x="16"
      y="12"
      width="32"
      height="40"
      rx="8"
      fill="url(#arGlass)"
      stroke="#38bdf8"
      strokeWidth="1.8"
      opacity="0.95"
    />
    <rect x="18" y="14" width="28" height="36" rx="6" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    {/* Glowing Orange Pie Chart (Top Left) */}
    <path
      d="M28 25L28 18A7 7 0 0 1 35 25Z"
      fill="url(#arGlow)"
      className="drop-shadow-[0_0_6px_#FF8A00]"
    />
    <circle cx="28" cy="25" r="7" stroke="#38bdf8" strokeWidth="1.8" fill="none" />
    {/* Glowing Orange Vertical Bar Chart Columns (Bottom Right) */}
    <rect x="36" y="42" width="2.5" height="5" rx="1" fill="#38bdf8" />
    <rect x="40" y="37" width="2.5" height="10" rx="1" fill="url(#arGlow)" className="drop-shadow-[0_0_4px_#FF8A00]" />
    <rect x="44" y="32" width="2.5" height="15" rx="1" fill="url(#arGlow)" className="drop-shadow-[0_0_4px_#FF8A00]" />
    {/* Bullet Report Indicator Bars (Bottom Left) */}
    <line x1="20" y1="38" x2="30" y2="38" stroke="url(#arGlow)" strokeWidth="2" strokeLinecap="round" className="drop-shadow-[0_0_4px_#FF8A00]" />
    <line x1="20" y1="42" x2="28" y2="42" stroke="url(#arGlow)" strokeWidth="2" strokeLinecap="round" className="drop-shadow-[0_0_4px_#FF8A00]" />
    <line x1="20" y1="46" x2="30" y2="46" stroke="url(#arGlow)" strokeWidth="2" strokeLinecap="round" className="drop-shadow-[0_0_4px_#FF8A00]" />
    {/* Specular curved highlight */}
    <path d="M20 15C24 13 32 13 36 14" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
  </svg>
);
