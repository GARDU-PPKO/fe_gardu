import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import CountdownTimer from '../../components/booking/CountdownTimer';
import { getBookingByKode, uploadBuktiBayar, resendPaymentLink } from '../../services/booking.service';
import {
  UploadCloud,
  FileImage,
  Trash2,
  CheckCircle,
  Loader2,
  Calendar,
  Clock,
  Users,
  Ticket,
  AlertCircle,
} from 'lucide-react';
import type { BookingDetail } from '../../types';

const STATUS_LABEL: Record<string, string> = {
  pending_payment: 'MENUNGGU PEMBAYARAN',
  pending_verify: 'MENUNGGU VERIFIKASI',
  confirmed: 'KONFIRMASI',
  cancelled: 'DIBATALKAN',
  expired: 'KEDALUWARSA',
  rejected: 'DITOLAK',
};

const PaymentPage: React.FC = () => {
  const { kode } = useParams<{ kode: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    if (!kode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('Kode booking tidak valid.');
      setIsLoading(false);
      return;
    }

    getBookingByKode(kode)
      .then((res) => {
        setBooking(res.data);
        // Skip screen 3: If already uploaded / pending_verify, redirect straight to CheckBooking screen (screen 4)
        if (res.data && res.data.status === 'pending_verify') {
          navigate(`/cek-pesanan?kode=${kode}&edit=1`, { replace: true });
        }
      })
      .catch(() => setError('Booking tidak ditemukan atau link tidak valid.'))
      .finally(() => setIsLoading(false));
  }, [kode, navigate]);

  const handleExpire = useCallback(() => {
    setBooking((prev) => (prev ? { ...prev, status: 'expired' } : prev));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!kode || !selectedFile) return;
    setIsSubmitting(true);
    try {
      await uploadBuktiBayar(kode, selectedFile);
      // Skip screen 3: Navigate directly to CheckBooking screen (screen 4)
      navigate(`/cek-pesanan?kode=${kode}&edit=1`);
    } catch {
      setToastMessage('Gagal mengunggah bukti. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!kode || isResending) return;
    setIsResending(true);
    try {
      await resendPaymentLink(kode);
      showToast('Link pembayaran terkirim ke WhatsApp Anda');
    } catch {
      showToast('Gagal mengirim ulang link');
    } finally {
      setIsResending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8faff]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 pt-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#182cc1]" />
          <p className="text-[#3d518c] text-sm font-medium">Memuat detail pembayaran...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8faff]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4 pt-24 pb-16 text-center">
          <AlertCircle size={40} className="text-red-500" />
          <p className="text-[#3d518c] font-medium">{error || 'Data booking tidak ditemukan.'}</p>
          <button
            onClick={() => navigate('/packages')}
            className="px-6 py-3 bg-[#182cc1] hover:bg-[#1524a3] text-white font-bold rounded-xl transition"
          >
            Lihat Paket Wisata
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const isActive = booking.status === 'pending_payment';
  const addOns = booking.addons || [];
  const paymentInfo = booking.payment_info;
  const statusLabel = STATUS_LABEL[booking.status] || 'PROSES';

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faff] text-[#091540] font-sans">
      <Navbar />

      <main className="flex-1 pt-20 sm:pt-24 pb-16 px-3 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl shadow-[#182cc1]/5 border border-[#c5d0ff] mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-gray-100">
              <div>
                <div className="text-xs sm:text-sm text-gray-500 mb-1">Status Pemesanan</div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-700'
                      : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : booking.status === 'expired'
                          ? 'bg-gray-200 text-gray-600'
                          : booking.status === 'pending_verify'
                            ? 'bg-blue-100 text-blue-700'
                            : booking.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {statusLabel}
                </span>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xs sm:text-sm text-gray-500 mb-1">Kode Booking</div>
                <div className="text-xl sm:text-2xl font-black text-[#182cc1] break-all" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {booking.kode_booking}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex items-start gap-3">
                <Ticket className="w-5 h-5 text-[#182cc1] mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Paket Wisata</p>
                  <p className="font-bold text-[#091540]">{booking.package?.nama || 'Paket Wisata'}</p>
                  {booking.package?.durasi && (
                    <p className="text-xs text-[#3d518c]">{booking.package.durasi}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#182cc1] mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Tanggal Kunjungan</p>
                  <p className="font-bold text-[#091540]">
                    {new Date(booking.tanggal).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#182cc1] mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Sesi Kedatangan</p>
                  <p className="font-bold text-[#091540]">{booking.sesi}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-[#182cc1] mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Jumlah Peserta</p>
                  <p className="font-bold text-[#091540]">{booking.jumlah_peserta} Orang</p>
                </div>
              </div>
            </div>

            {addOns.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Adds On</p>
                <div className="space-y-1.5">
                  {addOns.map((a, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="font-semibold text-[#091540]">+ {a.nama}</span>
                      <span className="text-gray-500">
                        {a.harga === 0 ? 'Gratis' : `Rp ${a.harga.toLocaleString('id-ID')}`}
                        {a.quantity > 1 ? ` × ${a.quantity}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-gray-500 font-medium">Total Tagihan</span>
              <span className="text-2xl font-black text-[#091540]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Rp {Number(booking.total_harga).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Payment action area */}
          {isActive ? (
            <div className="grid md:grid-cols-2 gap-6 items-stretch">
              {/* Upload bukti */}
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-[#091540] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Upload Bukti Pembayaran
                </h3>

                <div className="bg-white border border-[#c5d0ff] rounded-2xl p-5 shadow-sm flex-1 flex flex-col justify-center">
                  {!selectedFile ? (
                    <div
                      className="border-2 border-dashed border-[#c5d0ff] hover:border-[#182cc1] rounded-xl p-8 text-center transition-colors cursor-pointer bg-[#fafcff] hover:bg-[#eef2ff] w-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="w-14 h-14 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-[#e8edff]">
                        <UploadCloud size={24} className="text-[#182cc1]" />
                      </div>
                      <h4 className="text-[#091540] font-bold text-sm mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Klik untuk upload gambar
                      </h4>
                      <p className="text-xs text-[#3d518c]">Format JPG, PNG, atau PDF (maks. 5MB)</p>
                    </div>
                  ) : (
                    <div className="border border-[#c5d0ff] rounded-xl p-4 bg-[#f8faff] flex items-center justify-between w-full min-w-0 overflow-hidden">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-[#e8edff] flex items-center justify-center flex-shrink-0">
                          <FileImage size={20} className="text-[#182cc1]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-[#091540] truncate" title={selectedFile.name}>{selectedFile.name}</div>
                          <div className="text-xs text-[#3d518c]">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-red-500 transition-colors flex-shrink-0 ml-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/jpeg, image/png, application/pdf"
                    onChange={handleFileChange}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !selectedFile}
                  className="mt-4 w-full py-3.5 bg-[#182cc1] hover:bg-[#1524a3] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-[#c5d0ff]"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                  {isSubmitting ? 'Mengirim...' : 'Kirim Bukti Pembayaran'}
                </button>
              </div>

              {/* Instruksi pembayaran + countdown */}
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-[#091540] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Instruksi Pembayaran
                </h3>

                <CountdownTimer expiredAt={booking.expired_at} onExpire={handleExpire} />

                <div className="bg-white rounded-2xl border border-[#c5d0ff] overflow-hidden shadow-sm flex-1 flex flex-col mt-4">
                  <div className="p-5 border-b border-[#e8edff]">
                    <div className="text-xs text-[#3d518c] mb-1 font-semibold tracking-wide uppercase">Total Tagihan</div>
                    <div className="text-[#182cc1] font-black text-2xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Rp {Number(booking.total_harga).toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div className="p-5 bg-[#fafcff] flex-1">
                    <div className="text-sm font-semibold text-[#091540] mb-4">Transfer ke rekening berikut:</div>
                    <div className="bg-white border border-[#c5d0ff] rounded-xl p-4 shadow-sm">
                      <div className="text-xs text-[#3d518c] mb-1 font-medium">
                        {paymentInfo?.bank || 'Bank BRI'}
                      </div>
                      <div
                        className="font-bold text-lg text-[#091540] tracking-wider"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {paymentInfo?.nomor_rekening || '0012 3456 7890'}
                      </div>
                      <div className="text-xs text-[#3d518c] mt-1">
                        a.n. <strong>{paymentInfo?.atas_nama || 'Desa Wisata Getas'}</strong>
                      </div>
                    </div>
                    {paymentInfo?.qris_image && (
                      <img
                        src={paymentInfo.qris_image}
                        alt="QRIS"
                        className="mt-4 w-40 h-40 object-contain rounded-xl border border-[#c5d0ff] bg-white mx-auto"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#182cc1]/5 border border-[#c5d0ff] text-center">
              <CheckCircle size={40} className="text-[#182cc1] mx-auto mb-4" />
              <h3 className="text-xl font-black text-[#091540] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {booking.status === 'pending_verify'
                  ? 'Bukti Pembayaran Diterima'
                  : booking.status === 'confirmed'
                    ? 'Pesanan Dikonfirmasi'
                    : booking.status === 'cancelled'
                      ? 'Pesanan Dibatalkan'
                      : booking.status === 'rejected'
                        ? 'Bukti Pembayaran Ditolak'
                        : 'Masa Pembayaran Habis'}
              </h3>
              <p className="text-[#3d518c] text-sm mb-6 max-w-sm mx-auto">
                {booking.status === 'pending_verify'
                  ? 'Admin sedang memverifikasi pembayaran Anda. Cek status pesanan secara berkala.'
                  : booking.status === 'confirmed'
                    ? 'Pembayaran telah terverifikasi. Sampai jumpa di Desa Getas!'
                    : booking.status === 'cancelled'
                      ? 'Pesanan ini telah dibatalkan.'
                      : booking.status === 'rejected'
                        ? `Bukti pembayaran Anda ditolak admin${booking.rejected_reason ? `: "${booking.rejected_reason}"` : ''}. Silakan lakukan pemesanan baru jika ingin berkunjung.`
                        : 'Batas waktu pembayaran 24 jam telah lewat dan pesanan otomatis dibatalkan.'}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {booking.status === 'pending_verify' && (
                  <button
                    onClick={() => navigate(`/cek-pesanan?kode=${booking.kode_booking}`)}
                    className="px-6 py-3 bg-[#182cc1] hover:bg-[#1524a3] text-white font-bold rounded-xl transition"
                  >
                    Cek Status Pesanan
                  </button>
                )}
                <button
                  onClick={() => navigate('/packages')}
                  className="px-6 py-3 bg-[#e8edff] text-[#182cc1] font-bold rounded-xl transition hover:bg-[#c5d0ff]"
                >
                  Lihat Paket Lain
                </button>
              </div>
            </div>
          )}

          {/* Resend link */}
          {isActive && (
            <div className="text-center mt-6">
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-sm font-semibold text-[#182cc1] hover:underline disabled:opacity-50"
              >
                {isResending ? 'Mengirim...' : 'Belum menerima link WhatsApp? Kirim ulang'}
              </button>
            </div>
          )}
        </div>
      </main>

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-[#182cc1] text-white px-6 py-3 rounded-full shadow-xl shadow-[#182cc1]/30 font-semibold text-sm">
            {toastMessage}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PaymentPage;
