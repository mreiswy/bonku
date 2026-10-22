import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  ArrowLeft,
  Sparkles,
  Clock,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Sliders,
  FileSpreadsheet,
  ShieldCheck,
  KeyRound,
  ExternalLink,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';
import { profileData } from '../data/bonkuData';
import {
  getFormConfig,
  saveFormConfig,
  verifyAdminPin,
  changeAdminPin,
  type FormConfig,
} from '../services/configService';

interface AdminDashboardPageProps {
  onNavigateHome: () => void;
  onNavigateOrder?: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigateHome,
  onNavigateOrder,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('bonku_admin_auth') === 'true';
  });

  const [inputPin, setInputPin] = useState('');
  const [showLoginPin, setShowLoginPin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'config' | 'sps' | 'security'>('config');

  const [formConfig, setFormConfig] = useState<FormConfig>(getFormConfig);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(true);
  const [orderMode, setOrderMode] = useState<'po' | 'reguler'>('po');
  const [batchName, setBatchName] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quotaPouch, setQuotaPouch] = useState(50);
  const [quotaRoti, setQuotaRoti] = useState(30);
  const [closedMessage, setClosedMessage] = useState('');

  const [savingConfig, setSavingConfig] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showOldPin, setShowOldPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [pinChangeMsg, setPinChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const cfg = getFormConfig();
    setFormConfig(cfg);
    setIsFormOpen(cfg.isFormOpen);
    setOrderMode(cfg.orderMode);
    setBatchName(cfg.batchName);
    setEndDate(cfg.endDate);
    setQuotaPouch(cfg.quotaPouch);
    setQuotaRoti(cfg.quotaRoti);
    setClosedMessage(cfg.closedMessage);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (verifyAdminPin(inputPin)) {
      sessionStorage.setItem('bonku_admin_auth', 'true');
      setIsAuthenticated(true);
      setInputPin('');
    } else {
      setLoginError('PIN Admin salah. Default pengujian: 1234');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('bonku_admin_auth');
    setIsAuthenticated(false);
    setInputPin('');
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    setSaveSuccessMsg(null);

    try {
      const updated = await saveFormConfig({
        isFormOpen,
        orderMode,
        batchName: batchName.trim(),
        endDate,
        quotaPouch,
        quotaRoti,
        closedMessage: closedMessage.trim(),
      });
      setFormConfig(updated);
      setSaveSuccessMsg('Konfigurasi form dan mode PO berhasil disimpan!');
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    } catch {
      alert('Gagal menyimpan konfigurasi.');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeMsg(null);

    if (newPin !== confirmPin) {
      setPinChangeMsg({ type: 'error', text: 'Konfirmasi PIN baru tidak cocok.' });
      return;
    }

    const res = changeAdminPin(oldPin, newPin);
    if (res.success) {
      setPinChangeMsg({
        type: 'success',
        text: 'PIN Admin berhasil diperbarui! Gunakan PIN baru ini untuk sesi berikutnya.',
      });
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
    } else {
      setPinChangeMsg({ type: 'error', text: res.error || 'Gagal mengubah PIN.' });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fdf3e3] text-[#2a1710] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md bg-[#fffdf5] border-3 border-[#2a1710] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#2a1710] space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#fde047] border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] flex items-center justify-center">
              <Lock className="w-7 h-7 text-[#b2430f]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#2a1710]">
              Portal Konfigurasi BonKu
            </h1>
            <p className="text-xs text-[#5c3e32]">
              Masukkan PIN Admin untuk mengubah status on/off form &amp; mode PO.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-mono font-bold text-[#2a1710] block mb-1.5">
                PIN Admin:
              </label>
              <div className="relative">
                <input
                  type={showLoginPin ? 'text' : 'password'}
                  inputMode="numeric"
                  autoFocus
                  required
                  maxLength={8}
                  value={inputPin}
                  onChange={(e) => setInputPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Masukkan 4-digit PIN..."
                  className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-[#2a1710] bg-white text-sm font-mono font-bold tracking-widest text-[#2a1710] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#b2430f]"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPin(!showLoginPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#2a1710] cursor-pointer"
                >
                  {showLoginPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-[#64748b] mt-1.5">
                * PIN bawaan pengujian: <span className="font-mono font-bold text-[#b2430f]">1234</span>
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-[#fee2e2] border-2 border-[#dc2626] text-[#dc2626] text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-2.5 pt-1">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#b2430f] hover:bg-[#993608] text-white font-mono font-black text-xs sm:text-sm border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] cursor-pointer transition-transform active:translate-y-0.5"
              >
                Masuk Konfigurasi
              </button>

              <button
                type="button"
                onClick={onNavigateHome}
                className="w-full py-2.5 rounded-2xl bg-white hover:bg-[#faeee0] text-[#2a1710] font-mono font-bold text-xs border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf3e3] text-[#2a1710] pb-20 selection:bg-[#b2430f] selection:text-white">
      <header className="sticky top-0 z-30 bg-[#fdf3e3]/95 backdrop-blur-md border-b-3 border-[#2a1710] px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <BrandLogo />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-mono font-black text-base sm:text-lg text-[#2a1710] leading-tight">
                  Pengaturan Form &amp; Mode
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] border border-[#16a34a] font-bold hidden sm:inline-block">
                  SPS Connected
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#5c3e32]">
                Kontrol saklar on/off form & mode BonKu &bull; Terakhir: {formConfig.updatedAt ? new Date(formConfig.updatedAt).toLocaleTimeString() : '-'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateOrder && (
              <button
                type="button"
                onClick={onNavigateOrder}
                className="px-3 py-1.5 rounded-xl bg-[#fde047] hover:bg-[#facc15] text-[#2a1710] border-2 border-[#2a1710] font-mono font-bold text-xs shadow-[2px_2px_0px_#2a1710] flex items-center gap-1.5 cursor-pointer hidden sm:flex"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Lihat Form (/pesan)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onNavigateHome}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#faeee0] text-[#2a1710] border-2 border-[#2a1710] font-mono font-bold text-xs shadow-[2px_2px_0px_#2a1710] flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Beranda</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#fee2e2] hover:bg-[#fecaca] text-[#dc2626] border-2 border-[#2a1710] font-mono font-bold text-xs shadow-[2px_2px_0px_#2a1710] flex items-center gap-1.5 cursor-pointer"
              title="Keluar dari sesi admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-6 sm:pt-8 space-y-6">
        <div className="flex gap-2 p-1.5 rounded-2xl bg-white border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710]">
          <button
            type="button"
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-mono font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'config'
                ? 'bg-[#b2430f] text-white shadow-[2px_2px_0px_#2a1710]'
                : 'text-[#2a1710] hover:bg-[#fdf3e3]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Kontrol Form &amp; Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sps')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-mono font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'sps'
                ? 'bg-[#b2430f] text-white shadow-[2px_2px_0px_#2a1710]'
                : 'text-[#2a1710] hover:bg-[#fdf3e3]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Integrasi SPS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-mono font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-[#b2430f] text-white shadow-[2px_2px_0px_#2a1710]'
                : 'text-[#2a1710] hover:bg-[#fdf3e3]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Keamanan PIN</span>
          </button>
        </div>

        {activeTab === 'config' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#fffdf5] border-3 border-[#2a1710] rounded-3xl p-5 sm:p-7 shadow-[6px_6px_0px_#2a1710] space-y-6"
          >
            <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        isFormOpen ? 'bg-[#16a34a] animate-pulse' : 'bg-[#dc2626]'
                      }`}
                    />
                    <h2 className="font-mono font-black text-sm sm:text-base text-[#2a1710]">
                      Status Form Pemesanan: {isFormOpen ? 'BUKA (ON)' : 'TUTUP (OFF)'}
                    </h2>
                  </div>
                  <p className="text-[11px] text-[#64748b] mt-1">
                    {isFormOpen
                      ? 'Formulir di halaman web saat ini aktif menerima pesanan dari pelanggan.'
                      : 'Formulir saat ini terkunci / ditutup bagi umum dan pelanggan akan diarahkan ke WhatsApp.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFormOpen(!isFormOpen)}
                  className={`px-4 py-2.5 rounded-xl font-mono text-xs font-black border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] cursor-pointer transition-transform active:translate-y-0.5 shrink-0 ${
                    isFormOpen
                      ? 'bg-[#dcfce7] text-[#15803d] hover:bg-[#bbf7d0]'
                      : 'bg-[#fee2e2] text-[#b91c1c] hover:bg-[#fecaca]'
                  }`}
                >
                  {isFormOpen ? 'Matikan (Tutup Form)' : 'Aktifkan (Buka Form)'}
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-mono font-black text-[#2a1710] uppercase block">
                  Pilih Mode Pemesanan:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderMode('po')}
                    className={`p-4 rounded-2xl border-2 border-[#2a1710] text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                      orderMode === 'po'
                        ? 'bg-[#fff7ed] shadow-[3px_3px_0px_#2a1710] ring-2 ring-[#b2430f]'
                        : 'bg-white hover:bg-[#faeee0]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-[#b2430f]">
                        <Clock className="w-4 h-4" />
                        <span>Mode PO Batch</span>
                      </div>
                      {orderMode === 'po' && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#b2430f]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#5c3e32] leading-snug">
                      Pre-Order berjadwal dengan countdown timer batas waktu penutupan PO dan kuota pesanan.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderMode('reguler')}
                    className={`p-4 rounded-2xl border-2 border-[#2a1710] text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                      orderMode === 'reguler'
                        ? 'bg-[#f0fdf4] shadow-[3px_3px_0px_#2a1710] ring-2 ring-[#15803d]'
                        : 'bg-white hover:bg-[#faeee0]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-[#15803d]">
                        <Sparkles className="w-4 h-4 text-[#16a34a]" />
                        <span>Mode Day Biasa (Ready Stock)</span>
                      </div>
                      {orderMode === 'reguler' && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#15803d]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#5c3e32] leading-snug">
                      Ready stock harian tanpa countdown batas waktu, siap pesan kapan saja selama status Buka.
                    </p>
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-1">
                <div>
                  <label className="text-xs font-bold text-[#2a1710]">
                    {orderMode === 'po' ? 'Nama Batch PO' : 'Label Form / Nama Banner'}
                  </label>
                  <input
                    type="text"
                    required
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    placeholder={
                      orderMode === 'po'
                        ? 'Contoh: PO Batch 1 — Spesial Pekan Ini'
                        : 'Contoh: Pesanan Harian (Ready Stock)'
                    }
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl border-2 border-[#2a1710] bg-white text-xs sm:text-sm font-medium"
                  />
                </div>

                {orderMode === 'po' ? (
                  <div>
                    <label className="text-xs font-bold text-[#2a1710] flex items-center justify-between">
                      <span>Batas Waktu Penutupan PO (Waktu Habis) *</span>
                      <span className="text-[10px] text-[#64748b]">Waktu Indonesia (WIB)</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl border-2 border-[#2a1710] bg-white text-xs sm:text-sm font-mono font-bold"
                    />
                    <p className="text-[10px] text-[#64748b] mt-1">
                      * Saat tanggal &amp; jam ini tercapai, form otomatis tertutup bagi pelanggan dan dialihkan ke WhatsApp.
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-[#f0fdf4] border border-[#16a34a] text-xs text-[#15803d] flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-[#16a34a]" />
                    <div>
                      <span className="font-bold">Mode Day Biasa Aktif:</span>
                      <p className="text-[11px] text-[#166534] mt-0.5">
                        Formulir tidak memakai countdown waktu dan akan selalu aktif menerima pesanan selama saklar di atas berstatus <strong>BUKA</strong>.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#2a1710]">
                      {orderMode === 'po' ? 'Target Kuota Pouch' : 'Kapasitas Harian Pouch'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quotaPouch}
                      onChange={(e) => setQuotaPouch(parseInt(e.target.value) || 0)}
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl border-2 border-[#2a1710] bg-white text-xs sm:text-sm font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#2a1710]">
                      {orderMode === 'po' ? 'Target Kuota Roti' : 'Kapasitas Harian Roti'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quotaRoti}
                      onChange={(e) => setQuotaRoti(parseInt(e.target.value) || 0)}
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl border-2 border-[#2a1710] bg-white text-xs sm:text-sm font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2a1710]">
                    Pesan Saat Form Ditutup / Waktu Habis
                  </label>
                  <textarea
                    rows={3}
                    value={closedMessage}
                    onChange={(e) => setClosedMessage(e.target.value)}
                    placeholder="Tuliskan pesan penjelas untuk pelanggan saat form ditutup..."
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl border-2 border-[#2a1710] bg-white text-xs sm:text-sm"
                  />
                </div>
              </div>

              {saveSuccessMsg && (
                <div className="p-3 rounded-xl bg-[#dcfce7] border-2 border-[#16a34a] text-[#15803d] text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={savingConfig}
                className="w-full py-3.5 rounded-2xl bg-[#b2430f] hover:bg-[#993608] disabled:opacity-50 text-white font-mono font-black text-xs sm:text-sm border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] cursor-pointer transition-transform active:translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{savingConfig ? 'Menyimpan Pengaturan...' : 'Simpan Pengaturan Form & Mode'}</span>
              </button>
            </form>
          </motion.div>
        )}

        {activeTab === 'sps' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#fffdf5] border-3 border-[#2a1710] rounded-3xl p-5 sm:p-7 shadow-[6px_6px_0px_#2a1710] space-y-5"
          >
            <div className="flex items-center gap-2.5 border-b-2 border-[#eadac4] pb-3">
              <div className="p-2.5 rounded-xl bg-[#dcfce7] border-2 border-[#2a1710]">
                <FileSpreadsheet className="w-5 h-5 text-[#15803d]" />
              </div>
              <div>
                <h2 className="font-mono font-black text-sm sm:text-base text-[#2a1710]">
                  Koneksi Google Spreadsheet (SPS)
                </h2>
                <p className="text-xs text-[#5c3e32]">
                  Setiap pesanan di form web langsung dikirim ke spreadsheet tanpa server perantara
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-[#2a1710] space-y-3">
              <span className="text-xs font-mono font-bold text-[#5c3e32] uppercase">
                URL Webhook Apps Script Aktif:
              </span>
              <div className="p-3 rounded-xl bg-[#fdf3e3] border border-[#2a1710]/30 font-mono text-[11px] text-[#2a1710] break-all select-all">
                {profileData.contact.spreadsheetWebhookUrl ||
                  '(Belum diatur di src/data/bonkuData.ts)'}
              </div>
              <p className="text-[11px] text-[#64748b]">
                Untuk mengganti URL Webhook ini, ubah properti{' '}
                <code className="bg-[#fee2e2] px-1.5 py-0.5 rounded text-[#b2430f] font-mono">
                  spreadsheetWebhookUrl
                </code>{' '}
                pada file <code className="font-bold">src/data/bonkuData.ts</code>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#fff7ed] border border-[#ea580c]/30 text-xs text-[#7c2d12] space-y-2">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#b2430f]" />
                <span>Alur Kerja Bebas Server (Serverless):</span>
              </span>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-[#9a3412]">
                <li>Pelanggan mengisi form produk &amp; data kontak di web.</li>
                <li>Data dikirim instan melalui Webhook ke baris Google Spreadsheet Anda.</li>
                <li>Pelanggan langsung diarahkan ke chat WhatsApp dengan pesan rincian otomatis.</li>
              </ol>
            </div>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#fffdf5] border-3 border-[#2a1710] rounded-3xl p-5 sm:p-7 shadow-[6px_6px_0px_#2a1710] space-y-5"
          >
            <div className="flex items-center gap-2.5 border-b-2 border-[#eadac4] pb-3">
              <div className="p-2.5 rounded-xl bg-[#fef3c7] border-2 border-[#2a1710]">
                <KeyRound className="w-5 h-5 text-[#b2430f]" />
              </div>
              <div>
                <h2 className="font-mono font-black text-sm sm:text-base text-[#2a1710]">
                  Keamanan Akses Dashboard
                </h2>
                <p className="text-xs text-[#5c3e32]">
                  Perbarui 4-digit PIN untuk mengamankan akses ke pengaturan form BonKu
                </p>
              </div>
            </div>

            {pinChangeMsg && (
              <div
                className={`p-3 rounded-xl border-2 text-xs font-medium flex items-center gap-2 ${
                  pinChangeMsg.type === 'success'
                    ? 'bg-[#dcfce7] border-[#16a34a] text-[#15803d]'
                    : 'bg-[#fee2e2] border-[#dc2626] text-[#dc2626]'
                }`}
              >
                {pinChangeMsg.type === 'success' ? (
                  <Check className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{pinChangeMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#2a1710]">PIN Saat Ini (Lama) *</label>
                <div className="relative mt-1">
                  <input
                    type={showOldPin ? 'text' : 'password'}
                    required
                    inputMode="numeric"
                    value={oldPin}
                    onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Masukkan PIN lama..."
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border-2 border-[#2a1710] bg-white text-xs font-mono font-bold tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPin(!showOldPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#2a1710] cursor-pointer"
                  >
                    {showOldPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#2a1710]">PIN Baru * (Minimal 4 angka)</label>
                <div className="relative mt-1">
                  <input
                    type={showNewPin ? 'text' : 'password'}
                    required
                    inputMode="numeric"
                    maxLength={8}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Masukkan PIN baru..."
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border-2 border-[#2a1710] bg-white text-xs font-mono font-bold tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPin(!showNewPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#2a1710] cursor-pointer"
                  >
                    {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#2a1710]">Konfirmasi PIN Baru *</label>
                <div className="relative mt-1">
                  <input
                    type={showConfirmPin ? 'text' : 'password'}
                    required
                    inputMode="numeric"
                    maxLength={8}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ketik ulang PIN baru..."
                    className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border-2 bg-white text-xs font-mono font-bold tracking-widest ${
                      confirmPin && confirmPin !== newPin ? 'border-[#dc2626]' : 'border-[#2a1710]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#2a1710] cursor-pointer"
                  >
                    {showConfirmPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!oldPin || !newPin || newPin.length < 4 || newPin !== confirmPin}
                className="w-full py-3.5 rounded-2xl bg-[#b2430f] hover:bg-[#993608] disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono font-black text-xs sm:text-sm border-2 border-[#2a1710] shadow-[3px_3px_0px_#2a1710] cursor-pointer transition-transform active:translate-y-0.5 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Perbarui PIN Admin</span>
              </button>
            </form>
          </motion.div>
        )}
      </main>
    </div>
  );
};
