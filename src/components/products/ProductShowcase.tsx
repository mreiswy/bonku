import React, { useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import type { Project, ProjectCategory } from '../../types/bonku';
import { projectsData } from '../../data/bonkuData';
import { ProductDock } from './ProductDock';
import { AnimatedSauceSlideBackground } from './AnimatedSauceSlideBackground';

interface ProductShowcaseProps {
  onOpenProject?: (project: Project) => void;
}

/**
 * Katalog produk dengan animasi scroll: section di-pin 1 layar, lalu panel
 * katalog naik dari bawah menimpa layar (curtain wipe) mengikuti scroll.
 */
export const ProductShowcase: React.FC<ProductShowcaseProps> = ({ onOpenProject }) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');

  const handleSelect = onOpenProject || (() => {});

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 20,
    mass: 0.3,
    restDelta: 0.0005
  });

  // curtain wipe: katalog naik dari bawah menimpa layar
  const yDock = useTransform(smoothProgress, [0.15, 0.75], ['100%', '0%'], { clamp: true });
  const coverOpacity = useTransform(smoothProgress, [0.1, 0.55], [1, 0], { clamp: true });

  return (
    <section id="products" ref={containerRef} className="relative h-[220vh] select-none bg-[#8a3410]">
      {/* pinned viewport stage */}
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* latar saus bumbu, terlihat sebelum katalog menimpa */}
        <AnimatedSauceSlideBackground depthLevel={4} />

        <motion.div
          style={{ opacity: coverOpacity }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-4 text-center"
        >
          <span className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider text-[#2a1710] bg-[#fde047] px-2.5 py-1 rounded-lg border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710]">
            01 // KATALOG PRODUK
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-[#fdf3e3] tracking-tight drop-shadow-md">
            Pilih Produk BonKu
          </h3>
          <p className="text-xs sm:text-sm font-mono font-bold text-[#fdf3e3]/80">
            Scroll untuk membuka katalog ↓
          </p>
        </motion.div>

        {/* panel katalog yang menimpa */}
        <motion.div
          style={{ y: yDock, zIndex: 40 }}
          className="absolute inset-0 w-full h-full bg-[#8a3410] shadow-[0_-10px_28px_rgba(42,23,16,0.45)]"
        >
          <ProductDock
            projects={projectsData}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectProject={handleSelect}
          />
        </motion.div>
      </div>
    </section>
  );
};