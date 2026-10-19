import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useRafActivity } from '../../hooks/useRafActivity';

const CABAI_DIALOGUES = [
  'Wushh! Aku cabai merah, bumbu rahasia yang bikin abon nggak hambar!',
  'Aku ditumbuk halus bareng bawang dan rempah, wangi banget!',
  'Tanpa aku, abon cuma ayam kering tanpa karakter!',
  'Aku bikin gurihnya nendang tapi nggak bikin perut panas berlebih.',
  'Aku dipakai secukupnya saja, biar pedasnya pas untuk semua orang.',
  'Aroma bumbuku menguar sampai sekitarmu, hati-hati jadi lapar!',
  'Aku bumbu alami, bukan perasa buatan — jadi lebih aman dimakan rutin.',
  'Dari atas sini aku lihat dapur BonKu bersih dan rapi banget!',
  'Aku bagian dari resep rumahan yang bikin abon awet sampai berhari-hari!'
];

const createShuffledDeck = (items: string[], lastItem?: string): string[] => {
  const deck = [...items];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  if (lastItem && deck[0] === lastItem && deck.length > 1) {
    [deck[0], deck[deck.length - 1]] = [deck[deck.length - 1], deck[0]];
  }
  return deck;
};

const ALTITUDE_ZONES = [
  { min: 10, max: 24 },
  { min: 28, max: 36 },
  { min: 58, max: 68 }
];

export const CabaiTerbang: React.FC = () => {
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
  const [altitudePercent, setAltitudePercent] = useState<number>(14);
  const [currentQuip, setCurrentQuip] = useState<string | null>(null);

  const x = useMotionValue(-160);
  const cabaiRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRafActivity(cabaiRef);

  const deckRef = useRef<string[]>(createShuffledDeck(CABAI_DIALOGUES));
  const lastQuipRef = useRef<string>('');

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const flightLoop = (currentTime: number) => {
      if (!activeRef.current) {
        lastTime = currentTime;
        animId = requestAnimationFrame(flightLoop);
        return;
      }
      const delta = Math.min(0.05, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      const currX = x.get();
      const flightSpeed = 72;
      const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1400;

      if (direction === 'ltr') {
        const nextX = currX + flightSpeed * delta;
        if (nextX > screenWidth + 160) {
          const nextDir = Math.random() > 0.5 ? 'rtl' : 'ltr';
          const randomZone = ALTITUDE_ZONES[Math.floor(Math.random() * ALTITUDE_ZONES.length)];
          const nextAlt = randomZone.min + Math.random() * (randomZone.max - randomZone.min);

          setDirection(nextDir);
          setAltitudePercent(nextAlt);
          x.set(nextDir === 'rtl' ? screenWidth + 160 : -160);
        } else {
          x.set(nextX);
        }
      } else {
        const nextX = currX - flightSpeed * delta;
        if (nextX < -160) {
          const nextDir = Math.random() > 0.5 ? 'ltr' : 'rtl';
          const randomZone = ALTITUDE_ZONES[Math.floor(Math.random() * ALTITUDE_ZONES.length)];
          const nextAlt = randomZone.min + Math.random() * (randomZone.max - randomZone.min);

          setDirection(nextDir);
          setAltitudePercent(nextAlt);
          x.set(nextDir === 'ltr' ? -160 : screenWidth + 160);
        } else {
          x.set(nextX);
        }
      }

      animId = requestAnimationFrame(flightLoop);
    };

    animId = requestAnimationFrame(flightLoop);
    return () => cancelAnimationFrame(animId);
  }, [direction, x, activeRef]);

  useEffect(() => {
    const quipInterval = setInterval(() => {
      if (cabaiRef.current) {
        const rect = cabaiRef.current.getBoundingClientRect();
        if (rect.right > 100 && rect.left < window.innerWidth - 100) {
          if (deckRef.current.length === 0) {
            deckRef.current = createShuffledDeck(CABAI_DIALOGUES, lastQuipRef.current);
          }

          const nextQuip = deckRef.current.pop() || CABAI_DIALOGUES[0];
          lastQuipRef.current = nextQuip;
          setCurrentQuip(nextQuip);

          setTimeout(() => {
            setCurrentQuip(null);
          }, 3000);
        }
      }
    }, 8500);

    return () => clearInterval(quipInterval);
  }, []);

  return (
    <motion.div
      ref={cabaiRef}
      style={{
        x,
        top: `${altitudePercent}%`,
        position: 'absolute',
        pointerEvents: 'none'
      }}
      className="z-20 select-none"
    >
      <div className={`relative ${direction === 'rtl' ? '-scale-x-100' : 'scale-x-100'}`}>
        <motion.div
          animate={{
            y: [0, -8, 2, -6, 0],
            rotate: direction === 'ltr' ? [-1, 2, -1, -2, -1] : [1, -2, 1, 2, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
            ease: 'easeInOut'
          }}
          className="relative"
        >
          <div className="absolute top-24 left-4 w-12 h-2 bg-[#8a3410]/25 rounded-full blur-[3px]" />

          <svg
                      width="58"
                      height="46"
                      viewBox="0 0 58 46"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="drop-shadow-md"
                    >
                      {/* flying cabai merah with stem and wings made of leaf */}
                      <motion.path
                        animate={{
                          d: [
                            'M36 20 C30 8, 20 4, 10 8 C18 16, 24 20, 36 20 Z',
                            'M36 20 C30 14, 20 12, 10 14 C18 18, 24 20, 36 20 Z',
                            'M36 20 C30 30, 20 36, 10 34 C18 26, 24 22, 36 20 Z',
                            'M36 20 C30 8, 20 4, 10 8 C18 16, 24 20, 36 20 Z'
                          ]
                        }}
                        transition={{ repeat: Infinity, duration: 0.7, ease: 'easeInOut' }}
                        fill="#4D7C0F"
                        stroke="#3F6212"
                        strokeWidth="1.4"
                      />

                      {/* cabai body */}
                      <path
                        d="M20 26 C16 22, 16 16, 20 13 C26 9, 36 11, 42 16 C47 20, 48 26, 44 30 C38 35, 26 34, 20 26 Z"
                        fill="#E11D48"
                        stroke="#9F1239"
                        strokeWidth="1.8"
                      />
                      <path d="M24 17 C28 14 34 15 38 18" stroke="#FB7185" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />

                      {/* stem */}
                      <path d="M18 24 C13 25, 10 23, 8 20" stroke="#4D7C0F" strokeWidth="3" strokeLinecap="round" fill="none" />
                      <path d="M14 19 C11 16, 11 12, 13 9 C16 12, 17 16, 16 19 Z" fill="#4D7C0F" stroke="#3F6212" strokeWidth="1.2" />

                      {/* tail leaf */}
                      <path d="M44 30 C48 32, 52 31, 54 28 C50 27, 46 27, 44 30 Z" fill="#4D7C0F" stroke="#3F6212" strokeWidth="1.2" />

                      {/* eyes */}
                      <circle cx="24" cy="22" r="1.8" fill="#2a1710" />
                      <circle cx="24.5" cy="21.5" r="0.6" fill="#FFFFFF" />
                      <circle cx="31" cy="21" r="1.8" fill="#2a1710" />
                      <circle cx="31.5" cy="20.5" r="0.6" fill="#FFFFFF" />
                    </svg>

          {currentQuip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.75, y: 6 }}
              className={`absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/95 text-[#b2430f] text-[11px] font-bold shadow-lg border border-[#f6a83c] whitespace-nowrap backdrop-blur-xs flex items-center gap-1 ${
                direction === 'rtl' ? '-scale-x-100' : 'scale-x-100'
              }`}
            >
              <span>{currentQuip}</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
