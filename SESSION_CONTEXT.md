# SESSION CONTEXT — GARDU (FE + BE)

> Baca file ini dulu sebelum kerja. Ini merekam keputusan, status, dan rencana
> terakhir karena percakapan AI tidak tersimpan permanen.
> Update file ini setiap kali ada keputusan baru.

---

## 1. Status Diskusi Terakhir (Apa yang Sedang Dikerjakan)

**✅ BATCH SELESAI (sudah dieksekusi & diverifikasi):** hapus konsep re-upload, FE handle status `rejected`, BE kirim `rejected_reason`, update `fe_url` ke 5173. Detail di bagian 8.

**Sisa yang belum dikerjakan:** BookingHistory (#4) — opsional, bisa nyusul.

### Keputusan PENTING yang sudah disepakati
- **Konsep re-upload bukti pembayaran DIHAPUS.** User yang di-reject admin TIDAK bisa upload ulang bukti.
  - Alasan: backend TIDAK punya fitur itu (cuma teks link kosong di WA).
  - User di-reject = status final, harus booking baru dari nol.
- **Status `rejected` di frontend** → tampilkan label "DITOLAK" + alasan penolakan, TANPA tombol upload ulang.
- **`fe_url` di DB harus di-update** dari `http://localhost:5713` → `http://localhost:5173` (port FE yang benar).

### Batch yang akan dikerjakan (1-4)

**1. Backend — `F:\Developments\be_gardu\app\Http\Controllers\Admin\AdminBookingController.php`**
- Ubah `buildRejectMessage()` (baris ~169-178):
  - HAPUS `$feUrl` dan `$uploadUrl` (link `/booking/upload/{kode}`).
  - Pesan WA tolak jadi: bukti ditolak + alasan + "Silakan lakukan pemesanan baru jika ingin berkunjung".

**2. Backend — `F:\Developments\be_gardu\app\Http\Controllers\Public\BookingController.php`**
- Tambah `rejected_reason` ke `detailShape()` (agar FE bisa menampilkan alasan penolakan).

**3. Frontend — `F:\Developments\fe_gardu\src\pages\Booking\PaymentPage.tsx`**
- `STATUS_LABEL` tambah `rejected: 'DITOLAK'`.
- Badge warna `rejected` → merah.
- Di cabang non-aktif: tampilkan pesan "Bukti Pembayaran Ditolak" + alasan (`booking.rejected_reason`) + tombol "Lihat Paket Lain" (bukan form upload).

**4. Frontend — `F:\Developments\fe_gardu\src\pages\Booking\CheckBooking.tsx`**
- `getStatusBadge` tambah kasus `rejected` → merah "DITOLAK".
- `rejected` TIDAK masuk daftar status yang dapat aksi.

**5. Update DB `fe_url` → `http://localhost:5173`**
```
php artisan tinker --execute="App\Models\Setting::where('key','fe_url')->update(['value'=>'http://localhost:5173']);"
```
(jalankan di `F:\Developments\be_gardu`, lalu verify `curl http://localhost:8000/api/settings`)

### DILUAR SCOPE (dibatalkan)
- ❌ Endpoint upload untuk status `REJECTED` (tidak dibangun)
- ❌ Tombol "Unggah Ulang" di FE
- ❌ `BookingHistory` (#4) — nice to have, backend sudah ada (`GET /api/bookings?phone=`), FE-nya kosong (`src/pages/Profile/BookingHistory.tsx` 0 baris). Bisa nyusul.

---

## 2. Arsitektur & Alur (Ringkas)

### Aturan Bisnis
- Tidak ada user auth. Booking via WA + admin dashboard.
- Admin = satu-satunya gatekeeper CRUD.
- Booking state persist di localStorage (`desa_getas_booking`).

### Booking Flow
1. `/booking/package` → `/booking/form` → `POST /api/bookings` → redirect `/payment/{kode}`
2. User upload bukti → status `PENDING_VERIFY`
3. Admin Konfirmasi/Tolak dari dashboard
4. Auto-expire 24 jam (`booking:expire-stale`, scheduled daily di `routes/console.php`)

### Status Booking (constant di `be_gardu\app\Models\Booking.php`)
- `PENDING_PAYMENT` → `PENDING_VERIFY` → `CONFIRMED` / `REJECTED`
- Ada juga `EXPIRED`, `COMPLETED`, `CANCELLED`
- `REJECTED`, `EXPIRED`, `COMPLETED`, `CANCELLED` = **final status** (`isFinalStatus()`)

### WA Notifications (FonnteService — semua SUDAH jalan)
| Event | WA dikirim |
|---|---|
| `POST /api/bookings` | WA #1 ke user: kode + total + rekening + link payment |
| Upload bukti | WA ke user "bukti diterima" + notify admin |
| Admin Konfirmasi | WA tiket digital |
| Admin Tolak | WA alasan + (SEKARANG: tanpa link upload ulang) |
| Auto-expire | WA "booking expired" |
| `resend-wa` | kirim ulang WA #1 |

---

## 3. Konfigurasi Penting (JANGAN LUPA)

### Port (dua hal BEDA!)
| | Apa | Lokasi | Nilai |
|---|---|---|---|
| `VITE_API_URL` | Alamat API yang di-fetch FE | `fe_gardu/.env` | `http://localhost:8000/api` ✅ |
| `fe_url` | Alamat FE yang disisipkan ke pesan WA | DB `settings` (backend) | `http://localhost:5713` ⚠️ HARUS → 5173 |

- `fe_url` = string mentah di DB, bukan config Vite. Dipakai `BookingController.php:245` untuk link payment di WA #1.
- FE dev server jalan di **5173** (default Vite, karena `vite.config.ts` & `package.json` tidak set port).
- Catatan `be_gardu/SESSION_CONTEXT.md` menulis 5713 — itu SALAH/ketinggalan, jangan diikuti.

### Endpoint API (Backend Laravel di `http://localhost:8000/api`)
- `GET /home` (agregat), `GET /dusun`, `GET /tour-packages`, `GET /booking-sessions`, `GET /addons`, `GET /umkm-products`, `GET /budaya`, `GET /village-stats`, `GET /settings`
- `POST /bookings`, `GET /bookings/check`, `GET /bookings/{kode}`, `PATCH /bookings/{kode}`, `PATCH /bookings/{kode}/cancel`, `POST /bookings/{kode}/bukti`, `GET /bookings/{kode}/bukti`, `POST /bookings/{kode}/resend-wa`, `GET /bookings?phone=`

### Response envelope (diumwrap interceptor di `fe_gardu\src\services\api.ts`)
```json
{ "meta": { "success": true, "status_code": "200", "message": "..." }, "data": {...}, "pagination": {...} }
```

---

## 4. Bug yang SUDAH DIPERBAIKI (jangan dikerjakan ulang)

### Bug A — Home blank (selesai)
- **Gejala:** halaman `/` tidak tampil sama sekali.
- **Sebab:** `Hero.tsx` pakai `useHomeData()` tapi `HomeDataProvider` tidak pernah di-mount → throw error.
- **Fix:** `src/routes/AppRoutes.tsx` — bungkus `<HomeDataProvider>` di dalam `<BookingProvider>`.

### Bug B — "Gagal membuat pemesanan" (selesai)
- **Gejala:** submit form booking selalu gagal, tidak pernah dapat `kode_booking`.
- **Sebab:** `src/services/api.ts:48` fallback ke `https://api.gardu.site/api` (domain TIDAK ada di DNS) karena FE tidak punya `.env`.
- **Fix:** buat `fe_gardu/.env` berisi `VITE_API_URL=http://localhost:8000/api`. Backend local sudah jalan di port 8000.

---

## 5. Catatan Teknis & Gotcha

- `be_gardu` README adalah template Laravel default (tidak berisi info proyek). Info sebenarnya di `be_gardu/SESSION_CONTEXT.md` (untuk sisi BE) dan file ini (untuk FE + koordinasi).
- Settings pakai key-value: ambil dengan `Setting::getValue('key')` — JANGAN `Setting::value()`.
- Backend DB: MySQL `gardu` (127.0.0.1:3306, user root). Migrasi sudah dijalankan.
- `BookingController::detailShape()` = shape kontrak response untuk FE (payment page & cek-pesanan). Ada `payment_info` (bank, rekening, qris).
- FE typecheck: `npx tsc --noEmit -p tsconfig.app.json` (di `fe_gardu`).
- Backend kontrak lengkap di `fe_gardu/API_EXPECTED_RESPONSES.md` dan `be_gardu/API_EXPECTED_RESPONSES.md`.

---

## 6. Perintah Menjalankan

### Backend (be_gardu)
```
php artisan serve   # → http://localhost:8000
```

### Frontend (fe_gardu)
```
npm run dev         # → http://localhost:5173
```

### Verify API
```
curl http://localhost:8000/api/home
curl http://localhost:8000/api/settings   # cek fe_url
```

---

## 7. Status Git

- FE branch: `dhika` (uncommitted: banyak perubahan booking flow + .env + file baru seperti `PaymentPage.tsx`, `useHomeData.tsx`, `CountdownTimer.tsx`).
- BE branch: `main` (per SESSION_CONTEXT BE, booking flow belum di-commit).
- JANGAN commit kecuali diminta user.

---

## 8. Catatan Eksekusi Batch (Re-upload dihapus + status rejected) — SELESAI ✅

Dikerjakan tanggal: 2026-08-10.

### Yang diubah di FE (oleh agent)
- `fe_gardu/src/pages/Booking/PaymentPage.tsx`
  - `STATUS_LABEL` tambah `rejected: 'DITOLAK'`
  - Badge warna `rejected` → merah
  - Cabang non-aktif: pesan "Bukti Pembayaran Ditolak" + alasan (`booking.rejected_reason`) + tombol "Lihat Paket Lain"
- `fe_gardu/src/pages/Booking/CheckBooking.tsx`
  - `getStatusBadge` tambah kasus `rejected` → "DITOLAK" merah
  - Banner alasan penolakan untuk status `rejected`
- `fe_gardu/src/types/index.ts`
  - `BookingStatus` tambah `'rejected'`
  - `BookingDetail` tambah `rejected_reason?: string`

### Yang diubah di BE (oleh user, sesuai instruksi)
- `AdminBookingController.php` `buildRejectMessage()` — link re-upload dihapus, pesan baru tanpa link
- `BookingController.php` `detailShape()` — tambah `rejected_reason` (line ~605)
- DB: `fe_url` di-update `http://localhost:5713` → `http://localhost:5173`

### Hasil verifikasi (semua PASS)
- `npx tsc --noEmit` FE → OK
- `curl /api/settings` → `fe_url = http://localhost:5173` ✅
- `curl /api/bookings/GRD-20260810-7M2J` → `status: rejected`, `rejected_reason: 'Bukti tidak jelas/buram'` ✅
- FE dev server di 5173 → 200; kode PaymentPage memuat branch `rejected` ✅

### Booking test di DB
- `GRD-20260810-7M2J` (Lina Marlina) — status `REJECTED`, alasan "Bukti tidak jelas/buram". Bisa dipakai untuk tes tampilan FE.

### Sisa (opsional, belum dikerjakan)
- `BookingHistory` (#4): `src/pages/Profile/BookingHistory.tsx` masih kosong. Backend `GET /api/bookings?phone=` sudah ada. Perlu: tambah `history()` di `booking.service.ts` + route + halaman.
