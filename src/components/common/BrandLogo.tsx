import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  withText = false
}) => {
  const sizeMap = {
      sm: { badge: 'w-8 h-8 text-base', text: 'text-xs' },
            md: { badge: 'w-10 h-10 text-xl', text: 'text-sm' },
            lg: { badge: 'w-14 h-14 text-3xl', text: 'text-base' },
            xl: { badge: 'w-24 h-24 text-6xl', text: 'text-lg' }
    };

    const currentSize = sizeMap[size];

    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <div className="relative flex items-center justify-center transition-transform group-hover:scale-105 select-none">
          <img
            src="/logo-bonku-bg.png"
            alt="BonKu"
            className={`${currentSize.badge} object-contain select-none`}
          />
        </div>

        {withText && (
          <div className="flex flex-col text-left">
            <span className={`font-bold text-white tracking-wide leading-tight drop-shadow-sm ${currentSize.text}`}>
              BonKu
            </span>
            <span className="text-[11px] text-[#fdf3e3] font-mono font-medium flex items-center gap-1 drop-shadow-xs">
              &gt;_ Abon Ayam Rumahan
            </span>
          </div>
        )}
      </div>
    );
  };
