export type ProjectCategory = 'all' | 'abon' | 'roti';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'abon' | 'roti';
  summary: string;
  description: string;
  /** keunggulan & detail produk */
  architecture: string[];
  /** varian, isi kemasan, komposisi */
  stack: string[];
  highlights: string[];
  /** catatan pemesanan & penyimpanan */
  challenges: string;
  /** badge harga singkat */
  role: string;
  /** link Google Form pemesanan */
  orderFormUrl?: string;
  /** link WhatsApp pemesanan */
  orderUrl?: string;
  imageUrl: string;
  imageFit?: 'cover' | 'contain';
  featured: boolean;
  metrics: { label: string; value: string }[];
}

export type MarketingLayer = 'product' | 'price' | 'place' | 'promotion';

export interface MarketingItem {
  name: string;
  category: MarketingLayer;
  layer: MarketingLayer;
  iconKey: string;
  color: string;
  usageContext: string;
  productLinks?: string[];
  roleTag?: string;
}

export interface OrderStep {
  id: string;
  role: string;
  organization: string;
  period: string;
  badge?: string;
    /** label tahap, mis. 'Pilih Produk' — menentukan warna ikon (lihat categoryConfig di OrderTimeline) */
    category?: string;
    /** Ganti gambar tahap ini: taruh file di public/ lalu isi path, mis. '/produk/step-1.svg'. Kosong = pakai ikon default kategori. */
    iconUrl?: string;
  description: string;
  highlights?: string[];
  tech: string[];
}

/** alias supaya komponen timeline lama tetap jalan tanpa diubah */
export type ExperienceItem = OrderStep;
/** alias supaya komponen katalog keunggulan tetap jalan tanpa diubah */
export type TechItem = MarketingItem;
export type TechLayer = MarketingLayer;

export interface ProfileData {
  name: string;
  tagline: string;
  education: string;
  status: string;
  bio: string;
  experienceStart: string;
  avatarUrl: string;
  interests: string[];
  contact: {
    /** nomor WhatsApp yang ditampilkan */
    whatsapp: string;
    /** link wa.me siap pakai */
    whatsappLink: string;
    /** link Google Form pemesanan; kosongkan ('') bila belum ada */
    orderFormUrl: string;
    instagram: string;
    location: string;
  };
}