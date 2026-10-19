import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  Clock,
  Download,
  LogOut,
  RefreshCw,
  Search,
  PlusCircle,
  MessageCircle,
  Trash2,
  Check,
  ArrowLeft,
  Lock,
  AlertCircle,
  Delete,
} from 'lucide-react';
import {
  fetchOrders,
  fetchOrderStats,
  fetchActiveBatch,
  updateOrderStatus,
  deleteOrder,
  updateActiveBatch,
  createOrder,
  verifyAdminPin,
} from '../services/apiService';
import type { ActiveBatch, Order, OrderStats, OrderStatus, PaymentStatus } from '../types/bonku';
import { BrandLogo } from '../components/common/BrandLogo';

interface AdminDashboardPageProps {
  onNavigateHome: () => void;
}

type TabType = 'overview' | 'orders' | 'add_order' | 'batch_settings';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigateHome }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('bonku_admin_auth') === 'true';
  });

  // Auth Keypad State
  const [pin, setPin] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [batch, setBatch] = useState<ActiveBatch | null>(null);
  const [loading, setLoading] = useState(false);

  // Filter & Search
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Batch Form State
  const [batchName, setBatchName] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quotaPouch, setQuotaPouch] = useState(50);
  const [quotaRoti, setQuotaRoti] = useState(30);
  const [batchActive, setBatchActive] = useState(1);
  const [closedMessage, setClosedMessage] = useState('');
  const [savingBatch, setSavingBatch] = useState(false);
  const [batchMessage, setBatchMessage] = useState<string | null>(null);

  // Manual Order Form State
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const [manualPouchQty, setManualPouchQty] = useState(1);
  const [manualRotiQty, setManualRotiQty] = useState(0);
  const [manualNotes, setManualNotes] = useState('');
  const [submittingManual, setSubmittingManual] = useState(false);
  const [manualSuccessMsg, setManualSuccessMsg] = useState<string | null>(null);

  // Auth Logic
  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setAuthError(null);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDeleteDigit = () => {
    setPin((prev) => prev.slice(0, -1));
    setAuthError(null);
  };

  const handleClearPin = () => {
    setPin('');
    setAuthError(null);
  };

  const verifyPin = async (pinToTest: string) => {
    setVerifying(true);
    const res = await verifyAdminPin(pinToTest);
    setVerifying(false);
    if (res.success) {
      sessionStorage.setItem('bonku_admin_auth', 'true');
      setIsAuthenticated(true);
      setPin('');
    } else {
      setAuthError(res.error || 'PIN tidak sesuai, silakan coba lagi.');
      setPin('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('bonku_admin_auth');
    setIsAuthenticated(false);
    setPin('');
  };

  // Dashboard Data Loading
  const loadData = useCallback(async () => {
    setLoading(true);
    const [fetchedOrders, fetchedStats, fetchedBatch] = await Promise.all([
      fetchOrders({ status: statusFilter, search: searchQuery }),
      fetchOrderStats(),
      fetchActiveBatch(),
    ]);
    setOrders(fetchedOrders);
    setStats(fetchedStats);
    setBatch(fetchedBatch);

    if (fetchedBatch) {
      setBatchName(fetchedBatch.batch_name);
      try {
        const d = new Date(fetchedBatch.end_date);
        const pad = (n: number) => String(n).padStart(2, '0');
        const formattedDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        setEndDate(formattedDate);
      } catch {
        setEndDate('');
      }
      setQuotaPouch(fetchedBatch.quota_pouch);
      setQuotaRoti(fetchedBatch.quota_roti);
      setBatchActive(fetchedBatch.is_active);
      setClosedMessage(fetchedBatch.closed_message);
    }
    setLoading(false);
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let isSubscribed = true;

    Promise.all([
      fetchOrders({ status: statusFilter, search: searchQuery }),
      fetchOrderStats(),
      fetchActiveBatch(),
    ]).then(([fetchedOrders, fetchedStats, fetchedBatch]) => {
      if (!isSubscribed) return;
      setOrders(fetchedOrders);
      setStats(fetchedStats);
      setBatch(fetchedBatch);

      if (fetchedBatch) {
        setBatchName(fetchedBatch.batch_name);
        try {
          const d = new Date(fetchedBatch.end_date);
          const pad = (n: number) => String(n).padStart(2, '0');
          const formattedDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
          setEndDate(formattedDate);
        } catch {
          setEndDate('');
        }
        setQuotaPouch(fetchedBatch.quota_pouch);
        setQuotaRoti(fetchedBatch.quota_roti);
        setBatchActive(fetchedBatch.is_active);
        setClosedMessage(fetchedBatch.closed_message);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [isAuthenticated, statusFilter, searchQuery]);

  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    const res = await updateOrderStatus(orderId, { status: nextStatus });
    if (res.success) {
      loadData();
    }
  };

  const handlePaymentToggle = async (orderId: string, current: PaymentStatus) => {
    const next: PaymentStatus = current === 'paid' ? 'unpaid' : 'paid';
    const res = await updateOrderStatus(orderId, { payment_status: next });
    if (res.success) {
      loadData();
    }
  };

  const handleDelete = async (orderId: string) => {
    if (window.confirm(`Hapus pesanan ${orderId}?`)) {
      const ok = await deleteOrder(orderId);
      if (ok) {
        loadData();
      }
    }
  };

  const handleSaveBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBatch(true);
    setBatchMessage(null);

    const res = await updateActiveBatch({
      batch_name: batchName,
      end_date: endDate ? new Date(endDate).toISOString() : undefined,
      quota_pouch: quotaPouch,
      quota_roti: quotaRoti,
      is_active: batchActive,
      closed_message: closedMessage,
    });

    setSavingBatch(false);
    if (res.success) {
      setBatchMessage('Pengaturan batch PO berhasil diperbarui!');
      loadData();
    } else {
      setBatchMessage(res.error || 'Gagal menyimpan batch.');
    }
  };

  const handleManualOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingManual(true);
    setManualSuccessMsg(null);

    const items = [];
    if (manualPouchQty > 0) {
      items.push({
        productId: 'abon-ayam-pouch',
        title: 'Abon Ayam Pouch 100g',
        quantity: manualPouchQty,
        price: 18000,
        subtotal: manualPouchQty * 18000,
      });
    }
    if (manualRotiQty > 0) {
      items.push({
        productId: 'roti-isi-abon',
        title: 'Roti Isi Abon',
        quantity: manualRotiQty,
        price: 6000,
        subtotal: manualRotiQty * 6000,
      });
    }

    if (items.length === 0) {
      alert('Pilih minimal 1 porsi produk.');
      setSubmittingManual(false);
      return;
    }

    const res = await createOrder({
      customer_name: manualName,
      customer_phone: manualPhone || '-',
      location_note: manualLocation || 'COD Kampus',
      items,
      notes: manualNotes,
      source: 'manual',
    });

    setSubmittingManual(false);
    if (res.success && res.order) {
      setManualSuccessMsg(`Pesanan ${res.order.id} berhasil dicatat!`);
      setManualName('');
      setManualPhone('');
      setManualLocation('');
      setManualNotes('');
      setManualPouchQty(1);
      setManualRotiQty(0);
      loadData();
    } else {
      alert(res.error || 'Gagal mencatat pesanan.');
    }
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#fef3c7] text-[#b45309] border border-[#b45309]">Pending</span>;
      case 'confirmed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#dbeafe] text-[#1d4ed8] border border-[#1d4ed8]">Dikonfirmasi</span>;
      case 'ready_cod':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#f3e8ff] text-[#7e22ce] border border-[#7e22ce]">Siap COD</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#dcfce7] text-[#15803d] border border-[#15803d]">Selesai</span>;
      case 'cancelled':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#fee2e2] text-[#b91c1c] border border-[#b91c1c]">Batal</span>;
      default:
        return null;
    }
  };

  // JIKA BELUM LOGIN PIN -> TAMPILAN HALAMAN LOGIN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fdf3e3] text-[#2a1710] flex flex-col justify-between p-4 sm:p-6">
        {/* Top Navbar */}
        <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-4 border-b-2 border-[#2a1710]/20">
          <div className="flex items-center gap-2.5">
            <BrandLogo />
            <span className="font-mono font-black text-sm text-[#2a1710]">
              Portal Admin
            </span>
          </div>

          <button
            type="button"
            onClick={onNavigateHome}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#faeee0] text-[#2a1710] border-2 border-[#2a1710] font-mono font-bold text-xs shadow-[2px_2px_0px_#2a1710] flex items-center gap-1.5 cursor-pointer transition-transform active:translate-y-0.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </button>
        </header>

        {/* Center Keypad Card */}
        <div className="max-w-sm w-full mx-auto my-8 bg-[#fffdf5] border-3 border-[#2a1710] rounded-3xl shadow-[6px_6px_0px_#2a1710] p-6 space-y-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#b2430f] border-2 border-[#2a1710] flex items-center justify-center text-white shadow-[3px_3px_0px_#2a1710]">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-mono font-black text-base text-[#2a1710]">
              Masuk Dashboard Admin
            </h2>
            <p className="text-xs text-[#5c3e32]">
              Masukkan 4-digit PIN pengelola BonKu
            </p>
            <p className="text-[10px] font-mono text-[#94a3b8]">
              (PIN bawaan pengujian: 1234)
            </p>
          </div>

          {/* Dots Display */}
          <div className="flex items-center justify-center gap-3 py-2">
            {[0, 1, 2, 3].map((idx) => {
              const filled = pin.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 border-[#2a1710] transition-all ${
                    filled ? 'bg-[#b2430f] scale-110 shadow-[1px_1px_0px_#2a1710]' : 'bg-white'
                  }`}
                />
              );
            })}
          </div>

          {authError && (
            <div className="p-2.5 rounded-xl bg-[#fee2e2] border-2 border-[#dc2626] text-[#dc2626] text-xs font-medium flex items-center justify-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                disabled={verifying}
                onClick={() => handleDigit(digit)}
                className="py-3 rounded-2xl bg-white hover:bg-[#fdf3e3] active:bg-[#fde047] text-[#2a1710] border-2 border-[#2a1710] font-mono font-black text-base shadow-[2px_2px_0px_#2a1710] transition-transform active:translate-y-0.5 cursor-pointer"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClearPin}
              disabled={verifying || pin.length === 0}
              className="py-3 rounded-2xl bg-[#f8fafc] hover:bg-[#fee2e2] text-[#64748b] hover:text-[#dc2626] border-2 border-[#2a1710] font-mono font-bold text-xs shadow-[2px_2px_0px_#2a1710] cursor-pointer disabled:opacity-40"
            >
              C
            </button>
            <button
              type="button"
              disabled={verifying}
              onClick={() => handleDigit('0')}
              className="py-3 rounded-2xl bg-white hover:bg-[#fdf3e3] active:bg-[#fde047] text-[#2a1710] border-2 border-[#2a1710] font-mono font-black text-base shadow-[2px_2px_0px_#2a1710] transition-transform active:translate-y-0.5 cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDeleteDigit}
              disabled={verifying || pin.length === 0}
              className="py-3 rounded-2xl bg-[#f8fafc] hover:bg-[#fee2e2] text-[#2a1710] border-2 border-[#2a1710] flex items-center justify-center shadow-[2px_2px_0px_#2a1710] cursor-pointer disabled:opacity-40"
            >
              <Delete className="w-4 h-4" />
            </button>
          </div>

          {verifying && (
            <div className="text-center text-xs font-mono text-[#b2430f] animate-pulse">
              Memverifikasi PIN...
            </div>
          )}
        </div>

        <footer className="max-w-4xl w-full mx-auto text-center text-xs text-[#5c3e32]/70 font-mono">
          BonKu &copy; {new Date().getFullYear()} • Sistem Manajemen SQLite Lokal
        </footer>
      </div>
    );
  }

  // TAMPILAN HALAMAN DASHBOARD LENGKAP (FULL PAGE)
  return (
    <div className="min-h-screen bg-[#fdf3e3] text-[#2a1710] selection:bg-[#b2430f] selection:text-white pb-16">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 bg-[#fdf3e3]/95 backdrop-blur-md border-b-3 border-[#2a1710] px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BrandLogo />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-mono font-black text-base sm:text-lg text-[#2a1710] leading-tight">
                  Dashboard Admin BonKu
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-[#dcfce7] border border-[#16a34a] text-[10px] font-mono font-bold text-[#16a34a]">
                  SQLite: bonku.db
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#5c3e32]">
                Manajemen Pesanan, Batch Pre-Order &amp; Pembukuan
              </p>
            </div>
          </div>

          {/* Action Dock */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <a
              href="/api/export/csv"
              download
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#faeee0] text-[#2a1710] border-2 border-[#2a1710] text-xs font-mono font-bold shadow-[2px_2px_0px_#2a1710] flex items-center gap-1.5 transition-all cursor-pointer"
              title="Unduh rekapitulasi pesanan format CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#b2430f]" />
              <span className="hidden sm:inline">Ekspor CSV</span>
            </a>

            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="p-1.5 rounded-xl bg-white hover:bg-[#faeee0] text-[#2a1710] border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] cursor-pointer"
              title="Muat ulang data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onNavigateHome}
              className="px-3 py-1.5 rounded-xl bg-[#faeee0] hover:bg-[#fde047] text-[#2a1710] border-2 border-[#2a1710] font-mono font-bold text-xs shadow-[2px_2px_0px_#2a1710] flex items-center gap-1.5 cursor-pointer transition-transform active:translate-y-0.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Toko</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-xl bg-[#fee2e2] hover:bg-[#fca5a5] text-[#dc2626] border-2 border-[#2a1710] text-xs font-mono font-bold shadow-[2px_2px_0px_#2a1710] flex items-center gap-1 cursor-pointer"
              title="Keluar dari sesi admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b-3 border-[#2a1710] gap-2 overflow-x-auto no-scrollbar pt-2">
          {[
            { id: 'overview', label: 'Ringkasan & Metrik', icon: LayoutDashboard },
            { id: 'orders', label: `Daftar Pesanan (${orders.length})`, icon: ShoppingBag },
            { id: 'add_order', label: '+ Catat Pesanan Offline', icon: PlusCircle },
            { id: 'batch_settings', label: 'Batas Waktu & Batch PO', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-2.5 rounded-t-2xl font-mono text-xs font-bold border-t-3 border-x-3 border-[#2a1710] flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-[#fffdf5] text-[#b2430f] -mb-[3px] pb-3 shadow-[0px_-2px_0px_#2a1710]'
                    : 'bg-[#faeee0] text-[#5c3e32] hover:bg-[#fffdf5]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Box (Natural Page Flow - No inner overflow scroll!) */}
        <div className="bg-[#fffdf5] border-3 border-[#2a1710] rounded-3xl shadow-[6px_6px_0px_#2a1710] p-4 sm:p-7">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Status Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#fdf3e3] border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs text-[#2a1710] uppercase">
                      Batch Aktif:
                    </span>
                    <span className="font-bold text-sm sm:text-base text-[#b2430f]">
                      {batch?.batch_name || '-'}
                    </span>
                  </div>
                  <div className="text-xs text-[#5c3e32] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#b2430f]" />
                    <span>
                      Batas Waktu PO:{' '}
                      {batch?.end_date ? new Date(batch.end_date).toLocaleString('id-ID') : '-'}
                    </span>
                  </div>
                </div>

                <div>
                  {batch?.is_active && !batch?.is_expired ? (
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-black bg-[#dcfce7] text-[#15803d] border-2 border-[#15803d] flex items-center gap-1.5 shadow-[1px_1px_0px_#2a1710]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#15803d] animate-ping" />
                      FORM PO DIBUKA
                    </span>
                  ) : (
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-black bg-[#fee2e2] text-[#b91c1c] border-2 border-[#b91c1c] shadow-[1px_1px_0px_#2a1710]">
                      FORM PO DITUTUP
                    </span>
                  )}
                </div>
              </div>

              {/* Metrik Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-white border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] space-y-1">
                  <p className="text-[11px] font-mono text-[#64748b] uppercase font-bold">Total Omset</p>
                  <p className="text-lg sm:text-2xl font-mono font-black text-[#b2430f]">
                    {formatRupiah(stats?.totalRevenue || 0)}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] space-y-1">
                  <p className="text-[11px] font-mono text-[#64748b] uppercase font-bold">Total Pesanan</p>
                  <p className="text-lg sm:text-2xl font-mono font-black text-[#2a1710]">
                    {stats?.totalOrders || 0}{' '}
                    <span className="text-xs text-[#64748b] font-normal">transaksi</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] space-y-1">
                  <p className="text-[11px] font-mono text-[#64748b] uppercase font-bold">Pouch Terjual</p>
                  <p className="text-lg sm:text-2xl font-mono font-black text-[#2a1710]">
                    {stats?.totalPouch || 0}{' '}
                    <span className="text-xs text-[#64748b] font-normal">
                      / {batch?.quota_pouch || 50}
                    </span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] space-y-1">
                  <p className="text-[11px] font-mono text-[#64748b] uppercase font-bold">Roti Terjual</p>
                  <p className="text-lg sm:text-2xl font-mono font-black text-[#2a1710]">
                    {stats?.totalRoti || 0}{' '}
                    <span className="text-xs text-[#64748b] font-normal">
                      / {batch?.quota_roti || 30}
                    </span>
                  </p>
                </div>
              </div>

              {/* Progress Kuota */}
              <div className="p-5 rounded-2xl bg-white border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] space-y-4">
                <h3 className="font-mono font-bold text-xs uppercase text-[#2a1710]">
                  Progres Kuota Produksi Batch
                </h3>

                {/* Pouch */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="font-bold">Abon Ayam Pouch 100g:</span>
                    <span className="font-bold text-[#b2430f]">
                      {stats?.totalPouch || 0} / {batch?.quota_pouch || 50} pouch
                    </span>
                  </div>
                  <div className="w-full h-3.5 bg-[#faeee0] rounded-full border border-[#2a1710] overflow-hidden">
                    <div
                      className="h-full bg-[#b2430f] transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (((stats?.totalPouch || 0) / (batch?.quota_pouch || 50)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Roti */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="font-bold">Roti Isi Abon:</span>
                    <span className="font-bold text-[#f59e0b]">
                      {stats?.totalRoti || 0} / {batch?.quota_roti || 30} pcs
                    </span>
                  </div>
                  <div className="w-full h-3.5 bg-[#faeee0] rounded-full border border-[#2a1710] overflow-hidden">
                    <div
                      className="h-full bg-[#f59e0b] transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (((stats?.totalRoti || 0) / (batch?.quota_roti || 30)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: DAFTAR PESANAN */}
          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Filter & Search Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'Semua' },
                    { id: 'pending', label: 'Pending' },
                    { id: 'confirmed', label: 'Dikonfirmasi' },
                    { id: 'ready_cod', label: 'Siap COD' },
                    { id: 'completed', label: 'Selesai' },
                    { id: 'cancelled', label: 'Batal' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setStatusFilter(st.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border-2 border-[#2a1710] cursor-pointer transition-all ${
                        statusFilter === st.id
                          ? 'bg-[#b2430f] text-white shadow-[2px_2px_0px_#2a1710]'
                          : 'bg-white text-[#2a1710] hover:bg-[#faeee0]'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-50 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94a3b8]" />
                  <input
                    type="text"
                    placeholder="Cari nama, WA, ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border-2 border-[#2a1710] text-xs font-medium text-[#2a1710] placeholder:text-[#94a3b8] focus:outline-none"
                  />
                </div>
              </div>

              {/* Orders List */}
              {orders.length === 0 ? (
                <div className="py-16 text-center text-xs font-mono text-[#64748b] bg-white rounded-2xl border-2 border-[#2a1710]">
                  Belum ada pesanan yang sesuai dengan filter.
                </div>
              ) : (
                <div className="grid gap-3.5">
                  {orders.map((order) => {
                    let cleanPhone = order.customer_phone.replace(/\D/g, '');
                    if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
                    const waChatUrl = `https://wa.me/${cleanPhone}`;

                    return (
                      <div
                        key={order.id}
                        className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#eadac4]">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-xs text-[#b2430f] bg-[#fdf3e3] px-2.5 py-0.5 rounded-md border border-[#2a1710]">
                              {order.id}
                            </span>
                            <span className="font-bold text-xs sm:text-sm text-[#2a1710]">
                              {order.customer_name}
                            </span>
                            <span className="text-[10px] font-mono text-[#64748b]">
                              ({order.source})
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {getStatusBadge(order.status)}
                            <button
                              type="button"
                              onClick={() => handlePaymentToggle(order.id, order.payment_status)}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border-2 cursor-pointer ${
                                order.payment_status === 'paid'
                                  ? 'bg-[#dcfce7] text-[#15803d] border-[#15803d]'
                                  : 'bg-[#fee2e2] text-[#dc2626] border-[#dc2626]'
                              }`}
                              title="Klik untuk ubah status pembayaran"
                            >
                              {order.payment_status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                            </button>
                          </div>
                        </div>

                        {/* Order Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <div className="text-[#64748b] font-mono font-bold mb-1">Rincian Item:</div>
                            <div className="font-medium text-[#2a1710] space-y-0.5">
                              {order.parsedItems && order.parsedItems.length > 0 ? (
                                order.parsedItems.map((it, idx) => (
                                  <div key={idx} className="flex justify-between max-w-xs">
                                    <span>• {it.title} ({it.quantity}x)</span>
                                    <span className="font-mono font-bold">{formatRupiah(it.subtotal)}</span>
                                  </div>
                                ))
                              ) : (
                                <span>{order.items}</span>
                              )}
                            </div>
                            <div className="font-mono font-black text-[#b2430f] text-sm mt-2">
                              Total: {formatRupiah(order.total_price)}
                            </div>
                          </div>

                          <div className="space-y-1 text-[#5c3e32]">
                            <div className="flex items-center gap-1.5">
                              <a
                                href={waChatUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#16a34a] hover:underline font-bold flex items-center gap-1"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>{order.customer_phone}</span>
                              </a>
                            </div>
                            <div>
                              <span className="text-[#64748b]">Titik COD / Alamat:</span>{' '}
                              <span className="font-medium">{order.location_note || '-'}</span>
                            </div>
                            {order.notes && (
                              <div>
                                <span className="text-[#64748b]">Catatan:</span>{' '}
                                <span className="italic">{order.notes}</span>
                              </div>
                            )}
                            <div className="text-[10px] text-[#94a3b8] font-mono pt-1">
                              Waktu: {new Date(order.created_at).toLocaleString('id-ID')}
                            </div>
                          </div>
                        </div>

                        {/* Status Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-[#eadac4]">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-mono text-[#64748b]">Ubah Status:</span>
                            {order.status !== 'confirmed' && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(order.id, 'confirmed')}
                                className="px-2.5 py-1 rounded-lg bg-[#dbeafe] hover:bg-[#bfdbfe] text-[#1d4ed8] text-[10px] font-mono font-bold border border-[#1d4ed8] cursor-pointer"
                              >
                                Konfirmasi
                              </button>
                            )}
                            {order.status !== 'ready_cod' && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(order.id, 'ready_cod')}
                                className="px-2.5 py-1 rounded-lg bg-[#f3e8ff] hover:bg-[#e9d5ff] text-[#7e22ce] text-[10px] font-mono font-bold border border-[#7e22ce] cursor-pointer"
                              >
                                Siap COD
                              </button>
                            )}
                            {order.status !== 'completed' && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(order.id, 'completed')}
                                className="px-2.5 py-1 rounded-lg bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#15803d] text-[10px] font-mono font-bold border border-[#15803d] cursor-pointer"
                              >
                                Selesai
                              </button>
                            )}
                            {order.status !== 'cancelled' && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(order.id, 'cancelled')}
                                className="px-2.5 py-1 rounded-lg bg-[#fee2e2] hover:bg-[#fecaca] text-[#b91c1c] text-[10px] font-mono font-bold border border-[#b91c1c] cursor-pointer"
                              >
                                Batal
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDelete(order.id)}
                            className="p-1.5 rounded-lg hover:bg-[#fee2e2] text-[#dc2626] border border-transparent hover:border-[#dc2626] cursor-pointer"
                            title="Hapus Pesanan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: CATAT PESANAN OFFLINE */}
          {activeTab === 'add_order' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl mx-auto bg-white p-6 rounded-2xl border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] space-y-4"
            >
              <div className="space-y-1">
                <h3 className="font-mono font-black text-sm sm:text-base text-[#2a1710]">
                  Catat Pesanan Langsung (Offline / COD)
                </h3>
                <p className="text-xs text-[#5c3e32]">
                  Gunakan ini untuk memasukkan pesanan yang diterima langsung atau lewat chat WA manual ke SQLite.
                </p>
              </div>

              {manualSuccessMsg && (
                <div className="p-3 rounded-xl bg-[#dcfce7] border-2 border-[#16a34a] text-[#16a34a] text-xs font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>{manualSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleManualOrderSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-[#2a1710]">Nama Pemesan *</label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full mt-1 px-3 py-2 rounded-xl border-2 border-[#2a1710] text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2a1710]">Nomor WhatsApp</label>
                  <input
                    type="tel"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    className="w-full mt-1 px-3 py-2 rounded-xl border-2 border-[#2a1710] text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2a1710]">Titik COD / Catatan Lokasi</label>
                  <input
                    type="text"
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    placeholder="Contoh: Gedung C Kampus"
                    className="w-full mt-1 px-3 py-2 rounded-xl border-2 border-[#2a1710] text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-xs font-bold text-[#2a1710]">
                      Abon Pouch 100g (Rp 18rb)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={manualPouchQty}
                      onChange={(e) => setManualPouchQty(parseInt(e.target.value) || 0)}
                      className="w-full mt-1 px-3 py-2 rounded-xl border-2 border-[#2a1710] text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#2a1710]">
                      Roti Isi Abon (Rp 6rb)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={manualRotiQty}
                      onChange={(e) => setManualRotiQty(parseInt(e.target.value) || 0)}
                      className="w-full mt-1 px-3 py-2 rounded-xl border-2 border-[#2a1710] text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2a1710]">Catatan</label>
                  <input
                    type="text"
                    value={manualNotes}
                    onChange={(e) => setManualNotes(e.target.value)}
                    placeholder="Catatan tambahan..."
                    className="w-full mt-1 px-3 py-2 rounded-xl border-2 border-[#2a1710] text-xs"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-[#fdf3e3] border-2 border-[#2a1710] flex justify-between items-center text-xs font-mono font-bold">
                  <span>Total Pesanan:</span>
                  <span className="text-[#b2430f] text-sm sm:text-base">
                    {formatRupiah(manualPouchQty * 18000 + manualRotiQty * 6000)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submittingManual}
                  className="w-full py-3 rounded-xl bg-[#b2430f] hover:bg-[#993608] text-white font-mono font-black text-xs sm:text-sm border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] cursor-pointer transition-transform active:translate-y-0.5"
                >
                  {submittingManual ? 'Menyimpan...' : 'Simpan Pesanan ke Database'}
                </button>
              </form>
            </motion.div>
          )}

          {/* TAB 4: BATAS WAKTU & BATCH PO */}
          {activeTab === 'batch_settings' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl mx-auto bg-white p-6 rounded-2xl border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] space-y-4"
            >
              <div className="space-y-1">
                <h3 className="font-mono font-black text-sm sm:text-base text-[#2a1710]">
                  Pengaturan Batas Waktu &amp; Kuota Pre-Order
                </h3>
                <p className="text-xs text-[#5c3e32]">
                  Tentukan kapan form otomatis ditutup dan batas kuota produksi batch ini.
                </p>
              </div>

              {batchMessage && (
                <div className="p-3 rounded-xl bg-[#fdf3e3] border-2 border-[#2a1710] text-[#2a1710] text-xs font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#16a34a]" />
                  <span>{batchMessage}</span>
                </div>
              )}

              <form onSubmit={handleSaveBatch} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#2a1710]">Nama Batch PO</label>
                  <input
                    type="text"
                    required
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    placeholder="Contoh: PO Batch 1 — Spesial Pekan Ini"
                    className="w-full mt-1 px-3 py-2 rounded-xl border-2 border-[#2a1710] text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2a1710] flex items-center justify-between">
                    <span>Batas Waktu Penutupan Form (Waktu Habis) *</span>
                    <span className="text-[10px] text-[#64748b]">Waktu Indonesia (WIB)</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border-2 border-[#2a1710] text-xs font-mono font-bold"
                  />
                  <p className="text-[10px] text-[#64748b] mt-1">
                    * Begitu tanggal &amp; jam ini tercapai, form pemesanan pelanggan otomatis terkunci dan menampilkan status PO Ditutup.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#2a1710]">Kuota Pouch Abon</label>
                    <input
                      type="number"
                      min="1"
                      value={quotaPouch}
                      onChange={(e) => setQuotaPouch(parseInt(e.target.value) || 0)}
                      className="w-full mt-1 px-3 py-2 rounded-xl border-2 border-[#2a1710] text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#2a1710]">Kuota Roti Abon</label>
                    <input
                      type="number"
                      min="1"
                      value={quotaRoti}
                      onChange={(e) => setQuotaRoti(parseInt(e.target.value) || 0)}
                      className="w-full mt-1 px-3 py-2 rounded-xl border-2 border-[#2a1710] text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Override Toggle */}
                <div className="p-3.5 rounded-xl bg-[#faeee0] border-2 border-[#2a1710] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#2a1710]">Status Buka/Tutup Form</div>
                    <div className="text-[10px] text-[#5c3e32]">
                      Override manual untuk menutup form sebelum waktu habis
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBatchActive((prev) => (prev === 1 ? 0 : 1))}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] cursor-pointer ${
                      batchActive === 1 ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fee2e2] text-[#b91c1c]'
                    }`}
                  >
                    {batchActive === 1 ? 'Aktif (Buka)' : 'Nonaktif (Tutup)'}
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2a1710]">
                    Pesan Saat Form Habis / Ditutup
                  </label>
                  <textarea
                    rows={2}
                    value={closedMessage}
                    onChange={(e) => setClosedMessage(e.target.value)}
                    placeholder="Pesan penjelas untuk pelanggan..."
                    className="w-full mt-1 px-3 py-2 rounded-xl border-2 border-[#2a1710] text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingBatch}
                  className="w-full py-3 rounded-xl bg-[#b2430f] hover:bg-[#993608] text-white font-mono font-black text-xs sm:text-sm border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] cursor-pointer transition-transform active:translate-y-0.5"
                >
                  {savingBatch ? 'Menyimpan Pengaturan...' : 'Simpan Pengaturan Batch'}
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};
