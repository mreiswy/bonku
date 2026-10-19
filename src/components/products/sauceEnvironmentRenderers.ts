export interface SauceBounds {
  sauceMinY: number;
  sauceMaxY: number;
}

export function renderSauceBody(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  depthLevel: 1 | 2 | 3 | 4
): void {
  let sauceTop: string;
  let sauceMid: string;
  let sauceBottom: string;

  if (depthLevel === 1) {
    sauceTop = '#f6a83c';
    sauceMid = '#e2571a';
    sauceBottom = '#b2430f';
  } else if (depthLevel === 2) {
    sauceTop = '#f6a83c';
    sauceMid = '#e2571a';
    sauceBottom = '#8a3410';
  } else if (depthLevel === 3) {
    sauceTop = '#e2571a';
    sauceMid = '#8a3410';
    sauceBottom = '#3a1508';
  } else {
    sauceTop = '#8a3410';
    sauceMid = '#63280c';
    sauceBottom = '#4d1e09';
  }

  const sauceGrad = ctx.createLinearGradient(0, 0, 0, height);
  sauceGrad.addColorStop(0, sauceTop);
  sauceGrad.addColorStop(0.55, sauceMid);
  sauceGrad.addColorStop(1, sauceBottom);
  ctx.fillStyle = sauceGrad;
  ctx.fillRect(0, 0, width, height);
}

export function renderMejaLayers(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  depthLevel: 1 | 2 | 3 | 4,
  time: number
): SauceBounds {
  let sauceMinY = 0;
  let sauceMaxY = height;

  if (depthLevel === 1) {
    const topBandHeight = height * 0.20;
    sauceMinY = topBandHeight;

    ctx.save();
    const topGrad = ctx.createLinearGradient(0, 0, 0, topBandHeight);
    topGrad.addColorStop(0, '#ddb98f');
    topGrad.addColorStop(0.25, '#ecd3b3');
    topGrad.addColorStop(0.55, '#f7dfc2');
    topGrad.addColorStop(0.80, '#f8e7d2');
    topGrad.addColorStop(1.0, '#fdf3e3');
    ctx.fillStyle = topGrad;

    // tumpukan kemasan retort
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, topBandHeight);

    for (let x = width; x >= 0; x -= 6) {
      const sy =
        topBandHeight +
        Math.sin(x * 0.005 + time * 0.8) * 8 +
        Math.cos(x * 0.009 - time * 0.4) * 4;
      ctx.lineTo(x, sy);
    }

    ctx.closePath();
    ctx.fill();

    // garis lipatan kemasan
    ctx.beginPath();
    for (let x = 0; x <= width; x += 6) {
      const sy =
        topBandHeight +
        Math.sin(x * 0.005 + time * 0.8) * 8 +
        Math.cos(x * 0.009 - time * 0.4) * 4;
      if (x === 0) ctx.moveTo(x, sy);
      else ctx.lineTo(x, sy);
    }
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4.5;
    ctx.stroke();

    ctx.restore();
  } else if (depthLevel === 4) {
    const mejaY = height * 0.82;
    sauceMaxY = mejaY;

    ctx.save();
    const bottomGrad = ctx.createLinearGradient(0, mejaY, 0, height);
    bottomGrad.addColorStop(0, '#f0cf9f');
    bottomGrad.addColorStop(0.3, '#f7dfc2');
    bottomGrad.addColorStop(0.7, '#fbe9d6');
    bottomGrad.addColorStop(1.0, '#fdf3e3');
    ctx.fillStyle = bottomGrad;

    // permukaan meja kayu
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, mejaY);

    for (let x = 0; x <= width; x += 6) {
      const sy =
        mejaY +
        Math.sin(x * 0.004 + time * 0.6) * 10 +
        Math.cos(x * 0.008 - time * 0.3) * 5;
      ctx.lineTo(x, sy);
    }

    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // kilau tepi meja
    ctx.beginPath();
    for (let x = 0; x <= width; x += 6) {
      const sy =
        mejaY +
        Math.sin(x * 0.004 + time * 0.6) * 10 +
        Math.cos(x * 0.008 - time * 0.3) * 5;
      if (x === 0) ctx.moveTo(x, sy);
      else ctx.lineTo(x, sy);
    }
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.restore();
  }

  return { sauceMinY, sauceMaxY };
}

export function renderSteamWaves(
  ctx: CanvasRenderingContext2D,
  width: number,
  sauceMinY: number,
  sauceMaxY: number,
  time: number
): void {
  const wave1Y = sauceMinY + (sauceMaxY - sauceMinY) * 0.35;
  ctx.save();
  ctx.beginPath();
  for (let x = 0; x <= width; x += 6) {
    const cy =
      wave1Y +
      Math.sin(x * 0.004 + time * 1.1) * 14 +
      Math.cos(x * 0.008 - time * 0.5) * 6;
    if (x === 0) ctx.moveTo(x, cy);
    else ctx.lineTo(x, cy);
  }
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.lineWidth = 2.8;
  ctx.stroke();
  ctx.restore();

  const wave2Y = sauceMinY + (sauceMaxY - sauceMinY) * 0.72;
  ctx.save();
  ctx.beginPath();
  for (let x = 0; x <= width; x += 6) {
    const cy =
      wave2Y +
      Math.sin(x * 0.005 + time * 0.9 + 2) * 16 +
      Math.sin(x * 0.01 - time * 0.4) * 8;
    if (x === 0) ctx.moveTo(x, cy);
    else ctx.lineTo(x, cy);
  }
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 2.4;
  ctx.stroke();
  ctx.restore();
}

export function renderSpiceDust(
  ctx: CanvasRenderingContext2D,
  width: number,
  sauceMinY: number,
  sauceMaxY: number,
  time: number
): void {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.strokeStyle = '#2a1710';
  ctx.lineWidth = 1.2;

  const sauceHeight = sauceMaxY - sauceMinY;
  for (let i = 0; i < 14; i++) {
    const speed = 0.5 + (i % 4) * 0.25;
    const bx = ((width * 0.075 * i + Math.sin(time * 0.8 + i) * 25 + width) % width);
    const by = sauceMinY + (sauceHeight - (((time * 50 * speed + i * 40) % sauceHeight)));
    const r = 3.5 + (i % 3) * 2;

    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // kilau butiran bumbu
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(bx - r * 0.35, by - r * 0.35, r * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
