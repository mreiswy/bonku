import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import type { Project } from './types/bonku';
import { useLenisSmoothScroll } from './hooks/useLenisSmoothScroll';
import { usePageRouter } from './hooks/usePageRouter';
import { NavigationBar } from './components/navigation/NavigationBar';
import { HeroSection } from './components/hero/HeroSection';
import { WelcomeAnimation } from './components/hero/WelcomeAnimation';
import { AboutProduct } from './components/about/AboutProduct';
import { ProductShowcase } from './components/products/ProductShowcase';
import { MarketingGrid } from './components/marketing/MarketingGrid';
import { OrderTimeline } from './components/order/OrderTimeline';
import { ContactSection } from './components/contact/ContactSection';
import { ProductDetailModal } from './components/products/ProductDetailModal';
import { OrderPage } from './pages/OrderPage';

export function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [quickOrderProductId, setQuickOrderProductId] = useState<string | undefined>(undefined);

  const { currentRoute, navigateTo } = usePageRouter();

  useLenisSmoothScroll();

  const handleOpenOrderPage = (productId?: string) => {
    setQuickOrderProductId(productId);
    navigateTo('order');
  };

  // 1. TAMPILAN HALAMAN PEMESANAN (ORDER PAGE - TERHUBUNG KE SPS)
  if (currentRoute === 'order') {
    return (
      <MotionConfig reducedMotion="user">
        <OrderPage
          onNavigateHome={() => navigateTo('home')}
          initialProductId={quickOrderProductId}
        />
      </MotionConfig>
    );
  }

  // 2. TAMPILAN HALAMAN UTAMA (LANDING PAGE)
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
          <HeroSection onOpenQuickOrder={() => handleOpenOrderPage()} />
          <AboutProduct />
          <ProductShowcase onOpenProject={setActiveModalProject} />
          <MarketingGrid />
          <OrderTimeline />
          <ContactSection />
        </main>

        <ProductDetailModal
          project={activeModalProject}
          isOpen={!!activeModalProject}
          onClose={() => setActiveModalProject(null)}
          onOpenQuickOrder={(productId) => handleOpenOrderPage(productId)}
        />
      </div>
    </MotionConfig>
  );
}

export default App;
