import React, { useRef, useState } from 'react';
import { ArrowDown, FileText, ShoppingBag } from 'lucide-react';
import { BumbuHeroCanvas } from './BumbuHeroCanvas';
import type { BumbuHeroHandle } from './BumbuHeroCanvas';
import { WordmarkStage } from './WordmarkStage';
import type { WordmarkStageHandle } from './WordmarkStage';
import { RetortPouch } from './RetortPouch';
import type { PouchExpression } from './RetortPouch';
import { CabaiTerbang } from './CabaiTerbang';
import { AyamKampung } from './AyamKampung';
import type { AyamKampungHandle } from './AyamKampung';
import { KitchenDecorations } from './KitchenDecorations';
import { TactileButton } from '../ui/TactileButton';
import { profileData } from '../../data/bonkuData';

interface HeroSectionProps {
  onOpenQuickOrder?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenQuickOrder }) => {
  const heroCanvasRef = useRef<BumbuHeroHandle | null>(null);
  const stageRef = useRef<WordmarkStageHandle | null>(null);
  const ayamRef = useRef<AyamKampungHandle | null>(null);
  const [pouchExpression, setPouchExpression] = useState<PouchExpression>('normal');

  const collisionCooldownRef = useRef<boolean>(false);

  const handleSplash = (clientX: number, clientY: number, intensity: number) => {
    if (heroCanvasRef.current) {
      heroCanvasRef.current.triggerSplash(clientX, clientY, intensity);
    }
  };

  const handleRipple = (clientX: number, clientY: number, size?: number) => {
    if (heroCanvasRef.current) {
      heroCanvasRef.current.triggerRipple(clientX, clientY, size);
    }
  };

  const checkPouchAyamCollision = (pouchRect: DOMRect) => {
    if (collisionCooldownRef.current || !ayamRef.current) return;
    const ayamRect = ayamRef.current.getAyamRect();
    if (!ayamRect) return;

    const pouchCenterX = pouchRect.left + pouchRect.width / 2;
    const pouchCenterY = pouchRect.top + pouchRect.height / 2;
    const ayamCenterX = ayamRect.left + ayamRect.width / 2;
    const ayamCenterY = ayamRect.top + ayamRect.height / 2;

    const dx = Math.abs(pouchCenterX - ayamCenterX);
    const dy = Math.abs(pouchCenterY - ayamCenterY);

    if (dx < 60 && dy < 48) {
      collisionCooldownRef.current = true;
      ayamRef.current.triggerStun(pouchCenterX < ayamCenterX ? 'right' : 'left');
      setPouchExpression('impact');

      setTimeout(() => {
        setPouchExpression('normal');
      }, 2000);

      setTimeout(() => {
        collisionCooldownRef.current = false;
      }, 3200);
    }
  };

  const handlePouchDrop = (clientX: number, clientY: number, velocity: number, pouchRect?: DOMRect) => {
    if (pouchRect) {
      checkPouchAyamCollision(pouchRect);
    }

    if (stageRef.current) {
      stageRef.current.handlePouchDrop(clientX, clientY, velocity);
    } else {
      handleSplash(clientX, clientY, velocity);
    }
  };

  const handlePouchSwim = (pouchX: number, pouchY: number) => {
    if (stageRef.current) {
      stageRef.current.handlePouchSwim(pouchX, pouchY);
    } else {
      handleRipple(pouchX, pouchY, 45);
    }
  };

  const handleScrollToProjects = () => {
      const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-svh min-h-[700px] flex flex-col justify-between pt-16 pb-10 overflow-hidden select-none">
      <h1 className="sr-only">BonKu — Abon Ayam Rumahan Higienis, Bergizi, Awet di Suhu Ruang</h1>

      <div className="absolute inset-0 z-0 pointer-events-auto">
        <BumbuHeroCanvas ref={heroCanvasRef} />
      </div>

      <CabaiTerbang />

      <RetortPouch
        expression={pouchExpression}
        onPouchDrop={handlePouchDrop}
        onPouchSwim={handlePouchSwim}
        onPouchSplash={(x, y) => handleSplash(x, y, 1.3)}
        onPouchWaddle={checkPouchAyamCollision}
      />

      <AyamKampung ref={ayamRef} />

      <KitchenDecorations />

      <div className="absolute inset-0 z-[5] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(42,23,16,0.55)_0%,rgba(42,23,16,0.30)_45%,transparent_75%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full flex-1 flex flex-col items-center justify-center -translate-y-16 sm:-translate-y-24">
        <div className="w-full flex flex-col items-center text-center">
          <WordmarkStage
            ref={stageRef}
            onSplash={handleSplash}
            onRipple={handleRipple}
            onPouchExpressionChange={setPouchExpression}
          />

          <p className="mt-3 sm:mt-4 max-w-xl text-center text-xs sm:text-base text-[#f8fafc] font-medium leading-relaxed drop-shadow-md px-2">
                      Abon ayam rumahan yang dimasak higienis, bergizi, dan awet di suhu ruang. Siap santap bersama nasi hangat — pesan sekarang, COD area kampus.
                    </p>

                    <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 px-2">
                      <TactileButton
                        variant="primary"
                        onClick={handleScrollToProjects}
                        icon={<ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      >
                        Lihat Produk
                      </TactileButton>

                      <TactileButton
                        variant="kraft"
                        onClick={onOpenQuickOrder}
                        icon={<ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      >
                        Pesan di Web
                      </TactileButton>

                      <a
                        href={profileData.contact.orderFormUrl || profileData.contact.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#3a1d0c] hover:bg-[#46250f] text-[#f8fafc] border border-[#6b3a18] hover:border-[#ddb98f]/60 font-medium text-xs sm:text-sm transition-all select-none cursor-pointer hover:-translate-y-0.5"
                      >
                        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4ade80]" />
                        <span>Form Eksternal</span>
                      </a>
                    </div>
        </div>
      </div>
    </section>
  );
};
