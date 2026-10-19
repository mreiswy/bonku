import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  ShoppingBag,
  ClipboardList,
  MessageCircle,
  CreditCard,
  Calendar,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { experienceData } from '../../data/bonkuData';
import type { ExperienceItem } from '../../types/bonku';
import { OrderSauceCanvas } from './OrderSauceCanvas';

const categoryConfig: Record<
  string,
  {
    icon: React.FC<{ className?: string }>;
    nodeBg: string;
    nodeText: string;
    tagBg: string;
    tagText: string;
    tagBorder: string;
  }
> = {
  'Pilih Produk': {
      icon: ShoppingBag,
      nodeBg: 'bg-[#ef4444]',
      nodeText: 'text-white',
      tagBg: 'bg-[#fee2e2]',
      tagText: 'text-[#dc2626]',
      tagBorder: 'border-[#2a1710]'
    },
    'Formulir': {
      icon: ClipboardList,
      nodeBg: 'bg-[#f6a83c]',
      nodeText: 'text-[#2a1710]',
      tagBg: 'bg-[#fce7c8]',
      tagText: 'text-[#e2571a]',
      tagBorder: 'border-[#2a1710]'
    },
    'Konfirmasi': {
      icon: MessageCircle,
      nodeBg: 'bg-[#a3e635]',
      nodeText: 'text-[#2a1710]',
      tagBg: 'bg-[#ecfccb]',
      tagText: 'text-[#4d7c0f]',
      tagBorder: 'border-[#2a1710]'
    },
    'Bayar': {
      icon: CreditCard,
      nodeBg: 'bg-[#22c55e]',
      nodeText: 'text-white',
      tagBg: 'bg-[#dcfce7]',
      tagText: 'text-[#15803d]',
      tagBorder: 'border-[#2a1710]'
    }
};

export const OrderTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // scroll progress tracker
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 80%']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001
  });

  return (
    <section id="journey" ref={containerRef} className="relative z-20 -mt-1 w-full select-none py-28 overflow-hidden text-[#2a1710]">
      {/* saus bumbu, uap, dan butiran rempah */}
      <OrderSauceCanvas />

      {/* sendok kayu & butiran bumbu */}
            <motion.div
              animate={{ rotate: [-8, 8, -8], y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="absolute top-24 right-8 sm:right-24 z-10 pointer-events-none opacity-95"
            >
              <svg width="56" height="56" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
                <circle cx="27" cy="30" r="20" fill="#FBE9D6" stroke="#2a1710" strokeWidth="2.5" />
                <circle cx="27" cy="30" r="13" fill="#E2571A" />
                <circle cx="23" cy="26" r="2.5" fill="#F6A83C" />
                <circle cx="32" cy="28" r="2" fill="#C9A227" />
                <circle cx="28" cy="35" r="2.2" fill="#8A3410" />
                <path d="M27 10 L27 2" stroke="#A07449" strokeWidth="6" strokeLinecap="round" />
                <ellipse cx="27" cy="8" rx="9" ry="5" fill="#B9975F" stroke="#7A4A1D" strokeWidth="1.8" />
              </svg>
            </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-12 space-y-8 sm:space-y-12">
        {/* header dock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="p-4 sm:p-8 rounded-2xl sm:rounded-[32px] bg-[#fffdf5] border-2 sm:border-3 border-[#2a1710] shadow-[4px_4px_0px_#2a1710] sm:shadow-[6px_6px_0px_#2a1710] space-y-2.5 sm:space-y-3"
        >
          <div className="flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-[#fde047] text-[#2a1710] text-xs font-mono font-black border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] sm:shadow-[3px_3px_0px_#2a1710] w-fit">
            <Compass className="w-3.5 h-3.5" />
            <span>ALUR PEMESANAN</span>
          </div>

          <div className="space-y-1 sm:space-y-1.5">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#2a1710] tracking-tight leading-[1.08]">
                          Cara Pesan BonKu
                        </h2>
                        <p className="text-xs sm:text-base font-medium text-[#334155] max-w-2xl leading-relaxed">
                          Empat langkah sederhana dari pilih produk sampai abon siap disantap. Semuanya bisa diselesaikan lewat WhatsApp dan COD area kampus.
                        </p>
          </div>
        </motion.div>

        {/* timeline track */}
        <div className="relative pl-11 sm:pl-20 space-y-7 sm:space-y-12">
          {/* background track */}
          <div className="absolute top-5 sm:top-6 bottom-5 sm:bottom-6 left-4 sm:left-7 -translate-x-1/2 w-2.5 sm:w-3.5 bg-black/30 rounded-full overflow-hidden border-2 border-white/50 shadow-inner z-0">
            {/* vertical progress */}
            <motion.div
              style={{ scaleY: smoothProgress, transformOrigin: 'top' }}
              className="w-full h-full bg-gradient-to-b from-[#ef4444] via-[#f6a83c] via-[#a3e635] to-[#22c55e] rounded-full shadow-[0_0_16px_rgba(34,197,94,0.9)]"
            />
          </div>

          {experienceData.map((item: ExperienceItem, idx: number) => {
            const config = categoryConfig[item.category || 'Pilih Produk'] || categoryConfig['Pilih Produk'];
            const Icon = config.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -25, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.12,
                  type: 'spring',
                  stiffness: 240,
                  damping: 22
                }}
                className="relative group"
              >
                {/* timeline node icon — ganti gambar per tahap lewat item.iconUrl */}
                                <div
                                  className={`absolute left-[-28px] sm:left-[-52px] -translate-x-1/2 top-4 sm:top-6 w-9 h-9 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl border-2 border-[#2a1710] ${config.nodeBg} ${config.nodeText} flex items-center justify-center shadow-[2px_2px_0px_#2a1710] sm:shadow-[3px_3px_0px_#2a1710] group-hover:scale-110 transition-transform z-10 overflow-hidden`}
                                                                  >
                                                                    {item.iconUrl ? (
                                                                      <img
                                                                        src={item.iconUrl}
                                                                        alt={item.role}
                                                                        className="w-4 h-4 sm:w-6 sm:h-6 object-contain"
                                                                      />
                                                                    ) : (
                                                                      <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                                                                    )}
                                                                  </div>

                {/* milestone card */}
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  className="p-4 sm:p-8 rounded-2xl sm:rounded-[32px] bg-[#fffdf5] border-2 sm:border-3 border-[#2a1710] shadow-[4px_4px_0px_#2a1710] sm:shadow-[6px_6px_0px_#2a1710] hover:shadow-[3px_3px_0px_#2a1710] hover:translate-x-1 hover:translate-y-1 transition-all duration-300 space-y-3 sm:space-y-4 cursor-default"
                >
                  {/* card top badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pb-3 sm:pb-4 border-b-2 border-[#2a1710]/10">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] sm:text-xs font-mono font-black uppercase px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl border-2 ${config.tagBg} ${config.tagBorder} ${config.tagText} shadow-[1.5px_1.5px_0px_#2a1710] sm:shadow-[2px_2px_0px_#2a1710]`}
                      >
                        {item.badge || item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl bg-[#fdf3e3] border-2 border-[#2a1710] text-[10px] sm:text-xs font-mono font-black text-[#2a1710] shadow-[1.5px_1.5px_0px_#2a1710] sm:shadow-[2px_2px_0px_#2a1710]">
                      <Calendar className="w-3.5 h-3.5 text-[#e2571a]" />
                      <span>{item.period}</span>
                    </div>
                  </div>

                  {/* role and organization */}
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-[#2a1710] tracking-tight group-hover:text-[#e2571a] transition-colors">
                      {item.role}
                    </h3>
                    <div className="text-xs sm:text-sm font-mono font-bold text-[#e2571a] mt-0.5 sm:mt-1">
                      {item.organization}
                    </div>
                  </div>

                  {/* narrative description */}
                  <p className="text-xs sm:text-base font-medium text-[#334155] leading-relaxed">
                    {item.description}
                  </p>

                  {/* key highlights */}
                  {item.highlights && item.highlights.length > 0 && (
                    <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#fdf3e3]/80 border border-[#2a1710]/20 sm:border-2 sm:border-[#2a1710]/15 space-y-1.5 sm:space-y-2">
                      <div className="text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-wider text-[#334155]">
                        Poin Kunci &amp; Catatan
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                        {item.highlights.map((hl, hIdx) => (
                          <div
                            key={hIdx}
                            className="flex items-start gap-1.5 sm:gap-2 text-xs font-bold text-[#1e293b] leading-tight"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16a34a] shrink-0 mt-0.5" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* skills and tech tags */}
                  <div className="pt-1 sm:pt-2 flex flex-wrap gap-1.5 sm:gap-2">
                    {item.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-[#fdf3e3] hover:bg-[#fde047] text-[#2a1710] border border-[#2a1710] transition-colors"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
