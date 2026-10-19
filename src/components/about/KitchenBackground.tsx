import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface KitchenBackgroundProps {
  isFlooded: boolean;
}

export const KitchenBackground: React.FC<KitchenBackgroundProps> = ({ isFlooded }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <svg
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-full opacity-70"
        >
          <path
            d="M-100,80 Q420,220 880,100 T1540,180 L1540,900 L-100,900 Z"
            fill="#fbe9d6"
          />
          <path
            d="M-100,280 Q520,420 1020,260 T1540,380 L1540,900 L-100,900 Z"
            fill={isFlooded ? '#e8d8a7' : '#f7dfc2'}
            opacity="0.85"
          />
          <path
            d="M-100,520 Q360,660 920,480 T1540,620 L1540,900 L-100,900 Z"
            fill={isFlooded ? '#ddb98f' : '#f0cf9f'}
            opacity="0.7"
          />
        </svg>
      </div>

      <svg
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full opacity-40"
      >
        <path
          d="M0,140 Q460,250 940,160 T1440,240"
          stroke="#ddb98f"
          strokeWidth="1.5"
          strokeDasharray="6 8"
        />
        <path
          d="M0,340 Q560,460 1040,320 T1440,420"
          stroke="#b9975f"
          strokeWidth="1.5"
          strokeDasharray="8 10"
        />
        <path
          d="M0,580 Q400,680 960,540 T1440,640"
          stroke="#9c7a45"
          strokeWidth="1.5"
        />
      </svg>

      {isFlooded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 pointer-events-none"
        >
          <svg viewBox="0 0 1440 900" fill="none" className="w-full h-full">
            <g stroke="#7a4a1d" strokeWidth="2.5" strokeLinecap="round" opacity="0.65">
              <path d="M120,680 Q180,695 240,670 T320,710" />
              <path d="M720,720 Q800,750 880,715 T960,760" />
              <path d="M450,780 Q520,810 590,790" />
            </g>

            {/* Wet Water Pools */}
            <ellipse cx="380" cy="540" rx="160" ry="40" fill="#f6a83c" opacity="0.35" />
            <ellipse cx="960" cy="610" rx="210" ry="45" fill="#e2571a" opacity="0.3" />
            <ellipse cx="200" cy="730" rx="125" ry="30" fill="#f6a83c" opacity="0.4" />
            <ellipse cx="720" cy="780" rx="140" ry="32" fill="#e2571a" opacity="0.25" />
          </svg>
        </motion.div>
      )}

      {/* Dandang & tumpukan kemasan */}
            <div className="absolute bottom-16 right-10 sm:right-28 opacity-90 pointer-events-none">
              <AnimatePresence mode="wait">
                {!isFlooded ? (
                  <motion.div
                    key="dandang-intact"
                    initial={{ scale: 0.8, y: 15, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.8, y: 15, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  >
                    <svg width="110" height="95" viewBox="0 0 110 95" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                      <ellipse cx="55" cy="86" rx="50" ry="8" fill="#b9975f" opacity="0.4" />
                      <rect x="24" y="40" width="62" height="42" rx="8" fill="#C9CDD2" stroke="#4B5563" strokeWidth="2.5" />
                      <rect x="24" y="56" width="62" height="8" fill="#9CA3AF" />
                      <rect x="16" y="30" width="78" height="12" rx="6" fill="#E5E7EB" stroke="#4B5563" strokeWidth="2.5" />
                      <rect x="46" y="14" width="18" height="16" rx="7" fill="#9CA3AF" stroke="#4B5563" strokeWidth="2.5" />
                      <rect x="82" y="50" width="14" height="9" rx="4" fill="#E5E7EB" stroke="#4B5563" strokeWidth="2" />
                      <rect x="34" y="66" width="42" height="12" rx="4" fill="#FBE9D6" stroke="#2a1710" strokeWidth="1.8" />
                      <text x="55" y="75" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#8A3410" fontFamily="sans-serif">BONKU</text>
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div
                    key="kemasan-tumpah"
                    initial={{ scale: 0.8, y: -10, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.8, y: -10, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 240, damping: 20 }}
                  >
                    <svg width="110" height="95" viewBox="0 0 110 95" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                      <ellipse cx="55" cy="84" rx="52" ry="11" fill="#b9975f" opacity="0.35" />
                      <rect x="20" y="62" width="70" height="20" rx="7" fill="#FBE9D6" stroke="#2a1710" strokeWidth="2" transform="rotate(-6 55 72)" />
                      <rect x="30" y="42" width="58" height="20" rx="7" fill="#FBE9D6" stroke="#2a1710" strokeWidth="2" transform="rotate(9 59 52)" />
                      <path d="M40 30 Q50 22 58 32" stroke="#8A3410" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <path d="M52 26 Q62 20 70 30" stroke="#8A3410" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bunga lawang */}
            <motion.div
              animate={isFlooded ? { rotate: 215, x: 25, y: 35 } : { rotate: [-3, 3, -3], x: 0, y: [0, -3, 0] }}
              transition={{ repeat: isFlooded ? 0 : Infinity, duration: isFlooded ? 0.6 : 6, ease: 'easeInOut' }}
              className="absolute top-24 right-12 sm:right-32 opacity-80"
            >
              <svg width="38" height="38" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
                <path
                  d="M22 2 L26 15 L39 12 L30 22 L37 34 L24 29 L16 40 L16 27 L5 21 L17 16 Z"
                  fill="#7A4A1D"
                  stroke="#4B2E10"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="22" cy="22" r="2.5" fill="#C9A227" />
                <circle cx="22" cy="14" r="1.4" fill="#C9A227" />
                <circle cx="31" cy="22" r="1.4" fill="#C9A227" />
                <circle cx="27" cy="28" r="1.4" fill="#C9A227" />
                <circle cx="17" cy="27" r="1.4" fill="#C9A227" />
              </svg>
            </motion.div>

            {/* Kemasan retort pouch */}
            <motion.div
              animate={isFlooded ? { rotate: 85, x: -35, y: 40 } : { rotate: 12, x: 0, y: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute top-1/2 left-8 sm:left-20 opacity-75"
            >
              <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
                <rect x="3" y="9" width="30" height="22" rx="7" fill="#FBE9D6" stroke="#2a1710" strokeWidth="1.8" />
                <rect x="7" y="12" width="22" height="4" rx="2" fill="#F6A83C" />
                <rect x="9" y="19" width="18" height="7" rx="3" fill="#FFFFFF" stroke="#2a1710" strokeWidth="1" />
                <text x="18" y="24.5" textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="#8A3410" fontFamily="sans-serif">BONKU</text>
              </svg>
            </motion.div>
    </div>
  );
};
