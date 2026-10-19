import React from 'react';
import { motion } from 'framer-motion';

export const SpiceDecorations: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      <div className="absolute inset-0 w-full h-full">
        <svg
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M-50,0 C320,110 580,30 920,120 C1240,210 1380,80 1500,140 L1500,900 L-50,900 Z"
            fill="#fbe9d6"
            opacity="0.85"
          />

          <path
            d="M-50,220 C280,350 640,190 980,320 C1260,420 1420,280 1500,340 L1500,900 L-50,900 Z"
            fill="#f7dfc2"
            opacity="0.8"
          />

          <path
            d="M-50,480 C360,390 740,560 1080,440 C1320,360 1440,500 1500,470 L1500,900 L-50,900 Z"
            fill="#f0cf9f"
            opacity="0.75"
          />
        </svg>
      </div>

      <svg
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full opacity-45"
      >
        <path
          d="M0,80 C360,160 620,80 960,170 C1260,250 1380,140 1440,190"
          stroke="#ddb98f"
          strokeWidth="1.5"
          strokeDasharray="6 8"
        />
        <path
          d="M0,280 C320,400 680,240 1020,370 C1300,470 1400,330 1440,390"
          stroke="#b9975f"
          strokeWidth="1.5"
          strokeDasharray="8 10"
        />
        <path
          d="M0,540 C400,450 780,620 1120,500 C1360,420 1400,540 1440,510"
          stroke="#9c7a45"
          strokeWidth="1.5"
        />
      </svg>

      <motion.div
        animate={{ y: [0, -5, 0], rotate: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
        className="absolute top-16 right-10 sm:right-28 opacity-90"
      >
        <svg width="48" height="48" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                  {/* toples bumbu */}
                  <rect x="13" y="15" width="24" height="30" rx="6" fill="#FBE9D6" stroke="#2a1710" strokeWidth="2" />
                  <rect x="15" y="30" width="20" height="13" rx="4" fill="#E2571A" />
                  <rect x="9" y="6" width="32" height="9" rx="4" fill="#F6A83C" stroke="#2a1710" strokeWidth="2" />
                  <rect x="17" y="19" width="16" height="9" rx="3" fill="#FFFFFF" stroke="#2a1710" strokeWidth="1.4" />
                  <text x="25" y="26" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#8A3410" fontFamily="sans-serif">BUMBU</text>
                </svg>
      </motion.div>

      <motion.div
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
        className="absolute top-14 left-6 sm:left-16 opacity-85 pointer-events-none"
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                  {/* cobek batu */}
                  <path d="M8 30 L52 30 Q46 52 30 52 Q14 52 8 30 Z" fill="#7A4A1D" stroke="#2a1710" strokeWidth="2" />
                  <ellipse cx="30" cy="30" rx="22" ry="7" fill="#9C7A45" stroke="#2a1710" strokeWidth="2" />
                  <ellipse cx="30" cy="30" rx="15" ry="4.5" fill="#E2571A" />
                  {/* ulekan */}
                  <path d="M34 8 L28 30" stroke="#A07449" strokeWidth="7" strokeLinecap="round" />
                  <rect x="28" y="2" width="14" height="10" rx="4" fill="#B9975F" stroke="#7A4A1D" strokeWidth="1.6" />
                </svg>
      </motion.div>

      {/* bawang merah */}
            <div className="absolute top-1/2 left-6 sm:left-14 opacity-80">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
                <path
                  d="M20 6 C30 12 34 20 32 27 C30 34 26 36 20 36 C14 36 10 34 8 27 C6 20 10 12 20 6 Z"
                  fill="#B2430F"
                  stroke="#2a1710"
                  strokeWidth="1.8"
                />
                <path d="M20 6 C17 14 16 24 18 36" stroke="#8A3410" strokeWidth="1.4" fill="none" />
                <path d="M20 6 C23 14 24 24 22 36" stroke="#8A3410" strokeWidth="1.2" fill="none" />
                <path d="M18 5 L20 1 L22 5" stroke="#4D7C0F" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </div>

            {/* kemasan retort pouch bertumpuk */}
            <div className="absolute bottom-12 right-6 sm:right-20 opacity-85 pointer-events-none">
              <svg width="70" height="60" viewBox="0 0 70 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                <rect x="8" y="30" width="54" height="24" rx="7" fill="#FBE9D6" stroke="#2a1710" strokeWidth="2" />
                <rect x="14" y="33" width="42" height="5" rx="2.5" fill="#F6A83C" />

                <rect x="12" y="10" width="50" height="22" rx="7" fill="#FBE9D6" stroke="#2a1710" strokeWidth="2" />
                <rect x="18" y="13" width="38" height="5" rx="2.5" fill="#F6A83C" />
                <rect x="22" y="21" width="30" height="7" rx="3" fill="#FFFFFF" />
                <text x="37" y="27" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#8A3410" fontFamily="sans-serif">BONKU</text>
              </svg>
            </div>
    </div>
  );
};
