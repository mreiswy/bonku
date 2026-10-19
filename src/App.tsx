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

export function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  useLenisSmoothScroll();

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-svh bg-[#fdf3e3] text-[#2a1710] selection:bg-[#e2571a] selection:text-white">
      {showWelcome && (
        <WelcomeAnimation onComplete={() => setShowWelcome(false)} />
      )}

      <a href="#main" className="skip-link">
        Lewati ke konten utama
      </a>

      <NavigationBar />

      <main id="main" className="relative">
        <HeroSection />
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
      />
      </div>
    </MotionConfig>
  );
}

export default App;
