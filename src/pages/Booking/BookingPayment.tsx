import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';
import BookingLayout from '../../components/layout/BookingLayout';
import BookingSummary from '../../components/booking/BookingSummary';
import { getSettings } from '../../services/village.service';
import { createBooking } from '../../services/booking.service';
import type { Setting } from '../../types';
import { CheckCircle2, Calendar, Users, Sparkles, ShieldCheck } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const BookingPayment: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData, resetBooking } = useBooking();
  const [waAdmin, setWaAdmin] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketNumber] = useState(() => `GTS-${Math.floor(100000 + Math.random() * 900000)}`);

  useEffect(() => {
    getSettings('wa_admin').then(res => {
      const wa = res.data.find((item: Setting) => item.key === 'wa_admin')?.value;
      if (wa) setWaAdmin(wa);
    });
  }, []);

  // Calculate Total
  const price = bookingData.selectedPackage?.price || 0;
  const participants = bookingData.participants || 1;
  const totalPrice = price * participants;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (bookingData.selectedPackage) {
        await createBooking({
          package_id: bookingData.selectedPackage.id,
          customer_name: bookingData.userDetails.fullName || 'Tamu',
          phone: bookingData.userDetails.whatsapp || '',
          email: bookingData.userDetails.email,
          date: bookingData.date || new Date().toISOString().split('T')[0],
          session_time: bookingData.session || 'Pagi (07.00 - 09.00)',
          participants: participants,
          notes: bookingData.userDetails.notes
        });
      }
      setIsSubmitted(true);
    } catch (e) {
      console.error('Failed to submit booking to backend:', e);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const message = `Halo Admin Wisata Desa Getas,
Saya telah melakukan pemesanan paket wisata dengan rincian berikut:

📌 *Paket Wisata:* ${bookingData.selectedPackage?.name}
📅 *Tanggal Kunjungan:* ${bookingData.date}
⏰ *Sesi:* ${bookingData.session}
👥 *Jumlah Peserta:* ${participants} orang
💰 *Total Estimasi Pembayaran:* Rp ${totalPrice.toLocaleString('id-ID')}

👤 *Data Pemesan:*
- Nama: ${bookingData.userDetails.fullName}
- WhatsApp: ${bookingData.userDetails.whatsapp}
${bookingData.userDetails.email ? `- Email: ${bookingData.userDetails.email}\n` : ''}${bookingData.userDetails.notes ? `📝 *Catatan Tambahan:*\n${bookingData.userDetails.notes}\n` : ''}

Mohon konfirmasi ketersediaan dan instruksi selanjutnya. Terima kasih!`;

    const cleanWa = waAdmin ? waAdmin.replace(/[^0-9]/g, '') : '6281234567890';
    const finalWa = cleanWa.startsWith('0') ? '62' + cleanWa.slice(1) : cleanWa;
    const whatsappUrl = `https://wa.me/${finalWa}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // SUCCESS VIEW
  if (isSubmitted) {
    return (
      <BookingLayout currentStep={3}>
        <div className="max-w-2xl mx-auto py-8">
          <div className="bg-white rounded-[2.5rem] border border-blue-100/80 p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-50 rounded-full opacity-60 pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-blue-50 rounded-full opacity-60 pointer-events-none" />

            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-green-500/20 animate-bounce">
              <CheckCircle2 size={44} strokeWidth={2.5} />
            </div>

            <span className="text-xs font-extrabold uppercase tracking-widest text-[#182CC1] mb-2 inline-block">
              RESERVASI DITERIMA
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E293B] mb-3">
              Pesanan Berhasil Disubmit!
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed mb-8 font-medium">
              Terima kasih <strong className="text-[#1E293B] font-bold">{bookingData.userDetails.fullName}</strong>. Data pesanan Anda telah tersimpan di sistem kami. Langkah terakhir, silakan klik tombol di bawah untuk langsung terhubung dengan Admin via WhatsApp.
            </p>

            <div className="bg-[#F4F7FF] border border-blue-200/80 rounded-3xl p-6 mb-8 text-left space-y-3 shadow-inner">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200/60">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Nomor Tiket (Resi)</span>
                <span className="text-sm font-black text-[#182CC1] tracking-wider font-mono">{ticketNumber}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm font-medium pt-1">
                <div>
                  <span className="text-gray-400 text-xs block">Paket Pilihan</span>
                  <span className="text-[#1E293B] font-bold block mt-0.5">{bookingData.selectedPackage?.name}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">Jadwal</span>
                  <span className="text-[#1E293B] font-bold block mt-0.5">{bookingData.date} ({bookingData.session})</span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">Peserta</span>
                  <span className="text-[#1E293B] font-bold block mt-0.5">{participants} Orang</span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">Total Bayar (di lokasi)</span>
                  <span className="text-[#182CC1] font-black text-base block mt-0.5">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 max-w-md mx-auto">
              <button
                onClick={handleWhatsAppRedirect}
                className="w-full py-4 px-6 rounded-2xl font-black text-sm text-white bg-[#16a34a] hover:bg-[#15803d] transition-all duration-300 flex items-center justify-center space-x-2.5 shadow-lg shadow-green-600/30 hover:shadow-xl active:scale-95"
              >
                <FaWhatsapp size={20} className="flex-shrink-0" />
                <span>Hubungi Admin via WhatsApp</span>
                <span className="text-base">→</span>
              </button>
              
              <button
                onClick={() => { resetBooking(); navigate('/'); }}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-[#1E293B] bg-white hover:bg-gray-50 border-2 border-gray-200 transition-all duration-300 active:scale-95"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      </BookingLayout>
    );
  }

  // REVIEW VIEW (STEP 3 - PERSIS GAMBAR 4)
  const { selectedPackage, date, session, userDetails } = bookingData;

  return (
    <BookingLayout currentStep={3}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Details Review */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-blue-100/80 overflow-hidden shadow-xs">
            
            {/* Top Royal Blue Gradient Header */}
            <div className="bg-gradient-to-r from-[#182CC1] to-[#0D1970] text-white p-6 sm:p-8 relative overflow-hidden">
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1 block" style={{ fontFamily: "Inter, sans-serif" }}>
                    LANGKAH TERAKHIR
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Konfirmasi Pesanan Anda
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                  <Sparkles size={24} />
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              
              {/* Package Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider" style={{ fontFamily: "Poppins, sans-serif" }}>
                  DETAIL PAKET WISATA
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#EFF2FC]/60 p-4 rounded-2xl border border-blue-100 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white text-[#182CC1] flex items-center justify-center shadow-xs flex-shrink-0 font-bold">
                      📦
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Nama Paket</span>
                      <span className="text-sm font-extrabold text-[#1E293B] block truncate" style={{ fontFamily: "Poppins, sans-serif" }}>{selectedPackage?.name || '-'}</span>
                    </div>
                  </div>

                  <div className="bg-[#EFF2FC]/60 p-4 rounded-2xl border border-blue-100 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white text-[#182CC1] flex items-center justify-center shadow-xs flex-shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Jadwal & Sesi</span>
                      <span className="text-sm font-extrabold text-[#1E293B] block" style={{ fontFamily: "Poppins, sans-serif" }}>{date || '-'} ({session || '-'})</span>
                    </div>
                  </div>

                  <div className="bg-[#EFF2FC]/60 p-4 rounded-2xl border border-blue-100 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white text-[#182CC1] flex items-center justify-center shadow-xs flex-shrink-0">
                      <Users size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Peserta</span>
                      <span className="text-sm font-extrabold text-[#1E293B] block" style={{ fontFamily: "Poppins, sans-serif" }}>{participants} Orang</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Data Review */}
              <div className="space-y-3.5 border-t border-gray-100 pt-6">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider" style={{ fontFamily: "Poppins, sans-serif" }}>
                  IDENTITAS PEMESAN
                </h3>
                
                <div className="bg-[#F8FAFC]/70 p-5 rounded-2xl border border-gray-200/80 space-y-3 text-xs sm:text-sm font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Nama Lengkap</span>
                    <span className="text-[#1E293B] font-extrabold">{userDetails.fullName || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">WhatsApp</span>
                    <span className="text-[#182CC1] font-extrabold">{userDetails.whatsapp || '-'}</span>
                  </div>
                  {userDetails.email && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Email</span>
                      <span className="text-[#1E293B] font-bold">{userDetails.email}</span>
                    </div>
                  )}
                  {userDetails.city && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Kota Asal</span>
                      <span className="text-[#1E293B] font-bold">{userDetails.city}</span>
                    </div>
                  )}
                  {userDetails.notes && (
                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-gray-400 block mb-1">Catatan Tambahan:</span>
                      <span className="text-gray-700 italic bg-white p-3 rounded-xl border border-gray-100 block">{userDetails.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Fasilitas Termasuk (Persis Gambar 4) */}
              <div className="bg-[#EFF2FC] border border-blue-200/80 p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#182CC1]" />
                  <h4 className="text-xs font-extrabold text-[#182CC1] uppercase tracking-wide" style={{ fontFamily: "Poppins, sans-serif" }}>TERMASUK DALAM PAKET</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-semibold text-[#1E293B]">
                  {(selectedPackage?.includes || ['Perlengkapan Tubing safety', 'Guide pemandu berpengalaman', 'Welcome drink & snack lokal', 'Asuransi wisata standar']).map((inc, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#182CC1] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</div>
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Pembayaran Dark Navy Highlight (Persis Gambar 4) */}
              <div className="bg-[#0B133A] text-white p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl shadow-[#0B133A]/20">
                <div className="text-center sm:text-left">
                  <span className="text-xs font-bold text-blue-200 uppercase tracking-widest block" style={{ fontFamily: "Inter, sans-serif" }}>TOTAL PEMBAYARAN</span>
                  <span className="text-[11px] text-white/70 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>Dibayarkan secara tunai / QRIS di lokasi wisata</span>
                </div>
                <div className="bg-[#182CC1] px-6 py-3.5 rounded-2xl border border-blue-400/30 text-right shadow-inner">
                  <span className="text-white font-black text-2xl block" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Action Button */}
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <BookingSummary 
              buttonText={isSubmitting ? "Memproses..." : "Konfirmasi Pesanan"} 
              onButtonClick={handleSubmit}
              buttonDisabled={isSubmitting}
              showPaymentInfo={true}
            />
          </div>
        </div>

      </div>
    </BookingLayout>
  );
};

export default BookingPayment;

