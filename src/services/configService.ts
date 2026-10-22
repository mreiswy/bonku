import { profileData } from '../data/bonkuData';

export interface FormConfig {
  isFormOpen: boolean;
  orderMode: 'po' | 'reguler';
  batchName: string;
  endDate: string; // YYYY-MM-DDTHH:mm format for datetime-local
  quotaPouch: number;
  quotaRoti: number;
  closedMessage: string;
  updatedAt: string;
}

const STORAGE_KEY_CONFIG = 'bonku_form_config';
const STORAGE_KEY_PIN = 'bonku_admin_pin';
const DEFAULT_PIN = '1234';

function getDefaultEndDate(): string {
  // Default batas PO: 5 hari dari hari ini pukul 21:00 WIB
  const target = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  target.setHours(21, 0, 0, 0);
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, '0');
  const day = String(target.getDate()).padStart(2, '0');
  const hours = String(target.getHours()).padStart(2, '0');
  const minutes = String(target.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function getDefaultFormConfig(): FormConfig {
  return {
    isFormOpen: true,
    orderMode: 'po',
    batchName: profileData.status || 'Open PO — Batch Terbatas',
    endDate: getDefaultEndDate(),
    quotaPouch: 50,
    updatedAt: new Date().toISOString(),
    quotaRoti: 30,
    closedMessage:
      'Pemesanan ditutup sementara oleh pengelola BonKu. Hubungi WhatsApp kami untuk menanyakan stok atau pemesanan langsung.',
  };
}

export function getFormConfig(): FormConfig & { isExpired: boolean } {
  let config: FormConfig;
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_CONFIG) : null;
    if (raw) {
      config = { ...getDefaultFormConfig(), ...JSON.parse(raw) };
    } else {
      config = getDefaultFormConfig();
    }
  } catch {
    config = getDefaultFormConfig();
  }

  let isExpired = false;
  if (config.orderMode === 'po' && config.endDate) {
    const targetMs = new Date(config.endDate).getTime();
    if (!isNaN(targetMs) && targetMs <= Date.now()) {
      isExpired = true;
    }
  }

  return { ...config, isExpired };
}

export async function saveFormConfig(updates: Partial<FormConfig>): Promise<FormConfig> {
  const current = getFormConfig();
  const nextConfig: FormConfig = {
    isFormOpen: updates.isFormOpen !== undefined ? updates.isFormOpen : current.isFormOpen,
    orderMode: updates.orderMode || current.orderMode,
    batchName: updates.batchName || current.batchName,
    endDate: updates.endDate || current.endDate,
    quotaPouch: updates.quotaPouch !== undefined ? updates.quotaPouch : current.quotaPouch,
    quotaRoti: updates.quotaRoti !== undefined ? updates.quotaRoti : current.quotaRoti,
    closedMessage: updates.closedMessage !== undefined ? updates.closedMessage : current.closedMessage,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(nextConfig));
    // Trigger custom event untuk reactivity instan antar-komponen
    window.dispatchEvent(new Event('bonku-config-changed'));
  }

  // Notifikasi opsional ke SPS Webhook (Google Spreadsheet)
  const webhookUrl = profileData.contact.spreadsheetWebhookUrl?.trim();
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'syncConfig',
          config: nextConfig,
          updatedAt: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.warn('Opsional sync config ke SPS mengalami kendala:', err);
    }
  }

  return nextConfig;
}

export function getAdminPin(): string {
  if (typeof window === 'undefined') return DEFAULT_PIN;
  return localStorage.getItem(STORAGE_KEY_PIN) || DEFAULT_PIN;
}

export function verifyAdminPin(pinToVerify: string): boolean {
  return pinToVerify.trim() === getAdminPin().trim();
}

export function changeAdminPin(
  oldPin: string,
  newPin: string
): { success: boolean; error?: string } {
  if (!verifyAdminPin(oldPin)) {
    return { success: false, error: 'PIN lama yang Anda masukkan salah.' };
  }
  if (!newPin || newPin.trim().length < 4) {
    return { success: false, error: 'PIN baru minimal harus 4 digit angka.' };
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_PIN, newPin.trim());
  }
  return { success: true };
}
