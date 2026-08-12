import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingLayout from '../../components/layout/BookingLayout';
import BookingSummary from '../../components/booking/BookingSummary';
import { useBooking } from '../../hooks/useBooking';
import { createBooking } from '../../services/booking.service';
import { ApiValidationError } from '../../services/api';
import { CheckCircle, AlertCircle, X } from "lucide-react";

const validatePhone = (val: string) => {
  const cleaned = val.replace(/\s|-/g, '');
  return /^(\+62|62|0)8[0-9]{7,13}$/.test(cleaned);
};

const validateEmail = (val: string) => {
  return val.trim().length >= 3;
};

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
    email: userDetails.kontakDarurat || userDetails.email || '',
    city: userDetails.city || '',
    notes: userDetails.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (showConfirmModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showConfirmModal]);

  const validate = (data: typeof formData) => {
    const newErrors: Record<string, string> = {};
    if (!data.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap tidak boleh kosong';
    }
    if (!data.whatsapp.trim()) {
      newErrors.whatsapp = 'Nomor WhatsApp tidak boleh kosong';
    } else if (!validatePhone(data.whatsapp)) {
      newErrors.whatsapp = 'Format nomor tidak valid (contoh: 081234567890 atau +6281234567890)';
    }
    if (!data.email.trim()) {
      newErrors.email = 'Kontak darurat tidak boleh kosong';
    } else if (!validateEmail(data.email)) {
      newErrors.email = 'Kontak darurat minimal 3 karakter (no WA atau nama keluarga)';
    }
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    updateUserDetails(newFormData);
    if (touched[name]) {
      const newErrors = validate(newFormData);
      setErrors(prev => ({ ...prev, [name]: newErrors[name] || '' }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const newErrors = validate(formData);
    setErrors(prev => ({ ...prev, [name]: newErrors[name] || '' }));
  };

  const isFormValid = Object.keys(validate(formData)).length === 0;

  const handleSubmit = () => {
    const allTouched = { fullName: true, whatsapp: true, email: true };
    setTouched(allTouched);
    const newErrors = validate(formData);
    setErrors(newErrors);
    if (!isFormValid || Object.keys(newErrors).length > 0) return;
    setShowConfirmModal(true);
  };

  const handleConfirmProceed = async () => {
    setShowConfirmModal(false);

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

      if (res.data && res.data.kode_booking) {
        navigate(`/payment/${res.data.kode_booking}`);
      } else {
        setSubmitError('Pesanan berhasil dibuat tetapi kode booking tidak dikembalikan. Silakan cek pesanan Anda.');
        setIsSubmitting(false);
      }
    } catch (e) {
      if (e instanceof ApiValidationError) {
        const msgs = Object.values(e.errors).flat();
        setSubmitError(msgs.length > 0 ? msgs.join(' ') : e.message);
      } else if (e instanceof Error && e.message) {
        setSubmitError(e.message);
      } else {
        setSubmitError('Terjadi kesalahan saat membuat pesanan. Silakan coba lagi.');
      }
      setIsSubmitting(false);
    }
  };

  const fields = [
    { key: "fullName", label: "Nama Lengkap", placeholder: "Sesuai identitas", type: "text", val: formData.fullName, req: true, span: true },
    { key: "whatsapp", label: "No. WhatsApp", placeholder: "Contoh: 081234567890", type: "tel", val: formData.whatsapp, req: true, span: false },
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
                  onBlur={() => handleBlur(f.key)}
                  className={`w-full px-4 py-3 rounded-xl border text-[#091540] placeholder-[#3d518c]/50 text-sm focus:outline-none focus:ring-2 transition ${
                    errors[f.key] && touched[f.key]
                      ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100'
                      : 'border-[#c5d0ff] bg-white focus:border-[#182cc1] focus:ring-[#e8edff]'
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
                {errors[f.key] && touched[f.key] && (
                  <div className="flex items-start gap-1.5 mt-1.5">
                    <AlertCircle size={13} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-500" style={{ fontFamily: "Inter, sans-serif" }}>{errors[f.key]}</p>
                  </div>
                )}
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

        <div className="lg:sticky lg:top-4 self-start order-last lg:order-none">
          {submitError && (
            <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 leading-relaxed">{submitError}</p>
            </div>
          )}
          <BookingSummary
            buttonText={isSubmitting ? "Membuat Pesanan..." : "Lanjut ke Pembayaran"}
            onButtonClick={handleSubmit}
            buttonDisabled={isSubmitting}
            showPaymentInfo={false}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div 
          className="fixed inset-0 bg-[#091540]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowConfirmModal(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 my-auto overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#e8edff] rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#182cc1]" />
              </div>
              <button onClick={() => setShowConfirmModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition">
                <X size={16} />
              </button>
            </div>
            <h3 className="text-lg font-black text-[#091540] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              Konfirmasi Data Pemesan
            </h3>
            <p className="text-gray-500 text-sm mb-5 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              Apakah nomor telepon dan data berikut sudah benar?
            </p>

            <div className="bg-[#f8faff] rounded-2xl p-4 border border-[#c5d0ff] space-y-3 mb-6">
              <div>
                <div className="text-[10px] font-bold text-[#3d518c] uppercase tracking-wider">Nama Lengkap</div>
                <div className="text-sm font-bold text-[#091540] mt-0.5">{formData.fullName}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#3d518c] uppercase tracking-wider">No. WhatsApp</div>
                <div className="text-sm font-bold text-[#091540] mt-0.5">{formData.whatsapp}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#3d518c] uppercase tracking-wider">Kontak Darurat</div>
                <div className="text-sm font-bold text-[#091540] mt-0.5">{formData.email}</div>
              </div>
              {formData.city && (
                <div>
                  <div className="text-[10px] font-bold text-[#3d518c] uppercase tracking-wider">Kota Asal</div>
                  <div className="text-sm font-bold text-[#091540] mt-0.5">{formData.city}</div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 px-4 font-bold text-[#3d518c] bg-gray-100 hover:bg-gray-200 rounded-xl transition text-sm"
              >
                Perbaiki Data
              </button>
              <button
                onClick={handleConfirmProceed}
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 font-bold text-white bg-[#182cc1] hover:bg-[#1524a3] rounded-xl transition shadow-lg shadow-[#182cc1]/20 text-sm"
              >
                {isSubmitting ? "Memproses..." : "Ya, Sudah Benar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </BookingLayout>
  );
};

export default BookingFormPage;
