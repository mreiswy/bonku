import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Sparkles,
  User,
  Plus,
  Minus,
} from 'lucide-react';
import { fetchActiveBatch, createOrder } from '../../services/apiService';
import type { ActiveBatch, Order, OrderItem } from '../../types/bonku';
import { profileData } from '../../data/bonkuData';

interface QuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductId?: string;
}

const PRODUCTS = [
  {
    id: 'abon-ayam-pouch',
    title: 'Abon Ayam Pouch 100g',
    price: 18000,
    unit: 'pouch',
    badge: 'Best Seller',
    image: '/produk/abon-ayam.svg',
  },
  {
    id: 'roti-isi-abon',
    title: 'Roti Isi Abon',
    price: 6000,
    unit: 'pcs',
    badge: 'Fresh Bake',
    image: '/produk/roti-abon.svg',
  },
];

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  isOpen,
  onClose,
  initialProductId,
}) => {
  const [batch, setBatch] = useState<ActiveBatch | null>(null);
  const [loadingBatch, setLoadingBatch] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  // Form states
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>({
    'abon-ayam-pouch': initialProductId === 'abon-ayam-pouch' ? 1 : 0,
    'roti-isi-abon': initialProductId === 'roti-isi-abon' ? 1 : 0,
  });
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [locationNote, setLocationNote] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Status expired diturunkan dari response batch API
  const isExpired = batch ? (!batch.is_active || batch.is_expired) : false;

  // Load batch data saat modal dibuka
  useEffect(() => {
    if (!isOpen) return;
    let isSubscribed = true;

    fetchActiveBatch().then((data) => {
      if (isSubscribed) {
        setBatch(data);
        setLoadingBatch(false);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [isOpen]);

  // Hitung countdown waktu habis
  useEffect(() => {
    if (!batch || !batch.end_date || !batch.is_active) {
      return;
    }

    const calculateTime = () => {
      const target = new Date(batch.end_date).getTime();
      const diff = target - Date.now();

      if (diff <= 0) {
        setTimeLeft(null);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [batch]);

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const selectedItems: OrderItem[] = useMemo(() => {
    return PRODUCTS.filter((p) => (quantities[p.id] || 0) > 0).map((p) => ({
      productId: p.id,
      title: p.title,
      price: p.price,
      quantity: quantities[p.id],
      subtotal: p.price * quantities[p.id],
    }));
  }, [quantities]);

  const totalPrice = useMemo(() => {
    return selectedItems.reduce((acc, curr) => acc + curr.subtotal, 0);
  }, [selectedItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (selectedItems.length === 0) {
      setErrorMessage('Pilih minimal 1 porsi produk untuk memesan.');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage('Nama pemesan harus diisi.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      setErrorMessage('Nomor WhatsApp tidak valid (minimal 8 angka).');
      return;
    }

    setSubmitting(true);
    const res = await createOrder({
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      location_note: locationNote.trim(),
      items: selectedItems,
      notes: notes.trim(),
      source: 'web',
    });
    setSubmitting(false);

    if (res.success && res.order) {
      setCreatedOrder(res.order);
    } else {
      setErrorMessage(res.error || 'Terjadi kesalahan saat menyimpan pesanan.');
    }
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const generateWaConfirmationLink = (order: Order) => {
    let phone = profileData.contact.whatsapp.replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '62' + phone.slice(1);

    const itemsSummary = selectedItems.map((i) => `• ${i.title} (${i.quantity}x) = ${formatRupiah(i.subtotal)}`).join('\n');

    const msg = `Halo BonKu! Saya telah membuat pesanan di web:
*ID Pesanan:* ${order.id}
*Nama:* ${order.customer_name}
*No. WA:* ${order.customer_phone}
*Titik COD / Alamat:* ${order.location_note || '-'}
*Rincian:*
${itemsSummary}
*Total:* ${formatRupiah(order.total_price)}
${order.notes ? `*Catatan:* ${order.notes}\n` : ''}
Mohon konfirmasi dan info pembayaran/serah terima COD ya. Terima kasih!`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#2a1710]/70 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-[#fffdf5] border-3 border-[#2a1710] rounded-3xl shadow-[6px_6px_0px_#2a1710] overflow-hidden my-auto max-h-[92vh] flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-[#fdf3e3] border-b-2 border-[#2a1710] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#b2430f] border-2 border-[#2a1710] flex items-center justify-center text-white shadow-[2px_2px_0px_#2a1710]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#2a1710] font-mono leading-tight">
                    Pesan BonKu Sekarang
                  </h3>
                  <p className="text-xs text-[#5c3e32] font-medium">
                    {batch?.batch_name || 'Pre-Order BonKu'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white hover:bg-[#faeee0] text-[#2a1710] border-2 border-[#2a1710] flex items-center justify-center shadow-[2px_2px_0px_#2a1710] transition-all cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {loadingBatch ? (
                <div className="py-12 text-center text-sm font-mono text-[#5c3e32]">
                  Memeriksa status batch pre-order...
                </div>
              ) : isExpired ? (
                /* TAMPILAN JIKA WAKTU HABIS / PO DITUTUP */
                <div className="py-6 px-4 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-[#fde047] border-3 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] flex items-center justify-center">
                    <Clock className="w-8 h-8 text-[#b2430f]" />
                  </div>
                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-black bg-[#fee2e2] text-[#dc2626] border border-[#dc2626]">
                      PO DITUTUP SEMENTARA
                    </span>
                    <h4 className="text-lg font-black text-[#2a1710]">
                      Pre-Order Batch Ini Telah Ditutup
                    </h4>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed max-w-sm mx-auto">
                      {batch?.closed_message ||
                        'Batas waktu pemesanan untuk batch saat ini telah berakhir. Hubungi kami via WhatsApp untuk menanyakan ketersediaan sisa stok atau info batch selanjutnya.'}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                    <a
                      href={profileData.contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-[#2a1710] border-2 border-[#2a1710] font-mono font-bold text-xs shadow-[3px_3px_0px_#2a1710] flex items-center justify-center gap-2 cursor-pointer transition-transform active:translate-y-0.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Tanya Stok via WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-2xl bg-white hover:bg-[#faeee0] text-[#2a1710] border-2 border-[#2a1710] font-mono font-bold text-xs shadow-[3px_3px_0px_#2a1710] cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              ) : createdOrder ? (
                /* TAMPILAN JIKA PESANAN BERHASIL */
                <div className="py-4 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-[#dcfce7] border-3 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] flex items-center justify-center text-[#16a34a]">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-mono font-black bg-[#dcfce7] text-[#16a34a] border border-[#16a34a]">
                      PESANAN TERCATAT
                    </span>
                    <h4 className="text-lg font-black text-[#2a1710]">
                      Terima Kasih, {createdOrder.customer_name}!
                    </h4>
                    <p className="text-xs text-[#5c3e32]">
                      Pesanan Anda telah aman tersimpan di sistem lokal BonKu.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#fdf3e3] border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] text-left text-xs space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-[#eadac4]">
                      <span className="font-mono text-[#5c3e32]">ID Pesanan:</span>
                      <span className="font-mono font-black text-[#b2430f] bg-white px-2 py-0.5 rounded-md border border-[#2a1710]">
                        {createdOrder.id}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#5c3e32]">Total Tagihan:</span>
                      <span className="font-black text-sm text-[#2a1710]">
                        {formatRupiah(createdOrder.total_price)}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#64748b]">
                      Titik COD: {createdOrder.location_note || 'Area Kampus (Disepakati di WA)'}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <a
                      href={generateWaConfirmationLink(createdOrder)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-[#2a1710] border-2 border-[#2a1710] font-mono font-black text-xs shadow-[3px_3px_0px_#2a1710] flex items-center justify-center gap-2 cursor-pointer transition-transform active:translate-y-0.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Konfirmasi Pesanan ke WhatsApp BonKu</span>
                    </a>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#faeee0] text-[#2a1710] border-2 border-[#2a1710] font-mono font-bold text-xs shadow-[2px_2px_0px_#2a1710] cursor-pointer"
                    >
                      Tutup Modal
                    </button>
                  </div>
                </div>
              ) : (
                /* FORM PEMESANAN AKTIF */
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Countdown Timer Banner */}
                  {timeLeft && (
                    <div className="p-3 rounded-2xl bg-[#fef3c7] border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] flex items-center justify-between text-xs font-mono font-bold text-[#92400e]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#b2430f] animate-pulse" />
                        <span>Sisa Waktu PO:</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#2a1710]">
                        <span className="bg-white px-1.5 py-0.5 rounded border border-[#2a1710]">{timeLeft.days}h</span>:
                        <span className="bg-white px-1.5 py-0.5 rounded border border-[#2a1710]">{timeLeft.hours}j</span>:
                        <span className="bg-white px-1.5 py-0.5 rounded border border-[#2a1710]">{timeLeft.minutes}m</span>:
                        <span className="bg-white px-1.5 py-0.5 rounded border border-[#2a1710]">{timeLeft.seconds}d</span>
                      </div>
                    </div>
                  )}

                  {/* Produk Selector */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-mono font-black text-[#2a1710] uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#b2430f]" />
                      <span>1. Pilih Produk &amp; Jumlah</span>
                    </label>

                    <div className="grid gap-2">
                      {PRODUCTS.map((prod) => {
                        const qty = quantities[prod.id] || 0;
                        return (
                          <div
                            key={prod.id}
                            className={`p-3 rounded-2xl border-2 border-[#2a1710] transition-colors flex items-center justify-between ${
                              qty > 0 ? 'bg-[#fdf3e3] shadow-[2px_2px_0px_#2a1710]' : 'bg-white'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-[#2a1710]">{prod.title}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#fde047] text-[#2a1710] border border-[#2a1710]">
                                  {prod.badge}
                                </span>
                              </div>
                              <p className="text-xs font-mono font-bold text-[#b2430f]">
                                {formatRupiah(prod.price)} <span className="text-[10px] text-[#64748b]">/ {prod.unit}</span>
                              </p>
                            </div>

                            {/* Stepper Button */}
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateQuantity(prod.id, -1)}
                                disabled={qty === 0}
                                className="w-7 h-7 rounded-lg bg-white disabled:opacity-40 hover:bg-[#fee2e2] text-[#2a1710] border-2 border-[#2a1710] flex items-center justify-center font-bold shadow-[1px_1px_0px_#2a1710] cursor-pointer disabled:cursor-not-allowed"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-mono font-black text-sm text-[#2a1710]">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(prod.id, 1)}
                                className="w-7 h-7 rounded-lg bg-[#fde047] hover:bg-[#facc15] text-[#2a1710] border-2 border-[#2a1710] flex items-center justify-center font-bold shadow-[1px_1px_0px_#2a1710] cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ringkasan Subtotal */}
                  <div className="p-3 rounded-2xl bg-[#fffdf5] border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] flex items-center justify-between text-xs">
                    <span className="font-mono text-[#5c3e32]">Total Belanja:</span>
                    <span className="font-mono font-black text-base text-[#b2430f]">
                      {formatRupiah(totalPrice)}
                    </span>
                  </div>

                  {/* Informasi Pemesan */}
                  <div className="space-y-3 pt-1">
                    <label className="text-xs font-mono font-black text-[#2a1710] uppercase flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#b2430f]" />
                      <span>2. Data Pemesan</span>
                    </label>

                    <div className="space-y-2">
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="Nama Lengkap *"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#2a1710] text-xs font-medium text-[#2a1710] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#b2430f]"
                          />
                        </div>
                      </div>

                      <div className="relative">
                        <input
                          type="tel"
                          required
                          placeholder="Nomor WhatsApp (mis. 08123456789) *"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#2a1710] text-xs font-medium text-[#2a1710] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#b2430f]"
                        />
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Titik COD Kampus / Alamat (opsional)"
                          value={locationNote}
                          onChange={(e) => setLocationNote(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#2a1710] text-xs font-medium text-[#2a1710] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#b2430f]"
                        />
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Catatan khusus (opsional, mis. jangan terlalu manis)"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#2a1710] text-xs font-medium text-[#2a1710] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#b2430f]"
                        />
                      </div>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-[#fee2e2] border-2 border-[#dc2626] text-[#dc2626] text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting || totalPrice === 0}
                      className="w-full py-3 px-4 rounded-2xl bg-[#b2430f] hover:bg-[#993608] disabled:opacity-50 text-white font-mono font-black text-xs sm:text-sm border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] cursor-pointer disabled:cursor-not-allowed transition-transform active:translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <span>Menyimpan Pesanan...</span>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Kirim Pesanan ({formatRupiah(totalPrice)})</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-[#64748b] mt-2">
                      * Pembayaran COD dilakukan saat serah terima abon di area kampus.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
