import React from 'react';
import { Sparkles, MessageCircle, Volume2, ShieldCheck, Dumbbell, Award } from 'lucide-react';

export type GordPose = 'welcoming' | 'pointing' | 'flexing' | 'explaining' | 'tablet' | 'thumbs_up';

interface GordMascotProps {
  pose?: GordPose;
  message?: string;
  subMessage?: string;
  coachTip?: string;
  mode?: 'dialogue' | 'compact' | 'badge';
  className?: string;
}

export const GordMascot: React.FC<GordMascotProps> = ({
  pose = 'welcoming',
  message,
  subMessage,
  coachTip,
  mode = 'dialogue',
  className = '',
}) => {
  // SVG Graphic of Coach Gord according to character sheet IMG_5171
  const renderGordCharacter = () => {
    return (
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Ambient Back Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B00]/30 via-sky-500/15 to-transparent rounded-full blur-xl scale-125 pointer-events-none" />

        <svg
          viewBox="0 0 200 240"
          className="w-24 h-28 sm:w-28 sm:h-32 md:w-32 md:h-36 relative z-10 filter drop-shadow(0_8px_16px_rgba(0,0,0,0.45)) transition-transform duration-300 hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Skin Tone Gradient */}
            <linearGradient id="gordSkin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBD5B5" />
              <stop offset="50%" stopColor="#E5A67C" />
              <stop offset="100%" stopColor="#C47E53" />
            </linearGradient>

            {/* Hair & Beard Dark Gradient */}
            <linearGradient id="gordDarkHair" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="40%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Gym Outfit Royal Persian Blue */}
            <linearGradient id="gordBlueSuit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="50%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#0F2B5C" />
            </linearGradient>

            {/* Golden Orange Headband & Trims */}
            <linearGradient id="gordGoldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#FF6B00" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* White Neck Towel with Pattern */}
            <linearGradient id="gordTowel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>

          {/* Hair - Back Flowing Mane */}
          <path
            d="M60 40 C45 42, 38 60, 42 85 C44 98, 52 110, 56 115 C58 100, 60 75, 65 60 Z"
            fill="url(#gordDarkHair)"
          />
          <path
            d="M140 40 C155 42, 162 60, 158 85 C156 98, 148 110, 144 115 C142 100, 140 75, 135 60 Z"
            fill="url(#gordDarkHair)"
          />

          {/* Muscular Torso & Athletic Tunic (Deep Royal Blue) */}
          <path
            d="M62 110 C50 125, 45 160, 50 200 C70 208, 130 208, 150 200 C155 160, 150 125, 138 110 Z"
            fill="url(#gordBlueSuit)"
          />
          {/* Tunic Golden Belt / Sash */}
          <path
            d="M52 185 C80 192, 120 192, 148 185 L147 197 C120 204, 80 204, 53 197 Z"
            fill="url(#gordGoldTrim)"
          />
          {/* Sash Fringe Detail */}
          <path
            d="M125 192 L132 230 L144 228 L138 190 Z"
            fill="url(#gordGoldTrim)"
          />
          <path
            d="M128 200 H140 M130 212 H142"
            stroke="#7C2D12"
            strokeWidth="1.2"
          />

          {/* Chest "گُرد" Official Logo Emblem on Shirt */}
          <rect x="88" y="142" width="24" height="15" rx="3" fill="#0F172A" opacity="0.6" />
          <path
            d="M93 151 C96 148, 102 148, 107 151 M98 147 L105 147"
            stroke="#FF6B00"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Muscular Arms & Shoulders based on Pose */}
          {pose === 'flexing' ? (
            /* Double Biceps Flexing Pose */
            <g>
              {/* Left Arm Flexed (viewer's left) */}
              <path
                d="M58 115 C38 110, 22 92, 28 72 C34 55, 48 65, 52 82 C55 92, 58 105, 58 115 Z"
                fill="url(#gordSkin)"
              />
              {/* Left Bicep Peak */}
              <circle cx="36" cy="76" r="14" fill="url(#gordSkin)" />
              {/* Left Wristband */}
              <rect x="25" y="86" width="14" height="9" rx="2" fill="url(#gordGoldTrim)" transform="rotate(-20 25 86)" />

              {/* Right Arm Flexed (viewer's right) */}
              <path
                d="M142 115 C162 110, 178 92, 172 72 C166 55, 152 65, 148 82 C145 92, 142 105, 142 115 Z"
                fill="url(#gordSkin)"
              />
              {/* Right Bicep Peak */}
              <circle cx="164" cy="76" r="14" fill="url(#gordSkin)" />
              {/* Right Wristband */}
              <rect x="161" y="86" width="14" height="9" rx="2" fill="url(#gordGoldTrim)" transform="rotate(20 161 86)" />
            </g>
          ) : pose === 'pointing' ? (
            /* Pointing Directly at Athlete Pose */
            <g>
              {/* Left Arm on Waist */}
              <path
                d="M58 115 C40 125, 30 150, 42 170 C48 165, 56 140, 58 125 Z"
                fill="url(#gordSkin)"
              />
              {/* Right Arm Extended Pointing Forward */}
              <path
                d="M140 120 C155 125, 175 135, 180 148 C175 155, 155 150, 142 140 Z"
                fill="url(#gordSkin)"
              />
              <circle cx="180" cy="148" r="9" fill="url(#gordSkin)" />
              {/* Pointing Index Finger */}
              <path d="M182 146 L196 142 C198 141, 198 145, 194 148 L182 152 Z" fill="url(#gordSkin)" />
              <rect x="162" y="132" width="12" height="8" rx="2" fill="url(#gordGoldTrim)" transform="rotate(25 162 132)" />
            </g>
          ) : pose === 'tablet' ? (
            /* Holding Digital Coach Tablet */
            <g>
              {/* Arms holding tablet in front */}
              <path
                d="M58 120 C52 145, 68 165, 82 168 L80 150 C70 145, 64 135, 62 120 Z"
                fill="url(#gordSkin)"
              />
              <path
                d="M142 120 C148 145, 132 165, 118 168 L120 150 C130 145, 136 135, 138 120 Z"
                fill="url(#gordSkin)"
              />
              {/* Digital Tablet Device */}
              <rect x="76" y="148" width="48" height="34" rx="4" fill="#0F172A" stroke="#FF6B00" strokeWidth="2" />
              <rect x="80" y="152" width="40" height="22" rx="2" fill="#0284C7" opacity="0.35" />
              <path d="M84 158 H114 M84 164 H106" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="100" cy="177" r="1.5" fill="#FF6B00" />
            </g>
          ) : pose === 'explaining' ? (
            /* Explaining / Coaching Gesturing Pose */
            <g>
              {/* Left hand relaxed */}
              <path d="M58 115 C45 130, 42 160, 48 180 Z" fill="url(#gordSkin)" />
              {/* Right arm raised in coaching gesture */}
              <path
                d="M140 115 C158 108, 172 90, 168 70 C162 70, 150 95, 140 120 Z"
                fill="url(#gordSkin)"
              />
              <circle cx="168" cy="70" r="8" fill="url(#gordSkin)" />
              <path d="M168 64 L170 52 C172 50, 175 52, 172 58 L168 66 Z" fill="url(#gordSkin)" />
              <rect x="156" y="85" width="12" height="7" rx="2" fill="url(#gordGoldTrim)" transform="rotate(-30 156 85)" />
            </g>
          ) : pose === 'thumbs_up' ? (
            /* Thumbs Up Pose */
            <g>
              {/* Left Arm on hip */}
              <path d="M58 115 C40 125, 36 155, 48 175 Z" fill="url(#gordSkin)" />
              {/* Right Arm Thumbs Up */}
              <path
                d="M140 115 C155 120, 168 115, 172 100 C165 95, 150 105, 140 120 Z"
                fill="url(#gordSkin)"
              />
              {/* Hand with Thumbs Up */}
              <circle cx="174" cy="98" r="8" fill="url(#gordSkin)" />
              <path d="M174 92 C174 84, 178 84, 180 88 L178 96 Z" fill="url(#gordSkin)" />
              <rect x="158" y="106" width="10" height="7" rx="2" fill="url(#gordGoldTrim)" />
            </g>
          ) : (
            /* Welcoming Open Arms Pose (Default) */
            <g>
              {/* Left Open Arm */}
              <path
                d="M60 115 C42 125, 26 142, 18 160 C26 168, 45 145, 60 125 Z"
                fill="url(#gordSkin)"
              />
              <circle cx="18" cy="160" r="9" fill="url(#gordSkin)" />
              <rect x="30" y="142" width="12" height="8" rx="2" fill="url(#gordGoldTrim)" transform="rotate(-40 30 142)" />

              {/* Right Open Arm */}
              <path
                d="M140 115 C158 125, 174 142, 182 160 C174 168, 155 145, 140 125 Z"
                fill="url(#gordSkin)"
              />
              <circle cx="182" cy="160" r="9" fill="url(#gordSkin)" />
              <rect x="158" y="142" width="12" height="8" rx="2" fill="url(#gordGoldTrim)" transform="rotate(40 158 142)" />
            </g>
          )}

          {/* White Persian Neck Gym Towel draped over shoulders */}
          <path
            d="M66 90 C62 105, 58 135, 62 165 C68 166, 76 166, 80 165 C76 135, 78 105, 84 90 Z"
            fill="url(#gordTowel)"
          />
          {/* Traditional Cypress / Boteh Floral pattern on towel fringe */}
          <path
            d="M66 155 C70 148, 72 148, 76 155 M71 146 V158"
            stroke="#1E40AF"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M134 90 C138 105, 142 135, 138 165 C132 166, 124 166, 120 165 C124 135, 122 105, 116 90 Z"
            fill="url(#gordTowel)"
          />
          <path
            d="M124 155 C128 148, 130 148, 134 155 M129 146 V158"
            stroke="#1E40AF"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Strong Muscular Neck */}
          <path d="M86 75 H114 V102 H86 Z" fill="url(#gordSkin)" />
          {/* Trapezius muscles */}
          <path d="M68 90 C80 82, 90 78, 100 78 C110 78, 120 82, 132 90 Z" fill="url(#gordSkin)" />

          {/* Head & Athletic Champion Jawline */}
          <path
            d="M80 48 C80 30, 120 30, 120 48 C120 68, 114 84, 100 84 C86 84, 80 68, 80 48 Z"
            fill="url(#gordSkin)"
          />

          {/* Hair Top & Curls */}
          <path
            d="M76 42 C76 25, 124 25, 124 42 C126 50, 124 55, 122 55 C120 45, 118 36, 100 36 C82 36, 80 45, 78 55 C76 55, 74 50, 76 42 Z"
            fill="url(#gordDarkHair)"
          />

          {/* Ancient Persian Headband with Greek/Persian Key pattern */}
          <path
            d="M76 40 C90 38, 110 38, 124 40 L124 47 C110 45, 90 45, 76 47 Z"
            fill="url(#gordGoldTrim)"
          />
          {/* Headband geometric pattern */}
          <path
            d="M80 43 H84 V45 H82 M87 43 H91 V45 H89 M94 43 H98 V45 H96 M101 43 H105 V45 H103 M108 43 H112 V45 H110 M115 43 H119 V45 H117"
            stroke="#7C2D12"
            strokeWidth="1"
          />

          {/* Charismatic Eyes & Eyebrows */}
          {/* Left Eyebrow & Eye */}
          <path d="M85 52 C88 49, 93 49, 95 52" stroke="#0F172A" strokeWidth="2.4" strokeLinecap="round" />
          <ellipse cx="90" cy="56" rx="3.5" ry="3" fill="#0F172A" />
          <circle cx="91" cy="55" r="1.2" fill="#FFFFFF" />

          {/* Right Eyebrow & Eye (Winking if thumbs_up/welcoming, or both open) */}
          <path d="M105 52 C107 49, 112 49, 115 52" stroke="#0F172A" strokeWidth="2.4" strokeLinecap="round" />
          <ellipse cx="110" cy="56" rx="3.5" ry="3" fill="#0F172A" />
          <circle cx="111" cy="55" r="1.2" fill="#FFFFFF" />

          {/* Nose */}
          <path d="M99 54 L101 64 L96 66" stroke="#C47E53" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Full Neat Hero Beard & Mustache */}
          <path
            d="M84 66 C88 64, 94 65, 100 67 C106 65, 112 64, 116 66 C117 74, 114 84, 100 86 C86 84, 83 74, 84 66 Z"
            fill="url(#gordDarkHair)"
          />
          {/* Smiling Mouth inside Beard */}
          <path
            d="M93 72 C96 76, 104 76, 107 72"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Coach Gord Floating Level Badge */}
        <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#FF6B00] to-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg border border-white/20 flex items-center gap-1 z-20 font-sans">
          <Award className="w-3 h-3 stroke-[2.5]" />
          <span>مربی گُرد</span>
        </div>
      </div>
    );
  };

  if (mode === 'badge') {
    return (
      <div className={`flex items-center gap-2 p-1.5 rounded-2xl bg-gradient-to-r from-[#FF6B00]/10 to-blue-950/40 border border-[#FF6B00]/25 ${className}`}>
        {renderGordCharacter()}
        <div className="text-right">
          <div className="text-xs font-black text-white flex items-center gap-1">
            <span>مربی گُرد (GORD)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-[10px] text-amber-300 font-semibold">{message || 'در حال آنالیز وضعیت بدنی شما'}</p>
        </div>
      </div>
    );
  }

  // Full Dialogue Coaching Mode (used in questionnaire steps)
  return (
    <div className={`relative rounded-3xl p-4 sm:p-5 mb-5 bg-gradient-to-br from-[#0c1322] via-[#090e18] to-[#05080f] border border-[#FF6B00]/30 shadow-2xl overflow-hidden ${className}`}>
      {/* Decorative Persian Corner Pattern Accent */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-[#FF6B00]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 relative z-10">
        {/* Mascot Avatar / Full Pose */}
        <div className="shrink-0">{renderGordCharacter()}</div>

        {/* Coach Speech Bubble */}
        <div className="flex-1 text-right space-y-2.5 w-full">
          {/* Header of the speech bubble */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#FF6B00] text-black font-sans shadow-sm">
                مربی ارشد هوش مصنوعی
              </span>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                <span>صحبت‌های مربی گُرد</span>
                <span className="text-[#FF6B00] font-mono text-xs">(GORD)</span>
              </h3>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              <span>پاسخ زنده</span>
            </div>
          </div>

          {/* Main Question / Guidance from Gord */}
          <p className="text-xs sm:text-sm font-bold text-slate-100 leading-relaxed sm:leading-loose">
            {message || 'درود بر تو پهلوان! با دقت مشخصاتت رو بهم بگو تا بهترین برنامه اختصاصی عمرت رو برات طراحی کنم.'}
          </p>

          {subMessage && (
            <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium">
              {subMessage}
            </p>
          )}

          {/* Coach Gord Pro-Tip */}
          {coachTip && (
            <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2 text-[11px] text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-amber-300 font-extrabold ml-1">نکته طلایی گُرد:</strong>
                <span>{coachTip}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
