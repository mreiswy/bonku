import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { profileData } from '../../data/bonkuData';
import { BrandLogo } from '../common/BrandLogo';

const navItems = [
  { label: 'Tentang', id: 'about' },
  { label: 'Produk', id: 'products' },
  { label: 'Keunggulan', id: 'stack' },
  { label: 'Cara Pesan', id: 'journey' },
  // { label: 'Kontak', id: 'contact' }
];

export const NavigationBar: React.FC = () => {
  const { isScrolled, scrollToSection } = useScrollPosition();
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
    const handleResize = () => updatePill(activeSection);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeSection]);

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

    if (manualClickTimerRef.current) clearTimeout(manualClickTimerRef.current);
    manualClickTimerRef.current = setTimeout(() => {
      isManualClickRef.current = false;
    }, 850);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#8a3410]/95 backdrop-blur-xl border-b border-[#f6a83c]/35 pt-2 pb-1.5 sm:py-3 shadow-[0_8px_32px_rgba(138,52,16,0.45)]'
          : 'bg-[#8a3410]/90 backdrop-blur-xl border-b border-[#f6a83c]/30 pt-2 pb-1.5 shadow-md md:bg-transparent md:border-b-0 md:shadow-none md:py-4 sm:md:py-5'
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

        {/* Desktop pill navigation */}
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

        {/* Desktop actions */}
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

        {/* Mobile top-right action (WhatsApp) */}
        <div className="md:hidden flex items-center gap-2">
          <a
            href={profileData.contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f6a83c] border border-white/40 text-[#2a1710] active:scale-95 transition-transform backdrop-blur-md shadow-sm font-mono text-xs font-bold"
            aria-label="Chat WhatsApp BonKu"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Contact</span>
          </a>
        </div>
      </div>

      {/* Mobile Sub-Navbar: Horizontal Scrollable Bar tepat di bawah navbar */}
      <div className="md:hidden w-full overflow-x-auto no-scrollbar pt-2 pb-1.5 px-4 flex items-center gap-1.5 border-t border-[#f6a83c]/20">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#f6a83c] text-[#2a1710] font-bold shadow-sm'
                  : 'bg-white/15 hover:bg-white/20 text-white/95 border border-white/20'
              }`}
            >
              {item.label}
            </button>
          );
        })}
        <a
          href="#pesan"
          className="shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold whitespace-nowrap bg-[#fde047] text-[#2a1710] shadow-sm active:scale-95 transition-all"
        >
          <ShoppingBag className="w-3 h-3" />
          <span>Pesan PO</span>
        </a>
      </div>
    </header>
  );
};
