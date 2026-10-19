import React, { useEffect, useRef } from 'react';
import { useRafActivity } from '../../hooks/useRafActivity';

interface SplashDroplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
  gravity: number;
}

interface WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

export const ContactSauceCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dropletsRef = useRef<SplashDroplet[]>([]);
  const ripplesRef = useRef<WaterRipple[]>([]);
  const activeRef = useRafActivity(canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // butiran bumbu naik
    const bubbles: { x: number; y: number; radius: number; speed: number; wobbleSpeed: number; seed: number }[] = [];
    const initBubbles = (width: number, height: number) => {
      bubbles.length = 0;
      const count = Math.floor(width / 45);
      for (let i = 0; i < count; i++) {
        bubbles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 1.5 + Math.random() * 4,
          speed: 0.7 + Math.random() * 1.3,
          wobbleSpeed: 1.2 + Math.random() * 2,
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

    // klik memicu percikan saus
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // riak saus
      ripplesRef.current.push({
        x,
        y,
        radius: 4,
        maxRadius: 140,
        alpha: 0.9,
        speed: 3.2
      });

      ripplesRef.current.push({
        x,
        y,
        radius: 2,
        maxRadius: 90,
        alpha: 0.65,
        speed: 2.0
      });

      // butiran cabai menyembur
      const count = 16;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 2.5 + Math.random() * 4.5;
        dropletsRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.5,
          radius: 1.5 + Math.random() * 2.5,
          alpha: 1,
          decay: 0.02 + Math.random() * 0.015,
          gravity: 0.18
        });
      }
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('click', handleClick);
    }

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

      // latar saus bumbu senada section cara pesan
      const waterGrad = ctx.createLinearGradient(0, 0, 0, height);
      waterGrad.addColorStop(0, '#8a3410');
      waterGrad.addColorStop(0.35, '#63280c');
      waterGrad.addColorStop(0.85, '#4d1e09');
      waterGrad.addColorStop(1.0, '#3a1508');
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, 0, width, height);

      // garis uap panas
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
        ctx.lineWidth = 2;
        ctx.setLineDash([12, 14]);
        ctx.stroke();
        ctx.restore();
      };

      drawWaveCrest(height * 0.20, 0.005, 8, 1.0, 0.35, '#f6a83c');
      drawWaveCrest(height * 0.50, 0.004, 10, 0.8, 0.30, '#f07b1f');
      drawWaveCrest(height * 0.75, 0.004, 9, 0.7, 0.25, '#f8bf72');

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
              ctx.lineWidth = 1.8;
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

            const cabaiX = ((time * 40) % (width + 160)) - 80;
            const cabaiY = height * 0.35 + Math.sin(time * 1.5) * 12;
            drawCabai(cabaiX, cabaiY, 13, '#f6a83c', false);

      // butiran bumbu
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1;

      for (const b of bubbles) {
        b.y -= b.speed;
        if (b.y < -10) {
          b.y = height + 10;
          b.x = Math.random() * width;
        }

        const wobbleX = b.x + Math.sin(time * b.wobbleSpeed + b.seed) * 5;

        ctx.beginPath();
        ctx.arc(wobbleX, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();

      // gambar riak saus
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += r.speed;
        r.alpha -= 0.018;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#f6a83c';
        ctx.globalAlpha = r.alpha;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(r.x, r.y, Math.max(1, r.radius * 0.6), 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = r.alpha * 0.8;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // gambar butiran semburan
      for (let i = dropletsRef.current.length - 1; i >= 0; i--) {
        const d = dropletsRef.current[i];
        d.x += d.vx;
        d.y += d.vy;
        d.vy += d.gravity;
        d.alpha -= d.decay;

        if (d.alpha <= 0 || d.y > height) {
          dropletsRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fbd9a6';
        ctx.globalAlpha = d.alpha;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      // permukaan meja kayu
      const mejaY = height * 0.88;
      ctx.save();
      const mejaGrad = ctx.createLinearGradient(0, mejaY, 0, height);
      mejaGrad.addColorStop(0, '#f0cf9f');
      mejaGrad.addColorStop(0.5, '#ecd3b3');
      mejaGrad.addColorStop(1.0, '#ddb98f');
      ctx.fillStyle = mejaGrad;

      ctx.beginPath();
      ctx.moveTo(-50, height + 20);
      ctx.lineTo(-50, mejaY);

      for (let x = -50; x <= width + 50; x += 10) {
        const sy =
          mejaY +
          Math.sin(x * 0.006 + time * 0.8) * 8 +
          Math.cos(x * 0.009 - time * 0.4) * 4;
        ctx.lineTo(x, sy);
      }

      ctx.lineTo(width + 50, height + 20);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('click', handleClick);
      }
    };
  }, [activeRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
