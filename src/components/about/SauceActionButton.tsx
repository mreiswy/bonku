import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, Wrench, RefreshCw } from 'lucide-react';

interface SauceActionButtonProps {
  floodState: 'pristine' | 'flooding' | 'flooded' | 'rebuilding';
  rebuildProgress: number;
  onTriggerFlood: () => void;
  onTriggerRebuild: () => void;
}

export const SauceActionButton: React.FC<SauceActionButtonProps> = ({
  floodState,
  rebuildProgress,
  onTriggerFlood,
  onTriggerRebuild
}) => {
  return (
    <div className="flex items-center gap-3 min-h-[42px]">
      <AnimatePresence mode="wait" initial={false}>
        {floodState === 'pristine' && (
          <motion.button
            key="btn-flood-action"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            type="button"
            onClick={onTriggerFlood}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#e2571a] hover:bg-[#b2430f] text-white text-xs font-mono font-bold shadow-lg shadow-[#e2571a]/20 transition-all cursor-pointer hover:scale-105 active:scale-95 group"
            title="Siram konten dengan saus bumbu"
                      >
                        <Waves className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        <span>Siram Saus</span>
                      </motion.button>
                    )}

                    {(floodState === 'flooding' || floodState === 'flooded') && (
                      <motion.button
                        key="btn-rebuild-action"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                        type="button"
                        disabled={floodState === 'flooding'}
                        onClick={onTriggerRebuild}
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#f59e0b] hover:bg-[#d97706] text-white text-xs font-mono font-bold shadow-lg shadow-[#f59e0b]/25 transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                          floodState === 'flooding' ? 'opacity-85 cursor-wait' : ''
                        }`}
                        title="Susun ulang dan rapikan kembali tampilan"
                      >
                        <Wrench className="w-4 h-4" />
                        <span>Susun Ulang</span>
                      </motion.button>
                    )}

                    {floodState === 'rebuilding' && (
                      <motion.div
                        key="btn-rebuilding-hud"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#fffdf5] border border-[#e8d3bd] shadow-md"
                      >
                        <RefreshCw className="w-4 h-4 text-[#f59e0b] animate-spin" />
                        <div className="text-xs font-mono font-bold text-[#2a1710]">
                          Menyusun {rebuildProgress}%
                        </div>
                      </motion.div>
                    )}
      </AnimatePresence>
    </div>
  );
};
