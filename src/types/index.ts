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
  created_by: number;
  created_at: string;
  updated_at: string;
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

export interface TourPackage {
  id: number;
  nama: string;
  deskripsi: string;
  harga: number;
  satuan: 'orang' | 'grup';
  tag: string | null;
  durasi: string;
  min_participants: number | null;
  max_participants: number | null;
  gambar: string;
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  includes?: TourPackageInclude[];
}

export interface TourPackageInclude {
  id: number;
  package_id: number;
  item: string;
  urutan: number;
}

export interface BookingSession {
  id: number;
  package_id: number;
  tanggal: string;
  sesi: 'Pagi' | 'Siang' | 'Sore';
  kuota: number;
  terisi: number;
  is_active: boolean;
  package?: { id: number; nama: string };
}

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

export interface Budaya {
  id: number;
  judul: string;
  kategori: string;
  deskripsi: string;
  gambar: string;
  span_grid: number;
  is_active: boolean;
  created_by: number;
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

export interface VillageProfile {
  id: number;
  tipe: 'sejarah' | 'visi' | 'misi' | 'pemerintahan';
  judul: string;
  konten: string;
  urutan: number;
  is_active: boolean;
}

export interface VillageStat {
  id: number;
  label: string;
  nilai: string;
  satuan: string | null;
  icon: string | null;
  urutan: number;
  is_active: boolean;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
  deskripsi: string | null;
}
