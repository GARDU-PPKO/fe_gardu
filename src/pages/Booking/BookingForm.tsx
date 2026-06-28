import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingLayout from '../../components/layout/BookingLayout';
import BookingSummary from '../../components/booking/BookingSummary';
import { useBooking } from '../../hooks/useBooking';

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
    fullName: bookingData.userDetails.fullName,
    whatsapp: bookingData.userDetails.whatsapp,
    email: bookingData.userDetails.email,
    city: bookingData.userDetails.city,
    notes: bookingData.userDetails.notes,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    updateUserDetails(newFormData);
  };

  const isFormValid = formData.fullName.trim() !== '' && formData.whatsapp.trim() !== '';

  const handleNext = () => {
    navigate('/booking/payment');
  };

  return (
    <BookingLayout currentStep={2}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Data Pemesan</h2>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-700">Nama Lengkap <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Sesuai identitas"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-bold text-gray-700">No. WhatsApp <span className="text-red-500">*</span></label>
                <input 
                  type="tel" 
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="Contoh: 0812xxxx"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-bold text-gray-700">Email <span className="text-gray-400 font-normal">(opsional)</span></label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@contoh.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-700">Kota Asal</label>
              <input 
                type="text" 
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Semarang, Kendal, dll."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-700">Catatan Khusus <span className="text-gray-400 font-normal">(opsional)</span></label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Alergi, kebutuhan khusus, pertanyaan..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow resize-none"
              />
            </div>
          </div>

          <div className="bg-primary-light border border-primary/20 p-4 rounded-xl flex items-start space-x-3 text-sm text-green-800">
            <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>
              Konfirmasi pemesanan akan dikirim via WhatsApp ke nomor yang Anda masukkan. 
              Pembayaran dilakukan di lokasi saat kedatangan.
            </p>
          </div>

        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <BookingSummary 
              buttonText="Review Pesanan" 
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
