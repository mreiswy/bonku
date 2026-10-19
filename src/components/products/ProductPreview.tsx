import React, { useState } from 'react';
import { ShoppingBag, Image as ImageIcon, Coffee } from 'lucide-react';
import type { Project } from '../../types/bonku';

interface ProductPreviewProps {
  project: Project;
  className?: string;
  isMobileFrame?: boolean;
}

export const ProductPreview: React.FC<ProductPreviewProps> = ({
  project,
  className = '',
  isMobileFrame = false
}) => {
  const [imageError, setImageError] = useState(false);
  const isRoti = isMobileFrame || project.category === 'roti';

  return (
    <div
      className={`relative w-full flex flex-col overflow-hidden rounded-[24px] bg-[#fffdf5] border-2 border-[#2a1710] shadow-[6px_6px_0px_#2a1710] group/preview ${className}`}
    >
      {/* product frame label bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#f8e7d2] border-b-2 border-[#2a1710] shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#f87171] border border-[#2a1710]" />
          <span className="w-3 h-3 rounded-full bg-[#fde047] border border-[#2a1710]" />
          <span className="w-3 h-3 rounded-full bg-[#4ade80] border border-[#2a1710]" />
          <div className="ml-2 px-3 py-0.5 rounded-md bg-[#fffdf5] border border-[#2a1710]/50 text-[11px] font-mono font-bold text-[#2a1710] truncate max-w-[160px] sm:max-w-[240px]">
            {isRoti ? 'bonku / roti-isi-abon' : 'bonku / abon-ayam-pouch-100g'}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono font-black px-2.5 py-0.5 rounded-md bg-[#fde047] text-[#2a1710] border border-[#2a1710]">
          {isRoti ? <Coffee className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
          <span>{isRoti ? 'ROTI ISI ABON' : 'ABON AYAM'}</span>
        </div>
      </div>

      {/* content viewport */}
      <div className="relative w-full flex-1 min-h-0 bg-[#f8fafc] flex items-center justify-center overflow-hidden">
        {!imageError && project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            onError={() => setImageError(true)}
            className={`w-full h-full ${
              project.imageFit === 'contain' || isRoti
                ? 'object-contain object-center p-3 sm:p-4'
                : 'object-cover object-top'
            } transition-transform duration-500 group-hover/preview:scale-[1.02]`}
          />
        ) : (
          // fallback placeholder
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="p-4 rounded-2xl bg-[#fce7c8] border-2 border-[#2a1710] text-[#b2430f] shadow-[3px_3px_0px_#2a1710] group-hover/preview:scale-110 transition-transform">
              <ImageIcon className="w-8 h-8" />
            </div>

            <div>
              <div className="text-base font-black text-[#2a1710] tracking-tight">
                {project.title}
              </div>
              <p className="text-xs font-mono font-bold text-[#b2430f] mt-0.5">
                Foto Produk BonKu
              </p>
            </div>

            <div className="text-[11px] font-mono text-[#475569] bg-[#fffdf5] px-3 py-1 rounded-lg border border-[#2a1710]/30">
              {project.stack.slice(0, 3).join(' • ')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
