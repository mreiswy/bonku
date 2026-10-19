import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Code2 } from 'lucide-react';

interface ProductHighlightsProps {
  isFlooded: boolean;
}

export const ProductHighlights: React.FC<ProductHighlightsProps> = ({ isFlooded }) => {
  const [activePillar, setActivePillar] = useState<number>(0);

  const pillars = [
      {
        id: 'produk',
        icon: <Code2 className="w-5 h-5 text-[#e2571a]" />,
        title: 'Abon Ayam Pouch 100g',
        subtitle: 'Produk Utama & Andalan',
        desc: 'Abon ayam rumahan yang dimasak hingga kering dengan bumbu rempah alami, lalu dikemas dalam retort pouch food grade 100 gram. Hasilnya gurih, bergizi, awet disimpan di suhu ruang, dan siap disantap langsung bersama nasi hangat.',
        tags: ['100 gram', 'Ayam Pilihan', 'Bumbu Rempah Alami', 'Retort Pouch', 'Tanpa Pengawet', 'Siap Santap']
      },
      {
        id: 'mutu',
        icon: <Cpu className="w-5 h-5 text-[#e2571a]" />,
        title: 'Higienis, Bergizi, Awet',
        subtitle: 'Standar Mutu Produk',
        desc: 'Seluruh proses mulai dari pemilihan ayam, pengeringan, sampai pengemasan dikerjakan dengan peralatan bersih dan kemasan food grade. Tanpa pengawet sintetis berbahaya, sehingga aman dikonsumsi rutin untuk lauk sehari-hari.',
        tags: ['Food Grade', 'Tanpa Pengawet', 'Padat Gizi', 'Aman Dikonsumsi', 'Kualitas Rumahan']
      },
      {
        id: 'order',
        icon: <Terminal className="w-5 h-5 text-[#7a4a1d]" />,
        title: 'Pemesanan Mudah',
        subtitle: 'Formulir Online & COD Kampus',
        desc: 'Pesan lewat Google Form agar mudah direkap, lalu konfirmasi melalui WhatsApp. Penyerahan bisa COD tangan ke tangan di area kampus tanpa biaya kirim, atau transfer untuk pengiriman ke luar kota.',
        tags: ['Google Form', 'Konfirmasi WhatsApp', 'COD Kampus', 'Transfer', 'Promo Multi-Beli', 'Roti Isi Abon']
      }
    ];

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;

  return (
    <motion.div
      animate={
        isFlooded
          ? {
            rotate: isMobile ? 3 : 15,
            x: isMobile ? 0 : 28,
            y: isMobile ? 16 : 50,
            scale: 0.98,
            transition: { type: 'spring', stiffness: 150, damping: 16 }
          }
          : {
            rotate: 0,
            x: 0,
            y: 0,
            scale: 1,
            transition: { type: 'spring', stiffness: 260, damping: 18 }
          }
      }
      className="w-full flex flex-col gap-6"
    >
      {/* Selector Tabs */}
      <div className="grid grid-cols-3 gap-2.5 p-1.5 rounded-2xl bg-[#fffdf5] border border-[#e8d3bd] shadow-sm">
        {pillars.map((pillar, idx) => (
          <motion.button
            key={pillar.id}
            type="button"
            onClick={() => setActivePillar(idx)}
            animate={
              isFlooded
                ? {
                  rotate: idx === 0 ? -18 : idx === 1 ? 20 : -22,
                  y: idx === 0 ? 14 : idx === 1 ? -16 : 20,
                  x: idx === 0 ? -8 : idx === 1 ? 8 : 12
                }
                : { rotate: 0, y: 0, x: 0 }
            }
            className={`flex flex-col items-center justify-center p-3 rounded-xl text-center transition-all cursor-pointer ${activePillar === idx
              ? 'bg-[#e2571a] text-white shadow-md'
              : 'hover:bg-[#fdf3e3] text-[#334155] hover:text-[#2a1710]'
              }`}
          >
            <span
              className={`text-xs font-mono font-bold block ${activePillar === idx ? 'text-white' : 'text-[#7a4a1d]'
                }`}
            >
              0{idx + 1}
            </span>
            <span className="text-xs font-bold leading-tight mt-0.5">
              {pillar.id.toUpperCase()}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Active Pillar */}
      <div className="relative min-h-[305px] sm:min-h-[315px] rounded-[32px] bg-[#fffdf5] border border-[#e8d3bd] shadow-xl shadow-[#7a4a1d]/6 overflow-hidden">
        <motion.div
          key={activePillar}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="p-7 sm:p-9 h-full flex flex-col justify-between space-y-5"
        >
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-[#fdf3e3] border border-[#e3cfae] shadow-sm shrink-0">
                  {pillars[activePillar].icon}
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-[#7a4a1d]">
                    0{activePillar + 1} // {pillars[activePillar].subtitle}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#2a1710] mt-0.5">
                    {pillars[activePillar].title}
                  </h3>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm sm:text-base text-[#334155] leading-relaxed">
              {pillars[activePillar].desc}
            </p>
          </div>

          <div className="pt-4 border-t border-[#e8d3bd]">
            <span className="text-xs font-mono font-bold text-[#7a4a1d] block mb-2.5">
              KEUNGGULAN:
            </span>
            <div className="flex flex-wrap gap-2">
              {pillars[activePillar].tags.map((t) => (
                <span
                  key={t}
                  className="px-3.5 py-1.5 rounded-xl bg-[#fdf3e3] text-xs font-mono font-semibold text-[#2a1710] border border-[#e3cfae] shadow-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <motion.div
          animate={
            isFlooded
              ? { rotate: -24, x: -38, y: 70, scale: 0.94 }
              : { rotate: 0, x: 0, y: 0, scale: 1 }
          }
          transition={{ type: 'spring', stiffness: 160, damping: 15 }}
          className="p-4 rounded-2xl bg-[#fffdf5] border border-[#e8d3bd] shadow-sm"
        >
          <span className="text-xs font-bold text-[#2a1710] block">
                      Kemasan Food Grade
                    </span>
                    <p className="text-[11px] text-[#475569] mt-1 leading-relaxed">
                      Retort pouch rapat dan higienis, abon tetap aman serta praktis dibawa ke kampus.
                    </p>
                  </motion.div>

                  <motion.div
                    animate={
                      isFlooded
                        ? { rotate: 32, x: 18, y: 80, scale: 0.93 }
                        : { rotate: 0, x: 0, y: 0, scale: 1 }
                    }
                    transition={{ type: 'spring', stiffness: 160, damping: 15 }}
                    className="p-4 rounded-2xl bg-[#fffdf5] border border-[#e8d3bd] shadow-sm"
                  >
                    <span className="text-xs font-bold text-[#2a1710] block">
                      Tanpa Pengawet Sintetis
                    </span>
                    <p className="text-[11px] text-[#475569] mt-1 leading-relaxed">
                      Awet karena dimasak hingga kering, bukan karena bahan pengawet berbahaya.
                    </p>
                  </motion.div>

                  <motion.div
                    animate={
                      isFlooded
                        ? { rotate: -18, x: 48, y: -20, scale: 0.95 }
                        : { rotate: 0, x: 0, y: 0, scale: 1 }
                    }
                    transition={{ type: 'spring', stiffness: 160, damping: 15 }}
                    className="p-4 rounded-2xl bg-[#fffdf5] border border-[#e8d3bd] shadow-sm"
                  >
                    <span className="text-xs font-bold text-[#2a1710] block">
                      Promo Multi-Beli
                    </span>
                    <p className="text-[11px] text-[#475569] mt-1 leading-relaxed">
                      Beli lebih banyak, potongan harga lebih besar. Ada juga paket bundling.
                    </p>
                  </motion.div>
      </div>
    </motion.div>
  );
};
