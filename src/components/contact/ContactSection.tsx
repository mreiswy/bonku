import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowUp,
  Heart,
  Lock,
} from "lucide-react";
import { profileData } from "../../data/bonkuData";
import { ContactSauceCanvas } from "./ContactSauceCanvas";


interface ContactSectionProps {
  onOpenAdmin?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenAdmin }) => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [submarineClicks, setSubmarineClicks] = useState<number>(0);
  const [showHeart, setShowHeart] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setCurrentTime(new Intl.DateTimeFormat("id-ID", options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmarineClick = () => {
    setSubmarineClicks((prev) => prev + 1);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1200);
  };


  return (
    <section
      id="contact"
      className="relative z-20 -mt-1 w-full bg-[#8a3410] select-none py-24 overflow-hidden text-[#2a1710]"
    >
      <ContactSauceCanvas />

      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        className="absolute top-12 sm:top-20 right-4 sm:right-24 z-30 cursor-pointer group scale-75 sm:scale-100 origin-top-right"
        onClick={handleSubmarineClick}
        title="Klik kapal selam!"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [-4, 4, -4],
          }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        >
          <motion.div
            animate={{
              rotateY: submarineClicks * 360,
              scale: showHeart ? 1.2 : 1,
            }}
            transition={{ duration: 0.7, type: "spring", stiffness: 200 }}
            className="relative"
          >
            <svg
              width="68"
              height="68"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-xl"
            >
              <path
                d="M26 12 L26 20 L32 20"
                stroke="#2a1710"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <ellipse
                cx="32"
                cy="34"
                rx="24"
                ry="14"
                fill="#fde047"
                stroke="#2a1710"
                strokeWidth="2.5"
              />
              <path
                d="M24 20 C24 17 38 17 38 20 L38 24 L24 24 Z"
                fill="#facc15"
                stroke="#2a1710"
                strokeWidth="2"
              />
              <circle
                cx="24"
                cy="34"
                r="4"
                fill="#f6a83c"
                stroke="#2a1710"
                strokeWidth="1.8"
              />
              <circle
                cx="34"
                cy="34"
                r="4"
                fill="#f6a83c"
                stroke="#2a1710"
                strokeWidth="1.8"
              />
              <circle
                cx="44"
                cy="34"
                r="4"
                fill="#f6a83c"
                stroke="#2a1710"
                strokeWidth="1.8"
              />
              <path
                d="M7 28 L11 34 L7 40"
                stroke="#2a1710"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            <AnimatePresence>
              {showHeart && (
                <motion.div
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                  animate={{ opacity: 1, y: -28, scale: 1.2 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-rose-400 pointer-events-none"
                >
                  <Heart className="w-5 h-5 fill-rose-400 stroke-rose-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        {/* footer dock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="p-4 sm:p-6 rounded-2xl sm:rounded-[28px] bg-[#fffdf5] border-2 sm:border-3 border-[#2a1710] shadow-[4px_4px_0px_#2a1710] sm:shadow-[6px_6px_0px_#2a1710] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[11px] sm:text-xs font-mono font-bold text-[#334155]"
        >
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-[#2a1710] text-center sm:text-left">
            <div className="flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f59e0b] shrink-0" />
              <span>
                &copy; {new Date().getFullYear()} {profileData.name}
              </span>
              <span className="hidden sm:inline text-[#475569]">•</span>
            </div>
            <span className="text-[10px] sm:text-xs text-[#475569] sm:text-[#2a1710] font-normal sm:font-bold">
              Abon Ayam Rumahan • UMKM Mahasiswa
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="px-3 py-1.5 rounded-xl bg-[#faeee0] hover:bg-[#fde047] text-[#2a1710] border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] transition-all cursor-pointer flex items-center justify-center gap-1.5 font-mono font-bold text-xs"
              title="Akses Dashboard Pengelola BonKu"
            >
              <Lock className="w-3.5 h-3.5 text-[#b2430f]" />
              <span>Area Admin</span>
            </button>
            <button
              type="button"
              onClick={scrollToTop}
              className="px-4 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-[#fdf3e3] hover:bg-[#fde047] text-[#2a1710] border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] transition-all cursor-pointer flex items-center justify-center gap-1.5 font-mono font-bold text-xs"
            >
              <span>Ke Atas</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
