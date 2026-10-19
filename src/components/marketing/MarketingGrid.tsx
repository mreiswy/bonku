import React from 'react';
import type { TechLayer } from '../../types/bonku';
import { techStackData } from '../../data/bonkuData';
import { SpiceDecorations } from './SpiceDecorations';

/** 4 kartu ringkas — satu kartu per aspek pemasaran (product/price/place/promotion). */
const aspects: {
  layer: TechLayer;
  step: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
}[] = [
  {
    layer: 'product',
    step: '01',
    title: 'Product',
    subtitle: 'Produk',
    description:
      'Abon ayam kemasan retort pouch dan roti isi abon sebagai produk turunannya — higienis, bergizi, awet di suhu ruang.',
    accent: '#e2571a'
  },
  {
    layer: 'price',
    step: '02',
    title: 'Price',
    subtitle: 'Harga',
    description:
      'Harga tetap ramah kantong mahasiswa, dengan promo multi-beli dan bundling untuk pembelian banyak.',
    accent: '#16a34a'
  },
  {
    layer: 'place',
    step: '03',
    title: 'Place',
    subtitle: 'Tempat',
    description:
      'Pre-order online, COD area kampus, sampai titip jual di kantin dan lewat kawan satu kelas.',
    accent: '#0284c7'
  },
  {
    layer: 'promotion',
    step: '04',
    title: 'Promotion',
    subtitle: 'Promosi',
    description:
      'Instagram, story WhatsApp, mulut ke mulut kampus, dan sampel gratis untuk uji rasa.',
    accent: '#db2777'
  }
];

export const MarketingGrid: React.FC = () => {
  return (
    <section id="stack" className="relative z-20 -mt-1 w-full bg-[#fdf3e3] select-none">
      <SpiceDecorations />

      <div className="relative z-10 pt-24 pb-20 max-w-7xl mx-auto px-6 sm:px-12">
        {/* header */}
        <div className="space-y-4 pb-8 border-b-2 border-[#2a1710]/15">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#fde047] text-[#2a1710] text-xs font-mono font-black border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] w-fit">
            <span>02 // KEUNGGULAN</span>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2a1710] tracking-tight leading-[1.08]">
              Kenapa Pilih BonKu
            </h2>
            <p className="text-sm sm:text-base font-medium text-[#334155] mt-2 max-w-2xl leading-relaxed">
              Empat alasan utama produk BonKu layak masuk keranjang kamu.
            </p>
          </div>
        </div>

        {/* 4 aspek */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {aspects.map((aspect) => {
            const items = techStackData.filter((t) => t.layer === aspect.layer);

            return (
              <div
                key={aspect.layer}
                className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#fffdf5] border-2 border-[#2a1710] shadow-[4px_4px_0px_#2a1710] space-y-3 flex flex-col"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-mono font-black text-white px-2.5 py-1 rounded-lg border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710]"
                    style={{ backgroundColor: aspect.accent }}
                  >
                    {aspect.step}
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-[#2a1710] leading-tight">
                      {aspect.title}
                    </h3>
                    <span className="text-[11px] font-mono font-bold text-[#7a4a1d]">
                      {aspect.subtitle}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] sm:text-sm text-[#334155] font-medium leading-relaxed">
                  {aspect.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1 mt-auto">
                  {items.map((item) => (
                    <span
                      key={item.name}
                      className="px-2.5 py-1 rounded-lg bg-[#fdf3e3] text-[10px] sm:text-[11px] font-mono font-bold text-[#2a1710] border border-[#2a1710]/40"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};