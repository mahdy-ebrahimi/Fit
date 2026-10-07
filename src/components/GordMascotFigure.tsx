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
  onOpenUpload?: () => void;
}

/**
 * GordMascotFigure: Directly renders the official character sheet image (IMG_5171.png)
 */
export const GordMascotFigure: React.FC<GordMascotFigureProps> = ({
  className = '',
  size = 'hero',
  showShadow = true,
  withGlow = true,
}) => {
  const imageSizeMap = {
    sm: 'max-h-48 max-w-[140px]',
    md: 'max-h-64 max-w-[200px]',
    lg: 'max-h-84 sm:max-h-96 max-w-[290px]',
    hero: 'max-h-[380px] sm:max-h-[460px] md:max-h-[500px] max-w-[380px]',
  };

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Background Radiance Glow */}
      {withGlow && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B00]/25 via-blue-600/15 to-transparent rounded-full blur-3xl scale-110 pointer-events-none" />
      )}

      {/* Official Character Sheet Image (IMG_5171.png) */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative rounded-3xl overflow-hidden p-2.5 bg-gradient-to-b from-white/10 to-black/60 border border-[#FF6B00]/40 shadow-2xl backdrop-blur-md">
          <img
            src="/IMG_5171.png"
            alt="مربی گُرد (GORD)"
            className={`${imageSizeMap[size]} object-contain rounded-2xl filter drop-shadow(0_14px_28px_rgba(0,0,0,0.7)) transition-transform duration-500 hover:scale-[1.02]`}
          />
        </div>

        {/* Soft Radial Ground Shadow */}
        {showShadow && (
          <div className="w-48 sm:w-60 h-6 bg-black/60 rounded-full blur-md mt-2 pointer-events-none" />
        )}
      </div>
    </div>
  );
};
