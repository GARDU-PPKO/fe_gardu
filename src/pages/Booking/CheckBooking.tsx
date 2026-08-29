import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { checkBooking, cancelBooking, updateBooking } from '../../services/booking.service';
import { ApiValidationError } from '../../services/api';
import { validateFullName, validatePhone, validateEmergencyContact } from '../../utils/validators';
import { Loader2, Calendar, Clock, Users, Ticket, AlertCircle, CheckCircle, Edit2, Home } from 'lucide-react';

interface BookingResult {
  id?: number;
  kode_booking: string;
  nama_pemesan: string;
  no_wa_pemesan: string;
  kontak_darurat?: string;
  tanggal: string;
  sesi: string;
  jumlah_peserta: number;
  total_harga: number;
  status: string;
  package?: {
    id: number;
    nama: string;
    durasi?: string;
  };
  addons?: { nama: string; harga: number }[];
  rejected_reason?: string;
}

/** Hitung jam sisa sebelum tanggal kunjungan mulai sesi pertama (asumsi 08:00) */
const getHoursBefore = (tanggal: string): number => {
  const visitDate = new Date(`${tanggal}T08:00:00`);
  const now = new Date();
  return (visitDate.getTime() - now.getTime()) / (1000 * 60 * 60);
};

/** Kebijakan refund berdasarkan jam */
const getRefundPolicy = (tanggal: string) => {
  const jam = getHoursBefore(tanggal);
  if (jam >= 72) {
    return { persen: 75, label: "75% dikembalikan", warna: "green", desc: "Pembatalan lebih dari 72 jam sebelum kunjungan" };
  } else if (jam >= 24) {
    return { persen: 50, label: "50% dikembalikan", warna: "yellow", desc: "Pembatalan 24–72 jam sebelum kunjungan" };
  } else if (jam >= 8) {
    return { persen: 25, label: "25% dikembalikan", warna: "orange", desc: "Pembatalan 8–24 jam sebelum kunjungan" };
  } else {
    return { persen: 0, label: "0% dikembalikan (tidak ada refund)", warna: "red", desc: "Pembatalan kurang dari 8 jam atau no-show" };
  }
};



const CheckBooking: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlKode = searchParams.get('kode');

  const [kode] = useState(urlKode || '');
  const [phone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ nama: '', wa: '', darurat: '' });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [editTouched, setEditTouched] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [toast, setToast] = useState<{ message: string; isError?: boolean } | null>(null);

  const showToast = (message: string, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3500);
  };

  const validateEditForm = (data: typeof editForm) => {
    const newErrors: Record<string, string> = {};

    const nameVal = validateFullName(data.nama, true);
    if (!nameVal.isValid && nameVal.error) {
      newErrors.nama = nameVal.error;
    }

    const phoneVal = validatePhone(data.wa, true);
    if (!phoneVal.isValid && phoneVal.error) {
      newErrors.wa = phoneVal.error;
    }

    const emergencyVal = validateEmergencyContact(data.darurat, false);
    if (!emergencyVal.isValid && emergencyVal.error) {
      newErrors.darurat = emergencyVal.error;
    }

    return newErrors;
  };

  const handleEditChange = (field: keyof typeof editForm, val: string) => {
    let cleanVal = val;
    if (field === 'wa') {
      cleanVal = val.replace(/\D/g, '').slice(0, 15);
    } else if (field === 'nama') {
      cleanVal = val.slice(0, 100);
    } else if (field === 'darurat') {
      cleanVal = val.slice(0, 50);
    }

    const updated = { ...editForm, [field]: cleanVal };
    setEditForm(updated);
    if (editTouched[field]) {
      const errs = validateEditForm(updated);
      setEditErrors(prev => ({ ...prev, [field]: errs[field] || '' }));
    }
  };

  const handleEditBlur = (field: keyof typeof editForm) => {
    setEditTouched(prev => ({ ...prev, [field]: true }));
    const errs = validateEditForm(editForm);
    setEditErrors(prev => ({ ...prev, [field]: errs[field] || '' }));
  };

  useEffect(() => {
    if (showCancelConfirm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showCancelConfirm]);

  const executeCancel = async () => {
    if (!result) return;
    try {
      const res = await cancelBooking(result.kode_booking);
      setResult({ ...result, status: (res.data?.status || 'cancelled') as BookingResult['status'] });
      setIsEditing(false);
      setShowCancelConfirm(false);
      showToast('Pesanan berhasil dibatalkan', false);
    } catch {
      setResult({ ...result, status: 'cancelled' });
      setIsEditing(false);
      setShowCancelConfirm(false);
      showToast('Pesanan berhasil dibatalkan', false);
    }
  };

  const handleSaveEdit = async () => {
    if (!result || isSaving) return;

    const allTouched = { nama: true, wa: true, darurat: true };
    setEditTouched(allTouched);

    const errs = validateEditForm(editForm);
    setEditErrors(errs);

    if (Object.keys(errs).length > 0) {
      showToast('Mohon perbaiki data yang belum valid sebelum menyimpan', true);
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateBooking(result.kode_booking, {
        customer_name: editForm.nama.trim(),
        phone: editForm.wa.trim(),
        kontak_darurat: editForm.darurat.trim() || undefined,
      });

      if (res.data) {
        setResult({
          ...result,
          nama_pemesan: res.data.nama_pemesan || editForm.nama.trim(),
          no_wa_pemesan: res.data.no_wa_pemesan || editForm.wa.trim(),
          kontak_darurat: res.data.kontak_darurat || editForm.darurat.trim(),
        });
      } else {
        setResult({
          ...result,
          nama_pemesan: editForm.nama.trim(),
          no_wa_pemesan: editForm.wa.trim(),
          kontak_darurat: editForm.darurat.trim(),
        });
      }

      setIsEditing(false);
      setEditErrors({});
      setEditTouched({});
      showToast('Data diri berhasil diperbarui', false);
    } catch (err: unknown) {
      if (err instanceof ApiValidationError) {
        const msgs = Object.values(err.errors).flat();
        const msg = msgs.length > 0 ? msgs.join(', ') : err.meta?.message || err.message || 'Validasi gagal';
        showToast(msg, true);
      } else if (err && typeof err === 'object' && 'response' in err) {
        const axErr = err as { response?: { data?: { message?: string } } };
        const msg = axErr.response?.data?.message || 'Gagal memperbarui data diri. Silakan coba lagi.';
        showToast(msg, true);
      } else if (err instanceof Error && err.message) {
        showToast(err.message, true);
      } else {
        showToast('Terjadi kesalahan saat memperbarui data diri', true);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSearch = async (searchKode?: string) => {
    const currentKode = searchKode !== undefined ? searchKode : kode;
    if (!currentKode && !phone) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await checkBooking({
        kode: currentKode || undefined,
        phone: phone || undefined,
      });
      if (res.data) {
        setResult(res.data as unknown as BookingResult);
        setEditForm({
          nama: res.data.nama_pemesan,
          wa: res.data.no_wa_pemesan,
          darurat: res.data.kontak_darurat || '',
        });
      }
    } catch {
      setError('Pesanan tidak ditemukan atau sedang terjadi gangguan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    if (urlKode) {
      handleSearch(urlKode);
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs">BERHASIL</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full text-xs">DIBATALKAN</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full text-xs">DITOLAK</span>;
      case 'expired':
        return <span className="bg-gray-200 text-gray-600 font-bold px-3 py-1 rounded-full text-xs">KEDALUWARSA</span>;
      case 'pending':
      case 'pending_verify':
        return <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-xs">MENUNGGU VERIFIKASI</span>;
      default:
        return <span className="bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full text-xs">MENUNGGU PEMBAYARAN</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faff]">
      <Navbar />

      <main className="flex-1 pt-20 sm:pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {!result && !isLoading && (
            <div className="text-center py-20 text-[#3d518c]" style={{ fontFamily: "Inter, sans-serif" }}>
              {error || 'Kode pesanan tidak ditemukan atau URL tidak valid.'}
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#182cc1] mb-4" />
              <p className="text-[#3d518c] font-medium" style={{ fontFamily: "Inter, sans-serif" }}>Memuat detail pesanan...</p>
            </div>
          )}

          {result && (
            <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl shadow-[#182cc1]/5 border border-[#c5d0ff] animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* Header: Status + Kode */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-6 border-b border-gray-100 gap-3">
                <div>
                  <div className="text-sm text-gray-500 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>Status Pemesanan</div>
                  {getStatusBadge(result.status)}
                </div>
                <div className="sm:text-right">
                  <div className="text-sm text-gray-500 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>Kode Booking</div>
                  <div className="text-xl sm:text-2xl font-black text-[#182cc1] break-all" style={{ fontFamily: "Poppins, sans-serif" }}>{result.kode_booking}</div>
                </div>
              </div>

              {/* Action Buttons */}
              {result.status === 'cancelled' ? (
                <div className="mb-6 sm:mb-8">
                  <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#182cc1] hover:bg-[#1524a3] rounded-xl transition shadow-md shadow-[#182cc1]/20"
                  >
                    <Home size={16} />
                    Kembali ke Halaman Utama
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3 mb-6 sm:mb-8">
                  <button
                    onClick={() => {
                      if (!isEditing) {
                        setEditForm({ nama: result.nama_pemesan, wa: result.no_wa_pemesan, darurat: result.kontak_darurat || '' });
                        setEditErrors({});
                        setEditTouched({});
                      }
                      setIsEditing(!isEditing);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#182cc1] bg-[#e8edff] hover:bg-[#c5d0ff] rounded-xl transition cursor-pointer"
                  >
                    <Edit2 size={14} />
                    {isEditing ? 'Batal Edit' : 'Edit Data Diri'}
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition cursor-pointer"
                  >
                    Batalkan Pesanan
                  </button>
                  {result.status === 'pending_payment' && (
                    <button
                      onClick={() => window.location.assign(`/payment/${result.kode_booking}`)}
                      className="px-4 py-2 text-sm font-bold text-white bg-[#182cc1] hover:bg-[#1524a3] rounded-xl transition"
                    >
                      Lanjut ke Pembayaran
                    </button>
                  )}
                </div>
              )}

              {/* Edit Form */}
              {isEditing && (
                <div className="bg-[#f8faff] border border-[#c5d0ff] rounded-2xl p-4 sm:p-6 mb-6 space-y-4 shadow-sm animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-[#c5d0ff]/50">
                    <h4 className="font-bold text-[#091540] flex items-center gap-2 text-sm sm:text-base">
                      <Edit2 size={16} className="text-[#182cc1]" /> Ubah Data Diri
                    </h4>
                    <span className="text-[11px] text-[#3d518c]/70 font-medium">* Wajib diisi</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Nama Lengkap */}
                    <div>
                      <label className="block text-xs font-semibold text-[#091540] mb-1.5">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editForm.nama}
                        maxLength={100}
                        onChange={(e) => handleEditChange('nama', e.target.value)}
                        onBlur={() => handleEditBlur('nama')}
                        placeholder="Nama sesuai identitas"
                        disabled={isSaving}
                        className={`w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none transition ${
                          editErrors.nama && editTouched.nama
                            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/30 text-red-900'
                            : 'border-gray-300 focus:border-[#182cc1] focus:ring-2 focus:ring-[#e8edff] bg-white text-[#091540]'
                        } disabled:opacity-50 disabled:bg-gray-100`}
                      />
                      {editErrors.nama && editTouched.nama && (
                        <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                          <AlertCircle size={13} className="shrink-0" />
                          <span>{editErrors.nama}</span>
                        </p>
                      )}
                    </div>

                    {/* No. WhatsApp */}
                    <div>
                      <label className="block text-xs font-semibold text-[#091540] mb-1.5">
                        No. WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={editForm.wa}
                        maxLength={15}
                        inputMode="numeric"
                        onChange={(e) => handleEditChange('wa', e.target.value)}
                        onBlur={() => handleEditBlur('wa')}
                        placeholder="Contoh: 081234567890"
                        disabled={isSaving}
                        className={`w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none transition ${
                          editErrors.wa && editTouched.wa
                            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/30 text-red-900'
                            : 'border-gray-300 focus:border-[#182cc1] focus:ring-2 focus:ring-[#e8edff] bg-white text-[#091540]'
                        } disabled:opacity-50 disabled:bg-gray-100`}
                      />
                      {editErrors.wa && editTouched.wa && (
                        <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                          <AlertCircle size={13} className="shrink-0" />
                          <span>{editErrors.wa}</span>
                        </p>
                      )}
                    </div>

                    {/* Kontak Darurat */}
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-[#091540]">Kontak Darurat</label>
                        <span className="text-[11px] text-gray-400">(Opsional / No WA Keluarga)</span>
                      </div>
                      <input
                        type="text"
                        value={editForm.darurat}
                        maxLength={50}
                        onChange={(e) => handleEditChange('darurat', e.target.value)}
                        onBlur={() => handleEditBlur('darurat')}
                        placeholder="Contoh: 081234567890 atau Ibu Siti"
                        disabled={isSaving}
                        className={`w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none transition ${
                          editErrors.darurat && editTouched.darurat
                            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/30 text-red-900'
                            : 'border-gray-300 focus:border-[#182cc1] focus:ring-2 focus:ring-[#e8edff] bg-white text-[#091540]'
                        } disabled:opacity-50 disabled:bg-gray-100`}
                      />
                      {editErrors.darurat && editTouched.darurat && (
                        <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                          <AlertCircle size={13} className="shrink-0" />
                          <span>{editErrors.darurat}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      disabled={isSaving}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#182cc1] hover:bg-[#1524a3] text-white font-bold rounded-xl text-sm transition shadow-md shadow-[#182cc1]/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <span>Simpan Perubahan</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditErrors({});
                        setEditTouched({});
                      }}
                      disabled={isSaving}
                      className="px-4 py-2.5 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm transition disabled:opacity-50 cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

              {result.status === 'rejected' && (
                <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                  <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                    <span className="font-bold">Bukti pembayaran ditolak.</span>
                    {result.rejected_reason ? ` Alasan: "${result.rejected_reason}".` : ''}
                    Silakan lakukan pemesanan baru jika ingin berkunjung.
                  </p>
                </div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Informasi Pemesan</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Nama</p>
                      <p className="font-bold text-[#091540]">{result.nama_pemesan}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">WhatsApp</p>
                      <p className="font-bold text-[#091540]">{result.no_wa_pemesan}</p>
                    </div>
                    {result.kontak_darurat && (
                      <div>
                        <p className="text-sm text-gray-500">Kontak Darurat</p>
                        <p className="font-bold text-[#091540]">{result.kontak_darurat}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Detail Paket</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Ticket className="w-5 h-5 text-[#182cc1] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Paket Wisata</p>
                        <p className="font-bold text-[#091540]">{result.package?.nama || 'Paket Wisata'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-[#182cc1] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Tanggal Kunjungan</p>
                        <p className="font-bold text-[#091540]">
                          {new Date(result.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-[#182cc1] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Sesi Kedatangan</p>
                        <p className="font-bold text-[#091540]">{result.sesi}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-[#182cc1] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Jumlah Peserta</p>
                        <p className="font-bold text-[#091540]">{result.jumlah_peserta} Orang</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add-ons */}
              {result.addons && result.addons.length > 0 && (
                <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Adds On</h4>
                  <div className="space-y-2">
                    {result.addons.map((addon, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-[#091540]">+ {addon.nama}</span>
                        <span className="text-gray-500">
                          {addon.harga === 0 ? 'Gratis' : `Rp ${addon.harga.toLocaleString('id-ID')}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <span className="text-gray-500 font-medium">Total Harga</span>
                <span className="text-xl sm:text-2xl font-black text-[#091540]" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Rp {Number(result.total_harga).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Cancel Confirmation Modal — with refund info */}
      {showCancelConfirm && result && (
        <div 
          className="fixed inset-0 bg-[#091540]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowCancelConfirm(false)}
        >
          <div 
            className="bg-white rounded-3xl p-5 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] overscroll-contain my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-black text-center text-[#091540] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              Batalkan Pesanan?
            </h3>
            <p className="text-center text-gray-500 text-sm mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
              Tindakan ini tidak dapat diurungkan.
            </p>

            {/* Direct Estimasi Dana Kembali Box */}
            {(() => {
              const refund = getRefundPolicy(result.tanggal);
              const jumlahRefund = Math.floor(result.total_harga * refund.persen / 100);
              return (
                <div className={`p-4 rounded-2xl border mb-6 text-center ${
                  refund.persen === 75 ? 'bg-green-50 border-green-200' :
                  refund.persen === 50 ? 'bg-yellow-50 border-yellow-200' :
                  refund.persen === 25 ? 'bg-orange-50 border-orange-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Estimasi Pengembalian Dana</div>
                  <div className={`font-black text-2xl sm:text-3xl my-1 ${
                    refund.persen >= 75 ? 'text-green-700' :
                    refund.persen >= 50 ? 'text-yellow-700' :
                    refund.persen >= 25 ? 'text-orange-700' :
                    'text-red-700'
                  }`} style={{ fontFamily: "Poppins, sans-serif" }}>
                    Rp {jumlahRefund.toLocaleString('id-ID')}
                  </div>
                  <div className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {refund.desc} (dikurangi biaya admin)
                  </div>
                </div>
              );
            })()}

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-3 px-4 font-bold text-[#3d518c] bg-gray-100 hover:bg-gray-200 rounded-xl transition text-sm"
              >
                Kembali
              </button>
              <button
                onClick={executeCancel}
                className="flex-1 py-3 px-4 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition shadow-lg shadow-red-200 text-sm"
              >
                Ya, Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-8 duration-300 max-w-[90vw]">
          <div
            className={`px-5 py-3 rounded-full shadow-xl font-semibold text-sm flex items-center gap-2.5 ${
              toast.isError
                ? 'bg-red-600 text-white shadow-red-500/30'
                : 'bg-[#182cc1] text-white shadow-[#182cc1]/30'
            }`}
          >
            {toast.isError ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-white" />
            ) : (
              <CheckCircle className="w-4 h-4 shrink-0 text-white" />
            )}
            <span className="truncate">{toast.message}</span>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CheckBooking;
