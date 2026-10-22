import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Sparkles,
  User,
  Plus,
  Minus,
  ArrowLeft,
  FileSpreadsheet,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { submitOrderToSpreadsheet } from '../services/apiService';
import { getFormConfig } from '../services/configService';
import type { Order, OrderItem } from '../types/bonku';
import { profileData } from '../data/bonkuData';
import { BrandLogo } from '../components/common/BrandLogo';

interface OrderPageProps {
  onNavigateHome: () => void;
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
    description: 'Abon ayam olahan rumahan bumbu rempah alami, kemasan retort pouch food grade.',
  },
  {
    id: 'roti-isi-abon',
    title: 'Roti Isi Abon',
    price: 6000,
    unit: 'pcs',
    badge: 'Fresh Bake',
    image: '/produk/roti-abon.svg',
    description: 'Roti empuk dengan isian abon ayam gurih melimpah, padat gizi.',
  },
];

export const OrderPage: React.FC<OrderPageProps> = ({ onNavigateHome, initialProductId }) => {
  const [config, setConfig] = useState(getFormConfig);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  // Form states
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>({
    'abon-ayam-pouch': initialProductId === 'abon-ayam-pouch' ? 1 : 1,
    'roti-isi-abon': initialProductId === 'roti-isi-abon' ? 1 : 0,
  });
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [locationNote, setLocationNote] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isSavedToSpreadsheet, setIsSavedToSpreadsheet] = useState(false);

  // Sinkronisasi konfigurasi realtime dari event internal & storage
  useEffect(() => {
    const refreshConfig = () => setConfig(getFormConfig());
    window.addEventListener('bonku-config-changed', refreshConfig);
    window.addEventListener('storage', refreshConfig);
    return () => {
      window.removeEventListener('bonku-config-changed', refreshConfig);
      window.removeEventListener('storage', refreshConfig);
    };
  }, []);

  // Countdown timer PO
  useEffect(() => {
    if (!config.isFormOpen || config.orderMode === 'reguler' || !config.endDate) {
      setTimeLeft(null);
      return;
    }

    const calcTime = () => {
      const target = new Date(config.endDate).getTime();
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft(null);
        setConfig((prev) => ({ ...prev, isExpired: true }));
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calcTime();
    const interval = setInterval(calcTime, 1000);
    return () => clearInterval(interval);
  }, [config.isFormOpen, config.orderMode, config.endDate]);

  const isClosed = !config.isFormOpen || (config.orderMode === 'po' && config.isExpired);

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
      quantity: quantities[p.id],
      price: p.price,
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
    const res = await submitOrderToSpreadsheet({
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      location_note: locationNote.trim(),
      items: selectedItems,
      notes: notes.trim(),
      total_price: totalPrice,
      source: 'web',
    });
    setSubmitting(false);

    if (res.success && res.order) {
      setCreatedOrder(res.order);
      setIsSavedToSpreadsheet(!!res.sentToSpreadsheet);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrorMessage(res.error || 'Terjadi kesalahan saat memproses pesanan.');
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

    const itemsSummary = selectedItems
      .map((i) => `• ${i.title} (${i.quantity}x) = ${formatRupiah(i.subtotal)}`)
      .join('\n');

    const msg = `Halo BonKu! Saya telah mengisi form pemesanan di web:
*ID Pesanan:* ${order.id}
*Nama:* ${order.customer_name}
*No. WA:* ${order.customer_phone}
*Titik COD / Alamat:* ${order.location_note || '-'}
*Rincian Pesanan:*
${itemsSummary}
*Total:* ${formatRupiah(order.total_price)}
${order.notes ? `*Catatan Khusus:* ${order.notes}\n` : ''}
Mohon konfirmasi pesanan dan info serah terima COD ya. Terima kasih!`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-[#fdf3e3] text-[#2a1710] selection:bg-[#b2430f] selection:text-white pb-20">
      <header className="sticky top-0 z-30 bg-[#fdf3e3]/95 backdrop-blur-md border-b-3 border-[#2a1710] px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BrandLogo />
            <div>
              <h1 className="font-mono font-black text-base sm:text-lg text-[#2a1710] leading-tight">
                Pemesanan BonKu
              </h1>
              <p className="text-[11px] sm:text-xs text-[#5c3e32]">
                {config.orderMode === 'reguler'
                  ? config.batchName || 'Pesanan Harian (Ready Stock)'
                  : config.batchName || profileData.status}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateHome}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#faeee0] text-[#2a1710] border-2 border-[#2a1710] font-mono font-bold text-xs shadow-[2px_2px_0px_#2a1710] flex items-center gap-1.5 cursor-pointer transition-transform active:translate-y-0.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-6 sm:pt-8 space-y-6">
        {isClosed ? (
          /* TAMPILAN JIKA FORM DITUTUP ATAU WAKTU PO HABIS */
          <div className="bg-[#fffdf5] border-3 border-[#2a1710] rounded-3xl shadow-[6px_6px_0px_#2a1710] p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-[#fde047] border-3 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] flex items-center justify-center">
              <Clock className="w-8 h-8 text-[#b2430f]" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-black bg-[#fee2e2] text-[#dc2626] border border-[#dc2626]">
                {config.orderMode === 'po' && config.isExpired
                  ? 'PO DITUTUP (WAKTU HABIS)'
                  : 'FORM DITUTUP SEMENTARA'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#2a1710]">
                {config.orderMode === 'po' && config.isExpired
                  ? 'Pre-Order Batch Ini Telah Ditutup'
                  : 'Form Pemesanan Sedang Ditutup'}
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed max-w-md mx-auto">
                {config.closedMessage ||
                  'Pemesanan ditutup sementara oleh pengelola BonKu. Hubungi WhatsApp kami untuk menanyakan ketersediaan stok atau info batch selanjutnya.'}
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={profileData.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-[#2a1710] border-2 border-[#2a1710] font-mono font-bold text-xs shadow-[3px_3px_0px_#2a1710] flex items-center justify-center gap-2 cursor-pointer transition-transform active:translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4 text-[#2a1710]" />
                <span>Tanya Stok via WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={onNavigateHome}
                className="px-6 py-3 rounded-2xl bg-white hover:bg-[#faeee0] text-[#2a1710] border-2 border-[#2a1710] font-mono font-bold text-xs shadow-[3px_3px_0px_#2a1710] cursor-pointer"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        ) : createdOrder ? (
          /* TAMPILAN JIKA PESANAN BERHASIL */
          <div className="bg-[#fffdf5] border-3 border-[#2a1710] rounded-3xl shadow-[6px_6px_0px_#2a1710] p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-[#dcfce7] border-3 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] flex items-center justify-center text-[#16a34a]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-black bg-[#dcfce7] text-[#16a34a] border border-[#16a34a]">
                PESANAN SIAP DIKONFIRMASI
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#2a1710]">
                Terima Kasih, {createdOrder.customer_name}!
              </h2>
              <p className="text-xs sm:text-sm text-[#5c3e32]">
                {isSavedToSpreadsheet
                  ? 'Data pesanan telah otomatis tercatat ke Spreadsheet (SPS) BonKu.'
                  : 'Rincian pesanan Anda telah tersusun rapi dan siap dikonfirmasi.'}
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#fdf3e3] border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] text-left text-xs sm:text-sm space-y-2.5">
              <div className="flex justify-between items-center pb-2.5 border-b border-[#eadac4]">
                <span className="font-mono text-[#5c3e32] font-bold">ID Pesanan:</span>
                <span className="font-mono font-black text-[#b2430f] bg-white px-2.5 py-0.5 rounded-md border-2 border-[#2a1710]">
                  {createdOrder.id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#5c3e32] font-bold">Total Pembayaran:</span>
                <span className="font-black text-base text-[#2a1710]">
                  {formatRupiah(createdOrder.total_price)}
                </span>
              </div>
              <div className="text-xs text-[#64748b]">
                Titik COD: {createdOrder.location_note || 'Area Kampus (Disepakati di WhatsApp)'}
              </div>
              {createdOrder.notes && (
                <div className="text-xs text-[#64748b] italic">
                  Catatan: &ldquo;{createdOrder.notes}&rdquo;
                </div>
              )}
            </div>

            <div className="space-y-2.5 pt-2">
              <a
                href={generateWaConfirmationLink(createdOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-[#2a1710] border-2 border-[#2a1710] font-mono font-black text-xs sm:text-sm shadow-[3px_3px_0px_#2a1710] flex items-center justify-center gap-2 cursor-pointer transition-transform active:translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5 text-[#2a1710]" />
                <span>Konfirmasi Pesanan ke WhatsApp BonKu</span>
              </a>

              {profileData.contact.orderFormUrl && (
                <a
                  href={profileData.contact.orderFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-2xl bg-[#fffdf5] hover:bg-[#fde047] text-[#2a1710] border-2 border-[#2a1710] font-mono font-bold text-xs shadow-[2px_2px_0px_#2a1710] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#b2430f]" />
                  <span>Cadangan: Isi Google Form Resmi</span>
                  <ExternalLink className="w-3 h-3 text-[#64748b]" />
                </a>
              )}

              <button
                type="button"
                onClick={onNavigateHome}
                className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#faeee0] text-[#2a1710] border-2 border-[#2a1710] font-mono font-bold text-xs shadow-[2px_2px_0px_#2a1710] cursor-pointer"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        ) : (
          /* FORM PEMESANAN AKTIF */
          <div className="bg-[#fffdf5] border-3 border-[#2a1710] rounded-3xl shadow-[6px_6px_0px_#2a1710] p-5 sm:p-7 space-y-6">
            {/* Banner Status Mode PO vs Reguler */}
            {config.orderMode === 'reguler' ? (
              <div className="p-3.5 rounded-2xl bg-[#dcfce7] border-2 border-[#16a34a] shadow-[2px_2px_0px_#2a1710] flex items-center justify-between text-xs font-mono font-bold text-[#15803d]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] animate-pulse" />
                  <span>Pesanan Harian (Ready Stock) Buka</span>
                </div>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#16a34a] text-[#15803d]">
                  Siap Kirim / COD
                </span>
              </div>
            ) : timeLeft ? (
              <div className="p-3.5 rounded-2xl bg-[#fef3c7] border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] flex items-center justify-between text-xs font-mono font-bold text-[#92400e]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#b2430f] animate-pulse" />
                  <span>Sisa Waktu PO:</span>
                </div>
                <div className="flex items-center gap-1 text-[#2a1710]">
                  <span className="bg-white px-2 py-0.5 rounded border border-[#2a1710]">{timeLeft.days}h</span>:
                  <span className="bg-white px-2 py-0.5 rounded border border-[#2a1710]">{timeLeft.hours}j</span>:
                  <span className="bg-white px-2 py-0.5 rounded border border-[#2a1710]">{timeLeft.minutes}m</span>:
                  <span className="bg-white px-2 py-0.5 rounded border border-[#2a1710]">{timeLeft.seconds}d</span>
                </div>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Step 1: Produk */}
              <div className="space-y-3">
                <label className="text-xs font-mono font-black text-[#2a1710] uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#b2430f]" />
                  <span>1. Pilih Produk &amp; Jumlah</span>
                </label>

                <div className="grid gap-3">
                  {PRODUCTS.map((prod) => {
                    const qty = quantities[prod.id] || 0;
                    return (
                      <div
                        key={prod.id}
                        className={`p-4 rounded-2xl border-2 border-[#2a1710] transition-colors flex items-center justify-between gap-3 ${
                          qty > 0 ? 'bg-[#fdf3e3] shadow-[3px_3px_0px_#2a1710]' : 'bg-white'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-[#2a1710]">{prod.title}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#fde047] text-[#2a1710] border border-[#2a1710] font-bold">
                              {prod.badge}
                            </span>
                          </div>
                          <p className="text-xs font-mono font-bold text-[#b2430f]">
                            {formatRupiah(prod.price)} <span className="text-[10px] text-[#64748b]">/ {prod.unit}</span>
                          </p>
                          <p className="text-[11px] text-[#64748b] hidden sm:block">
                            {prod.description}
                          </p>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-2.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateQuantity(prod.id, -1)}
                            disabled={qty === 0}
                            className="w-8 h-8 rounded-xl bg-white disabled:opacity-40 hover:bg-[#fee2e2] text-[#2a1710] border-2 border-[#2a1710] flex items-center justify-center font-bold shadow-[1px_1px_0px_#2a1710] cursor-pointer disabled:cursor-not-allowed"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center font-mono font-black text-base text-[#2a1710]">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(prod.id, 1)}
                            className="w-8 h-8 rounded-xl bg-[#fde047] hover:bg-[#facc15] text-[#2a1710] border-2 border-[#2a1710] flex items-center justify-center font-bold shadow-[1px_1px_0px_#2a1710] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Subtotal Display */}
              <div className="p-4 rounded-2xl bg-[#fffdf5] border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] flex items-center justify-between text-xs sm:text-sm">
                <span className="font-mono font-bold text-[#5c3e32]">Total Belanja:</span>
                <span className="font-mono font-black text-lg text-[#b2430f]">
                  {formatRupiah(totalPrice)}
                </span>
              </div>

              {/* Step 2: Identitas Pemesan */}
              <div className="space-y-3 pt-1">
                <label className="text-xs font-mono font-black text-[#2a1710] uppercase flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#b2430f]" />
                  <span>2. Data Pemesan</span>
                </label>

                <div className="space-y-2.5">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Nama Lengkap *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-[#2a1710] text-xs sm:text-sm font-medium text-[#2a1710] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#b2430f]"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Nomor WhatsApp (mis. 08123456789) *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-[#2a1710] text-xs sm:text-sm font-medium text-[#2a1710] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#b2430f]"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Titik COD Kampus / Alamat (opsional)"
                      value={locationNote}
                      onChange={(e) => setLocationNote(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-[#2a1710] text-xs sm:text-sm font-medium text-[#2a1710] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#b2430f]"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Catatan pesanan khusus (opsional)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-[#2a1710] text-xs sm:text-sm font-medium text-[#2a1710] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#b2430f]"
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
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#b2430f] hover:bg-[#993608] disabled:opacity-50 text-white font-mono font-black text-xs sm:text-sm border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] cursor-pointer disabled:cursor-not-allowed transition-transform active:translate-y-0.5 flex items-center justify-center gap-2"
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
                <p className="text-[11px] text-center text-[#64748b] mt-2 font-medium">
                  * Pembayaran tunai/COD dilakukan saat serah terima abon di area kampus.
                </p>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
