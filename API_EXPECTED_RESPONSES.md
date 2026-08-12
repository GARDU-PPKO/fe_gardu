# STANDAR FORMAT RESPONSE API (DESA GETAS)

Dokumen ini berisi spesifikasi endpoint, request payload, serta response data yang dibutuhkan oleh frontend Desa Wisata Getas.

> **Catatan Versi (Update):**
> - Landing page tidak lagi dipecah menjadi 6 endpoint kecil, melainkan **satu endpoint agregat `GET /api/home`** (satu request, semua data). Endpoint per-entity tetap tersedia untuk halaman detail, admin dashboard, dan reuse.
> - Menambahkan endpoint yang selama ini masih hardcode/dummy di frontend: **Add-Ons**, **booking detail/check/bukti/cancel/update**, dan **riwayat booking**.
> - Menyeragamkan **status booking** (`pending_payment → pending_verify → confirmed | cancelled | expired`) dan **format sesi** (`"Pagi (07.00 - 09.00)"`) sesuai yang benar-benar dipakai komponen.
> - Menambahkan daftar lengkap key `settings` termasuk yang masih hardcode di komponen (rekening bank, AR URL, aturan booking).

---

## Standar Format Response

### ✅ Success (Tanpa Data)
```json
{
  "meta": {
    "success": true,
    "status_code": "200",
    "message": "Success"
  }
}
```

### ✅ Success (Dengan Data)
```json
{
  "meta": {
    "success": true,
    "status_code": "200",
    "message": "Success"
  },
  "data": {
    "id": "uuid/integer",
    "name": "string",
    "createdAt": "2025-12-16",
    "updatedAt": "2025-12-16"
  }
}
```

### ✅ Success (Dengan Pagination)
```json
{
  "meta": {
    "success": true,
    "status_code": "200",
    "message": "Success"
  },
  "data": [...],
  "pagination": {
    "current_page": 1,
    "per_page": 15,
    "total": 100,
    "last_page": 7,
    "from": 1,
    "to": 15
  }
}
```

### ❌ Error Response
```json
{
  "meta": {
    "success": false,
    "status_code": "422",
    "message": "Validation Error"
  },
  "errors": {
    "phone": ["The phone field must be a valid WhatsApp number."]
  }
}
```

---

## 1. Landing Page — Satu Endpoint Agregat

### **Get Landing Page Data (Agregat)**
* **Endpoint:** `GET /api/home`
* **Deskripsi:** Mengambil **seluruh data** yang dibutuhkan landing page dalam satu request:
  * Hero → `settings` (nama_desa) + `village_stats` + `dusun` (hero_img)
  * Section Paket → `tour_packages`
  * Section UMKM → `umkm_products`
  * Section Budaya → `budaya`
  * Kontak & WA floating → `settings`
  * Dusun Slider → `dusun`
* **Alasan:** Semua section render bersamaan di halaman pertama, sehingga 1 request lebih efisien (mengurangi request duplikat `GET /settings` dan `GET /dusun` yang dulu dipanggil beberapa kali).
* **Expected Response (Success dengan Data):**
  ```json
  {
    "meta": {
      "success": true,
      "status_code": "200",
      "message": "Success retrieving home data"
    },
    "data": {
      "settings": [
        {
          "id": 1,
          "key": "nama_desa",
          "value": "Desa Wisata Getas",
          "deskripsi": "Nama desa wisata utama"
        },
        {
          "id": 2,
          "key": "wa_admin",
          "value": "6281234567890",
          "deskripsi": "Nomor WhatsApp admin"
        },
        {
          "id": 3,
          "key": "alamat_desa",
          "value": "Jl. Raya Getas No. 1, Kec. Singorojo, Kab. Kendal 51382",
          "deskripsi": "Alamat Kantor Desa"
        },
        {
          "id": 4,
          "key": "email_desa",
          "value": "desagetas@kendalkab.go.id",
          "deskripsi": "Email resmi desa"
        },
        {
          "id": 5,
          "key": "jam_pelayanan",
          "value": "Senin–Jumat: 08.00–15.00 WIB",
          "deskripsi": "Jam kerja pelayanan desa"
        }
      ],
      "village_stats": [
        {
          "id": 1,
          "label": "Wisatawan / Tahun",
          "nilai": "8.500",
          "satuan": "+",
          "icon": "mountain",
          "urutan": 1,
          "is_active": true
        },
        {
          "id": 2,
          "label": "UMKM Aktif",
          "nilai": "62",
          "satuan": "unit",
          "icon": "briefcase",
          "urutan": 2,
          "is_active": true
        }
      ],
      "dusun": [
        {
          "id": 1,
          "nama": "Seklotok",
          "rw": "RW 01",
          "jumlah_rt": 3,
          "jumlah_penduduk": 412,
          "luas_wilayah": "1,2 km²",
          "deskripsi": "Dusun di tepi sungai dengan sawah hijau membentang luas.",
          "thumbnail": "https://images.unsplash.com/photo-1627796863235-2dddce3e862d?w=400&h=300&fit=crop&auto=format",
          "hero_img": "https://images.unsplash.com/photo-1627796863235-2dddce3e862d?w=800&h=500&fit=crop&auto=format",
          "is_active": true
        }
      ],
      "tour_packages": [
        {
          "id": 1,
          "nama": "Tubing Adventure",
          "deskripsi": "Menyusuri Sungai Blukar sepanjang 1,5 km dengan arus alami.",
          "harga": 75000,
          "satuan": "orang",
          "tag": "Terpopuler",
          "durasi": "±2 jam",
          "min_participants": 1,
          "max_participants": 10,
          "gambar": "https://images.unsplash.com/photo-1546058914-5000137323f0?w=500&h=320&fit=crop&auto=format",
          "is_active": true,
          "includes": [
            {
              "id": 1,
              "package_id": 1,
              "item": "Pemandu bersertifikat",
              "urutan": 1
            }
          ]
        }
      ],
      "umkm_products": [
        {
          "id": 1,
          "nama": "Kopi Arabika Getas",
          "kategori": "Oleh-Oleh",
          "harga": 65000,
          "deskripsi": "Kopi asli buatan petani lokal Getas (200g)",
          "gambar": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&auto=format",
          "no_wa_penjual": "62812345007",
          "is_active": true
        }
      ],
      "budaya": [
        {
          "id": 1,
          "judul": "Kuda Lumping",
          "kategori": "Seni Pertunjukan",
          "deskripsi": "Tarian tradisional kuda lumping yang digelar setiap peringatan hari besar dan acara adat desa.",
          "gambar": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=700&h=460&fit=crop&auto=format",
          "span_grid": 2,
          "is_active": true,
          "schedules": [
            {
              "id": 1,
              "budaya_id": 1,
              "nama_acara": "Kuda Lumping Suroan",
              "hari": "Sabtu",
              "jam": "09.00 - 15.00 WIB",
              "deskripsi": "Pentas utama di Dusun Sanggar",
              "is_active": true
            }
          ]
        }
      ]
    }
  }
  ```

> **Pembaca frontend:** struktur `data` di atas mengikuti `HomeData` pada `src/services/home.service.ts`. Komponen yang konsumsi: `Hero`, `DusunSlider`, `TourPackages`, `UMKMSection`, `KebudayaanSection`, `KontakSection`.

---

## 2. Endpoint Publik Per Entity

Endpoint di bawah tetap tersedia secara terpisah. Digunakan untuk **halaman detail**, **admin dashboard**, **cache per-section**, dan **fallback** jika endpoint agregat gagal. Struktur field mengikuti yang sudah dicontohkan di bagian 1.

### **A. Get Dusun List**
* **Endpoint:** `GET /api/dusun`
* **Dibutuhkan oleh:** DusunSlider, Hero (hero_img), fallback `useHomeData`.
* **Data:** `id, nama, rw, jumlah_rt, jumlah_penduduk, luas_wilayah, deskripsi, thumbnail, hero_img, is_active`

### **B. Get Detail Dusun**
* **Endpoint:** `GET /api/dusun/{id}`
* **Dibutuhkan oleh:** Overlay `DusunPage` (gallery + keunggulan).
* **Data:** seluruh field list + tambahan:
  ```json
  {
    "id": 1,
    "nama": "Seklotok",
    "detail": "Seklotok adalah dusun yang berbatasan langsung dengan aliran Sungai Blukar...",
    "galleries": [
      { "id": 11, "dusun_id": 1, "image_url": "https://.../w=600&h=400", "urutan": 1 }
    ],
    "keunggulan": [
      { "id": 101, "dusun_id": 1, "keunggulan": "Sawah organik tepi sungai", "urutan": 1 }
    ]
  }
  ```

### **C. Get Tour Packages List**
* **Endpoint:** `GET /api/tour-packages`
* **Dibutuhkan oleh:** section `TourPackages`, halaman `/packages` (`PackagesPage`).
* **Data:** `id, nama, deskripsi, harga, satuan, tag, durasi, min_participants, max_participants, gambar, is_active, includes[]`

### **D. Get Detail Tour Package**
* **Endpoint:** `GET /api/tour-packages/{id}`
* **Dibutuhkan oleh:** halaman detail paket (direncanakan) & admin dashboard.
* **Data:** sama dengan list, `includes[]` sudah lengkap.

### **E. Get UMKM Products**
* **Endpoint:** `GET /api/umkm-products`
* **Dibutuhkan oleh:** section `UMKMSection`.
* **Query Params:**
  * `kategori` (string, opsional): `Makanan`, `Kerajinan`, `Pertanian`, `Oleh-Oleh`
  * `page` (integer, opsional, default: 1)
  * `limit` (integer, opsional, default: 15)
* **Response:** menggunakan envelope pagination, `data` berisi array produk.
* **Data:** `id, nama, kategori, harga, deskripsi, gambar, no_wa_penjual, is_active`

### **F. Get Kebudayaan**
* **Endpoint:** `GET /api/budaya`
* **Dibutuhkan oleh:** section `KebudayaanSection` (masonry + kartu jadwal acara).
* **Data:** `id, judul, kategori, deskripsi, gambar, span_grid, is_active, schedules[]`

### **G. Get Settings**
* **Endpoint:** `GET /api/settings`
* **Dibutuhkan oleh:** `KontakSection`, WA floating, `useHomeData` (fallback), serta berbagai komponen yang butuh info kontak & pembayaran.
* **Query Params:**
  * `keys` (string, opsional): dipisahkan koma, contoh `nama_desa,wa_admin,alamat_desa,email_desa,jam_pelayanan`.
* **Data:** `[{ id, key, value, deskripsi }]`
* **Daftar key lengkap:** lihat **Bagian 5**.

### **H. Get Village Stats**
* **Endpoint:** `GET /api/village-stats`
* **Dibutuhkan oleh:** stat bar di Hero (via `useHomeData`).
* **Data:** `id, label, nilai, satuan, icon, urutan, is_active`

### **I. Get Village Profile**
* **Endpoint:** `GET /api/village-profile`
* **Dibutuhkan oleh:** cadangan section "Tentang Desa" (belum dipakai halaman saat ini).
* **Data:** `id, tipe, judul, konten, urutan, is_active`

---

## 3. Add-Ons (Tambahan Booking)

### **Get Add-Ons List**
* **Endpoint:** `GET /api/addons`
* **Deskripsi:** Daftar add-on yang bisa ditambahkan user saat booking (step 1). Saat ini masih **hardcode** di `BookingPackage.tsx` — harus dipindah ke API agar bisa dikelola admin.
* **Query Params:**
  * `package_id` (integer, opsional): jika add-on bersifat per-paket. Kosongkan untuk add-on global.
* **Expected Response (Success dengan Data):**
  ```json
  {
    "meta": {
      "success": true,
      "status_code": "200",
      "message": "Success retrieving add-ons"
    },
    "data": [
      {
        "id": "bbq",
        "nama": "Alat Bakaran",
        "harga": 35000,
        "satuan": "paket",
        "deskripsi": "Lengkap dengan arang, capitan, kipas, dan panggangan. Cocok untuk BBQ malam.",
        "gambar": "https://images.unsplash.com/photo-1520329612326-d6038d1395a1?w=300&h=300&fit=crop&auto=format",
        "is_free": false,
        "is_active": true,
        "urutan": 1
      },
      {
        "id": "snack",
        "nama": "Paket Snack Lokal",
        "harga": 15000,
        "satuan": "paket",
        "deskripsi": "Kopi/teh hangat, ubi rebus, kacang rebus, dan jajanan tradisional khas Getas.",
        "gambar": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop&auto=format",
        "is_free": false,
        "is_active": true,
        "urutan": 2
      },
      {
        "id": "atv",
        "nama": "ATV Ride Adventure",
        "harga": 50000,
        "satuan": "sesi",
        "deskripsi": "Sewa ATV 30 menit di sirkuit mini off-road kami. Sudah termasuk helm.",
        "gambar": "https://images.unsplash.com/photo-1546058914-5000137323f0?w=300&h=300&fit=crop&auto=format",
        "is_free": false,
        "is_active": true,
        "urutan": 3
      },
      {
        "id": "archery",
        "nama": "Area Panahan (Archery)",
        "harga": 0,
        "satuan": "sesi",
        "deskripsi": "Gratis! Coba 3 anak panah dengan target sasaran di area khusus.",
        "gambar": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&h=300&fit=crop&auto=format",
        "is_free": true,
        "is_active": true,
        "urutan": 4
      }
    ]
  }
  ```

---

## 4. Booking Flow (Jadwal, Data Pemesan, Pembayaran, Cek Pesanan)

> **Alur booking → payment (sinkron dengan frontend):**
> 1. User mengisi jadwal (step 1) & data diri (step 2) → **submit** → `POST /api/bookings` (draft `pending_payment`, `expired_at` = sekarang + 24 jam).
> 2. Frontend langsung redirect ke **`/payment/{kode_booking}`**. Sistem **sekaligus** mengirim **WA #1** berisi link payment yang sama (cadangan bila user menutup halaman).
> 3. Halaman payment memuat data via `GET /api/bookings/{kode}`, menampilkan ringkasan, countdown 24 jam, instruksi rekening/QRIS, dan form upload bukti.
> 4. User upload bukti → `POST /api/bookings/{kode}/bukti` → status `pending_verify` → **WA #2** (bukti diterima) + notifikasi admin.
> 5. Cron (server) tiap jam: booking `pending_payment` yang lewat `expired_at` → status `expired` (data diarsipkan) + **WA #3c** (pembatalan otomatis).

### **A. Get Booking Sessions (Cek Kuota)**
* **Endpoint:** `GET /api/booking-sessions`
* **Dibutuhkan oleh:** `BookingPackage` (step 1) untuk dropdown sesi yang masih punya kuota.
* **Query Params:**
  * `package_id` (integer, wajib)
  * `tanggal` (string `YYYY-MM-DD`, wajib)
* **Expected Response (Success dengan Data):**
  ```json
  {
    "meta": {
      "success": true,
      "status_code": "200",
      "message": "Success retrieving booking sessions"
    },
    "data": [
      {
        "id": 1,
        "package_id": 1,
        "tanggal": "2026-08-10",
        "sesi": "Pagi (07.00 - 09.00)",
        "kuota": 20,
        "terisi": 5,
        "sisa_kuota": 15,
        "is_active": true
      },
      {
        "id": 2,
        "package_id": 1,
        "tanggal": "2026-08-10",
        "sesi": "Siang (10.00 - 12.00)",
        "kuota": 20,
        "terisi": 20,
        "sisa_kuota": 0,
        "is_active": true
      }
    ]
  }
  ```
* **Catatan:** `sesi` harus dikembalikan dalam **label penuh** (bukan enum `"Pagi"` saja) karena frontend langsung memakai nilainya sebagai nilai & teks dropdown. Backend cukup menggabungkan enum + rentang jam. Frontend hanya menampilkan sesi dengan `sisa_kuota > 0`.

### **B. Create Booking (Submit Form & Mulai Pembayaran)**
* **Endpoint:** `POST /api/bookings`
* **Dibutuhkan oleh:** `BookingForm` (step 2 — submit data diri, sebelum masuk halaman payment).
* **Request Content-Type:** `application/json`
* **Expected Request Body:**
  ```json
  {
    "package_id": 1,
    "customer_name": "Budi Santoso",
    "phone": "6281234567890",
    "email": "budi@gmail.com",
    "kontak_darurat": "6289876543210",
    "date": "2026-08-10",
    "session_time": "Pagi (07.00 - 09.00)",
    "participants": 3,
    "addons": [
      { "id": "atv", "name": "ATV Ride Adventure", "price": 50000, "quantity": 1 }
    ],
    "notes": "Tidak ada alergi"
  }
  ```
* **Catatan contract:**
  * `total_harga` **dihitung oleh server** (harga paket × peserta + total add-ons). Tidak dikirim dari client.
  * `addons` opsional.
  * `email` dan `kontak_darurat` keduanya opsional.
  * Response `kode_booking` dipakai frontend untuk **redirect ke `/payment/{kode}`** dan sekaligus dikirim sebagai link di **WA #1**.
  * **Anti duplikat (HTTP 409):** jika sudah ada booking `pending_payment` aktif dengan kombinasi paket + tanggal + sesi + no. WA yang sama, server menolak dan mengembalikan data booking lama agar frontend bisa langsung mengarahkan ke halaman payment-nya.
* **Expected Response (Success - HTTP 201):**
  ```json
  {
    "meta": {
      "success": true,
      "status_code": "201",
      "message": "Booking successfully created"
    },
    "data": {
      "id": 42,
      "kode_booking": "GTS-827394",
      "total_harga": 275000,
      "status": "pending_payment",
      "expired_at": "2026-08-09 23:59:59"
    }
  }
  ```
* **Expected Response (Validation Error - HTTP 422):**
  ```json
  {
    "meta": {
      "success": false,
      "status_code": "422",
      "message": "Validation Error"
    },
    "errors": {
      "phone": ["The phone field must be a valid WhatsApp number."],
      "participants": ["The participants must be at least 1."]
    }
  }
  ```

### **C. Get Detail Booking by Kode**
* **Endpoint:** `GET /api/bookings/{kode}`
* **Dibutuhkan oleh:** halaman `/payment/:kode` (ringkasan + instruksi bayar + countdown) dan `/cek-pesanan` (`CheckBooking`).
* **Catatan:** endpoint ini wajib mengembalikan `payment_info` agar halaman payment **self-contained** (tanpa fetch settings terpisah).
* **Expected Response (Success dengan Data):**
  ```json
  {
    "meta": {
      "success": true,
      "status_code": "200",
      "message": "Success retrieving booking detail"
    },
    "data": {
      "id": 42,
      "kode_booking": "GTS-827394",
      "nama_pemesan": "Budi Santoso",
      "no_wa_pemesan": "6281234567890",
      "kontak_darurat": "6289876543210",
      "kota_asal": "Semarang",
      "catatan": "Tidak ada alergi",
      "tanggal": "2026-08-10",
      "sesi": "Pagi (07.00 - 09.00)",
      "jumlah_peserta": 3,
      "total_harga": 275000,
      "status": "pending_payment",
      "expired_at": "2026-08-09 23:59:59",
      "bukti_bayar": null,
      "payment_info": {
        "bank": "BRI",
        "nomor_rekening": "0012 3456 7890",
        "atas_nama": "Desa Wisata Getas",
        "qris_image": "https://api.gardu.site/storage/qris.png",
        "batas_waktu_jam": 24
      },
      "package": {
        "id": 1,
        "nama": "Tubing Adventure",
        "durasi": "±2 jam",
        "gambar": "https://images.unsplash.com/photo-1546058914-5000137323f0?w=400&h=300&fit=crop&auto=format",
        "satuan": "orang"
      },
      "addons": [
        {
          "id": "atv",
          "nama": "ATV Ride Adventure",
          "harga": 50000,
          "quantity": 1
        }
      ]
    }
  }
  ```

### **D. Check Booking (Cari by Kode atau Phone)**
* **Endpoint:** `GET /api/bookings/check`
* **Dibutuhkan oleh:** `/cek-pesanan` saat user mencari tanpa URL kode (via input kode atau no. WA).
* **Query Params:**
  * `kode` (string, opsional)
  * `phone` (string, opsional)
  * Minimal salah satu wajib diisi.
* **Expected Response:** sama dengan **C** (BookingDetail). Jika tidak ditemukan → HTTP 404 dengan meta `success: false`.

### **E. Upload Bukti Bayar**
* **Endpoint:** `POST /api/bookings/{kode}/bukti`
* **Dibutuhkan oleh:** `PaymentPage` (`/payment/:kode`) — fungsi `uploadBuktiBayar` sudah tersedia di `booking.service.ts`. Step ini mengubah status `pending_payment` → `pending_verify`.
* **Request Content-Type:** `multipart/form-data`
  * Field: `bukti_bayar` (file JPG/PNG/PDF, maks 5MB)
* **Expected Response (Success):**
  ```json
  {
    "meta": {
      "success": true,
      "status_code": "200",
      "message": "Payment proof uploaded"
    },
    "data": {
      "id": 42,
      "kode_booking": "GTS-827394",
      "status": "pending_verify",
      "bukti_bayar": "https://api.gardu.site/storage/bukti/42.jpg"
    }
  }
  ```

### **F. Cancel Booking**
* **Endpoint:** `PATCH /api/bookings/{kode}/cancel`
* **Dibutuhkan oleh:** tombol "Batalkan Pesanan" di `/cek-pesanan`.
* **Expected Response (Success):**
  ```json
  {
    "meta": {
      "success": true,
      "status_code": "200",
      "message": "Booking cancelled"
    },
    "data": {
      "kode_booking": "GTS-827394",
      "status": "cancelled"
    }
  }
  ```

### **G. Update Data Diri Booking**
* **Endpoint:** `PATCH /api/bookings/{kode}`
* **Dibutuhkan oleh:** fitur "Edit Data Diri" di `/cek-pesanan`.
* **Expected Request Body:**
  ```json
  {
    "customer_name": "Budi Santoso Baru",
    "phone": "6281234567890",
    "kontak_darurat": "6289876543210"
  }
  ```
* **Expected Response:** BookingDetail (sama dengan **C**).

### **H. Kirim Ulang Link Pembayaran (Resend WA)**
* **Endpoint:** `POST /api/bookings/{kode}/resend-wa`
* **Deskripsi:** Mengirim ulang **WA #1** (link `/payment/{kode}`) ke nomor pemesan. Dipakai tombol "Belum menerima link WhatsApp? Kirim ulang" di halaman payment.
* **Restriksi:** hanya berlaku untuk booking berstatus `pending_payment`.
* **Expected Response (Success):**
  ```json
  {
    "meta": {
      "success": true,
      "status_code": "200",
      "message": "Payment link resent"
    },
    "data": {
      "kode_booking": "GTS-827394"
    }
  }
  ```

### **I. Get Booking History (Riwayat Booking)**
* **Endpoint:** `GET /api/bookings`
* **Dibutuhkan oleh:** halaman Profile/`BookingHistory` (masih placeholder).
* **Query Params:**
  * `phone` (string, wajib): filter riwayat per no. WhatsApp.
  * `page` (integer, opsional, default: 1)
  * `limit` (integer, opsional, default: 10)
* **Expected Response (Success dengan Pagination):**
  ```json
  {
    "meta": {
      "success": true,
      "status_code": "200",
      "message": "Success retrieving booking history"
    },
    "data": [
      {
        "id": 42,
        "kode_booking": "GTS-827394",
        "nama_pemesan": "Budi Santoso",
        "tanggal": "2026-08-10",
        "sesi": "Pagi (07.00 - 09.00)",
        "jumlah_peserta": 3,
        "total_harga": 275000,
        "status": "confirmed",
        "package": { "id": 1, "nama": "Tubing Adventure" }
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 5,
      "last_page": 1,
      "from": 1,
      "to": 5
    }
  }
  ```

---

## 4b. Notifikasi WhatsApp (server-side)

Semua notifikasi WA dikirim oleh **backend**, bukan frontend. Frontend hanya perlu kontrak API di atas.

| WA | Waktu | Penerima | Isi |
|----|-------|----------|-----|
| **#1** | Setelah `POST /api/bookings` berhasil | User (nomor pemesan) | Link `/payment/{kode_booking}` + total tagihan + batas waktu 24 jam |
| **#2** | Setelah `POST /api/bookings/{kode}/bukti` berhasil | User | Bukti diterima, tunggu verifikasi (±10 jam) |
| **#3c** | Cron (tiap jam) saat `pending_payment` lewat `expired_at` | User | Info pembatalan otomatis (status `expired`) |
| **Notif admin** | Setelah `POST /api/bookings/{kode}/bukti` berhasil | Admin (dashboard/WA) | Ada bukti baru masuk untuk diverifikasi |

---

## 5. Daftar Lengkap Keys `settings`

Semua key dikelola admin. Nilai diambil oleh landing, booking, dan halaman terkait.

| Key | Dipakai di | Keterangan |
|-----|-----------|------------|
| `nama_desa` | Hero (judul besar) | Nama desa wisata utama |
| `wa_admin` | WA floating, Kontak | Nomor WhatsApp admin (format `628xx`) |
| `alamat_desa` | Kontak | Alamat kantor desa |
| `email_desa` | Kontak | Email resmi desa |
| `jam_pelayanan` | Kontak | Jam kerja pelayanan |
| `rekening_bank` | `PaymentPage` (instruksi transfer) | Nama bank, contoh `BRI` — **sekarang masih hardcode** |
| `rekening_no` | `PaymentPage` | Nomor rekening, contoh `0012 3456 7890` — **sekarang masih hardcode** |
| `rekening_atas_nama` | `PaymentPage` | Nama pemilik rekening, contoh `Desa Wisata Getas` — **sekarang masih hardcode** |
| `qris_image` | Halaman payment | URL/QRIS statis (opsional, alternatif transfer bank) — **baru** |
| `ar_url` | `ARSection` | URL aplikasi AR (sekarang hardcode `https://feby-akliji23.github.io/AR-BETA_V01/`) |
| `check_in_time` | `BookingPackage` (aturan) | Contoh `13.00 WIB` — **sekarang masih hardcode** |
| `check_out_time` | `BookingPackage` (aturan) | Contoh `11.00 WIB` — **sekarang masih hardcode** |
| `cancel_policy` | `BookingPackage` (aturan) | Contoh `Pembatalan/reschedule maks. 8 jam sebelum kedatangan` — **sekarang masih hardcode** |
| `night_curfew` | `BookingPackage` (aturan) | Contoh `Jam malam mulai 22.00 WIB` — **sekarang masih hardcode** |

---

## 6. Konsistensi Status & Sesi

### Status Booking (enum)
Alur status yang dipakai frontend (`src/types/index.ts`):

```
pending_payment ──(upload bukti)──▶ pending_verify ──(admin konfirmasi)──▶ confirmed
      │                                  │
      └──(expired)──▶ expired            └──(dibatalkan)──▶ cancelled
```

| Status | Makna |
|--------|-------|
| `pending_payment` | Booking dibuat, menunggu upload bukti bayar |
| `pending_verify` | Bukti sudah diupload, menunggu verifikasi admin |
| `confirmed` | Pembayaran terkonfirmasi admin |
| `cancelled` | Dibatalkan (oleh user/admin) |
| `expired` | Masa tenggat pembayaran lewat |

### Format Sesi
- **Database:** enum `Pagi` | `Siang` | `Sore`.
- **API response:** dikirim sebagai **label penuh** agar langsung ditampilkan tanpa mapping di frontend:
  - `"Pagi (07.00 - 09.00)"`
  - `"Siang (10.00 - 12.00)"`
  - `"Sore (14.00 - 16.00)"`

---

## Peta Kebutuhan Halaman → Endpoint

| Halaman / Komponen | Endpoint yang digunakan |
|--------------------|------------------------|
| Landing (`/`) — semua section | `GET /api/home` |
| Landing (fallback) | `GET /api/settings`, `GET /api/village-stats`, `GET /api/dusun`, `GET /api/tour-packages`, `GET /api/umkm-products`, `GET /api/budaya` |
| Overlay Detail Dusun | `GET /api/dusun/{id}` |
| Halaman Paket (`/packages`) | `GET /api/tour-packages` |
| Booking Step 1 — Jadwal (`/booking/package`) | `GET /api/booking-sessions`, `GET /api/addons` |
| Booking Step 2 — Form (`/booking/form`) | `POST /api/bookings` (buat draft → redirect `/payment/{kode}`) |
| Halaman Pembayaran (`/payment/:kode`) | `GET /api/bookings/{kode}`, `POST /api/bookings/{kode}/bukti`, `POST /api/bookings/{kode}/resend-wa` |
| Cek Pesanan (`/cek-pesanan`) | `GET /api/bookings/{kode}`, `GET /api/bookings/check`, `PATCH /api/bookings/{kode}/cancel`, `PATCH /api/bookings/{kode}` |
| Riwayat Booking (Profile) | `GET /api/bookings?phone=` |
