import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';

const DB_PATH = path.resolve(process.cwd(), 'bonku.db');
let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_PATH);
    dbInstance.exec('PRAGMA journal_mode = WAL;');
  }
  return dbInstance;
}

export function initDb() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      location_note TEXT,
      items TEXT NOT NULL,
      total_price INTEGER NOT NULL,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      payment_status TEXT NOT NULL DEFAULT 'unpaid',
      source TEXT NOT NULL DEFAULT 'web',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS batches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batch_name TEXT NOT NULL,
      start_date TEXT,
      end_date TEXT NOT NULL,
      quota_pouch INTEGER DEFAULT 50,
      quota_roti INTEGER DEFAULT 30,
      is_active INTEGER DEFAULT 1,
      closed_message TEXT DEFAULT 'Pre-Order batch ini sudah ditutup. Pantau pengumuman batch berikutnya atau hubungi WhatsApp kami untuk menanyakan sisa stok!',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Default PIN admin = 1234 jika belum ada
  const adminPin = db.prepare('SELECT value FROM settings WHERE key = ?').get('admin_pin') as { value: string } | undefined;
  if (!adminPin) {
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('admin_pin', '1234');
  }

  // Default active batch (7 hari ke depan) jika belum ada
  const existingBatch = db.prepare('SELECT id FROM batches LIMIT 1').get();
  if (!existingBatch) {
    const now = new Date();
    const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 hari
    db.prepare(`
      INSERT INTO batches (batch_name, start_date, end_date, quota_pouch, quota_roti, is_active, closed_message)
      VALUES (?, ?, ?, ?, ?, 1, ?)
    `).run(
      'PO Batch 1 — Spesial Pekan Ini',
      now.toISOString(),
      endDate.toISOString(),
      50,
      30,
      'Waktu pre-order batch ini telah berakhir. Terima kasih atas antusiasme teman-teman! Hubungi admin untuk tanya sisa stok.'
    );
  }
}

export interface BatchRecord {
  id: number;
  batch_name: string;
  start_date: string;
  end_date: string;
  quota_pouch: number;
  quota_roti: number;
  is_active: number;
  closed_message: string;
  created_at: string;
}

export function getActiveBatch(): (BatchRecord & { is_expired: boolean }) | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM batches ORDER BY id DESC LIMIT 1').get() as BatchRecord | undefined;
  if (!row) {
    return null;
  }
  const isExpired = new Date(row.end_date).getTime() <= Date.now();
  return {
    ...row,
    is_expired: isExpired,
  };
}

export function getOrderStats() {
  const db = getDb();
  const orders = db.prepare('SELECT * FROM orders').all() as Array<{
    id: string;
    total_price: number;
    items: string;
    status: string;
  }>;

  let totalRevenue = 0;
  let totalPouch = 0;
  let totalRoti = 0;
  let pendingOrders = 0;

  for (const order of orders) {
    if (order.status !== 'cancelled') {
      totalRevenue += order.total_price;
      try {
        const items = JSON.parse(order.items);
        for (const item of items) {
          if (item.productId === 'abon-ayam-pouch') {
            totalPouch += item.quantity || 0;
          } else if (item.productId === 'roti-isi-abon') {
            totalRoti += item.quantity || 0;
          }
        }
      } catch {
        // Abaikan parse error jika ada data rusak
      }
    }
    if (order.status === 'pending') {
      pendingOrders++;
    }
  }

  return {
    totalRevenue,
    totalOrders: orders.length,
    totalPouch,
    totalRoti,
    pendingOrders,
  };
}
