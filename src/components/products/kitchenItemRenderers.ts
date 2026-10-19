// Dekorasi kanvas bertema dapur abon: ayam suwir, cabai, cobek, toples bumbu.
// Renderer benda dapur & bahan abon (pengganti renderer makhluk laut template asal).

export function drawAyamSuwir(
  ctx: CanvasRenderingContext2D,
  time: number,
  x: number,
  y: number,
  size: number = 14,
  flip: boolean = false
): void {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);

  const sway = Math.sin(time * 4) * (size * 0.18);

  ctx.strokeStyle = '#B2430F';
  ctx.lineWidth = Math.max(1.6, size * 0.16);
  ctx.lineCap = 'round';

  // suwiran abon
  ctx.beginPath();
  ctx.moveTo(-size * 1.6, sway);
  ctx.quadraticCurveTo(-size * 0.2, -size * 0.5 + sway, size * 1.5, sway * 0.6);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-size * 1.4, size * 0.5 + sway);
  ctx.quadraticCurveTo(0, size * 0.9, size * 1.3, size * 0.4 - sway);
  ctx.stroke();

  ctx.strokeStyle = '#E2571A';
  ctx.beginPath();
  ctx.moveTo(-size * 1.2, -size * 0.5 - sway);
  ctx.quadraticCurveTo(size * 0.2, -size * 0.9, size * 1.4, -size * 0.4 + sway);
  ctx.stroke();

  ctx.restore();
}

export function drawCabaiMerah(
  ctx: CanvasRenderingContext2D,
  time: number,
  x: number,
  y: number,
  size: number = 16
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(time * 1.6) * 0.18);

  ctx.fillStyle = '#E11D48';
  ctx.strokeStyle = '#9F1239';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 1.5, size * 0.62, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = '#FB7185';
  ctx.lineWidth = size * 0.18;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-size * 0.5, -size * 0.22);
  ctx.lineTo(size * 0.7, -size * 0.22);
  ctx.stroke();

  ctx.strokeStyle = '#4D7C0F';
  ctx.lineWidth = size * 0.24;
  ctx.beginPath();
  ctx.moveTo(-size * 1.4, 0);
  ctx.lineTo(-size * 2.0, -size * 0.35);
  ctx.stroke();

  ctx.restore();
}

export function drawCobek(
  ctx: CanvasRenderingContext2D,
  time: number,
  x: number,
  y: number
): void {
  ctx.save();
  ctx.translate(x, y + Math.sin(time * 2) * 3);

  // mortar body
  ctx.fillStyle = '#5A2F13';
  ctx.strokeStyle = '#2a1710';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-42, -14);
  ctx.lineTo(42, -14);
  ctx.quadraticCurveTo(30, 26, 0, 26);
  ctx.quadraticCurveTo(-30, 26, -42, -14);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // rim
  ctx.fillStyle = '#7A4A1D';
  ctx.beginPath();
  ctx.ellipse(0, -14, 42, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // bumbu halus
  ctx.fillStyle = '#E2571A';
  ctx.beginPath();
  ctx.ellipse(0, -13, 32, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // pestle
  ctx.save();
  ctx.rotate(Math.sin(time * 1.4) * 0.22 - 0.35);
  ctx.fillStyle = '#9C7A45';
  ctx.strokeStyle = '#2a1710';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(24, -76, 16, 62, 8);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

export function drawToplesBumbu(
  ctx: CanvasRenderingContext2D,
  time: number,
  x: number,
  y: number,
  fillColor: string = '#E2571A'
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(time * 1.2) * 0.07);

  ctx.strokeStyle = '#2a1710';
  ctx.lineWidth = 2.5;

  // jar
  ctx.fillStyle = '#FBE9D6';
  ctx.beginPath();
  ctx.roundRect(-22, -34, 44, 68, 10);
  ctx.fill();
  ctx.stroke();

  // isi bumbu
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.roundRect(-19, -4, 38, 35, 8);
  ctx.fill();

  // tutup
  ctx.fillStyle = '#F6A83C';
  ctx.beginPath();
  ctx.roundRect(-26, -44, 52, 12, 5);
  ctx.fill();
  ctx.stroke();

  // label
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(-15, -24, 30, 16, 4);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#8A3410';
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BUMBU', 0, -12);

  ctx.restore();
}

export function drawTelurAyam(
  ctx: CanvasRenderingContext2D,
  time: number,
  x: number,
  y: number,
  size: number = 18
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(time * 1.8) * 0.12);

  ctx.fillStyle = '#FDF3E3';
  ctx.strokeStyle = '#B9975F';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.78, size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(-size * 0.24, -size * 0.3, size * 0.2, size * 0.28, -0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawWajan(
  ctx: CanvasRenderingContext2D,
  time: number,
  x: number,
  y: number
): void {
  ctx.save();
  ctx.translate(x, y);

  // uap
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  for (let i = -1; i <= 1; i++) {
    const t = time * 1.5 + i;
    ctx.beginPath();
    ctx.moveTo(i * 16, -34);
    ctx.quadraticCurveTo(i * 16 + Math.sin(t) * 10, -56, i * 16 + Math.sin(t + 1) * 12, -78);
    ctx.stroke();
  }

  // wajan
  ctx.fillStyle = '#3A1D0C';
  ctx.strokeStyle = '#2a1710';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-52, -18);
  ctx.lineTo(52, -18);
  ctx.quadraticCurveTo(38, 30, 0, 30);
  ctx.quadraticCurveTo(-38, 30, -52, -18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // bibir wajan
  ctx.fillStyle = '#46250F';
  ctx.beginPath();
  ctx.ellipse(0, -18, 52, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // abon sedang disangrai
  ctx.strokeStyle = '#F6A83C';
  ctx.lineWidth = 2.4;
  for (let i = 0; i < 5; i++) {
    const ox = -32 + i * 16;
    const oy = -16 + Math.sin(time * 3 + i) * 2;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.quadraticCurveTo(ox + 6, oy - 5, ox + 12, oy);
    ctx.stroke();
  }

  // gagang
  ctx.fillStyle = '#7A4A1D';
  ctx.strokeStyle = '#2a1710';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(50, -16, 58, 12, 6);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

export function renderKitchenItemsByDepth(
  ctx: CanvasRenderingContext2D,
  depthLevel: 1 | 2 | 3 | 4,
  width: number,
  height: number,
  time: number,
  waterMinY: number,
  waterMaxY: number
): void {
  if (depthLevel === 1) {
    const a1 = (time * 70) % (width + 160) - 80;
    drawAyamSuwir(ctx, time, a1, waterMinY + 60, 15);

    const a2 = width - (((time * 55) % (width + 160)) - 80);
    drawAyamSuwir(ctx, time, a2, waterMinY + 140, 12, true);

    const wajanX = (time * 40 + width * 0.4) % (width + 220) - 110;
    drawWajan(ctx, time, wajanX, waterMinY + 100);
  } else if (depthLevel === 2) {
    const cobekX = (time * 55) % (width + 260) - 130;
    drawCobek(ctx, time, cobekX, height * 0.48);

    const cabaiX = width - (((time * 80) % (width + 200)) - 100);
    drawCabaiMerah(ctx, time, cabaiX, height * 0.26, 16);
  } else if (depthLevel === 3) {
    const toplesX = (time * 85) % (width + 300) - 150;
    drawToplesBumbu(ctx, time, toplesX, height * 0.38, '#E2571A');

    const cabai2X = width - (((time * 45) % (width + 200)) - 100);
    drawCabaiMerah(ctx, time, cabai2X, height * 0.65, 13);
  } else if (depthLevel === 4) {
    const telurX = ((time * 40) % (width + 220)) - 110;
    drawTelurAyam(ctx, time, telurX, waterMaxY + 26, 18);

    const a3 = (time * 65) % (width + 160) - 80;
    drawAyamSuwir(ctx, time, a3, height * 0.32, 14);
  }
}