import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { profileData } from '../../data/bonkuData';
import { useCardTilt } from '../../hooks/useCardTilt';

interface ProductPhotoCardProps {
  isFlooded: boolean;
}

export const ProductPhotoCard: React.FC<ProductPhotoCardProps> = ({ isFlooded }) => {
  const { tiltProps } = useCardTilt(6);

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;

  return (
    <motion.div
      animate={
        isFlooded
          ? {
              rotate: isMobile ? -5 : -24,
              x: isMobile ? 0 : -32,
              y: isMobile ? 20 : 70,
              scale: isMobile ? 0.98 : 0.94,
              transition: { type: 'spring', stiffness: 160, damping: 16 }
            }
          : {
              rotate: 0,
              x: 0,
              y: 0,
              scale: 1,
              transition: { type: 'spring', stiffness: 260, damping: 18 }
            }
      }
      className="relative w-full flex flex-col items-center lg:items-start gap-6"
    >
      <div
        {...tiltProps}
        className="relative w-full max-w-sm rounded-[32px] p-3.5 bg-[#fffdf5] border border-[#e8d3bd] shadow-2xl shadow-[#7a4a1d]/8 group cursor-pointer"
      >
        <div className="relative aspect-[3/4] w-full rounded-[24px] overflow-hidden bg-[#f8e7d2] border border-[#e3cfae] flex items-center justify-center">
          <img
                      src={profileData.avatarUrl || '/produk/abon-ayam.svg'}
                      alt={profileData.name}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/produk/abon-ayam.svg';
                      }}
                    />

          <div className="absolute inset-0 bg-gradient-to-t from-[#2a1710]/75 via-transparent to-transparent opacity-65 pointer-events-none" />

          <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#fffdf5]/90 border border-[#e8d3bd] backdrop-blur-md shadow-sm">
            <div className="text-sm font-bold text-[#2a1710]">
              {profileData.name}
            </div>
            <div className="text-xs text-[#7a4a1d] font-mono mt-0.5">
              {profileData.education}
            </div>
          </div>
        </div>

        <div className="mt-3 px-2 flex items-center justify-between text-[11px] font-mono text-[#7a4a1d]">
                  <span>FOTO PRODUK</span>
                  <span>ID // BONKU</span>
                </div>
              </div>

              {/* Location & Operating Environment */}
              <motion.div
                animate={isFlooded ? { rotate: 12, x: 24, y: 30 } : { rotate: 0, x: 0, y: 0 }}
                className="w-full max-w-sm p-4 rounded-2xl bg-[#fffdf5] border border-[#e8d3bd] flex items-center justify-between text-xs font-mono text-[#2a1710] shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#7a4a1d]" />
                  <span>{profileData.contact.location}</span>
                </div>
                <span className="text-[#b2430f] font-bold">{profileData.status}</span>
              </motion.div>
    </motion.div>
  );
};
