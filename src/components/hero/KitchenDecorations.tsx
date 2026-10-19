import React from 'react';
import { motion } from 'framer-motion';

export const KitchenDecorations: React.FC = () => {
  return (
    <div className="absolute inset-x-0 bottom-0 h-64 z-20 pointer-events-none overflow-hidden select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute left-1 sm:left-6 md:left-10 bottom-1 sm:bottom-3 pointer-events-auto cursor-pointer group scale-[0.62] sm:scale-[0.85] md:scale-100 origin-bottom-left"
      >
        <motion.div
          animate={{ rotate: [-1, 1.5, -1] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="relative"
        >
          <div className="absolute bottom-2 left-6 w-28 h-10 bg-[#ecd3b3]/80 rounded-full blur-[3px] -rotate-6" />

          <svg width="140" height="160" viewBox="0 0 130 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                      {/* wajan besi dengan spatula kayu */}
                      <path d="M14 84 C14 116 38 134 66 134 C94 134 116 116 116 84 Z" fill="#3A1D0C" stroke="#2a1710" strokeWidth="3" />
                      <ellipse cx="65" cy="84" rx="51" ry="14" fill="#46250F" stroke="#2a1710" strokeWidth="3" />
                      <ellipse cx="65" cy="82" rx="42" ry="10" fill="#5A2F13" />

                      {/* abon tersangrai */}
                      <g stroke="#F6A83C" strokeWidth="3" strokeLinecap="round" fill="none">
                        <path d="M36 80 C42 74 50 74 56 80" />
                        <path d="M52 84 C58 78 66 78 72 84" />
                        <path d="M70 79 C76 73 84 73 90 79" />
                      </g>
                      <circle cx="48" cy="86" r="2.4" fill="#E2571A" />
                      <circle cx="78" cy="85" r="2.2" fill="#E2571A" />

                      {/* spatula kayu */}
                      <path d="M76 22 L62 78" stroke="#A07449" strokeWidth="9" strokeLinecap="round" />
                      <path d="M76 22 L62 78" stroke="#7a4a1d" strokeWidth="4" strokeLinecap="round" />
                      <rect x="68" y="10" width="20" height="16" rx="7" fill="#9C7A45" stroke="#7a4a1d" strokeWidth="2" />

                      {/* uap */}
                      <g stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.75" fill="none">
                        <path d="M40 62 C44 52 36 46 40 36" />
                        <path d="M60 58 C64 46 56 40 60 28" />
                      </g>
                    </svg>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        className="flex absolute left-1/2 -translate-x-1/2 bottom-8 sm:bottom-14 md:bottom-20 pointer-events-auto flex-col items-center group cursor-pointer scale-[0.58] sm:scale-[0.78] md:scale-100 origin-bottom"
      >
        <div className="relative">
          <div className="absolute bottom-2 left-6 w-96 h-14 bg-[#ecd3b3]/75 rounded-full blur-[3px]" />

          <svg width="380" height="125" viewBox="0 0 380 125" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
                      {/* talenan kayu */}
                      <polygon points="20,60 360,60 338,116 42,116" fill="#E8D3BD" stroke="#B9975F" strokeWidth="2" />
                      <polygon points="34,66 346,66 328,110 52,110" fill="none" stroke="#B9975F" strokeWidth="1.2" strokeDasharray="4 3" />
                      <line x1="190" y1="60" x2="190" y2="116" stroke="#B9975F" strokeWidth="1.5" strokeDasharray="3 2" />

                      {/* ayam rebus siap disuwir */}
                      <ellipse cx="150" cy="46" rx="62" ry="26" fill="#F6E0C0" stroke="#B9975F" strokeWidth="2" />
                      <ellipse cx="150" cy="44" rx="52" ry="19" fill="#FBE9D6" />

                      {/* suwiran abon */}
                      <g stroke="#B2430F" strokeWidth="3" strokeLinecap="round" fill="none">
                        <path d="M96 82 C104 74 116 74 124 82" />
                        <path d="M120 88 C130 78 142 78 152 88" />
                        <path d="M152 84 C160 76 172 76 180 84" />
                        <path d="M182 90 C192 80 204 80 214 90" />
                        <path d="M216 84 C224 76 236 76 244 84" />
                        <path d="M248 90 C258 80 270 80 280 90" />
                      </g>
                      <circle cx="140" cy="92" r="3" fill="#E2571A" />
                      <circle cx="200" cy="95" r="2.6" fill="#F6A83C" />
                      <circle cx="262" cy="93" r="2.8" fill="#E2571A" />

                      {/* pisau dapur */}
                      <path d="M300 26 L340 42" stroke="#FDF3E3" strokeWidth="12" strokeLinecap="round" />
                      <path d="M300 26 L340 42" stroke="#B9975F" strokeWidth="2" strokeLinecap="round" />
                      <rect x="332" y="36" width="34" height="10" rx="5" fill="#7A4A1D" stroke="#5A2F13" strokeWidth="2" transform="rotate(22 332 36)" />
                    </svg>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute right-1 sm:right-6 md:right-12 bottom-1 sm:bottom-3 pointer-events-auto flex items-end gap-1.5 sm:gap-2.5 md:gap-3 scale-[0.62] sm:scale-[0.85] md:scale-100 origin-bottom-right"
      >
        <motion.div
          whileHover={{ rotate: -18, y: -4 }}
          className="cursor-pointer select-none"
        >
          <div className="w-6 h-2 bg-[#ecd3b3]/80 rounded-full blur-[1px] translate-y-1" />
          <svg width="32" height="72" viewBox="0 0 32 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="-rotate-12 drop-shadow-md">
            <path
              d="M16 2 C26 18, 28 52, 22 70 C16 72, 16 72, 10 70 C4 52, 6 18, 16 2 Z"
              fill="#e2571a"
              stroke="#b2430f"
              strokeWidth="1.5"
            />
            <path
              d="M16 2 C18 18, 19 52, 16 70"
              stroke="#fdf3e3"
              strokeWidth="4"
            />
            <path
              d="M16 2 C18 18, 19 52, 16 70"
              stroke="#F97316"
              strokeWidth="2"
            />
          </svg>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          className="cursor-pointer select-none relative mb-1"
        >
          <div className="absolute -bottom-1 left-2 w-24 h-4 bg-[#ecd3b3]/80 rounded-full blur-[2px]" />
          <svg width="95" height="42" viewBox="0 0 95 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
            <line x1="12" y1="28" x2="8" y2="40" stroke="#7a4a1d" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="28" x2="48" y2="40" stroke="#7a4a1d" strokeWidth="3" strokeLinecap="round" />
            <line x1="82" y1="18" x2="86" y2="40" stroke="#7a4a1d" strokeWidth="3" strokeLinecap="round" />
            <path
              d="M6 28 L55 28 L86 12"
              stroke="#A07449"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path
              d="M8 26 L54 26 L84 11"
              stroke="#f6a83c"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M18 26 L26 26 M36 26 L44 26 M62 22 L70 18"
              stroke="#FFFFFF"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <rect x="74" y="8" width="12" height="7" rx="3" fill="#F97316" stroke="#EA580C" strokeWidth="1" />
          </svg>
        </motion.div>

        <motion.div
          whileHover={{ rotate: 4, scale: 1.05 }}
          className="cursor-pointer select-none relative"
        >
          <div className="absolute -bottom-1 left-4 w-28 h-8 bg-[#ecd3b3]/80 rounded-full blur-[3px]" />
          <svg width="105" height="115" viewBox="0 0 105 115" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                      {/* tumpukan kemasan retort pouch BonKu */}
                      <rect x="10" y="86" width="86" height="26" rx="9" fill="#FBE9D6" stroke="#B2430F" strokeWidth="2.2" />
                      <rect x="18" y="90" width="70" height="6" rx="3" fill="#F6A83C" />
                      <rect x="24" y="99" width="58" height="8" rx="4" fill="#FFFFFF" />
                      <text x="53" y="106" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#8A3410" fontFamily="sans-serif">BONKU 100g</text>

                      <rect x="16" y="58" width="80" height="26" rx="9" fill="#FBE9D6" stroke="#B2430F" strokeWidth="2.2" />
                      <rect x="24" y="62" width="64" height="6" rx="3" fill="#F6A83C" />
                      <rect x="30" y="71" width="52" height="8" rx="4" fill="#FFFFFF" />
                      <text x="56" y="78" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#8A3410" fontFamily="sans-serif">BONKU 100g</text>

                      <rect x="22" y="30" width="74" height="26" rx="9" fill="#FBE9D6" stroke="#B2430F" strokeWidth="2.2" />
                      <rect x="30" y="34" width="58" height="6" rx="3" fill="#F6A83C" />
                      <rect x="36" y="43" width="46" height="8" rx="4" fill="#FFFFFF" />
                      <text x="59" y="50" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#8A3410" fontFamily="sans-serif">BONKU 100g</text>

                      {/* suwiran abon di atas tumpukan */}
                      <g stroke="#B2430F" strokeWidth="2" strokeLinecap="round" fill="none">
                        <path d="M34 26 C40 20 48 20 54 26" />
                        <path d="M50 24 C56 18 64 18 70 24" />
                      </g>
                      <circle cx="46" cy="22" r="2" fill="#E2571A" />
                      <circle cx="62" cy="20" r="1.8" fill="#F6A83C" />
                    </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};
