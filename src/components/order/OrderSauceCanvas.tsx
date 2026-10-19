import React, { useEffect, useRef } from 'react';
import { useRafActivity } from '../../hooks/useRafActivity';

export const OrderSauceCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRafActivity(canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // butiran bumbu
    const bubbles: { x: number; y: number; radius: number; speed: number; wobbleSpeed: number; seed: number }[] = [];
    const initBubbles = (width: number, height: number) => {
      bubbles.length = 0;
      const count = Math.floor(width / 60);
      for (let i = 0; i < count; i++) {
        bubbles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 1.5 + Math.random() * 3.5,
          speed: 0.6 + Math.random() * 1.2,
          wobbleSpeed: 1 + Math.random() * 2,
          seed: Math.random() * 100
        });
      }
    };

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      initBubbles(canvas.width, canvas.height);
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
      const waterGrad = ctx.createLinearGradient(0, 0, 0, height);
      waterGrad.addColorStop(0, '#f6a83c');
      waterGrad.addColorStop(0.35, '#e2571a');
      waterGrad.addColorStop(0.80, '#b2430f');
      waterGrad.addColorStop(1.0, '#8a3410');
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, 0, width, height);

      // transisi menuju warna section keunggulan
      const bandHeight = Math.min(220, height * 0.18);
      ctx.save();
      const bandGrad = ctx.createLinearGradient(0, 0, 0, bandHeight);
      bandGrad.addColorStop(0, '#f2e0aa');
      bandGrad.addColorStop(0.3, '#f7dfc2');
      bandGrad.addColorStop(0.7, '#f8e7d2');
      bandGrad.addColorStop(1.0, '#fdf3e3');
      ctx.fillStyle = bandGrad;

      ctx.beginPath();
      ctx.moveTo(-50, -20);
      ctx.lineTo(width + 50, -20);
      ctx.lineTo(width + 50, bandHeight);

      for (let x = width + 50; x >= -50; x -= 8) {
        const sy =
          bandHeight +
          Math.sin(x * 0.005 + time * 1.2) * 12 +
          Math.cos(x * 0.008 - time * 0.7) * 6;
        ctx.lineTo(x, sy);
      }

      ctx.lineTo(-50, -20);
      ctx.closePath();
      ctx.fill();

      // garis tepi terang
      ctx.beginPath();
      for (let x = -50; x <= width + 50; x += 8) {
        const sy =
          bandHeight +
          Math.sin(x * 0.005 + time * 1.2) * 12 +
          Math.cos(x * 0.008 - time * 0.7) * 6;
        if (x === -50) ctx.moveTo(x, sy);
        else ctx.lineTo(x, sy);
      }
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.restore();

      // garis uap
      const drawWaveCrest = (yPos: number, freq: number, amp: number, speed: number, alpha: number, color: string) => {
        ctx.save();
        ctx.beginPath();
        for (let x = 0; x <= width; x += 10) {
          const wy = yPos + Math.sin(x * freq + time * speed) * amp + Math.cos(x * (freq * 0.7) - time * (speed * 0.5)) * (amp * 0.5);
          if (x === 0) ctx.moveTo(x, wy);
          else ctx.lineTo(x, wy);
        }
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 2.5;
        ctx.setLineDash([14, 14]);
        ctx.stroke();
        ctx.restore();
      };

      drawWaveCrest(height * 0.32, 0.006, 8, 1.0, 0.45, '#ffffff');
      drawWaveCrest(height * 0.55, 0.005, 10, 0.8, 0.4, '#fce7c8');
      drawWaveCrest(height * 0.78, 0.004, 12, 0.6, 0.35, '#fbd9a6');

      // cabai melayang
      const drawCabai = (fx: number, fy: number, size: number, color: string, flip: boolean) => {
              ctx.save();
              ctx.translate(fx, fy);
              if (flip) ctx.scale(-1, 1);
              ctx.rotate(Math.sin(time * 2 + fx * 0.01) * 0.16);

              const sway = Math.sin(time * 3) * (size * 0.12);

              // batang
              ctx.strokeStyle = '#4D7C0F';
              ctx.lineWidth = size * 0.22;
              ctx.lineCap = 'round';
              ctx.beginPath();
              ctx.moveTo(-size * 1.5, 0);
              ctx.lineTo(-size * 2.1, -size * 0.35);
              ctx.stroke();

              // buah cabai
              ctx.fillStyle = color;
              ctx.strokeStyle = '#9F1239';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.ellipse(0, 0, size * 1.5, size * 0.66, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();

              // kilau
              ctx.strokeStyle = '#FB7185';
              ctx.lineWidth = size * 0.18;
              ctx.beginPath();
              ctx.moveTo(-size * 0.55, -size * 0.24 + sway);
              ctx.lineTo(size * 0.65, -size * 0.24 + sway);
              ctx.stroke();

              ctx.restore();
            };

      // cabai 1 melintas
      const cabai1X = ((time * 45) % (width + 160)) - 80;
      const cabai1Y = height * 0.42 + Math.sin(time * 2) * 15;
      drawCabai(cabai1X, cabai1Y, 14, '#f97316', false);

      // cabai 2 arah berlawanan
      const cabai2X = width - (((time * 38) % (width + 160)) - 80);
      const cabai2Y = height * 0.68 + Math.cos(time * 1.8) * 18;
      drawCabai(cabai2X, cabai2Y, 16, '#f6a83c', true);

      // butiran bumbu naik
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 1;

      for (const b of bubbles) {
        b.y -= b.speed;
        if (b.y < bandHeight) {
          b.y = height + 10;
          b.x = Math.random() * width;
        }

        const wobbleX = b.x + Math.sin(time * b.wobbleSpeed + b.seed) * 6;

        ctx.beginPath();
        ctx.arc(wobbleX, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
