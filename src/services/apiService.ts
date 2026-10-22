import type { Order, OrderItem } from '../types/bonku';
import { profileData } from '../data/bonkuData';

export interface CreateOrderPayload {
  customer_name: string;
  customer_phone: string;
  location_note?: string;
  items: OrderItem[];
  notes?: string;
  total_price: number;
  source?: 'web' | 'manual' | 'whatsapp';
}

/**
 * Mengirimkan data pesanan langsung ke Google Spreadsheet (SPS) via Webhook Google Apps Script,
 * dan menghasilkan objek Order terstruktur untuk dilanjutkan ke konfirmasi WhatsApp.
 */
export async function submitOrderToSpreadsheet(data: CreateOrderPayload): Promise<{
  success: boolean;
  order?: Order;
  error?: string;
  sentToSpreadsheet?: boolean;
}> {
  try {
    const timestampWib = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      dateStyle: 'medium',
      timeStyle: 'medium',
    });

    const orderId = `BK-${Date.now().toString().slice(-6)}`;

    const order: Order = {
      id: orderId,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      location_note: data.location_note || '',
      items: JSON.stringify(data.items),
      parsedItems: data.items,
      total_price: data.total_price,
      notes: data.notes || '',
      status: 'pending',
      payment_status: 'unpaid',
      source: data.source || 'web',
      created_at: timestampWib,
    };

    let sentToSpreadsheet = false;
    const webhookUrl = profileData.contact.spreadsheetWebhookUrl?.trim();

    if (webhookUrl) {
      try {
        const itemsSummary = data.items
          .map((i) => `${i.title} (${i.quantity}x)`)
          .join(', ');

        // Mengirim data ke Google Spreadsheet via Google Apps Script Web App
        // mode 'no-cors' digunakan untuk memastikan request berhasil dikirim ke Google Script
        await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: order.id,
            timestamp: order.created_at,
            customerName: order.customer_name,
            customerPhone: order.customer_phone,
            locationNote: order.location_note || '-',
            itemsSummary: itemsSummary,
            totalPrice: order.total_price,
            notes: order.notes || '-',
            source: order.source,
          }),
        });
        sentToSpreadsheet = true;
      } catch (webhookErr) {
        console.warn('Pengiriman ke Webhook Google Spreadsheet (SPS) mengalami kendala:', webhookErr);
      }
    }

    return {
      success: true,
      order,
      sentToSpreadsheet,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses pesanan.',
    };
  }
}
