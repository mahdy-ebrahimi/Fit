import React from 'react';

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
}

/**
 * GordMascotFigure: Ultra-detailed, authentic recreation of Coach "گُرد" (GORD)
 * strictly modeled after IMG_5171.png (Official Character Sheet):
 * 1. Facial & Hair: Pompadour taper fade, golden meander headband, groomed black beard & mustache, bright smile.
 * 2. Signature Apparel:
 *    - White gym neck towel with Persian navy Boteh (paisley) floral embroidery
 *    - Royal Persian Blue athletic compression tank with gold piping and GORD chest crest
 *    - Wide golden sash belt with embroidered hanging tail
 *    - Navy training trousers with gold side meander ornament
 *    - Athletic gym sneakers with orange and white soles
 *    - Golden-orange wrist wraps
 * 3. Exact Poses from Character Sheet:
 *    - Welcoming (Hero Host)
 *    - Pointing (Stat Inquiries)
 *    - Flexing (Hypertrophy & Muscle Goals)
 *    - Explaining (Biomechanics & Joint Safety)
 *    - Holding Tablet (Metrics & Diet Checklist)
 *    - Thumbs Up (Final Champion Approval)
 */
export const GordMascotFigure: React.FC<GordMascotFigureProps> = ({
  pose = 'welcoming',
  className = '',
  size = 'hero',
  showShadow = true,
  withGlow = true,
}) => {
  const sizeMap = {
    sm: 'w-32 h-44',
    md: 'w-48 h-64',
    lg: 'w-64 h-84 sm:w-76 sm:h-96',
    hero: 'w-72 h-96 sm:w-96 sm:h-[460px] md:w-[420px] md:h-[510px]',
  };

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Dynamic Background Radiance Aura */}
      {withGlow && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B00]/25 via-blue-600/15 to-transparent rounded-full blur-3xl scale-110 pointer-events-none" />
      )}

      <svg
        viewBox="0 0 340 430"
        className={`${sizeMap[size]} relative z-10 filter drop-shadow(0_16px_32px_rgba(0,0,0,0.65)) transition-all duration-500 ease-out`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Skin Shading Gradient */}
          <linearGradient id="gordSkin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBD5B5" />
            <stop offset="50%" stopColor="#E5A67C" />
            <stop offset="100%" stopColor="#BA7248" />
          </linearGradient>

          {/* Skin Muscle Shadow */}
          <linearGradient id="gordSkinShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BA7248" />
            <stop offset="100%" stopColor="#9C5935" />
          </linearGradient>

          {/* Hair & Beard Deep Gradient */}
          <linearGradient id="gordHair" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="40%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Royal Persian Blue Athletic Outfit */}
          <linearGradient id="gordRoyalBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="40%" stopColor="#1D4ED8" />
            <stop offset="85%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0F1F47" />
          </linearGradient>

          {/* Golden Amber Sash & Trims */}
          <linearGradient id="gordGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="40%" stopColor="#FFB800" />
            <stop offset="70%" stopColor="#FF6B00" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Gym Neck Towel Clean White */}
          <linearGradient id="gordTowel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#F8FAFC" />
            <stop offset="90%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Floor Radial Shadow */}
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

        {/* 2. Athletic Trousers / Legs (Baggy Navy Gym Pants from character sheet) */}
        <g id="trousers-and-shoes">
          {/* Left Leg */}
          <path
            d="M135 255 C118 280, 102 318, 110 365 C113 376, 132 376, 138 368 C145 330, 153 295, 162 260 Z"
            fill="url(#gordRoyalBlue)"
          />
          {/* Right Leg */}
          <path
            d="M205 255 C222 280, 238 318, 230 365 C227 376, 208 376, 202 368 C195 330, 187 295, 178 260 Z"
            fill="url(#gordRoyalBlue)"
          />
          {/* Crotch Inseam Shadow */}
          <path d="M160 258 L170 282 L180 258 Z" fill="#0A1838" />

          {/* Gold Meander Embroidery Down Outer Trouser Seams */}
          <path
            d="M112 285 C115 305, 115 328, 116 350"
            stroke="url(#gordGold)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M228 285 C225 305, 225 328, 224 350"
            stroke="url(#gordGold)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Ankle Cuffs (Gathered Gold Bands) */}
          <rect x="112" y="364" width="26" height="8" rx="4" fill="url(#gordGold)" />
          <rect x="202" y="364" width="26" height="8" rx="4" fill="url(#gordGold)" />

          {/* Left Athletic Sneaker */}
          <path
            d="M110 372 C110 372, 108 388, 94 396 C90 399, 93 404, 102 404 L138 404 C143 404, 145 399, 143 388 L137 372 Z"
            fill="url(#gordRoyalBlue)"
          />
          <path d="M92 401 L145 401 C145 406, 140 409, 136 409 L98 409 C94 409, 92 406, 92 401 Z" fill="#FFFFFF" />
          <path d="M104 392 C114 386, 126 386, 134 392" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" />

          {/* Right Athletic Sneaker */}
          <path
            d="M230 372 C230 372, 232 388, 246 396 C250 399, 247 404, 238 404 L202 404 C197 404, 195 399, 197 388 L203 372 Z"
            fill="url(#gordRoyalBlue)"
          />
          <path d="M248 401 L195 401 C195 406, 200 409, 204 409 L242 409 C246 409, 248 406, 248 401 Z" fill="#FFFFFF" />
          <path d="M236 392 C226 386, 214 386, 206 392" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* 3. Hair (Back Flowing Locks) */}
        <path
          d="M110 82 C86 88, 78 116, 84 152 C88 180, 102 202, 108 212 C112 185, 116 148, 124 115 Z"
          fill="url(#gordHair)"
        />
        <path
          d="M230 82 C254 88, 262 116, 256 152 C252 180, 238 202, 232 212 C228 185, 224 148, 216 115 Z"
          fill="url(#gordHair)"
        />

        {/* 4. Torso & Fitted Royal Blue Athletic Tank */}
        <path
          d="M116 148 C102 170, 96 215, 102 258 C124 266, 216 266, 238 258 C244 215, 238 170, 224 148 Z"
          fill="url(#gordRoyalBlue)"
        />

        {/* Torso Gold Seam Highlights */}
        <path d="M120 155 C128 190, 130 230, 126 256" stroke="url(#gordGold)" strokeWidth="2.5" opacity="0.8" />
        <path d="M220 155 C212 190, 210 230, 214 256" stroke="url(#gordGold)" strokeWidth="2.5" opacity="0.8" />

        {/* 5. Golden Waist Sash Belt with Hanging Embroidered Tail */}
        <path
          d="M102 236 C138 245, 202 245, 238 236 L237 252 C202 260, 138 260, 103 252 Z"
          fill="url(#gordGold)"
        />
        {/* Hanging Sash Tail */}
        <path
          d="M204 246 L218 305 L236 300 L226 244 Z"
          fill="url(#gordGold)"
        />
        {/* Embroidered Lines on Sash */}
        <path
          d="M208 260 H228 M210 274 H230 M212 288 H232"
          stroke="#78350F"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* 6. Chest Official "گُرد / GORD" Crest Emblem on Tank */}
        <g id="chest-logo-shield">
          <path
            d="M170 174 C178 174, 188 178, 190 188 C192 198, 186 210, 170 220 C154 210, 148 198, 150 188 C152 178, 162 174, 170 174 Z"
            fill="#09142C"
            stroke="url(#gordGold)"
            strokeWidth="1.8"
          />
          <text
            x="170"
            y="196"
            textAnchor="middle"
            fill="#FFA000"
            fontSize="10"
            fontWeight="900"
            fontFamily="Vazirmatn, sans-serif"
          >
            گُرد
          </text>
          <text
            x="170"
            y="207"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="5.5"
            fontWeight="900"
            letterSpacing="1"
            fontFamily="sans-serif"
          >
            GORD
          </text>
        </g>

        {/* 7. Action Arms based on current Pose */}
        {pose === 'flexing' ? (
          /* Pose: Flexing Both Biceps (Pose 5 in Sheet) */
          <g id="pose-flexing">
            {/* Left Arm Flexed High */}
            <path
              d="M112 152 C82 144, 55 120, 64 88 C75 60, 97 80, 104 105 C108 122, 112 138, 112 152 Z"
              fill="url(#gordSkin)"
            />
            {/* Left Bicep Peak */}
            <circle cx="76" cy="94" r="24" fill="url(#gordSkin)" />
            <path d="M68 96 C74 88, 86 88, 92 98" stroke="url(#gordSkinShadow)" strokeWidth="2.5" />
            {/* Left Gold Wristband */}
            <rect x="58" y="108" width="22" height="14" rx="3.5" fill="url(#gordGold)" transform="rotate(-25 58 108)" />
            <path d="M60 114 L80 106" stroke="#1E3A8A" strokeWidth="2.8" />
            {/* Left Fist */}
            <circle cx="62" cy="80" r="15" fill="url(#gordSkin)" />

            {/* Right Arm Flexed High */}
            <path
              d="M228 152 C258 144, 285 120, 276 88 C265 60, 243 80, 236 105 C232 122, 228 138, 228 152 Z"
              fill="url(#gordSkin)"
            />
            {/* Right Bicep Peak */}
            <circle cx="264" cy="94" r="24" fill="url(#gordSkin)" />
            <path d="M256 96 C262 88, 274 88, 280 98" stroke="url(#gordSkinShadow)" strokeWidth="2.5" />
            {/* Right Gold Wristband */}
            <rect x="262" y="108" width="22" height="14" rx="3.5" fill="url(#gordGold)" transform="rotate(25 262 108)" />
            <path d="M264 114 L284 106" stroke="#1E3A8A" strokeWidth="2.8" />
            {/* Right Fist */}
            <circle cx="278" cy="80" r="15" fill="url(#gordSkin)" />
          </g>
        ) : pose === 'pointing' ? (
          /* Pose: Pointing Directly towards questions (Pose 2 in Sheet) */
          <g id="pose-pointing">
            {/* Left Hand on Hip */}
            <path
              d="M114 152 C82 168, 66 208, 86 240 C97 235, 112 195, 114 165 Z"
              fill="url(#gordSkin)"
            />
            <circle cx="86" cy="235" r="13" fill="url(#gordSkin)" />
            <rect x="80" y="212" width="18" height="11" rx="3.5" fill="url(#gordGold)" />

            {/* Right Arm Extended Pointing Forward-Right */}
            <path
              d="M226 158 C250 166, 285 180, 296 202 C287 213, 252 205, 230 188 Z"
              fill="url(#gordSkin)"
            />
            <circle cx="296" cy="201" r="14" fill="url(#gordSkin)" />
            {/* Pointing Index Finger */}
            <path d="M300 197 L326 191 C329 190, 330 195, 324 199 L300 205 Z" fill="url(#gordSkin)" />
            {/* Right Gold Wristband */}
            <rect x="270" y="182" width="20" height="11" rx="3.5" fill="url(#gordGold)" transform="rotate(25 270 182)" />
            <path d="M272 187 L288 193" stroke="#1E3A8A" strokeWidth="2.5" />
          </g>
        ) : pose === 'holding_tablet' ? (
          /* Pose: Holding Coach Tablet / Checklist (Pose 6 in Sheet) */
          <g id="pose-tablet">
            {/* Left Arm holding tablet edge */}
            <path
              d="M114 158 C104 196, 128 226, 150 230 L146 206 C131 198, 122 182, 120 158 Z"
              fill="url(#gordSkin)"
            />
            {/* Right Arm holding tablet edge */}
            <path
              d="M226 158 C236 196, 212 226, 190 230 L194 206 C209 198, 218 182, 220 158 Z"
              fill="url(#gordSkin)"
            />
            {/* The Digital Fitness Tablet */}
            <rect x="134" y="202" width="72" height="54" rx="7" fill="#09142C" stroke="url(#gordGold)" strokeWidth="2.8" />
            <rect x="140" y="208" width="60" height="38" rx="4" fill="#0369A1" opacity="0.4" />
            {/* Checklist Bars on Tablet */}
            <path d="M145 218 H190 M145 227 H180 M145 236 H172" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="186" cy="236" r="3" fill="#FF6B00" />
            {/* Thumbs holding tablet */}
            <circle cx="134" cy="226" r="6.5" fill="url(#gordSkin)" />
            <circle cx="206" cy="226" r="6.5" fill="url(#gordSkin)" />
          </g>
        ) : pose === 'explaining' ? (
          /* Pose: Explaining Biomechanics / Joint Safety (Pose 3 in Sheet) */
          <g id="pose-explaining">
            {/* Left Arm resting at side */}
            <path d="M114 152 C94 174, 88 218, 96 250 Z" fill="url(#gordSkin)" />
            <circle cx="96" cy="250" r="12" fill="url(#gordSkin)" />

            {/* Right Arm Raised in Guiding Gesture */}
            <path
              d="M226 152 C258 141, 283 114, 277 85 C266 85, 247 120, 226 158 Z"
              fill="url(#gordSkin)"
            />
            <circle cx="277" cy="85" r="13" fill="url(#gordSkin)" />
            {/* Open Guiding Hand */}
            <path d="M275 76 L281 56 C283 53, 289 56, 285 65 L279 80 Z" fill="url(#gordSkin)" />
            <rect x="259" y="106" width="20" height="11" rx="3.5" fill="url(#gordGold)" transform="rotate(-30 259 106)" />
            <path d="M261 110 L276 102" stroke="#1E3A8A" strokeWidth="2.5" />
          </g>
        ) : pose === 'thumbs_up' ? (
          /* Pose: Confident Thumbs Up (Pose 4 in Sheet) */
          <g id="pose-thumbs">
            {/* Left Hand on Hip */}
            <path d="M114 152 C82 168, 76 212, 94 245 Z" fill="url(#gordSkin)" />
            <circle cx="94" cy="245" r="12" fill="url(#gordSkin)" />

            {/* Right Arm Raised with Thumbs Up */}
            <path
              d="M226 152 C250 161, 272 155, 280 131 C269 122, 244 137, 226 158 Z"
              fill="url(#gordSkin)"
            />
            <circle cx="281" cy="129" r="13" fill="url(#gordSkin)" />
            {/* Thumb Raised High */}
            <path d="M281 120 C281 107, 288 107, 291 114 L288 126 Z" fill="url(#gordSkin)" />
            <rect x="260" y="140" width="18" height="11" rx="3.5" fill="url(#gordGold)" />
            <path d="M262 145 L275 145" stroke="#1E3A8A" strokeWidth="2.5" />
          </g>
        ) : (
          /* Pose: Welcoming Hero Coach (Pose 1 in Sheet - Default) */
          <g id="pose-welcoming">
            {/* Left Arm Welcoming Gesture */}
            <path
              d="M116 152 C88 168, 62 193, 49 222 C60 234, 90 201, 116 168 Z"
              fill="url(#gordSkin)"
            />
            <circle cx="49" cy="222" r="13" fill="url(#gordSkin)" />
            <rect x="69" y="195" width="18" height="11" rx="3.5" fill="url(#gordGold)" transform="rotate(-40 69 195)" />
            <path d="M71 200 L84 190" stroke="#1E3A8A" strokeWidth="2.5" />

            {/* Right Arm Welcoming Gesture */}
            <path
              d="M224 152 C252 168, 278 193, 291 222 C280 234, 250 201, 224 168 Z"
              fill="url(#gordSkin)"
            />
            <circle cx="291" cy="222" r="13" fill="url(#gordSkin)" />
            <rect x="253" y="195" width="18" height="11" rx="3.5" fill="url(#gordGold)" transform="rotate(40 253 195)" />
            <path d="M255 200 L268 190" stroke="#1E3A8A" strokeWidth="2.5" />
          </g>
        )}

        {/* 8. White Gym Neck Towel (draped with authentic Boteh / Cypress floral print) */}
        {/* Left Towel Flap */}
        <path
          d="M125 120 C118 142, 112 186, 118 230 C127 232, 140 232, 146 230 C140 186, 142 142, 151 120 Z"
          fill="url(#gordTowel)"
        />
        {/* Persian Boteh / Cypress Paisley Embroidery on Left Flap */}
        <path
          d="M124 214 C131 204, 135 204, 139 214 M132 200 V220 M126 208 H137"
          stroke="#1E3A8A"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* Right Towel Flap */}
        <path
          d="M215 120 C222 142, 228 186, 222 230 C213 232, 200 232, 194 230 C200 186, 198 142, 189 120 Z"
          fill="url(#gordTowel)"
        />
        {/* Persian Boteh / Cypress Paisley Embroidery on Right Flap */}
        <path
          d="M201 214 C208 204, 212 204, 216 214 M209 200 V220 M203 208 H214"
          stroke="#1E3A8A"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* 9. Muscular Neck, Trapezius & Throat */}
        <path d="M152 98 H188 V136 H152 Z" fill="url(#gordSkin)" />
        <path d="M128 120 C144 110, 156 104, 170 104 C184 104, 196 110, 212 120 Z" fill="url(#gordSkin)" />

        {/* 10. Head, Jawline & Ears */}
        <path
          d="M144 60 C144 35, 196 35, 196 60 C196 87, 188 111, 170 111 C152 111, 144 87, 144 60 Z"
          fill="url(#gordSkin)"
        />
        {/* Ears */}
        <ellipse cx="142" cy="68" rx="5" ry="8" fill="url(#gordSkin)" />
        <ellipse cx="198" cy="68" rx="5" ry="8" fill="url(#gordSkin)" />

        {/* 11. Pompadour Hair Locks (Styled Persian Hero Cut) */}
        <path
          d="M138 52 C138 28, 202 28, 202 52 C204 63, 200 71, 196 71 C194 57, 190 44, 170 44 C150 44, 146 57, 144 71 C140 71, 136 63, 138 52 Z"
          fill="url(#gordHair)"
        />

        {/* 12. Ancient Persian Gold Headband with Meander / Greek Key Pattern */}
        <path
          d="M138 49 C156 46, 184 46, 202 49 L202 59 C184 56, 156 56, 138 59 Z"
          fill="url(#gordGold)"
        />
        {/* Meander Geometric Pattern Tracing */}
        <path
          d="M144 52 H150 V56 H146 M154 52 H160 V56 H156 M164 52 H170 V56 H166 M174 52 H180 V56 H176 M184 52 H190 V56 H186 M194 52 H198"
          stroke="#78350F"
          strokeWidth="1.4"
        />

        {/* 13. Charismatic Facial Features */}
        {/* Strong Masculine Eyebrows */}
        <path d="M150 66 C156 61, 162 61, 165 66" stroke="#0F172A" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M175 66 C178 61, 184 61, 190 66" stroke="#0F172A" strokeWidth="3.4" strokeLinecap="round" />

        {/* Bright Heroic Dark Eyes with White Catchlights */}
        <ellipse cx="157" cy="71" rx="5" ry="4.2" fill="#0F172A" />
        <circle cx="158" cy="70" r="1.8" fill="#FFFFFF" />

        <ellipse cx="183" cy="71" rx="5" ry="4.2" fill="#0F172A" />
        <circle cx="184" cy="70" r="1.8" fill="#FFFFFF" />

        {/* Chiseled Nose */}
        <path d="M170 68 L172 81 L166 83" stroke="#BA7248" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

        {/* Neat Thick Persian Beard & Mustache */}
        <path
          d="M148 83 C154 81, 162 82, 170 85 C178 82, 186 81, 192 83 C194 94, 190 111, 170 115 C150 111, 146 94, 148 83 Z"
          fill="url(#gordHair)"
        />
        {/* Bright Friendly Smile with Teeth */}
        <path
          d="M161 92 C165 97, 175 97, 179 92"
          stroke="#FFFFFF"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
