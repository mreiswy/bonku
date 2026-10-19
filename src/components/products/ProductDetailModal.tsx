import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MessageCircle,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Package
} from 'lucide-react';
import type { Project } from '../../types/bonku';
import { ProductPreview } from './ProductPreview';
import { profileData } from '../../data/bonkuData';
import { stopLenisScroll, startLenisScroll } from '../../hooks/useLenisSmoothScroll';

interface ProductDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickOrder?: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onOpenQuickOrder
}) => {
  // suspend global lenis scroll while dialog is open without modifying body overflow
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      stopLenisScroll();
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      startLenisScroll();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      >
        {/* backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#2a1710]/50 backdrop-blur-sm"
        />

        {/* modal container */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-[#fffdf5] rounded-2xl sm:rounded-[32px] border-2 sm:border-4 border-[#2a1710] shadow-[6px_6px_0px_#2a1710] sm:shadow-[12px_12px_0px_#2a1710] p-4 sm:p-8 space-y-4 sm:space-y-6 z-10 my-4 sm:my-8 max-h-[92vh] overflow-y-auto"
        >
          {/* modal header and close button */}
          <div className="flex items-start justify-between gap-3 sm:gap-4 border-b-2 border-[#2a1710]/20 pb-3 sm:pb-4">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <span className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider text-[#2a1710] bg-[#fde047] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg border-2 border-[#2a1710]">
                                  {project.category === 'abon' ? 'ABON AYAM — PRODUK UTAMA' : 'ROTI ISI ABON — PRODUK SAMPINGAN'}
                                </span>
                                <span className="text-[10px] sm:text-xs font-mono font-bold text-[#475569]">
                                  // {project.role}
                                </span>
              </div>

              <h3 className="text-xl sm:text-3xl font-black text-[#2a1710] tracking-tight">
                {project.title}
              </h3>
              <p className="text-xs sm:text-sm font-mono font-bold text-[#b2430f] mt-0.5">
                {project.subtitle}
              </p>
            </div>

            <button
              type="button"
              autoFocus
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#fdf3e3] hover:bg-[#fee2e2] border-2 border-[#2a1710] text-[#2a1710] hover:text-[#dc2626] shadow-[2px_2px_0px_#2a1710] sm:shadow-[3px_3px_0px_#2a1710] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all cursor-pointer shrink-0"
              aria-label="Tutup detail produk"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* preview frame */}
          <ProductPreview
                      project={project}
                      className="aspect-[16/10] w-full max-h-[340px]"
                    />

          {/* performance metrics */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
            {project.metrics.map((m, idx) => {
              const bg = idx === 0 ? 'bg-[#fce7c8]' : idx === 1 ? 'bg-[#fef9c3]' : 'bg-[#dcfce7]';
              const labelColor = idx === 0 ? 'text-[#b2430f]' : idx === 1 ? 'text-[#854d0e]' : 'text-[#15803d]';

              return (
                <div
                  key={idx}
                  className={`p-2 sm:p-3.5 rounded-xl sm:rounded-2xl ${bg} border-2 border-[#2a1710] text-center shadow-[2px_2px_0px_#2a1710] sm:shadow-[3px_3px_0px_#2a1710] flex flex-col justify-center`}
                >
                  <div className={`text-[9px] sm:text-[10px] font-mono font-bold uppercase ${labelColor} leading-tight`}>
                    {m.label}
                  </div>
                  <div className="text-[11px] sm:text-base font-black text-[#2a1710] mt-0.5 leading-tight break-words">
                    {m.value}
                  </div>
                </div>
              );
            })}
          </div>

          {/* project mandate and overview */}
          <div className="space-y-2">
            <h4 className="text-[11px] sm:text-xs font-mono uppercase font-black text-[#2a1710] flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#b2430f]" />
                          <span>Deskripsi &amp; Asal Usul Produk</span>
                        </h4>
            <p className="text-xs sm:text-base text-[#334155] leading-relaxed bg-[#fdf3e3] p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-[#2a1710]/30 font-medium">
              {project.description}
            </p>
          </div>

          {/* architecture and technical execution */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase font-black text-[#2a1710] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#b2430f]" />
                            <span>Tentang Produk</span>
                          </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {project.architecture.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 p-3.5 rounded-xl bg-[#fdf3e3] border border-[#2a1710]/30 text-xs sm:text-sm text-[#2a1710] font-medium"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* storage & ordering notes */}
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-mono uppercase font-black text-[#854d0e] flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-[#ca8a04]" />
                          <span>Catatan Penyimpanan &amp; Pembelian</span>
                        </h4>
                        <div className="p-4 sm:p-5 rounded-2xl bg-[#fef9c3] border-2 border-[#2a1710]/30 text-xs sm:text-sm text-[#2a1710] leading-relaxed">
                          <p className="font-black text-[#854d0e] mb-1">Wajib dibaca sebelum pesan:</p>
                          <p className="text-[#334155] font-medium">{project.challenges}</p>
                        </div>
                      </div>

                      {/* variant and packaging */}
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-mono uppercase font-black text-[#2a1710]">
                          Varian, Isi Kemasan &amp; Komposisi
                        </h4>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-[#fdf3e3] text-[#2a1710] border border-[#2a1710]/50"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* dialog action buttons */}
          <div className="pt-6 border-t-2 border-[#2a1710]/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-3">
                        {/* web order button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (project) {
                              onClose();
                              onOpenQuickOrder?.(project.id);
                            }
                          }}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#b2430f] hover:bg-[#993608] text-white text-xs font-mono font-black border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>Pesan Langsung (Web)</span>
                        </button>

                        {/* whatsapp order button */}
                        {project.orderUrl && (
                          <a
                            href={project.orderUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4ade80] hover:bg-[#22c55e] text-[#2a1710] text-xs font-mono font-black border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Pesan via WhatsApp</span>
                          </a>
                        )}

                        {/* google form order button */}
                        {profileData.contact.orderFormUrl ? (
                          <a
                            href={profileData.contact.orderFormUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#fdf3e3] hover:bg-[#f8e7d2] text-[#2a1710] text-xs font-mono font-black border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all"
                          >
                            <ShoppingBag className="w-4 h-4 text-[#b2430f]" />
                            <span>Isi Form Pemesanan</span>
                          </a>
                        ) : (
                          <span
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#fdf3e3] text-[#334155] text-xs font-mono font-bold border-2 border-dashed border-[#94a3b8]"
                            title="Link Google Form pemesanan belum dipasang di src/data/bonkuData.ts"
                          >
                            <ShoppingBag className="w-4 h-4 text-[#94a3b8]" />
                            <span>Form Pemesanan (segera dibuka)</span>
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl bg-[#fffdf5] hover:bg-[#fdf3e3] text-[#2a1710] text-xs font-mono font-black border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-center"
                      >
                        Tutup
                      </button>
                    </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
