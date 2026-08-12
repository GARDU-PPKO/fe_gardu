import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { checkBooking, cancelBooking, updateBooking } from '../../services/booking.service';
import { Loader2, Calendar, Clock, Users, Ticket, AlertCircle, CheckCircle } from 'lucide-react';
import type { BookingDetail } from '../../types';

const CheckBooking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlKode = searchParams.get('kode');

  const [kode] = useState(urlKode || '');
  const [phone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingDetail | null>(null);

  // Dummy states for edit
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ nama: '', wa: '', darurat: '' });

  // UI states
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const executeCancel = async () => {
    if (!result) return;
    try {
      const res = await cancelBooking(result.kode_booking);
      setResult({ ...result, status: res.data.status as BookingDetail['status'] });
      setShowCancelConfirm(false);
      showToast('Pesanan berhasil dibatalkan');
    } catch {
      setShowCancelConfirm(false);
      showToast('Gagal membatalkan pesanan');
    }
  };

  const handleSaveEdit = async () => {
    if (!result) return;
    try {
      const res = await updateBooking(result.kode_booking, {
        customer_name: editForm.nama,
        phone: editForm.wa,
        kontak_darurat: editForm.darurat,
      });
      setResult(res.data);
      setIsEditing(false);
      showToast('Data diri berhasil diperbarui');
    } catch {
      showToast('Gagal memperbarui data');
    }
  };

  const handleSearch = async (searchKode?: string) => {
    const currentKode = searchKode !== undefined ? searchKode : kode;

    if (!currentKode && !phone) {
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await checkBooking({
        kode: currentKode || undefined,
        phone: phone || undefined,
      });
      setResult(res.data);
      setEditForm({
        nama: res.data.nama_pemesan,
        wa: res.data.no_wa_pemesan,
        darurat: res.data.kontak_darurat || '',
      });
    } catch {
      setError('Kode pesanan tidak ditemukan atau URL tidak valid.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (urlKode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      case 'pending_verify':
        return <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-xs">MENUNGGU VERIFIKASI</span>;
      default:
        return <span className="bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full text-xs">MENUNGGU PEMBAYARAN</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faff]">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
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
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#182cc1]/5 border border-[#c5d0ff] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-6 border-b border-gray-100 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>Status Pemesanan</div>
                  {getStatusBadge(result.status)}
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-sm text-gray-500 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>Kode Booking</div>
                  <div className="text-2xl font-black text-[#182cc1]" style={{ fontFamily: "Poppins, sans-serif" }}>{result.kode_booking}</div>
                </div>
              </div>

              {/* Action Buttons */}
              {(result.status === 'pending_payment' || result.status === 'pending_verify' || result.status === 'confirmed') && (
                <div className="flex flex-wrap gap-3 mb-8">
                  <button
                    onClick={() => {
                      setEditForm({ nama: result.nama_pemesan, wa: result.no_wa_pemesan, darurat: result.kontak_darurat || '' });
                      setIsEditing(!isEditing);
                    }}
                    className="px-4 py-2 text-sm font-bold text-[#182cc1] bg-[#e8edff] hover:bg-[#c5d0ff] rounded-xl transition"
                  >
                    {isEditing ? 'Batal Edit' : 'Edit Data Diri'}
                  </button>
                  {(result.status === 'pending_payment' || result.status === 'pending_verify') && (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
                    >
                      Batalkan Pesanan
                    </button>
                  )}
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

              {isEditing && (
                <div className="bg-[#f8faff] border border-[#c5d0ff] rounded-xl p-4 mb-6 space-y-4">
                  <h4 className="font-bold text-[#091540]">Ubah Data Diri</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#091540] mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        value={editForm.nama}
                        onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#182cc1] focus:ring-1 focus:ring-[#182cc1] rounded-lg text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#091540] mb-1">No. WhatsApp</label>
                      <input
                        type="text"
                        value={editForm.wa}
                        onChange={(e) => setEditForm({ ...editForm, wa: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#182cc1] focus:ring-1 focus:ring-[#182cc1] rounded-lg text-sm outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#091540] mb-1">Kontak Darurat</label>
                      <input
                        type="text"
                        value={editForm.darurat}
                        onChange={(e) => setEditForm({ ...editForm, darurat: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#182cc1] focus:ring-1 focus:ring-[#182cc1] rounded-lg text-sm outline-none"
                        placeholder="No WA / Nama Keluarga"
                      />
                    </div>
                  </div>
                  <button onClick={handleSaveEdit} className="px-4 py-2 bg-[#182cc1] text-white font-bold rounded-lg text-sm hover:bg-[#1524a3]">
                    Simpan Perubahan
                  </button>
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
                      <Ticket className="w-5 h-5 text-[#182cc1] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Paket Wisata</p>
                        <p className="font-bold text-[#091540]">{result.package?.nama || 'Paket Wisata'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-[#182cc1] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Tanggal Kunjungan</p>
                        <p className="font-bold text-[#091540]">
                          {new Date(result.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-[#182cc1] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Sesi Kedatangan</p>
                        <p className="font-bold text-[#091540]">{result.sesi}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-[#182cc1] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Jumlah Peserta</p>
                        <p className="font-bold text-[#091540]">{result.jumlah_peserta} Orang</p>
                      </div>
                    </div>
                    {result.package?.durasi && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-[#182cc1] mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Durasi</p>
                          <p className="font-bold text-[#091540]">{result.package.durasi}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {result.addons && result.addons.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
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

              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <span className="text-gray-500 font-medium">Total Harga</span>
                <span className="text-2xl font-black text-[#091540]" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Rp {Number(result.total_harga).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-[#091540]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-black text-center text-[#091540] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              Batalkan Pesanan?
            </h3>
            <p className="text-center text-gray-500 text-sm mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
              Tindakan ini tidak dapat diurungkan. Pesanan Anda akan dibatalkan secara permanen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-3 px-4 font-bold text-[#3d518c] bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                Kembali
              </button>
              <button
                onClick={executeCancel}
                className="flex-1 py-3 px-4 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition shadow-lg shadow-red-200"
              >
                Ya, Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-8 duration-300">
          <div className="bg-[#182cc1] text-white px-6 py-3 rounded-full shadow-xl shadow-[#182cc1]/30 font-semibold text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {toastMessage}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CheckBooking;
