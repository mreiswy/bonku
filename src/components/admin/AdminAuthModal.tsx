import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, AlertCircle, Delete } from 'lucide-react';
import { verifyAdminPin } from '../../services/apiService';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(null);
      if (nextPin.length === 4) {
        verify(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleClear = () => {
    setPin('');
    setError(null);
  };

  const verify = async (pinToTest: string) => {
    setLoading(true);
    const res = await verifyAdminPin(pinToTest);
    setLoading(false);
    if (res.success) {
      sessionStorage.setItem('bonku_admin_auth', 'true');
      setPin('');
      onSuccess();
    } else {
      setError(res.error || 'PIN salah, coba lagi.');
      setPin('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="relative w-full max-w-xs sm:max-w-sm bg-[#fffdf5] border-3 border-[#2a1710] rounded-3xl shadow-[6px_6px_0px_#2a1710] overflow-hidden z-10 p-5 space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#eadac4]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#b2430f] border-2 border-[#2a1710] flex items-center justify-center text-white shadow-[2px_2px_0px_#2a1710]">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="font-mono font-black text-sm text-[#2a1710]">
                  Autentikasi Admin
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white hover:bg-[#faeee0] text-[#2a1710] border-2 border-[#2a1710] flex items-center justify-center shadow-[1px_1px_0px_#2a1710] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center space-y-1">
              <p className="text-xs text-[#5c3e32]">
                Masukkan 4-digit PIN Pengelola BonKu
              </p>
              <p className="text-[10px] font-mono text-[#94a3b8]">
                (PIN bawaan pengujian: 1234)
              </p>
            </div>

            {/* PIN Dots Display */}
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

            {error && (
              <div className="p-2.5 rounded-xl bg-[#fee2e2] border-2 border-[#dc2626] text-[#dc2626] text-xs font-medium flex items-center justify-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  disabled={loading}
                  onClick={() => handleDigit(digit)}
                  className="py-3 rounded-2xl bg-white hover:bg-[#fdf3e3] active:bg-[#fde047] text-[#2a1710] border-2 border-[#2a1710] font-mono font-black text-base shadow-[2px_2px_0px_#2a1710] transition-transform active:translate-y-0.5 cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                disabled={loading || pin.length === 0}
                className="py-3 rounded-2xl bg-[#f8fafc] hover:bg-[#fee2e2] text-[#64748b] hover:text-[#dc2626] border-2 border-[#2a1710] font-mono font-bold text-xs shadow-[2px_2px_0px_#2a1710] cursor-pointer disabled:opacity-40"
              >
                C
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDigit('0')}
                className="py-3 rounded-2xl bg-white hover:bg-[#fdf3e3] active:bg-[#fde047] text-[#2a1710] border-2 border-[#2a1710] font-mono font-black text-base shadow-[2px_2px_0px_#2a1710] transition-transform active:translate-y-0.5 cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading || pin.length === 0}
                className="py-3 rounded-2xl bg-[#f8fafc] hover:bg-[#fee2e2] text-[#2a1710] border-2 border-[#2a1710] flex items-center justify-center shadow-[2px_2px_0px_#2a1710] cursor-pointer disabled:opacity-40"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>

            {loading && (
              <div className="text-center text-xs font-mono text-[#b2430f] animate-pulse">
                Memverifikasi...
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
