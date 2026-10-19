/* eslint-disable react-hooks/set-state-in-effect -- the pouch syncs its internal animation pose (grabbed/goyang/quip) to the collision/expression prop from the parent */
import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { useRafActivity } from '../../hooks/useRafActivity';

export type PouchExpression = 'normal' | 'lifted' | 'impact' | 'happy';

interface RetortPouchProps {
  expression?: PouchExpression;
  onPouchDrop: (clientX: number, clientY: number, velocity: number, pouchRect?: DOMRect) => void;
  onPouchSwim: (clientX: number, clientY: number) => void;
  onPouchSplash?: (clientX: number, clientY: number) => void;
  onPouchWaddle?: (pouchRect: DOMRect) => void;
}

const POUCH_DIALOGUES = [
  '♪ Aku kemasan retort pouch, rapat dan food grade ~',
  'Aku tahan suhu ruang tanpa perlu kulkas, lho!',
  'Abon di dalamku dimasak sampai kering, jadi awet berhari-hari.',
  'Aku bisa dibawa ke kampus, tinggal sobek dan santap!',
  'Satu pouch 100 gram, pas buat lauk dua sampai tiga kali makan.',
  'Aku bukan pengawet sintetis, keawetannya datang dari proses masak!',
  'Roti isi abon pakai abon isi diriku sebagai isian, enak banget!',
  'Aku dijaga higienis dari dapur sampai tanganmu ~',
  'Jangan lupa habiskan setelah pouch dibuka ya, biar tetap segar!',
  'Aku gurih, bergizi, dan praktis — trio lengkap untuk lauk mahasiswa.',
  'Pesan aku lewat WhatsApp, bisa COD area kampus!'
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

export const RetortPouch: React.FC<RetortPouchProps> = ({
  expression = 'normal',
  onPouchDrop,
  onPouchSwim,
  onPouchSplash,
  onPouchWaddle
}) => {
  const [isGrabbed, setIsGrabbed] = useState(false);
  const [isGoyang, setIsGoyang] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [currentQuip, setCurrentQuip] = useState<string | null>(null);

  const deckRef = useRef<string[]>(createShuffledDeck(POUCH_DIALOGUES));
  const lastQuipRef = useRef<string>('');

  const x = useMotionValue(-120);
  const y = useMotionValue(0);

  const pouchRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRafActivity(pouchRef);

  const MEJA_LINE_Y = 22;

  useEffect(() => {
    if (expression === 'impact') {
      setIsGrabbed(false);
      // goyang hanya kalau pouch jatuh di meja, bukan di saus
      if (y.get() > MEJA_LINE_Y + 12) {
        setIsGoyang(true);
      }
    }
  }, [expression, y]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 160);
    }, 4200);

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    if (isGrabbed || isGoyang) {
      setCurrentQuip(null);
      return;
    }

    const quipInterval = setInterval(() => {
      if (pouchRef.current) {
        const rect = pouchRef.current.getBoundingClientRect();
        if (rect.right > 90 && rect.left < window.innerWidth - 90) {
          if (deckRef.current.length === 0) {
            deckRef.current = createShuffledDeck(POUCH_DIALOGUES, lastQuipRef.current);
          }

          const nextQuip = deckRef.current.pop() || POUCH_DIALOGUES[0];
          lastQuipRef.current = nextQuip;
          setCurrentQuip(nextQuip);

          setTimeout(() => {
            setCurrentQuip(null);
          }, 3200);
        }
      }
    }, 7200);

    return () => clearInterval(quipInterval);
  }, [isGrabbed, isGoyang]);

  // swimming loop across the screen with collision check
  useEffect(() => {
    if (isGrabbed || isGoyang) return;

    let animId: number;
    let lastTime = performance.now();
    let lastCollisionCheck = 0;

    const swimLoop = (currentTime: number) => {
      if (!activeRef.current) {
        lastTime = currentTime;
        animId = requestAnimationFrame(swimLoop);
        return;
      }
      const delta = Math.min(0.05, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      const currX = x.get();
      const speed = 40;
      let nextX = currX + speed * delta;
      const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1400;

      if (nextX > screenWidth + 140) {
        nextX = -140;
      }

      x.set(nextX);

      // collision check (every 50ms)
      if (currentTime - lastCollisionCheck > 50 && pouchRef.current) {
        lastCollisionCheck = currentTime;
        const rect = pouchRef.current.getBoundingClientRect();
        if (rect.right > 0 && rect.left < window.innerWidth) {
          onPouchSwim(rect.left + rect.width / 2, rect.top + rect.height * 0.75);
        }
      }

      animId = requestAnimationFrame(swimLoop);
    };

    animId = requestAnimationFrame(swimLoop);
    return () => cancelAnimationFrame(animId);
  }, [isGrabbed, isGoyang, onPouchSwim, x, activeRef]);

  // moving upward back into shallow water
  useEffect(() => {
    if (!isGoyang || isGrabbed) return;

    let animId: number;
    let lastTime = performance.now();

    const waddleStep = (currentTime: number) => {
      const delta = Math.min(0.05, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      const currY = y.get();
      const waddleSpeed = 75;
      const nextY = currY - waddleSpeed * delta;

      if (pouchRef.current && onPouchWaddle) {
        onPouchWaddle(pouchRef.current.getBoundingClientRect());
      }

      if (nextY <= MEJA_LINE_Y) {
        y.set(0);
        setIsGoyang(false);
        if (pouchRef.current) {
          const rect = pouchRef.current.getBoundingClientRect();
          if (onPouchSplash) {
            onPouchSplash(rect.left + rect.width / 2, rect.top + rect.height * 0.75);
          }
        }
        return;
      }

      y.set(nextY);
      animId = requestAnimationFrame(waddleStep);
    };

    animId = requestAnimationFrame(waddleStep);
    return () => cancelAnimationFrame(animId);
  }, [isGoyang, isGrabbed, onPouchSplash, onPouchWaddle, y]);

  const handleDragStart = () => {
    setIsGrabbed(true);
    setIsGoyang(false);
    setCurrentQuip(null);
  };

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsGrabbed(false);
    const speed = Math.sqrt(info.velocity.x ** 2 + info.velocity.y ** 2);
    const intensity = Math.min(2.8, Math.max(1.0, speed / 200));

    const currentY = y.get();
    const currentX = x.get();

    const heroEl = pouchRef.current?.closest('section');
    const heroRect = heroEl ? heroEl.getBoundingClientRect() : null;
    const heroHeight = heroRect ? heroRect.height : (typeof window !== 'undefined' ? window.innerHeight : 800);
    const heroWidth = heroRect ? heroRect.width : (typeof window !== 'undefined' ? window.innerWidth : 1400);

    const topBaseline = heroHeight * (heroWidth < 640 ? 0.28 : 0.44);
    const minY = -topBaseline + 60;
    const maxY = heroHeight - topBaseline - 70;
    const minX = -40;
    const maxX = heroWidth - 60;

    const clampedX = Math.max(minX, Math.min(maxX, currentX));
    const clampedY = Math.max(minY, Math.min(maxY, currentY));

    x.set(clampedX);
    y.set(clampedY);

    const pouchRect = pouchRef.current ? pouchRef.current.getBoundingClientRect() : undefined;
    onPouchDrop(info.point.x, info.point.y, intensity, pouchRect);

    if (clampedY > MEJA_LINE_Y + 12) {
      setIsGoyang(true);
    }
  };

  const currentExpression: PouchExpression = isGrabbed
    ? 'lifted'
    : expression === 'impact'
      ? 'impact'
      : isGoyang
        ? 'happy'
        : 'normal';

  return (
    <motion.div
      ref={pouchRef}
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        x,
        y,
        touchAction: 'none'
      }}
      animate={{
        scale: isGrabbed ? 1.3 : 1,
        zIndex: isGrabbed ? 70 : 30
      }}
      transition={{
        scale: { duration: 0.12 }
      }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 1.35 }}
      className="absolute top-[28%] sm:top-[44%] left-0 cursor-grab active:cursor-grabbing select-none pointer-events-auto p-4 -m-4"
    >
      <motion.div
        animate={
          isGrabbed
            ? { rotate: 12, y: 0 }
            : isGoyang
              ? {
                rotate: [-7, 7, -7],
                y: [0, -4, 0]
              }
              : currentExpression === 'impact'
                ? { rotate: -10, y: -4 }
                : {
                  y: [0, -6, 0, 5, 0],
                  rotate: [0, -2, 0, 2, 0]
                }
        }
        transition={{
          repeat: isGrabbed || currentExpression === 'impact' ? 0 : Infinity,
          duration: isGoyang ? 0.42 : 3.2,
          ease: 'easeInOut'
        }}
        className="relative group scale-[0.62] sm:scale-100 origin-center"
      >
        <div className="absolute -bottom-2 left-2 right-2 h-3 bg-[#3a1508]/60 rounded-full blur-[2px]" />

        <svg
                  width="72"
                  height="72"
                  viewBox="0 0 68 74"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-2xl filter"
                >
                  {/* pouch body */}
                  <path
                    d="M11 16C11 11 15 8 21 8H47C53 8 57 11 57 16V66C57 70 53 72 47 72H21C15 72 11 70 11 66V16Z"
                    fill="#FBE9D6"
                    stroke="#B2430F"
                    strokeWidth="2.4"
                  />
                  {/* top seal */}
                  <path d="M11 16C11 11 15 8 21 8H47C53 8 57 11 57 16V21H11V16Z" fill="#F6A83C" />
                  <path d="M11 21H57" stroke="#B2430F" strokeWidth="1.8" />
                  <path d="M17 12H51" stroke="#FBC95C" strokeWidth="2.4" strokeLinecap="round" />
                  {/* tear notch */}
                  <path d="M40 25L46 19M46 25L40 19" stroke="#B2430F" strokeWidth="1.6" strokeLinecap="round" />

                  {/* abon shreds peeking at bottom */}
                                    <g stroke="#B2430F" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M20 64 C23 61 27 61 30 64" />
                    <path d="M30 65 C33 62 37 62 40 65" />
                    <path d="M38 64 C41 61 45 61 48 64" />
                  </g>

                  {currentExpression === 'lifted' ? (
                    <path
                      d="M57 20C63 18 67 22 66 27C65 31 60 33 57 31V20Z"
                      fill="#E2571A"
                      stroke="#8A3410"
                      strokeWidth="1.8"
                    />
                  ) : currentExpression === 'impact' ? (
                    <path
                      d="M57 22C62 21 66 23 66 26C66 28 62 29 57 28V22Z"
                      fill="#E2571A"
                      stroke="#8A3410"
                      strokeWidth="1.8"
                    />
                  ) : (
                    <path
                      d="M57 21C62 20 66 23 66 26C66 29 62 30 57 29V21Z"
                      fill="#E2571A"
                      stroke="#8A3410"
                      strokeWidth="1.6"
                    />
                  )}

                  {currentExpression === 'impact' ? (
                    <>
                      <path
                        d="M24 36L28 39L24 42"
                        stroke="#2a1710"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M32 36L28 39L32 42"
                        stroke="#2a1710"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  ) : currentExpression === 'happy' ? (
                    <>
                      <path
                        d="M23 40Q26 35 29 40"
                        stroke="#2a1710"
                        strokeWidth="2.4"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d="M31 40Q34 35 37 40"
                        stroke="#2a1710"
                        strokeWidth="2.4"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </>
                  ) : isBlinking ? (
                    <path
                      d="M24 40Q27 43 30 40"
                      stroke="#2a1710"
                      strokeWidth="2.2"
                      fill="none"
                      strokeLinecap="round"
                    />
                  ) : (
                    <>
                      <circle cx="27" cy="39" r="3.2" fill="#2a1710" />
                      <circle cx="28.2" cy="37.9" r="1.1" fill="#FFFFFF" />
                      <circle cx="41" cy="39" r="3.2" fill="#2a1710" />
                      <circle cx="42.2" cy="37.9" r="1.1" fill="#FFFFFF" />
                    </>
                  )}

                  <path
                    d={
                      currentExpression === 'lifted'
                        ? 'M32 46C35 43 41 43 43 46C45 49 38 51 34 50C31 49.5 30 47.5 32 46Z'
                        : 'M32 47C35 44 41 44 43 47C45 50 38 52 34 51C31 50.5 30 48.5 32 47Z'
                    }
                    fill="#E2571A"
                    stroke="#8A3410"
                    strokeWidth="1.6"
                  />
        </svg>

        {currentExpression === 'lifted' && (
          <motion.div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#f6a83c] text-[#2a1710] text-[10px] font-extrabold shadow-lg border border-[#b2430f] whitespace-nowrap animate-bounce">
            SEGAR!
          </motion.div>
        )}

        {currentExpression === 'impact' && (
          <motion.div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#b2430f] text-white text-[10px] font-extrabold shadow-lg border border-[#8a3410] whitespace-nowrap animate-pulse">
            &gt;_&lt; ADUH!
          </motion.div>
        )}

        {isGoyang && currentExpression !== 'impact' && (
          <motion.div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#f6a83c] text-white text-[10px] font-extrabold shadow-lg border border-[#e2571a] whitespace-nowrap">
            KEMBALI KE MEJA!
          </motion.div>
        )}

        {!isGrabbed && !isGoyang && currentExpression !== 'impact' && currentQuip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.75, y: 6 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-2xl bg-white/95 text-[#8a3410] text-xs font-bold shadow-xl border border-[#f6a83c] whitespace-nowrap flex items-center gap-1.5 backdrop-blur-md"
          >
            <span className="drop-shadow-xs">{currentQuip}</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
