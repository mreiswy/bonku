import type { IncomingMessage, ServerResponse } from 'node:http';
import { getDb, getActiveBatch, getOrderStats, initDb } from './db.js';

// Pastikan DB terinisialisasi
initDb();

function sendJson(res: ServerResponse, statusCode: number, data: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

function parseJsonBody<T = Record<string, unknown>>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function generateOrderId(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BK-${dateStr}-${randomSuffix}`;
}

export async function handleApiRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const method = req.method?.toUpperCase() || 'GET';

  if (!pathname.startsWith('/api/')) {
    return false;
  }

  const db = getDb();

  try {
    // 1. Health check
    if (pathname === '/api/health' && method === 'GET') {
      sendJson(res, 200, { status: 'ok', database: 'connected' });
      return true;
    }

    // 2. Auth: Verify PIN
    if (pathname === '/api/auth/verify' && method === 'POST') {
      const body = await parseJsonBody<{ pin?: string }>(req);
      const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('admin_pin') as { value: string } | undefined;
      const validPin = row?.value || '1234';
      if (body.pin === validPin) {
        sendJson(res, 200, { success: true });
      } else {
        sendJson(res, 401, { success: false, error: 'PIN tidak sesuai' });
      }
      return true;
    }

    // 3. Auth: Change PIN
    if (pathname === '/api/auth/change-pin' && method === 'POST') {
      const body = await parseJsonBody<{ oldPin?: string; newPin?: string }>(req);
      const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('admin_pin') as { value: string } | undefined;
      const validPin = row?.value || '1234';
      if (body.oldPin !== validPin) {
        sendJson(res, 401, { success: false, error: 'PIN lama salah' });
        return true;
      }
      if (!body.newPin || body.newPin.length < 4) {
        sendJson(res, 400, { success: false, error: 'PIN baru minimal 4 digit' });
        return true;
      }
      db.prepare('UPDATE settings SET value = ? WHERE key = ?').run(body.newPin, 'admin_pin');
      sendJson(res, 200, { success: true });
      return true;
    }

    // 4. Batch: Get active batch & expiration
    if (pathname === '/api/batch/active' && method === 'GET') {
      const batch = getActiveBatch();
      sendJson(res, 200, batch);
      return true;
    }

    // 5. Batch: Update active batch
    if (pathname === '/api/batch/active' && method === 'POST') {
      const body = await parseJsonBody<{
        batch_name?: string;
        end_date?: string;
        quota_pouch?: number;
        quota_roti?: number;
        is_active?: number;
        order_mode?: 'po' | 'reguler';
        closed_message?: string;
      }>(req);

      const activeBatch = getActiveBatch();
      if (!activeBatch) {
        db.prepare(`
          INSERT INTO batches (batch_name, start_date, end_date, quota_pouch, quota_roti, is_active, order_mode, closed_message)
          VALUES (?, datetime('now'), ?, ?, ?, ?, ?, ?)
        `).run(
          body.batch_name || 'PO Batch Baru',
          body.end_date || new Date(Date.now() + 7 * 86400000).toISOString(),
          body.quota_pouch || 50,
          body.quota_roti || 30,
          body.is_active !== undefined ? body.is_active : 1,
          body.order_mode || 'po',
          body.closed_message || 'Pre-order batch ini telah ditutup.'
        );
      } else {
        db.prepare(`
          UPDATE batches
          SET batch_name = COALESCE(?, batch_name),
              end_date = COALESCE(?, end_date),
              quota_pouch = COALESCE(?, quota_pouch),
              quota_roti = COALESCE(?, quota_roti),
              is_active = COALESCE(?, is_active),
              order_mode = COALESCE(?, order_mode),
              closed_message = COALESCE(?, closed_message)
          WHERE id = ?
        `).run(
          body.batch_name || null,
          body.end_date || null,
          body.quota_pouch ?? null,
          body.quota_roti ?? null,
          body.is_active ?? null,
          body.order_mode || null,
          body.closed_message || null,
          activeBatch.id
        );
      }

      sendJson(res, 200, { success: true, batch: getActiveBatch() });
      return true;
    }

    // 6. Stats
    if (pathname === '/api/stats' && method === 'GET') {
      sendJson(res, 200, getOrderStats());
      return true;
    }

    // 7. Orders: List
    if (pathname === '/api/orders' && method === 'GET') {
      const status = url.searchParams.get('status');
      const search = url.searchParams.get('search');

      let query = 'SELECT * FROM orders';
      const params: (string | number)[] = [];
      const conditions: string[] = [];

      if (status && status !== 'all') {
        conditions.push('status = ?');
        params.push(status);
      }

      if (search && search.trim()) {
        conditions.push('(customer_name LIKE ? OR customer_phone LIKE ? OR id LIKE ?)');
        const searchPattern = `%${search.trim()}%`;
        params.push(searchPattern, searchPattern, searchPattern);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      query += ' ORDER BY created_at DESC';

      const orders = db.prepare(query).all(...params);
      sendJson(res, 200, orders);
      return true;
    }

    // 8. Orders: Create new order
    if (pathname === '/api/orders' && method === 'POST') {
      const body = await parseJsonBody<{
        customer_name: string;
        customer_phone: string;
        location_note?: string;
        items: Array<{ productId: string; title: string; quantity: number; price: number; subtotal: number }>;
        notes?: string;
        source?: 'web' | 'manual' | 'whatsapp';
      }>(req);

      // Verifikasi apakah waktu pemesanan masih buka
      const activeBatch = getActiveBatch();
      const isManual = body.source === 'manual';

      if (!isManual) {
        // Cek apakah form dimatikan secara manual (is_active = 0)
        if (!activeBatch || !activeBatch.is_active) {
          sendJson(res, 400, {
            error: activeBatch?.closed_message || 'Form pemesanan saat ini sedang ditutup.',
          });
          return true;
        }

        // Cek jika mode PO dan waktu telah habis
        if (activeBatch.order_mode === 'po' && activeBatch.is_expired) {
          sendJson(res, 400, {
            error: activeBatch?.closed_message || 'Batas waktu Pre-Order batch ini telah habis.',
          });
          return true;
        }
      }

      if (!body.customer_name || !body.customer_phone || !body.items || body.items.length === 0) {
        sendJson(res, 400, { error: 'Nama, nomor WhatsApp, dan pilihan produk wajib diisi.' });
        return true;
      }

      let calculatedTotal = 0;
      for (const it of body.items) {
        calculatedTotal += (it.quantity || 0) * (it.price || 0);
      }

      const orderId = generateOrderId();
      const itemsJson = JSON.stringify(body.items);

      db.prepare(`
        INSERT INTO orders (id, customer_name, customer_phone, location_note, items, total_price, notes, status, payment_status, source)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'unpaid', ?)
      `).run(
        orderId,
        body.customer_name.trim(),
        body.customer_phone.trim(),
        (body.location_note || '').trim(),
        itemsJson,
        calculatedTotal,
        (body.notes || '').trim(),
        body.source || 'web'
      );

      const createdOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
      sendJson(res, 201, { success: true, order: createdOrder });
      return true;
    }

    // 9. Orders: Update status
    if (pathname.startsWith('/api/orders/') && method === 'PATCH') {
      const orderId = pathname.replace('/api/orders/', '');
      const body = await parseJsonBody<{ status?: string; payment_status?: string }>(req);

      db.prepare(`
        UPDATE orders
        SET status = COALESCE(?, status),
            payment_status = COALESCE(?, payment_status),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(body.status || null, body.payment_status || null, orderId);

      const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
      sendJson(res, 200, { success: true, order: updated });
      return true;
    }

    // 10. Orders: Delete
    if (pathname.startsWith('/api/orders/') && method === 'DELETE') {
      const orderId = pathname.replace('/api/orders/', '');
      db.prepare('DELETE FROM orders WHERE id = ?').run(orderId);
      sendJson(res, 200, { success: true });
      return true;
    }

    // 11. Export CSV
    if (pathname === '/api/export/csv' && method === 'GET') {
      const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all() as Array<{
        id: string;
        customer_name: string;
        customer_phone: string;
        location_note: string;
        items: string;
        total_price: number;
        notes: string;
        status: string;
        payment_status: string;
        source: string;
        created_at: string;
      }>;

      let csv = 'ID Pesanan,Nama Pemesan,Nomor WA,Titik COD/Alamat,Rincian Item,Total Harga,Status Pesanan,Status Bayar,Sumber,Tanggal\r\n';

      for (const o of orders) {
        let itemDesc = '';
        try {
          const items = JSON.parse(o.items);
          itemDesc = items.map((i: { title: string; quantity: number }) => `${i.title} (${i.quantity}x)`).join('; ');
        } catch {
          itemDesc = o.items;
        }

        const escapeCsv = (str: string | number) => `"${String(str || '').replace(/"/g, '""')}"`;

        csv += [
          escapeCsv(o.id),
          escapeCsv(o.customer_name),
          escapeCsv(o.customer_phone),
          escapeCsv(o.location_note),
          escapeCsv(itemDesc),
          escapeCsv(o.total_price),
          escapeCsv(o.status),
          escapeCsv(o.payment_status),
          escapeCsv(o.source),
          escapeCsv(o.created_at),
        ].join(',') + '\r\n';
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="bonku-pesanan-${new Date().toISOString().slice(0, 10)}.csv"`);
      res.end(csv);
      return true;
    }

    sendJson(res, 404, { error: 'Endpoint tidak ditemukan' });
    return true;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    sendJson(res, 500, { error: message });
    return true;
  }
}
