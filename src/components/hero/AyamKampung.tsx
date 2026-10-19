import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useRafActivity } from '../../hooks/useRafActivity';

export interface AyamKampungHandle {
  triggerStun: (knockbackDirection: 'left' | 'right') => void;
  getAyamRect: () => DOMRect | null;
  isStunned: () => boolean;
}

const AYAM_DIALOGUES = [
  '*Gurih-gurih menggoda*',
  'Aku disuwir halus, dimasak sampai kering, jadi abon yang tahan lama!',
  'Bumbu rempahnya meresap sampai ke serat paling dalam, lho.',
  'Pouch-ku rapat food grade, jadi aku awet tanpa pengawet sintetis.',
  'Bawa aku ke kampus buat lauk nasi hangat, praktis banget!',
  'Roti isi abon juga pakai aku sebagai isiannya, enak buat sarapan!',
  'Satu pouch 100 gram, cukup buat dua sampai tiga kali makan.',
  'Dimasak higienis dengan peralatan bersih, aman dimakan tiap hari.',
  'Kering tapi tetap lembut, gurih tapi nggak bikin eneg!',
  'Aku sumber protein yang gampang, tinggal buka pouch dan santap!',
  'Aroma bumbuku wangi sampai bikin lapar sendiri ~'
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

export const AyamKampung = forwardRef<AyamKampungHandle>((_props, ref) => {
  const screenInitialWidth = typeof window !== 'undefined' ? window.innerWidth + 80 : 1500;
  const x = useMotionValue(screenInitialWidth);
  const [currentQuip, setCurrentQuip] = useState<string | null>(null);
  const [isStunned, setIsStunned] = useState<boolean>(false);
  const [knockbackDir, setKnockbackDir] = useState<number>(0);
  const ayamRef = useRef<HTMLDivElement | null>(null);
  const isStunnedRef = useRef<boolean>(false);
  const activeRef = useRafActivity(ayamRef);

  const deckRef = useRef<string[]>(createShuffledDeck(AYAM_DIALOGUES));
  const lastQuipRef = useRef<string>('');

  useImperativeHandle(ref, () => ({
    triggerStun: (knockbackDirection: 'left' | 'right') => {
      if (isStunnedRef.current) return;
      isStunnedRef.current = true;
      setIsStunned(true);
      setKnockbackDir(knockbackDirection === 'left' ? -25 : 25);
      setCurrentQuip('OUCH! *Dizzy pinch!* >_<');

      setTimeout(() => {
        setKnockbackDir(0);
      }, 900);

      setTimeout(() => {
        isStunnedRef.current = false;
        setIsStunned(false);
        setCurrentQuip(null);
      }, 2800);
    },
    getAyamRect: () => {
      return ayamRef.current ? ayamRef.current.getBoundingClientRect() : null;
    },
    isStunned: () => isStunnedRef.current
  }));

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const scuttleLoop = (currentTime: number) => {
      if (!activeRef.current) {
        lastTime = currentTime;
        animId = requestAnimationFrame(scuttleLoop);
        return;
      }
      const delta = Math.min(0.05, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      if (!isStunnedRef.current) {
        const currX = x.get();
        const ayamSpeed = 34;
        let nextX = currX - ayamSpeed * delta;
        const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1400;

        if (nextX < -120) {
          nextX = screenWidth + 120;
        }

        x.set(nextX);
      }

      animId = requestAnimationFrame(scuttleLoop);
    };

    animId = requestAnimationFrame(scuttleLoop);
    return () => cancelAnimationFrame(animId);
  }, [x, activeRef]);

  useEffect(() => {
    const quipInterval = setInterval(() => {
      if (ayamRef.current && !isStunnedRef.current) {
        const rect = ayamRef.current.getBoundingClientRect();
        if (rect.right > 100 && rect.left < window.innerWidth - 100) {
          if (deckRef.current.length === 0) {
            deckRef.current = createShuffledDeck(AYAM_DIALOGUES, lastQuipRef.current);
          }

          const nextQuip = deckRef.current.pop() || AYAM_DIALOGUES[0];
          lastQuipRef.current = nextQuip;
          setCurrentQuip(nextQuip);

          setTimeout(() => {
            if (!isStunnedRef.current) setCurrentQuip(null);
          }, 3000);
        }
      }
    }, 8800);

    return () => clearInterval(quipInterval);
  }, []);

  return (
    <motion.div
      ref={ayamRef}
      style={{
        x,
        position: 'absolute',
        pointerEvents: 'none'
      }}
      className="z-20 select-none bottom-28 sm:bottom-36 md:bottom-[185px] scale-[0.75] sm:scale-[0.85] md:scale-100 origin-bottom"
    >
      <motion.div
        animate={{
          x: knockbackDir,
          y: isStunned ? [0, -2, 0, 2, 0] : [0, -3, 0, -3, 0],
          rotate: isStunned ? [-6, 6, -6, 6, -6] : [-2, 2, -2, 2, -2]
        }}
        transition={{
          x: { duration: 0.8, ease: 'easeOut' },
          y: { repeat: Infinity, duration: isStunned ? 0.4 : 0.8, ease: 'easeInOut' },
          rotate: { repeat: Infinity, duration: isStunned ? 0.4 : 0.8, ease: 'easeInOut' }
        }}
        className="relative"
      >
        <div className="absolute -bottom-1 left-2 w-14 h-3 bg-[#ecd3b3]/90 rounded-full blur-[2px]" />

        {isStunned && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-16 h-8 pointer-events-none z-30">
            <motion.div
              animate={{
                x: [-16, 0, 16, 0, -16],
                y: [0, -5, 0, 5, 0],
                scale: [0.9, 1.15, 0.9, 0.75, 0.9],
                rotate: [0, 180, 360]
              }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              className="absolute text-sm select-none"
            >
              ⭐
            </motion.div>

            <motion.div
              animate={{
                x: [16, 0, -16, 0, 16],
                y: [0, 5, 0, -5, 0],
                scale: [0.9, 0.75, 0.9, 1.15, 0.9],
                rotate: [360, 180, 0]
              }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              className="absolute text-sm select-none"
            >
              ✨
            </motion.div>

            <motion.div
              animate={{
                x: [0, 14, 0, -14, 0],
                y: [-5, 0, 5, 0, -5],
                scale: [1.1, 0.8, 1.1, 0.8, 1.1],
                rotate: [0, 360]
              }}
              transition={{ repeat: Infinity, duration: 1.0, ease: 'linear' }}
              className="absolute text-xs select-none"
            >
              💫
            </motion.div>
          </div>
        )}

        <svg
                  width="62"
                  height="46"
                  viewBox="0 0 62 46"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-md"
                >
                  {/* lid */}
                  <rect x="10" y="2" width="42" height="7" rx="3.5" fill="#F6A83C" stroke="#B2430F" strokeWidth="2" />
                  <rect x="14" y="4" width="34" height="2.5" rx="1.25" fill="#FBC95C" />
                  {/* little handle */}
                  <path d="M31 2 C31 -3 38 -3 38 1" stroke="#B2430F" strokeWidth="2" strokeLinecap="round" fill="none" />

                  {/* jar body */}
                  <rect x="13" y="9" width="36" height="33" rx="7" fill="#FBE9D6" stroke="#B2430F" strokeWidth="2.2" />
                  <rect x="15.5" y="12" width="6" height="26" rx="3" fill="#FFFFFF" opacity="0.7" />

                  {/* abon shreds inside */}
                  <g stroke="#B2430F" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 37 C25 31 30 31 34 37" />
                    <path d="M25 38 C29 33 33 33 37 38" />
                    <path d="M19 40 C24 35 31 35 36 40" />
                    <path d="M27 41 C30 37 34 37 39 41" />
                  </g>
                  <circle cx="24" cy="35" r="1.6" fill="#E2571A" />
                  <circle cx="35" cy="34" r="1.4" fill="#F6A83C" />
                  <circle cx="30" cy="39" r="1.3" fill="#E2571A" />

                  {/* face on the jar */}
                  {isStunned ? (
                    <>
                      <circle cx="25" cy="10.5" r="3.2" fill="#FFFFFF" stroke="#B2430F" strokeWidth="1" />
                      <path d="M23.2 8.8 L26.8 12.2 M26.8 8.8 L23.2 12.2" stroke="#7C2D12" strokeWidth="1.6" strokeLinecap="round" />
                      <circle cx="37" cy="10.5" r="3.2" fill="#FFFFFF" stroke="#B2430F" strokeWidth="1" />
                      <path d="M35.2 8.8 L38.8 12.2 M38.8 8.8 L35.2 12.2" stroke="#7C2D12" strokeWidth="1.6" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      <circle cx="25" cy="10.5" r="3.2" fill="#FFFFFF" stroke="#B2430F" strokeWidth="1" />
                      <circle cx="25" cy="10.5" r="1.7" fill="#2a1710" />
                      <circle cx="25.6" cy="9.8" r="0.6" fill="#FFFFFF" />
                      <circle cx="37" cy="10.5" r="3.2" fill="#FFFFFF" stroke="#B2430F" strokeWidth="1" />
                      <circle cx="37" cy="10.5" r="1.7" fill="#2a1710" />
                      <circle cx="37.6" cy="9.8" r="0.6" fill="#FFFFFF" />
                    </>
                  )}
                </svg>

        {currentQuip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.75, y: 6 }}
            className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/95 text-[#c2410c] text-[11px] font-bold shadow-lg border border-[#f97316] whitespace-nowrap backdrop-blur-xs flex items-center gap-1"
          >
            <span>{currentQuip}</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
});

AyamKampung.displayName = 'AyamKampung';
