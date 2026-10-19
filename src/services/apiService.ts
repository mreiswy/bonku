import type { ActiveBatch, Order, OrderItem, OrderStats, OrderStatus, PaymentStatus } from '../types/bonku';

export async function fetchActiveBatch(): Promise<ActiveBatch | null> {
  try {
    const res = await fetch('/api/batch/active');
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch active batch:', err);
    return null;
  }
}

export async function createOrder(data: {
  customer_name: string;
  customer_phone: string;
  location_note?: string;
  items: OrderItem[];
  notes?: string;
  source?: 'web' | 'manual' | 'whatsapp';
}): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      return { success: false, error: result.error || 'Gagal menyimpan pesanan' };
    }
    return { success: true, order: result.order };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Koneksi ke server gagal' };
  }
}

export async function fetchOrders(params?: { status?: string; search?: string }): Promise<Order[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);

    const res = await fetch(`/api/orders?${searchParams.toString()}`);
    if (!res.ok) return [];
    const orders: Order[] = await res.json();
    return orders.map((o) => {
      try {
        return { ...o, parsedItems: JSON.parse(o.items) };
      } catch {
        return { ...o, parsedItems: [] };
      }
    });
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    return [];
  }
}

export async function updateOrderStatus(
  orderId: string,
  updates: { status?: OrderStatus; payment_status?: PaymentStatus }
): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const result = await res.json();
    if (!res.ok) {
      return { success: false, error: result.error || 'Gagal mengubah status' };
    }
    return { success: true, order: result.order };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Koneksi gagal' };
  }
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchOrderStats(): Promise<OrderStats> {
  try {
    const res = await fetch('/api/stats');
    if (!res.ok) {
      return { totalRevenue: 0, totalOrders: 0, totalPouch: 0, totalRoti: 0, pendingOrders: 0 };
    }
    return await res.json();
  } catch {
    return { totalRevenue: 0, totalOrders: 0, totalPouch: 0, totalRoti: 0, pendingOrders: 0 };
  }
}

export async function verifyAdminPin(pin: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    const result = await res.json();
    return { success: result.success === true, error: result.error };
  } catch {
    return { success: false, error: 'Gagal menghubungi server verifikasi' };
  }
}

export async function updateActiveBatch(data: {
  batch_name?: string;
  end_date?: string;
  quota_pouch?: number;
  quota_roti?: number;
  is_active?: number;
  order_mode?: 'po' | 'reguler';
  closed_message?: string;
}): Promise<{ success: boolean; batch?: ActiveBatch; error?: string }> {
  try {
    const res = await fetch('/api/batch/active', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      return { success: false, error: result.error || 'Gagal memperbarui batch' };
    }
    return { success: true, batch: result.batch };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Koneksi gagal' };
  }
}
