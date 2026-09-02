// ── Dusun ──

export interface Dusun {
  id: number;
  nama: string;
  rw: string;
  jumlah_rt: number;
  jumlah_penduduk: number;
  luas_wilayah: string;
  deskripsi: string;
  detail: string;
  hero_img: string;
  thumbnail: string;
  is_active: boolean;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
  galleries?: DusunGallery[];
  keunggulan?: DusunKeunggulan[];
}

export interface DusunGallery {
  id: number;
  dusun_id: number;
  image_url: string;
  urutan: number;
}

export interface DusunKeunggulan {
  id: number;
  dusun_id: number;
  keunggulan: string;
  urutan: number;
}

// ── Tour Packages ──

export interface PackageReview {
  id: number;
  nama_pengulas: string;
  rating: number;
  komentar: string;
  created_at?: string;
  tanggal_formatted?: string;
}

export interface TourPackageTier {
  id?: number;
  min_peserta: number;
  harga_per_orang: number;
}

export interface TourPackage {
  id: number;
  nama: string;
  deskripsi: string;
  tipe_harga?: 'per_orang_tier' | 'per_paket_fixed';
  harga: number;
  satuan: 'orang' | 'grup' | 'tenda' | 'paket';
  kapasitas_per_unit?: number | null;
  tag: string | null;
  durasi: string;
  min_participants: number | null;
  max_participants: number | null;
  gambar: string;
  is_active: boolean;
  rating_avg?: number | null;
  reviews_count?: number;
  reviews?: PackageReview[];
  created_by?: number;
  created_at?: string;
  updated_at?: string;
  includes?: TourPackageInclude[];
  tiers?: TourPackageTier[];
}

export interface TourPackageInclude {
  id: number;
  package_id: number;
  item: string;
  urutan: number;
}

// ── Booking Sessions ──

export interface BookingSession {
  id: number;
  package_id: number;
  tanggal: string;
  sesi: string; // e.g. "Pagi"
  jam_mulai?: string; // e.g. "07:00:00"
  jam_selesai?: string; // e.g. "10:00:00"
  kuota: number;
  terisi: number;
  is_active: boolean;
  package?: { id: number; nama: string };
}

// ── Booking Status ──

export type BookingStatus =
  | 'pending_payment'
  | 'pending_verify'
  | 'confirmed'
  | 'cancelled'
  | 'expired'
  | 'rejected';

// ── Booking Detail (response from API) ──

export interface BookingAddon {
  id: string;
  nama: string;
  harga: number;
  quantity: number;
}

export interface BookingPaymentInfo {
  bank: string;
  nomor_rekening: string;
  atas_nama: string;
  qris_image?: string;
  batas_waktu_jam?: number;
}

export interface BookingDetail {
  id: number;
  kode_booking: string;
  nama_pemesan: string;
  no_wa_pemesan: string;
  kontak_darurat?: string;
  kota_asal?: string;
  catatan?: string;
  tanggal: string;
  sesi: string;
  jumlah_peserta: number;
  total_harga: number;
  status: BookingStatus;
  expired_at?: string;
  rejected_reason?: string;
  bukti_bayar?: string;
  payment_info?: BookingPaymentInfo;
  package?: {
    id: number;
    nama: string;
    durasi?: string;
    gambar?: string;
    satuan?: string;
  };
  addons?: BookingAddon[];
}

// ── UMKM ──

export interface UmkmProduct {
  id: number;
  nama: string;
  kategori: 'Makanan' | 'Kerajinan' | 'Pertanian' | 'Oleh-Oleh';
  harga: number;
  deskripsi: string;
  gambar: string;
  no_wa_penjual: string;
  is_active: boolean;
}

// ── Budaya ──

export interface Budaya {
  id: number;
  judul: string;
  kategori: string;
  deskripsi: string;
  gambar: string;
  span_grid: number;
  is_active: boolean;
  created_by?: number;
  schedules?: BudayaSchedule[];
}

export interface BudayaSchedule {
  id: number;
  budaya_id: number;
  nama_acara: string;
  hari: string;
  jam: string;
  deskripsi: string;
  is_active: boolean;
}

// ── Village Profile ──

export interface VillageProfile {
  id: number;
  tipe: 'sejarah' | 'visi' | 'misi' | 'pemerintahan';
  judul: string;
  konten: string;
  urutan: number;
  is_active: boolean;
}

// ── Village Stats ──

export interface VillageStat {
  id: number;
  label: string;
  nilai: string;
  satuan: string | null;
  icon: string | null;
  urutan: number;
  is_active: boolean;
}

// ── Settings ──

export interface Setting {
  id: number;
  key: string;
  value: string;
  deskripsi: string | null;
}
