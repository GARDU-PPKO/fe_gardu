import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';
import BookingLayout from '../../components/layout/BookingLayout';
import BookingSummary from '../../components/booking/BookingSummary';
import { getSettings } from '../../services/village.service';
import { createBooking } from '../../services/booking.service';
import type { Setting } from '../../types';
import { CheckCircle, Ticket, Waves, MessageSquare } from "lucide-react";

const BookingPayment: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData, resetBooking } = useBooking();
  const [waAdmin, setWaAdmin] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketNumber] = useState(() => `GTS-${Math.floor(100000 + Math.random() * 900000)}`);

  useEffect(() => {
    getSettings('wa_admin').then(res => {
      const wa = res.data?.find((item: Setting) => item.key === 'wa_admin')?.value;
      if (wa) setWaAdmin(wa);
    }).catch(() => {});
  }, []);

  const { selectedPackage, date, session, userDetails } = bookingData;
  const price = selectedPackage?.price || 0;
  const participants = bookingData.participants || 1;
  const totalPrice = price * participants;

  useEffect(() => {
    if (!selectedPackage && !isSubmitted) {
      navigate('/booking/package');
    }
  }, [selectedPackage, isSubmitted, navigate]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (selectedPackage) {
        await createBooking({
          package_id: selectedPackage.id,
          customer_name: userDetails.fullName || 'Tamu',
          phone: userDetails.whatsapp || '',
          email: userDetails.email,
          date: date || new Date().toISOString().split('T')[0],
          session_time: session || 'Pagi (07.00 - 09.00)',
          participants: participants,
          notes: userDetails.notes
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
    const message = `Halo Admin Wisata Desa Getas,\nSaya telah melakukan pemesanan paket wisata dengan rincian berikut:\n\n📌 *Paket Wisata:* ${selectedPackage?.name}\n📅 *Tanggal Kunjungan:* ${date}\n⏰ *Sesi:* ${session}\n👥 *Jumlah Peserta:* ${participants} orang\n💰 *Total Estimasi Pembayaran:* Rp ${totalPrice.toLocaleString('id-ID')}\n\n👤 *Data Pemesan:*\n- Nama: ${userDetails.fullName}\n- WhatsApp: ${userDetails.whatsapp}\n${userDetails.email ? `- Email: ${userDetails.email}\n` : ''}${userDetails.notes ? `📝 *Catatan Tambahan:*\n${userDetails.notes}\n` : ''}\nMohon konfirmasi ketersediaan dan instruksi selanjutnya. Terima kasih!`;

    const cleanWa = waAdmin ? waAdmin.replace(/[^0-9]/g, '') : '6281234567890';
    const finalWa = cleanWa.startsWith('0') ? '62' + cleanWa.slice(1) : cleanWa;
    const whatsappUrl = `https://wa.me/${finalWa}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const formattedDate = date
    ? new Date(date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "—";

  const shortDate = date
    ? new Date(date).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    : "—";

  const includes = selectedPackage?.includes && selectedPackage.includes.length > 0
    ? selectedPackage.includes
    : ['Safety equipment', 'Multiple guide', 'Makan siang', 'Area gathering'];

  // ══ STEP 4: Sukses ══
  if (isSubmitted) {
    return (
      <BookingLayout currentStep={4}>
        <div className="max-w-lg mx-auto text-center py-8">
          <div className="w-24 h-24 rounded-full bg-[#e8edff] border-4 border-[#c5d0ff] flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle size={48} className="text-[#182cc1]" />
          </div>
          <h3 className="text-2xl font-black text-[#091540] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
            Pesanan Berhasil! 🎉
          </h3>
          <p className="text-[#3d518c] text-sm mb-6 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
            Terima kasih, <strong className="text-[#091540]">{userDetails.fullName}</strong>! Pesanan Anda telah diterima dan sedang diproses.
          </p>

          {/* booking card */}
          <div className="bg-white rounded-2xl border-2 border-[#c5d0ff] p-6 mb-6 text-left shadow-lg">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#c5d0ff]">
              <div>
                <div className="text-xs text-[#3d518c] mb-1">Kode Pemesanan</div>
                <div className="text-2xl font-black text-[#182cc1] tracking-wider" style={{ fontFamily: "Poppins, sans-serif" }}>{ticketNumber}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#182cc1] flex items-center justify-center">
                <Waves size={22} className="text-white" />
              </div>
            </div>
            {[
              { label: "Nama Pemesan", value: userDetails.fullName, bold: false },
              { label: "Paket", value: selectedPackage?.name || '-', bold: false },
              { label: "Tanggal", value: shortDate, bold: false },
              { label: "Sesi", value: session || '-', bold: false },
              { label: "Peserta", value: `${participants} orang`, bold: false },
              { label: "Total", value: `Rp ${totalPrice.toLocaleString('id-ID')}`, bold: true },
            ].map(r => (
              <div key={r.label} className="flex justify-between py-2 text-sm border-b border-[#eef2ff] last:border-0 gap-3">
                <span className="text-[#3d518c] flex-shrink-0" style={{ fontFamily: "Inter, sans-serif" }}>{r.label}</span>
                <span className={`${r.bold ? "text-[#182cc1] font-bold" : "text-[#091540] font-medium"} text-right`}
                  style={{ fontFamily: "Poppins, sans-serif" }}>{r.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleWhatsAppRedirect}
              type="button"
              className="w-full py-4 bg-[#182cc1] hover:bg-[#1524a3] text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-[#c5d0ff] text-sm"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <MessageSquare size={18} /> Konfirmasi via WhatsApp
            </button>
            <button
              onClick={() => { resetBooking(); navigate('/'); }}
              type="button"
              className="w-full py-3 border border-[#c5d0ff] bg-white text-[#3d518c] hover:bg-[#eef2ff] rounded-2xl transition text-sm font-medium"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Kembali ke Beranda
            </button>
          </div>

          <p className="text-xs text-[#3d518c] mt-4 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
            Screenshot kode pemesanan ini dan tunjukkan saat kedatangan.<br />
            Pembayaran dilakukan di lokasi.
          </p>
        </div>
      </BookingLayout>
    );
  }

  // ══ STEP 3: Konfirmasi ══
  const detailRows = [
    { label: "Paket", value: selectedPackage?.name || '-' },
    { label: "Tanggal", value: formattedDate },
    { label: "Sesi", value: session || '-' },
    { label: "Peserta", value: `${participants} orang` },
    { label: "Nama Pemesan", value: userDetails.fullName || '-' },
    { label: "No. WhatsApp", value: userDetails.whatsapp || '-' },
    ...(userDetails.email ? [{ label: "Email", value: userDetails.email }] : []),
    ...(userDetails.city ? [{ label: "Kota Asal", value: userDetails.city }] : []),
    ...(userDetails.notes ? [{ label: "Catatan", value: userDetails.notes }] : []),
  ];

  return (
    <BookingLayout currentStep={3}>
      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        <div>
          <h3 className="text-lg font-bold text-[#091540] mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
            Review & Konfirmasi Pesanan
          </h3>

          {/* Package preview */}
          <div className="rounded-2xl overflow-hidden border border-[#c5d0ff] mb-5">
            <div className="relative h-36">
              {selectedPackage?.image ? (
                <img src={selectedPackage.image} alt={selectedPackage.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#182cc1]/30 to-[#eef2ff]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-5">
                <div>
                  <div className="text-white font-black text-xl" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {selectedPackage?.name || 'Paket Wisata'}
                  </div>
                  <div className="text-white/80 text-sm mt-1">Sungai Blukar, Desa Getas</div>
                </div>
              </div>
            </div>
          </div>

          {/* Detail rows */}
          <div className="bg-white rounded-2xl border border-[#c5d0ff] overflow-hidden mb-5">
            {detailRows.map((r, i) => (
              <div key={r.label} className={`flex items-start gap-4 px-5 py-3 ${i % 2 === 0 ? "bg-white" : "bg-[#eef2ff]"}`}>
                <span className="text-[#3d518c] text-sm w-32 flex-shrink-0" style={{ fontFamily: "Inter, sans-serif" }}>
                  {r.label}
                </span>
                <span className="text-[#091540] text-sm font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                  {r.value}
                </span>
              </div>
            ))}
          </div>

          {/* Includes */}
          <div className="bg-[#e8edff] border border-[#c5d0ff] rounded-2xl p-4 mb-5">
            <div className="text-xs font-bold uppercase tracking-widest text-[#1d2e80] mb-3">Termasuk dalam Paket</div>
            <div className="grid grid-cols-2 gap-1.5">
              {includes.map(inc => (
                <div key={inc} className="flex items-center gap-2 text-sm text-[#1d2e80]" style={{ fontFamily: "Inter, sans-serif" }}>
                  <CheckCircle size={13} className="text-[#182cc1] flex-shrink-0" />
                  {inc}
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-[#091540] rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="text-[#abd2fa] text-xs mb-1" style={{ fontFamily: "Inter, sans-serif" }}>Total Pembayaran</div>
              <div className="text-white font-black text-2xl" style={{ fontFamily: "Poppins, sans-serif" }}>
                Rp {totalPrice.toLocaleString('id-ID')}
              </div>
              <div className="text-[#abd2fa] text-xs mt-0.5">
                {selectedPackage?.unit === 'orang' || !selectedPackage?.unit
                  ? `${participants} orang × Rp ${price.toLocaleString('id-ID')}`
                  : `Paket grup · ${participants} orang`}
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#182cc1]/30 flex items-center justify-center">
              <Ticket size={22} className="text-[#abd2fa]" />
            </div>
          </div>
        </div>

        {/* Sticky right column */}
        <div className="lg:sticky lg:top-4 self-start">
          <BookingSummary
            buttonText={isSubmitting ? "Memproses..." : "Konfirmasi Pesanan"}
            onButtonClick={handleSubmit}
            buttonDisabled={isSubmitting}
            showPaymentInfo={true}
            hideSummaryCard={true}
            onBackClick={() => navigate('/booking/form')}
            backButtonText="← Ubah Data"
            buttonIcon={<CheckCircle size={16} />}
          />
        </div>
      </div>
    </BookingLayout>
  );
};

export default BookingPayment;


