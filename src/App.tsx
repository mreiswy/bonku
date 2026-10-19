import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import type { Project } from './types/bonku';
import { useLenisSmoothScroll } from './hooks/useLenisSmoothScroll';
import { NavigationBar } from './components/navigation/NavigationBar';
import { HeroSection } from './components/hero/HeroSection';
import { WelcomeAnimation } from './components/hero/WelcomeAnimation';
import { AboutProduct } from './components/about/AboutProduct';
import { ProductShowcase } from './components/products/ProductShowcase';
import { MarketingGrid } from './components/marketing/MarketingGrid';
import { OrderTimeline } from './components/order/OrderTimeline';
import { ContactSection } from './components/contact/ContactSection';
import { ProductDetailModal } from './components/products/ProductDetailModal';
import { QuickOrderModal } from './components/order/QuickOrderModal';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';

export function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  // Quick Order & Admin Modal States
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [quickOrderProductId, setQuickOrderProductId] = useState<string | undefined>(undefined);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  useLenisSmoothScroll();

  const handleOpenQuickOrder = (productId?: string) => {
    setQuickOrderProductId(productId);
    setIsQuickOrderOpen(true);
  };

  const handleOpenAdmin = () => {
    const isAuthed = sessionStorage.getItem('bonku_admin_auth') === 'true';
    if (isAuthed) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminAuthOpen(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthOpen(false);
    setIsAdminDashboardOpen(true);
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('bonku_admin_auth');
    setIsAdminDashboardOpen(false);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-svh bg-[#fdf3e3] text-[#2a1710] selection:bg-[#b2430f] selection:text-white">
        {showWelcome && (
          <WelcomeAnimation onComplete={() => setShowWelcome(false)} />
        )}

        <a href="#main" className="skip-link">
          Lewati ke konten utama
        </a>

        <NavigationBar />

        <main id="main" className="relative">
          <HeroSection onOpenQuickOrder={() => handleOpenQuickOrder()} />
          <AboutProduct />
          <ProductShowcase onOpenProject={setActiveModalProject} />
          <MarketingGrid />
          <OrderTimeline />
          <ContactSection onOpenAdmin={handleOpenAdmin} />
        </main>

        <ProductDetailModal
          project={activeModalProject}
          isOpen={!!activeModalProject}
          onClose={() => setActiveModalProject(null)}
          onOpenQuickOrder={handleOpenQuickOrder}
        />

        <QuickOrderModal
          isOpen={isQuickOrderOpen}
          onClose={() => setIsQuickOrderOpen(false)}
          initialProductId={quickOrderProductId}
        />

        <AdminAuthModal
          isOpen={isAdminAuthOpen}
          onClose={() => setIsAdminAuthOpen(false)}
          onSuccess={handleAdminAuthSuccess}
        />

        <AdminDashboardModal
          isOpen={isAdminDashboardOpen}
          onClose={() => setIsAdminDashboardOpen(false)}
          onLogout={handleAdminLogout}
        />
      </div>
    </MotionConfig>
  );
}

export default App;
