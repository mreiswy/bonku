import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
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
} from 'lucide-react';
import {
  fetchOrders,
  fetchOrderStats,
  fetchActiveBatch,
  updateOrderStatus,
  deleteOrder,
  updateActiveBatch,
  createOrder,
} from '../../services/apiService';
import type { ActiveBatch, Order, OrderStats, OrderStatus, PaymentStatus } from '../../types/bonku';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

type TabType = 'overview' | 'orders' | 'add_order' | 'batch_settings';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
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
    if (!isOpen) return;
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
  }, [isOpen, statusFilter, searchQuery]);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#2a1710]/75 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-4xl bg-[#fffdf5] border-3 border-[#2a1710] rounded-3xl shadow-[8px_8px_0px_#2a1710] overflow-hidden my-auto max-h-[94vh] flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-[#fdf3e3] border-b-2 sm:border-b-3 border-[#2a1710] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#b2430f] border-2 border-[#2a1710] flex items-center justify-center text-white shadow-[2px_2px_0px_#2a1710]">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-[#2a1710] font-mono leading-tight">
                      Dashboard Admin BonKu
                    </h2>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-[#dcfce7] border border-[#16a34a] text-[10px] font-mono font-bold text-[#16a34a]">
                      SQLite Lokal: bonku.db
                    </span>
                  </div>
                  <p className="text-xs text-[#5c3e32]">
                    Manajemen Pesanan, Stok Batch PO, dan Rekapitulasi UMKM
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <a
                  href="/api/export/csv"
                  download
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#faeee0] text-[#2a1710] border-2 border-[#2a1710] text-xs font-mono font-bold shadow-[2px_2px_0px_#2a1710] flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Unduh data pesanan ke CSV"
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
                  onClick={onLogout}
                  className="px-2.5 py-1.5 rounded-xl bg-[#fee2e2] hover:bg-[#fca5a5] text-[#dc2626] border-2 border-[#2a1710] text-xs font-mono font-bold shadow-[2px_2px_0px_#2a1710] flex items-center gap-1 cursor-pointer"
                  title="Keluar dari sesi admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-[#faeee0] text-[#2a1710] border-2 border-[#2a1710] flex items-center justify-center shadow-[2px_2px_0px_#2a1710] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b-2 border-[#2a1710] bg-[#fffdf5] px-3 sm:px-5 pt-2 gap-2 overflow-x-auto no-scrollbar">
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
                    className={`px-3 py-2 rounded-t-xl font-mono text-xs font-bold border-t-2 border-x-2 border-[#2a1710] flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-[#fdf3e3] text-[#b2430f] -mb-0.5 pb-2.5'
                        : 'bg-[#faeee0] text-[#5c3e32] hover:bg-[#fdf3e3]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-5">
                  {/* Status Banner */}
                  <div className="p-4 rounded-2xl bg-[#fdf3e3] border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-[#2a1710] uppercase">
                          Batch Aktif:
                        </span>
                        <span className="font-bold text-sm text-[#b2430f]">
                          {batch?.batch_name || '-'}
                        </span>
                      </div>
                      <div className="text-xs text-[#5c3e32] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          Batas Tutup PO: {batch?.end_date ? new Date(batch.end_date).toLocaleString('id-ID') : '-'}
                        </span>
                      </div>
                    </div>

                    <div>
                      {batch?.is_active && !batch?.is_expired ? (
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-[#dcfce7] text-[#15803d] border border-[#15803d] flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#15803d] animate-ping" />
                          FORM PO BUKA
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-[#fee2e2] text-[#b91c1c] border border-[#b91c1c]">
                          FORM PO DITUTUP
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metrik Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] space-y-1">
                      <p className="text-[11px] font-mono text-[#64748b] uppercase">Total Omset</p>
                      <p className="text-lg sm:text-xl font-mono font-black text-[#b2430f]">
                        {formatRupiah(stats?.totalRevenue || 0)}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] space-y-1">
                      <p className="text-[11px] font-mono text-[#64748b] uppercase">Total Pesanan</p>
                      <p className="text-lg sm:text-xl font-mono font-black text-[#2a1710]">
                        {stats?.totalOrders || 0} <span className="text-xs text-[#64748b] font-normal">transaksi</span>
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] space-y-1">
                      <p className="text-[11px] font-mono text-[#64748b] uppercase">Abon Pouch Terjual</p>
                      <p className="text-lg sm:text-xl font-mono font-black text-[#2a1710]">
                        {stats?.totalPouch || 0}{' '}
                        <span className="text-xs text-[#64748b] font-normal">
                          / {batch?.quota_pouch || 50}
                        </span>
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] space-y-1">
                      <p className="text-[11px] font-mono text-[#64748b] uppercase">Roti Abon Terjual</p>
                      <p className="text-lg sm:text-xl font-mono font-black text-[#2a1710]">
                        {stats?.totalRoti || 0}{' '}
                        <span className="text-xs text-[#64748b] font-normal">
                          / {batch?.quota_roti || 30}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Kuota Progress Bar */}
                  <div className="p-4 rounded-2xl bg-white border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] space-y-3">
                    <h3 className="font-mono font-bold text-xs uppercase text-[#2a1710]">
                      Progres Kuota Produksi Batch
                    </h3>

                    {/* Pouch */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span>Abon Ayam Pouch 100g:</span>
                        <span className="font-bold">
                          {stats?.totalPouch || 0} / {batch?.quota_pouch || 50} pouch
                        </span>
                      </div>
                      <div className="w-full h-3 bg-[#faeee0] rounded-full border border-[#2a1710] overflow-hidden">
                        <div
                          className="h-full bg-[#b2430f]"
                          style={{
                            width: `${Math.min(100, (((stats?.totalPouch || 0) / (batch?.quota_pouch || 50)) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Roti */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span>Roti Isi Abon:</span>
                        <span className="font-bold">
                          {stats?.totalRoti || 0} / {batch?.quota_roti || 30} pcs
                        </span>
                      </div>
                      <div className="w-full h-3 bg-[#faeee0] rounded-full border border-[#2a1710] overflow-hidden">
                        <div
                          className="h-full bg-[#f59e0b]"
                          style={{
                            width: `${Math.min(100, (((stats?.totalRoti || 0) / (batch?.quota_roti || 30)) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DAFTAR PESANAN */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {/* Filters & Search */}
                  <div className="flex flex-col sm:flex-row gap-2.5 justify-between">
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
                          className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border-2 border-[#2a1710] cursor-pointer transition-all ${
                            statusFilter === st.id
                              ? 'bg-[#b2430f] text-white shadow-[2px_2px_0px_#2a1710]'
                              : 'bg-white text-[#2a1710] hover:bg-[#faeee0]'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative min-w-50">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#94a3b8]" />
                      <input
                        type="text"
                        placeholder="Cari nama, WA, ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border-2 border-[#2a1710] text-xs font-medium text-[#2a1710] placeholder:text-[#94a3b8] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Orders List */}
                  {orders.length === 0 ? (
                    <div className="py-12 text-center text-xs font-mono text-[#64748b] bg-white rounded-2xl border-2 border-[#2a1710]">
                      Tidak ada pesanan ditemukan.
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {orders.map((order) => {
                        let cleanPhone = order.customer_phone.replace(/\D/g, '');
                        if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
                        const waChatUrl = `https://wa.me/${cleanPhone}`;

                        return (
                          <div
                            key={order.id}
                            className="p-4 rounded-2xl bg-white border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] space-y-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#eadac4]">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-xs text-[#b2430f] bg-[#fdf3e3] px-2 py-0.5 rounded-md border border-[#2a1710]">
                                  {order.id}
                                </span>
                                <span className="font-bold text-xs text-[#2a1710]">
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
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border cursor-pointer ${
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

                            {/* Info & Items */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div>
                                <div className="text-[#64748b]">Rincian Item:</div>
                                <div className="font-medium text-[#2a1710]">
                                  {order.parsedItems && order.parsedItems.length > 0 ? (
                                    order.parsedItems.map((it, idx) => (
                                      <div key={idx}>
                                        • {it.title} x {it.quantity} ({formatRupiah(it.subtotal)})
                                      </div>
                                    ))
                                  ) : (
                                    <span>{order.items}</span>
                                  )}
                                </div>
                                <div className="font-mono font-black text-[#b2430f] mt-1">
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
                                  {order.location_note || '-'}
                                </div>
                                {order.notes && (
                                  <div>
                                    <span className="text-[#64748b]">Catatan:</span> {order.notes}
                                  </div>
                                )}
                                <div className="text-[10px] text-[#94a3b8] font-mono">
                                  {new Date(order.created_at).toLocaleString('id-ID')}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#eadac4]">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[10px] font-mono text-[#64748b]">Ubah Status:</span>
                                {order.status !== 'confirmed' && (
                                  <button
                                    type="button"
                                    onClick={() => handleStatusChange(order.id, 'confirmed')}
                                    className="px-2 py-0.5 rounded-lg bg-[#dbeafe] hover:bg-[#bfdbfe] text-[#1d4ed8] text-[10px] font-mono font-bold border border-[#1d4ed8] cursor-pointer"
                                  >
                                    Konfirmasi
                                  </button>
                                )}
                                {order.status !== 'ready_cod' && (
                                  <button
                                    type="button"
                                    onClick={() => handleStatusChange(order.id, 'ready_cod')}
                                    className="px-2 py-0.5 rounded-lg bg-[#f3e8ff] hover:bg-[#e9d5ff] text-[#7e22ce] text-[10px] font-mono font-bold border border-[#7e22ce] cursor-pointer"
                                  >
                                    Siap COD
                                  </button>
                                )}
                                {order.status !== 'completed' && (
                                  <button
                                    type="button"
                                    onClick={() => handleStatusChange(order.id, 'completed')}
                                    className="px-2 py-0.5 rounded-lg bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#15803d] text-[10px] font-mono font-bold border border-[#15803d] cursor-pointer"
                                  >
                                    Selesai
                                  </button>
                                )}
                                {order.status !== 'cancelled' && (
                                  <button
                                    type="button"
                                    onClick={() => handleStatusChange(order.id, 'cancelled')}
                                    className="px-2 py-0.5 rounded-lg bg-[#fee2e2] hover:bg-[#fecaca] text-[#b91c1c] text-[10px] font-mono font-bold border border-[#b91c1c] cursor-pointer"
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
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: TAMBAH PESANAN MANUAL (OFFLINE) */}
              {activeTab === 'add_order' && (
                <div className="max-w-lg mx-auto bg-white p-5 rounded-2xl border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-mono font-black text-sm text-[#2a1710]">
                      Catat Pesanan Langsung (Offline / COD)
                    </h3>
                    <p className="text-xs text-[#5c3e32]">
                      Gunakan ini untuk memasukkan pesanan yang diterima langsung atau lewat chat WA manual.
                    </p>
                  </div>

                  {manualSuccessMsg && (
                    <div className="p-3 rounded-xl bg-[#dcfce7] border-2 border-[#16a34a] text-[#16a34a] text-xs font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      <span>{manualSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleManualOrderSubmit} className="space-y-3">
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

                    <div className="p-3 rounded-xl bg-[#fdf3e3] border-2 border-[#2a1710] flex justify-between items-center text-xs font-mono font-bold">
                      <span>Total Pesanan:</span>
                      <span className="text-[#b2430f] text-sm">
                        {formatRupiah(manualPouchQty * 18000 + manualRotiQty * 6000)}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingManual}
                      className="w-full py-2.5 rounded-xl bg-[#b2430f] hover:bg-[#993608] text-white font-mono font-black text-xs border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] cursor-pointer"
                    >
                      {submittingManual ? 'Menyimpan...' : 'Simpan ke Database'}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: PENGATURAN BATCH & BATAS WAKTU (DEADLINE) */}
              {activeTab === 'batch_settings' && (
                <div className="max-w-lg mx-auto bg-white p-5 rounded-2xl border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-mono font-black text-sm text-[#2a1710]">
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

                  <form onSubmit={handleSaveBatch} className="space-y-3.5">
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
                        className="w-full mt-1 px-3 py-2 rounded-xl border-2 border-[#2a1710] text-xs font-mono"
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
                          className="w-full mt-1 px-3 py-2 rounded-xl border-2 border-[#2a1710] text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#2a1710]">Kuota Roti Abon</label>
                        <input
                          type="number"
                          min="1"
                          value={quotaRoti}
                          onChange={(e) => setQuotaRoti(parseInt(e.target.value) || 0)}
                          className="w-full mt-1 px-3 py-2 rounded-xl border-2 border-[#2a1710] text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* Override Toggle */}
                    <div className="p-3 rounded-xl bg-[#faeee0] border-2 border-[#2a1710] flex items-center justify-between">
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
                      className="w-full py-2.5 rounded-xl bg-[#b2430f] hover:bg-[#993608] text-white font-mono font-black text-xs border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] cursor-pointer"
                    >
                      {savingBatch ? 'Menyimpan Pengaturan...' : 'Simpan Pengaturan Batch'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
