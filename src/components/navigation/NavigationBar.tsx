import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle, ShoppingBag } from 'lucide-react';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { profileData } from '../../data/bonkuData';
import { BrandLogo } from '../common/BrandLogo';

const navItems = [
  { label: 'Tentang', id: 'about' },
  { label: 'Produk', id: 'products' },
  { label: 'Keunggulan', id: 'stack' },
  { label: 'Cara Pesan', id: 'journey' },
  { label: 'Kontak', id: 'contact' }
];

export const NavigationBar: React.FC = () => {
  const { isScrolled, scrollToSection } = useScrollPosition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('about');

  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const isManualClickRef = useRef<boolean>(false);
  const manualClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updatePill = (sectionId: string) => {
    const el = tabRefs.current[sectionId];
    if (el) {
      setPillStyle({
        left: el.offsetLeft,
        width: el.offsetWidth
      });
    }
  };

  useEffect(() => {
    updatePill(activeSection);
  }, [activeSection]);

  useEffect(() => {
    const handleResize = () => {
      updatePill(activeSection);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeSection]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (isManualClickRef.current) return;

      const scrollPosition = window.scrollY + 240;
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;

      if (isAtBottom) {
        setActiveSection('contact');
        return;
      }

      for (let i = navItems.length - 1; i >= 0; i--) {
        const item = navItems[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    isManualClickRef.current = true;
    setActiveSection(id);
    updatePill(id);
    scrollToSection(id);
    setMobileMenuOpen(false);

    if (manualClickTimerRef.current) clearTimeout(manualClickTimerRef.current);
    manualClickTimerRef.current = setTimeout(() => {
      isManualClickRef.current = false;
    }, 850);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 md:fixed md:top-0 md:left-0 md:right-0 ${
          isScrolled
            ? 'bg-[#8a3410]/95 backdrop-blur-xl border-b border-[#f6a83c]/35 py-2.5 sm:py-3 shadow-[0_8px_32px_rgba(138,52,16,0.45)]'
            : 'bg-[#8a3410]/95 backdrop-blur-xl border-b border-[#f6a83c]/35 py-3 shadow-[0_4px_20px_rgba(42,23,16,0.3)] md:bg-transparent md:border-transparent md:shadow-none md:py-4 sm:md:py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-left group cursor-pointer"
          >
            <BrandLogo size="md" withText />
          </button>

          <nav className="hidden md:flex items-center relative bg-white/15 hover:bg-white/20 border border-white/30 p-1.5 rounded-full backdrop-blur-xl shadow-[0_4px_24px_rgba(226,87,26,0.2)] transition-all">
            {pillStyle.width > 0 && (
              <div
                className="absolute top-1.5 bottom-1.5 rounded-full bg-white/25 border border-white/40 shadow-inner pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  left: `${pillStyle.left}px`,
                  width: `${pillStyle.width}px`
                }}
              >
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#fdf3e3] shadow-[0_0_6px_#fdf3e3]" />
              </div>
            )}

            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabRefs.current[item.id] = el;
                  }}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className="relative z-10 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer group select-none"
                >
                  <span
                    className={`block wave-text-half ${
                      isActive ? 'is-active' : ''
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="#pesan"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/35 text-xs font-mono font-bold text-white shadow-sm transition-all backdrop-blur-xl cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Pesan PO</span>
            </a>
            <a
              href={profileData.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#f6a83c] hover:bg-[#f8bf72] border border-white/40 text-xs font-mono font-bold text-[#2a1710] shadow-md transition-all backdrop-blur-xl cursor-pointer group active:scale-95"
              title="Chat WhatsApp BonKu"
            >
              <MessageCircle className="w-3.5 h-3.5 group-hover:rotate-6 transition-transform" />
              <span>Contact</span>
            </a>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <a
              href={profileData.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#f6a83c] border border-white/40 text-[#2a1710] active:scale-95 transition-transform backdrop-blur-md shadow-sm"
              aria-label="Chat WhatsApp BonKu"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs font-bold">Contact</span>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white/15 hover:bg-white/20 border border-white/30 text-white active:scale-95 transition-transform backdrop-blur-md shadow-sm cursor-pointer"
              aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="md:hidden border-t border-[#f6a83c]/25 mt-3 pt-3 pb-4 px-4 sm:px-6 max-h-[calc(100svh-68px)] overflow-y-auto"
            >
              <div className="flex flex-col gap-1.5">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#f6a83c] text-[#2a1710] font-bold shadow-sm'
                          : 'text-white hover:text-[#fdf3e3] hover:bg-white/10 font-medium'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-[#2a1710]" />
                      )}
                    </button>
                  );
                })}

                <div className="grid grid-cols-2 gap-2 mt-2 pt-2.5 border-t border-white/15">
                  <a
                    href="#pesan"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#f6a83c] hover:bg-[#f8bf72] text-[#2a1710] text-xs font-mono font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Pesan PO</span>
                  </a>
                  <a
                    href={profileData.contact.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-mono font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Backdrop saat menu hamburger mobile terbuka */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
};
