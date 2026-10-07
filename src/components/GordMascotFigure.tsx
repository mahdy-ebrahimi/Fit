import React, { useState, useEffect } from 'react';
import { getCustomCharacterImage } from '../utils/assetManager';
import { Upload, Sparkles, Image as ImageIcon } from 'lucide-react';

export type GordActionPose =
  | 'welcoming'
  | 'pointing'
  | 'explaining'
  | 'thumbs_up'
  | 'flexing'
  | 'holding_tablet';

interface GordMascotFigureProps {
  pose?: GordActionPose;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showShadow?: boolean;
  withGlow?: boolean;
  onOpenUpload?: () => void;
}

/**
 * GordMascotFigure: Displays the user's uploaded character sheet image (IMG_5171.png)
 * or the vector character representation when image is loading.
 */
export const GordMascotFigure: React.FC<GordMascotFigureProps> = ({
  pose = 'welcoming',
  className = '',
  size = 'hero',
  showShadow = true,
  withGlow = true,
  onOpenUpload,
}) => {
  const [customImage, setCustomImage] = useState<string | null>(() => getCustomCharacterImage());
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setCustomImage(getCustomCharacterImage());
      setImgError(false);
    };
    window.addEventListener('gord-assets-updated', handleUpdate);
    return () => window.removeEventListener('gord-assets-updated', handleUpdate);
  }, []);

  const sizeMap = {
    sm: 'w-32 h-44',
    md: 'w-48 h-64',
    lg: 'w-64 h-84 sm:w-76 sm:h-96',
    hero: 'w-72 h-96 sm:w-96 sm:h-[460px] md:w-[420px] md:h-[510px]',
  };

  const imageSizeMap = {
    sm: 'max-h-44 max-w-[130px]',
    md: 'max-h-64 max-w-[190px]',
    lg: 'max-h-84 sm:max-h-96 max-w-[280px]',
    hero: 'max-h-[380px] sm:max-h-[460px] max-w-[360px]',
  };

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Dynamic Background Radiance Aura */}
      {withGlow && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B00]/30 via-blue-600/20 to-transparent rounded-full blur-3xl scale-110 pointer-events-none" />
      )}

      {/* Case 1: Custom Character Sheet Image Uploaded */}
      {customImage && !imgError ? (
        <div className="relative z-10 flex flex-col items-center group">
          <div className="relative rounded-3xl overflow-hidden p-2 bg-gradient-to-b from-white/10 to-black/60 border border-[#FF6B00]/40 shadow-2xl backdrop-blur-md">
            <img
              src={customImage}
              alt="مربی گُرد (GORD)"
              onError={() => setImgError(true)}
              className={`${imageSizeMap[size]} object-contain rounded-2xl filter drop-shadow(0_12px_24px_rgba(0,0,0,0.7)) transition-transform duration-500 group-hover:scale-[1.02]`}
            />

            {/* Quick Upload Button on Hover */}
            {onOpenUpload && (
              <button
                type="button"
                onClick={onOpenUpload}
                className="absolute bottom-3 left-3 right-3 py-2 px-3 rounded-xl bg-black/80 hover:bg-[#FF6B00] text-amber-300 hover:text-black font-black text-[11px] border border-amber-500/40 shadow-lg flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>تغییر تصویر کاراکتر</span>
              </button>
            )}
          </div>

          {showShadow && (
            <div className="w-48 h-6 bg-black/60 rounded-full blur-md mt-2" />
          )}
        </div>
      ) : (
        /* Case 2: High-Definition Vector Representation & Upload Trigger */
        <div className="relative flex flex-col items-center">
          <svg
            viewBox="0 0 340 430"
            className={`${sizeMap[size]} relative z-10 filter drop-shadow(0_16px_32px_rgba(0,0,0,0.65)) transition-all duration-500 ease-out`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="gordSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBD5B5" />
                <stop offset="50%" stopColor="#E5A67C" />
                <stop offset="100%" stopColor="#BA7248" />
              </linearGradient>

              <linearGradient id="gordSkinShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#BA7248" />
                <stop offset="100%" stopColor="#9C5935" />
              </linearGradient>

              <linearGradient id="gordHair" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="40%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              <linearGradient id="gordRoyalBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="40%" stopColor="#1D4ED8" />
                <stop offset="85%" stopColor="#1E3A8A" />
                <stop offset="100%" stopColor="#0F1F47" />
              </linearGradient>

              <linearGradient id="gordGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="40%" stopColor="#FFB800" />
                <stop offset="70%" stopColor="#FF6B00" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              <linearGradient id="gordTowel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="65%" stopColor="#F8FAFC" />
                <stop offset="90%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>

              <radialGradient id="gordFloorShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(0,0,0,0.7)" />
                <stop offset="60%" stopColor="rgba(0,0,0,0.3)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* 1. Ground Shadow */}
            {showShadow && (
              <ellipse cx="170" cy="412" rx="110" ry="15" fill="url(#gordFloorShadow)" />
            )}

            {/* 2. Athletic Trousers / Legs */}
            <g id="trousers-and-shoes">
              <path
                d="M135 255 C118 280, 102 318, 110 365 C113 376, 132 376, 138 368 C145 330, 153 295, 162 260 Z"
                fill="url(#gordRoyalBlue)"
              />
              <path
                d="M205 255 C222 280, 238 318, 230 365 C227 376, 208 376, 202 368 C195 330, 187 295, 178 260 Z"
                fill="url(#gordRoyalBlue)"
              />
              <path d="M160 258 L170 282 L180 258 Z" fill="#0A1838" />

              <path d="M112 285 C115 305, 115 328, 116 350" stroke="url(#gordGold)" strokeWidth="4" strokeLinecap="round" />
              <path d="M228 285 C225 305, 225 328, 224 350" stroke="url(#gordGold)" strokeWidth="4" strokeLinecap="round" />

              <rect x="112" y="364" width="26" height="8" rx="4" fill="url(#gordGold)" />
              <rect x="202" y="364" width="26" height="8" rx="4" fill="url(#gordGold)" />

              <path
                d="M110 372 C110 372, 108 388, 94 396 C90 399, 93 404, 102 404 L138 404 C143 404, 145 399, 143 388 L137 372 Z"
                fill="url(#gordRoyalBlue)"
              />
              <path d="M92 401 L145 401 C145 406, 140 409, 136 409 L98 409 C94 409, 92 406, 92 401 Z" fill="#FFFFFF" />
              <path d="M104 392 C114 386, 126 386, 134 392" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" />

              <path
                d="M230 372 C230 372, 232 388, 246 396 C250 399, 247 404, 238 404 L202 404 C197 404, 195 399, 197 388 L203 372 Z"
                fill="url(#gordRoyalBlue)"
              />
              <path d="M248 401 L195 401 C195 406, 200 409, 204 409 L242 409 C246 409, 248 406, 248 401 Z" fill="#FFFFFF" />
              <path d="M236 392 C226 386, 214 386, 206 392" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* 3. Hair */}
            <path
              d="M110 82 C86 88, 78 116, 84 152 C88 180, 102 202, 108 212 C112 185, 116 148, 124 115 Z"
              fill="url(#gordHair)"
            />
            <path
              d="M230 82 C254 88, 262 116, 256 152 C252 180, 238 202, 232 212 C228 185, 224 148, 216 115 Z"
              fill="url(#gordHair)"
            />

            {/* 4. Torso & Fitted Royal Blue Tank */}
            <path
              d="M116 148 C102 170, 96 215, 102 258 C124 266, 216 266, 238 258 C244 215, 238 170, 224 148 Z"
              fill="url(#gordRoyalBlue)"
            />
            <path d="M120 155 C128 190, 130 230, 126 256" stroke="url(#gordGold)" strokeWidth="2.5" opacity="0.8" />
            <path d="M220 155 C212 190, 210 230, 214 256" stroke="url(#gordGold)" strokeWidth="2.5" opacity="0.8" />

            {/* 5. Golden Waist Sash */}
            <path
              d="M102 236 C138 245, 202 245, 238 236 L237 252 C202 260, 138 260, 103 252 Z"
              fill="url(#gordGold)"
            />
            <path d="M204 246 L218 305 L236 300 L226 244 Z" fill="url(#gordGold)" />
            <path d="M208 260 H228 M210 274 H230 M212 288 H232" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />

            {/* 6. Chest Crest */}
            <g id="chest-logo-shield">
              <path
                d="M170 174 C178 174, 188 178, 190 188 C192 198, 186 210, 170 220 C154 210, 148 198, 150 188 C152 178, 162 174, 170 174 Z"
                fill="#09142C"
                stroke="url(#gordGold)"
                strokeWidth="1.8"
              />
              <text x="170" y="196" textAnchor="middle" fill="#FFA000" fontSize="10" fontWeight="900" fontFamily="sans-serif">
                گُرد
              </text>
              <text x="170" y="207" textAnchor="middle" fill="#FFFFFF" fontSize="5.5" fontWeight="900" letterSpacing="1" fontFamily="sans-serif">
                GORD
              </text>
            </g>

            {/* 7. Action Arms based on current Pose */}
            {pose === 'flexing' ? (
              <g id="pose-flexing">
                <path d="M112 152 C82 144, 55 120, 64 88 C75 60, 97 80, 104 105 C108 122, 112 138, 112 152 Z" fill="url(#gordSkin)" />
                <circle cx="76" cy="94" r="24" fill="url(#gordSkin)" />
                <rect x="58" y="108" width="22" height="14" rx="3.5" fill="url(#gordGold)" transform="rotate(-25 58 108)" />
                <circle cx="62" cy="80" r="15" fill="url(#gordSkin)" />

                <path d="M228 152 C258 144, 285 120, 276 88 C265 60, 243 80, 236 105 C232 122, 228 138, 228 152 Z" fill="url(#gordSkin)" />
                <circle cx="264" cy="94" r="24" fill="url(#gordSkin)" />
                <rect x="262" y="108" width="22" height="14" rx="3.5" fill="url(#gordGold)" transform="rotate(25 262 108)" />
                <circle cx="278" cy="80" r="15" fill="url(#gordSkin)" />
              </g>
            ) : pose === 'pointing' ? (
              <g id="pose-pointing">
                <path d="M114 152 C82 168, 66 208, 86 240 C97 235, 112 195, 114 165 Z" fill="url(#gordSkin)" />
                <circle cx="86" cy="235" r="13" fill="url(#gordSkin)" />
                <rect x="80" y="212" width="18" height="11" rx="3.5" fill="url(#gordGold)" />

                <path d="M226 158 C250 166, 285 180, 296 202 C287 213, 252 205, 230 188 Z" fill="url(#gordSkin)" />
                <circle cx="296" cy="201" r="14" fill="url(#gordSkin)" />
                <path d="M300 197 L326 191 C329 190, 330 195, 324 199 L300 205 Z" fill="url(#gordSkin)" />
                <rect x="270" y="182" width="20" height="11" rx="3.5" fill="url(#gordGold)" transform="rotate(25 270 182)" />
              </g>
            ) : (
              <g id="pose-welcoming">
                <path d="M116 152 C88 168, 62 193, 49 222 C60 234, 90 201, 116 168 Z" fill="url(#gordSkin)" />
                <circle cx="49" cy="222" r="13" fill="url(#gordSkin)" />
                <rect x="69" y="195" width="18" height="11" rx="3.5" fill="url(#gordGold)" transform="rotate(-40 69 195)" />

                <path d="M224 152 C252 168, 278 193, 291 222 C280 234, 250 201, 224 168 Z" fill="url(#gordSkin)" />
                <circle cx="291" cy="222" r="13" fill="url(#gordSkin)" />
                <rect x="253" y="195" width="18" height="11" rx="3.5" fill="url(#gordGold)" transform="rotate(40 253 195)" />
              </g>
            )}

            {/* 8. White Gym Towel */}
            <path d="M125 120 C118 142, 112 186, 118 230 C127 232, 140 232, 146 230 C140 186, 142 142, 151 120 Z" fill="url(#gordTowel)" />
            <path d="M124 214 C131 204, 135 204, 139 214 M132 200 V220 M126 208 H137" stroke="#1E3A8A" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M215 120 C222 142, 228 186, 222 230 C213 232, 200 232, 194 230 C200 186, 198 142, 189 120 Z" fill="url(#gordTowel)" />
            <path d="M201 214 C208 204, 212 204, 216 214 M209 200 V220 M203 208 H214" stroke="#1E3A8A" strokeWidth="2.4" strokeLinecap="round" />

            {/* 9. Muscular Neck */}
            <path d="M152 98 H188 V136 H152 Z" fill="url(#gordSkin)" />
            <path d="M128 120 C144 110, 156 104, 170 104 C184 104, 196 110, 212 120 Z" fill="url(#gordSkin)" />

            {/* 10. Head & Jaw */}
            <path d="M144 60 C144 35, 196 35, 196 60 C196 87, 188 111, 170 111 C152 111, 144 87, 144 60 Z" fill="url(#gordSkin)" />
            <path d="M138 52 C138 28, 202 28, 202 52 C204 63, 200 71, 196 71 C194 57, 190 44, 170 44 C150 44, 146 57, 144 71 C140 71, 136 63, 138 52 Z" fill="url(#gordHair)" />

            {/* 11. Headband */}
            <path d="M138 49 C156 46, 184 46, 202 49 L202 59 C184 56, 156 56, 138 59 Z" fill="url(#gordGold)" />

            {/* 12. Face & Beard */}
            <path d="M150 66 C156 61, 162 61, 165 66" stroke="#0F172A" strokeWidth="3.4" strokeLinecap="round" />
            <path d="M175 66 C178 61, 184 61, 190 66" stroke="#0F172A" strokeWidth="3.4" strokeLinecap="round" />
            <ellipse cx="157" cy="71" rx="5" ry="4.2" fill="#0F172A" />
            <circle cx="158" cy="70" r="1.8" fill="#FFFFFF" />
            <ellipse cx="183" cy="71" rx="5" ry="4.2" fill="#0F172A" />
            <circle cx="184" cy="70" r="1.8" fill="#FFFFFF" />
            <path d="M170 68 L172 81 L166 83" stroke="#BA7248" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M148 83 C154 81, 162 82, 170 85 C178 82, 186 81, 192 83 C194 94, 190 111, 170 115 C150 111, 146 94, 148 83 Z" fill="url(#gordHair)" />
            <path d="M161 92 C165 97, 175 97, 179 92" stroke="#FFFFFF" strokeWidth="3.6" strokeLinecap="round" />
          </svg>

          {/* Direct Prompt to Upload the Exact Character Sheet */}
          {onOpenUpload && (
            <button
              type="button"
              onClick={onOpenUpload}
              className="mt-3 px-4 py-2 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>بارگذاری فایل اصلی کاراکتر (IMG_5171.png)</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
