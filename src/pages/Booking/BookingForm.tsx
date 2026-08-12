import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingLayout from '../../components/layout/BookingLayout';
import BookingSummary from '../../components/booking/BookingSummary';
import { useBooking } from '../../hooks/useBooking';
import { createBooking } from '../../services/booking.service';
import { ApiValidationError } from '../../services/api';
import { CheckCircle, AlertCircle } from "lucide-react";

const BookingFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData, updateUserDetails } = useBooking();

  const { selectedPackage, userDetails } = bookingData;

  useEffect(() => {
    if (!selectedPackage) {
      navigate('/booking/package');
    }
  }, [selectedPackage, navigate]);

  const [formData, setFormData] = useState({
    fullName: userDetails.fullName || '',
    whatsapp: userDetails.whatsapp || '',
    email: userDetails.kontakDarurat || '',
    city: userDetails.city || '',
    notes: userDetails.notes || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    updateUserDetails(newFormData);
  };

  const isFormValid = formData.fullName.trim() !== '' && formData.whatsapp.trim() !== '' && formData.email.trim() !== '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const { selectedPackage, date, session, participants, selectedAddOns } = bookingData;
    if (!selectedPackage || !date || !session) {
      navigate('/booking/package');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await createBooking({
        package_id: selectedPackage.id,
        customer_name: formData.fullName.trim(),
        phone: formData.whatsapp.trim(),
        kontak_darurat: formData.email.trim(),
        kota_asal: formData.city.trim(),
        date,
        session_time: session,
        participants,
        notes: formData.notes.trim() || undefined,
        addons: (selectedAddOns || []).map(a => ({
          id: a.id,
        })),
      });

      navigate(`/payment/${res.data.kode_booking}`);
    } catch (e) {
      if (e instanceof ApiValidationError) {
        const msgs = Object.values(e.errors).flat();
        setSubmitError(msgs.length > 0 ? msgs.join(' ') : e.message);
      } else {
        setSubmitError('Gagal membuat pemesanan. Silakan coba lagi.');
      }
      setIsSubmitting(false);
    }
  };

  const fields = [
    { key: "fullName", label: "Nama Lengkap", placeholder: "Sesuai identitas", type: "text", val: formData.fullName, req: true, span: true },
    { key: "whatsapp", label: "No. WhatsApp", placeholder: "Contoh: 0812xxxx", type: "tel", val: formData.whatsapp, req: true, span: false },
    { key: "email", label: "Kontak Darurat", placeholder: "No WA / Nama Keluarga", type: "text", val: formData.email, req: true, span: false },
    { key: "city", label: "Kota Asal", placeholder: "Semarang, Kendal, dll.", type: "text", val: formData.city, req: false, span: false },
  ];

  return (
    <BookingLayout currentStep={2} onBackClick={() => navigate('/booking/package')}>
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
              Silakan periksa kembali data Anda sebelum lanjut ke pembayaran. Nomor WhatsApp akan digunakan untuk konfirmasi.
            </p>
          </div>
        </div>

        <div className="lg:sticky lg:top-4 self-start">
          {submitError && (
            <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 leading-relaxed">{submitError}</p>
            </div>
          )}
          <BookingSummary
            buttonText={isSubmitting ? "Membuat Pesanan..." : "Buat Pesanan & Lanjut ke Pembayaran"}
            onButtonClick={handleSubmit}
            buttonDisabled={!isFormValid || isSubmitting}
            showPaymentInfo={false}
          />
        </div>
      </div>
    </BookingLayout>
  );
};

export default BookingFormPage;
