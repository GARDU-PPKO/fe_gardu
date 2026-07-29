import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingLayout from '../../components/layout/BookingLayout';
import BookingSummary from '../../components/booking/BookingSummary';
import { useBooking } from '../../hooks/useBooking';
import { User, Phone, Mail, FileText, Info, ArrowLeft } from "lucide-react";

const BookingFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData, updateUserDetails } = useBooking();

  // If page is refreshed and no package is selected, go back to step 1
  useEffect(() => {
    if (!bookingData.selectedPackage) {
      navigate('/booking/package');
    }
  }, [bookingData.selectedPackage, navigate]);

  const [formData, setFormData] = useState({
    fullName: bookingData.userDetails.fullName || '',
    whatsapp: bookingData.userDetails.whatsapp || '',
    email: bookingData.userDetails.email || '',
    city: bookingData.userDetails.city || '',
    notes: bookingData.userDetails.notes || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    updateUserDetails(newFormData);
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'Nomor WhatsApp wajib diisi';
    else if (!/^[0-9+ -]{9,15}$/.test(formData.whatsapp)) newErrors.whatsapp = 'Nomor WhatsApp tidak valid';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = formData.fullName.trim() !== '' && formData.whatsapp.trim() !== '';

  const handleNext = () => {
    if (validate()) {
      navigate('/booking/payment');
    }
  };

  return (
    <BookingLayout currentStep={2}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-blue-100/80 p-6 sm:p-8 shadow-xs space-y-6">
            
            <div className="border-b border-gray-100 pb-5">
              <h2 className="text-xl sm:text-2xl font-black text-[#1E293B]" style={{ fontFamily: "Poppins, sans-serif" }}>
                Data Pemesan
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-1 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                Lengkapi identitas penanggung jawab pemesanan tiket di bawah ini.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-5">
              {/* Nama Lengkap */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-extrabold text-[#1E293B]" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap sesuai identitas"
                    className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border bg-[#F8FAFC]/50 transition-all text-sm font-semibold text-[#1E293B] outline-none focus:ring-2 focus:ring-[#182CC1] focus:bg-white hover:border-[#182CC1]/40 ${
                      errors.fullName ? 'border-red-500 bg-red-50/20' : 'border-gray-200'
                    }`}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>
                {errors.fullName && <p className="text-red-500 text-xs font-semibold mt-1">{errors.fullName}</p>}
              </div>

              {/* WhatsApp & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-extrabold text-[#1E293B]" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Nomor WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Phone size={18} />
                    </div>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="0812xxxx (Aktif)"
                      className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border bg-[#F8FAFC]/50 transition-all text-sm font-semibold text-[#1E293B] outline-none focus:ring-2 focus:ring-[#182CC1] focus:bg-white hover:border-[#182CC1]/40 ${
                        errors.whatsapp ? 'border-red-500 bg-red-50/20' : 'border-gray-200'
                      }`}
                      style={{ fontFamily: "Inter, sans-serif" }}
                    />
                  </div>
                  {errors.whatsapp && <p className="text-red-500 text-xs font-semibold mt-1">{errors.whatsapp}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-extrabold text-[#1E293B]" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Email <span className="text-gray-400 font-normal text-xs">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@contoh.com"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-[#F8FAFC]/50 transition-all text-sm font-semibold text-[#1E293B] outline-none focus:ring-2 focus:ring-[#182CC1] focus:bg-white hover:border-[#182CC1]/40"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    />
                  </div>
                </div>
              </div>

              {/* Kota Asal */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-extrabold text-[#1E293B]" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Kota / Daerah Asal <span className="text-gray-400 font-normal text-xs">(Opsional)</span>
                </label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Contoh: Semarang, Kendal, Jakarta, dll."
                  className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-[#F8FAFC]/50 transition-all text-sm font-semibold text-[#1E293B] outline-none focus:ring-2 focus:ring-[#182CC1] focus:bg-white hover:border-[#182CC1]/40"
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
              </div>

              {/* Catatan */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-extrabold text-[#1E293B]" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Catatan Tambahan <span className="text-gray-400 font-normal text-xs">(Opsional)</span>
                </label>
                <div className="relative">
                  <div className="absolute top-4 left-4 flex items-start pointer-events-none text-gray-400">
                    <FileText size={18} />
                  </div>
                  <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Contoh: Kami membawa rombongan anak-anak dan lansia, butuh persediaan air mineral atau pelampung khusus."
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-[#F8FAFC]/50 transition-all text-sm font-semibold text-[#1E293B] outline-none focus:ring-2 focus:ring-[#182CC1] focus:bg-white hover:border-[#182CC1]/40 resize-none"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>
              </div>

              {/* Blue Info Banner */}
              <div className="bg-[#EFF2FC] border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3.5 mt-4">
                <div className="p-1 rounded-lg bg-[#182CC1]/10 text-[#182CC1] flex-shrink-0 mt-0.5">
                  <Info size={18} />
                </div>
                <div style={{ fontFamily: "Inter, sans-serif" }}>
                  <h4 className="text-xs font-bold text-[#182CC1]">Penting Diperhatikan</h4>
                  <p className="text-[11px] sm:text-xs text-gray-700 leading-relaxed mt-0.5 font-medium">
                    Pastikan nomor <strong className="text-[#1E293B]">WhatsApp</strong> Anda aktif untuk menerima bukti reservasi resmi, peta petunjuk arah, dan instruksi dari pengelola Desa Getas.
                  </p>
                </div>
              </div>

            </form>
          </div>

          <button 
            onClick={() => navigate('/booking/package')}
            type="button"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white border-2 border-blue-200 text-[#182CC1] font-extrabold text-xs sm:text-sm hover:bg-blue-50/80 transition-all shadow-xs active:scale-95"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <ArrowLeft size={16} />
            Kembali ke Pilih Paket
          </button>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <BookingSummary 
              buttonText="Lanjutkan ke Pembayaran" 
              onButtonClick={handleNext}
              buttonDisabled={!isFormValid}
            />
          </div>
        </div>
        
      </div>
    </BookingLayout>
  );
};

export default BookingFormPage;
