import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingLayout from '../../components/layout/BookingLayout';
import BookingSummary from '../../components/booking/BookingSummary';
import { useBooking } from '../../hooks/useBooking';
import { CheckCircle, Waves, MessageSquare } from "lucide-react";
import { getSettings } from '../../services/village.service';
import { createBooking } from '../../services/booking.service';
import type { Setting } from '../../types';

const BookingFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData, updateUserDetails, resetBooking } = useBooking();
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

  const [formData, setFormData] = useState({
    fullName: userDetails.fullName || '',
    whatsapp: userDetails.whatsapp || '',
    email: userDetails.email || '',
    city: userDetails.city || '',
    notes: userDetails.notes || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    updateUserDetails(newFormData);
  };

  const isFormValid = formData.fullName.trim() !== '' && formData.whatsapp.trim() !== '';

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    try {
      if (selectedPackage) {
        await createBooking({
          package_id: selectedPackage.id,
          customer_name: formData.fullName || 'Tamu',
          phone: formData.whatsapp || '',
          email: formData.email,
          date: date || new Date().toISOString().split('T')[0],
          session_time: session || 'Pagi (07.00 - 09.00)',
          participants: participants,
          notes: formData.notes
        });
      }
      setIsSubmitted(true);
    } catch (e) {
      console.error('Failed to submit booking:', e);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const message = `Halo Admin Wisata Desa Getas,\nSaya telah melakukan pemesanan paket wisata dengan rincian berikut:\n\n📌 *Paket Wisata:* ${selectedPackage?.name}\n📅 *Tanggal Kunjungan:* ${date}\n⏰ *Sesi:* ${session}\n👥 *Jumlah Peserta:* ${participants} orang\n💰 *Total Estimasi Pembayaran:* Rp ${totalPrice.toLocaleString('id-ID')}\n\n👤 *Data Pemesan:*\n- Nama: ${formData.fullName}\n- WhatsApp: ${formData.whatsapp}\n${formData.email ? `- Email: ${formData.email}\n` : ''}${formData.notes ? `📝 *Catatan Tambahan:*\n${formData.notes}\n` : ''}\nMohon konfirmasi ketersediaan dan instruksi selanjutnya. Terima kasih!`;

    const cleanWa = waAdmin ? waAdmin.replace(/[^0-9]/g, '') : '6281234567890';
    const finalWa = cleanWa.startsWith('0') ? '62' + cleanWa.slice(1) : cleanWa;
    const whatsappUrl = `https://wa.me/${finalWa}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shortDate = date
    ? new Date(date).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    : "—";

  if (isSubmitted) {
    return (
      <BookingLayout currentStep={3}>
        <div className="max-w-lg mx-auto text-center py-8">
          <div className="w-24 h-24 rounded-full bg-[#e8edff] border-4 border-[#c5d0ff] flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle size={48} className="text-[#182cc1]" />
          </div>
          <h3 className="text-2xl font-black text-[#091540] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
            Pesanan Berhasil! 🎉
          </h3>
          <p className="text-[#3d518c] text-sm mb-6 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
            Terima kasih, <strong className="text-[#091540]">{formData.fullName}</strong>! Pesanan Anda telah diterima dan sedang diproses.
          </p>

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
              { label: "Nama Pemesan", value: formData.fullName, bold: false },
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

  const fields = [
    { key: "fullName", label: "Nama Lengkap", placeholder: "Sesuai identitas", type: "text", val: formData.fullName, req: true, span: true },
    { key: "whatsapp", label: "No. WhatsApp", placeholder: "Contoh: 0812xxxx", type: "tel", val: formData.whatsapp, req: true, span: false },
    { key: "email", label: "Email (opsional)", placeholder: "email@contoh.com", type: "email", val: formData.email, req: false, span: false },
    { key: "city", label: "Kota Asal", placeholder: "Semarang, Kendal, dll.", type: "text", val: formData.city, req: false, span: false },
  ];

  return (
    <BookingLayout currentStep={2}>
      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        <div>
          <h3 className="text-lg font-bold text-[#091540] mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
            Data Pemesan
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.key} className={f.span ? "sm:col-span-2" : ""}>
                <label className="block text-sm font-semibold text-[#091540] mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                  {f.label} {f.req && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={f.val}
                  name={f.key}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#c5d0ff] bg-white text-[#091540] placeholder-[#3d518c]/50 text-sm focus:outline-none focus:border-[#182cc1] focus:ring-2 focus:ring-[#e8edff] transition"
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-[#091540] mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                Catatan Khusus <span className="text-[#3d518c] font-normal">(opsional)</span>
              </label>
              <textarea
                placeholder="Alergi, kebutuhan khusus, pertanyaan..."
                value={formData.notes}
                name="notes"
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-[#c5d0ff] bg-white text-[#091540] placeholder-[#3d518c]/50 text-sm focus:outline-none focus:border-[#182cc1] focus:ring-2 focus:ring-[#e8edff] transition resize-none"
                style={{ fontFamily: "Inter, sans-serif" }}
              />
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3 bg-[#e8edff] border border-[#c5d0ff] rounded-xl p-4">
            <CheckCircle size={16} className="text-[#182cc1] flex-shrink-0 mt-0.5" />
            <p className="text-[#1d2e80] text-xs leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              Konfirmasi pemesanan akan dikirim via WhatsApp ke nomor yang Anda masukkan. Pembayaran dilakukan di lokasi saat kedatangan.
            </p>
          </div>
        </div>

        <div className="lg:sticky lg:top-4 self-start">
          <BookingSummary
            buttonText={isSubmitting ? "Memproses..." : "Selesaikan Pemesanan"}
            onButtonClick={handleSubmit}
            buttonDisabled={!isFormValid || isSubmitting}
            onBackClick={() => navigate('/booking/package')}
            backButtonText="← Kembali"
            showPaymentInfo={true}
          />
        </div>
      </div>
    </BookingLayout>
  );
};

export default BookingFormPage;

