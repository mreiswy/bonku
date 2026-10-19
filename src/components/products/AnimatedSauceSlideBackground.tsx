import React, { useEffect, useRef } from 'react';
import { useRafActivity } from '../../hooks/useRafActivity';
import {
  renderSauceBody,
  renderMejaLayers,
  renderSteamWaves,
  renderSpiceDust
} from './sauceEnvironmentRenderers';
import { renderKitchenItemsByDepth } from './kitchenItemRenderers';

interface AnimatedSauceSlideBackgroundProps {
  depthLevel: 1 | 2 | 3 | 4;
}

export const AnimatedSauceSlideBackground: React.FC<AnimatedSauceSlideBackgroundProps> = ({
  depthLevel
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRafActivity(canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      if (!ctx || !canvas) return;
      if (!activeRef.current) {
        animId = requestAnimationFrame(render);
        return;
      }
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      time += 0.016;

      // latar saus bumbu
            renderSauceBody(ctx, width, height, depthLevel);

            // lapisan meja & kemasan
            const { sauceMinY, sauceMaxY } = renderMejaLayers(ctx, width, height, depthLevel, time);

            // uap panas
            renderSteamWaves(ctx, width, sauceMinY, sauceMaxY, time);

            // perlengkapan dapur per kedalaman
            renderKitchenItemsByDepth(ctx, depthLevel, width, height, time, sauceMinY, sauceMaxY);

            // butiran bumbu
            renderSpiceDust(ctx, width, sauceMinY, sauceMaxY, time);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [depthLevel, activeRef]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
