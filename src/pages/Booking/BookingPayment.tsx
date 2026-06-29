import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingLayout from '../../components/layout/BookingLayout';
import BookingSummary from '../../components/booking/BookingSummary';
import { useBooking } from '../../hooks/useBooking';
import { getSettings } from '../../services/village.service';
import type { Setting } from '../../types';

const BookingPayment: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData, resetBooking } = useBooking();
  const [waNumber, setWaNumber] = React.useState('');

  useEffect(() => {
    if (!bookingData.selectedPackage || !bookingData.userDetails.fullName) {
      navigate('/booking/package');
    }
  }, [bookingData, navigate]);

  useEffect(() => {
    getSettings('wa_admin').then(res => {
      const wa = res.data.find((item: Setting) => item.key === 'wa_admin');
      setWaNumber(wa?.value ?? '');
    });
  }, []);

  const handleConfirm = () => {
    if (!waNumber) return;
    const { selectedPackage, date, session, participants, userDetails } = bookingData;

    const lines = [
      `Halo Admin Desa Getas, saya ingin memesan paket wisata:`,
      ``,
      `📦 Paket: ${selectedPackage?.name}`,
      `📅 Tanggal: ${date}`,
      `⏰ Sesi: ${session}`,
      `👥 Peserta: ${participants} orang`,
      `💰 Total: Rp ${((selectedPackage?.price || 0) * participants).toLocaleString('id-ID')}`,
      ``,
      `👤 Nama: ${userDetails.fullName}`,
      `📱 WhatsApp: ${userDetails.whatsapp}`,
      userDetails.email ? `✉️ Email: ${userDetails.email}` : '',
      userDetails.city ? `🏙️ Kota: ${userDetails.city}` : '',
      userDetails.notes ? `📝 Catatan: ${userDetails.notes}` : '',
      ``,
      `Mohon konfirmasi ketersediaan dan infokan pembayaran. Terima kasih!`,
    ].filter(Boolean).join('\n');

    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(lines)}`;
    resetBooking();
    window.open(waUrl, '_blank');
    navigate('/');
  };

  const { selectedPackage, date, session, participants, userDetails } = bookingData;

  return (
    <BookingLayout currentStep={3}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Review Data */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#052e16]">Review & Konfirmasi Pesanan</h2>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-[#052e16] to-[#0a3d1f] relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-6 text-white">
                <h3 className="font-bold text-xl">{selectedPackage?.name}</h3>
                <p className="text-sm text-green-200">Sungai Blukar, Desa Getas</p>
              </div>
            </div>

            {/* Data Table */}
            <div className="divide-y divide-green-50">
              <div className="grid grid-cols-3 p-4">
                <span className="text-gray-500 text-sm">Paket</span>
                <span className="col-span-2 font-medium text-sm text-[#052e16]">{selectedPackage?.name}</span>
              </div>
              <div className="grid grid-cols-3 p-4">
                <span className="text-gray-500 text-sm">Tanggal</span>
                <span className="col-span-2 font-medium text-sm text-[#052e16]">{date}</span>
              </div>
              <div className="grid grid-cols-3 p-4">
                <span className="text-gray-500 text-sm">Sesi</span>
                <span className="col-span-2 font-medium text-sm text-[#052e16]">{session}</span>
              </div>
              <div className="grid grid-cols-3 p-4">
                <span className="text-gray-500 text-sm">Peserta</span>
                <span className="col-span-2 font-medium text-sm text-[#052e16]">{participants} orang</span>
              </div>
              <div className="grid grid-cols-3 p-4">
                <span className="text-gray-500 text-sm">Nama Pemesan</span>
                <span className="col-span-2 font-medium text-sm text-[#052e16] uppercase">{userDetails.fullName}</span>
              </div>
              <div className="grid grid-cols-3 p-4">
                <span className="text-gray-500 text-sm">No. WhatsApp</span>
                <span className="col-span-2 font-medium text-sm text-[#052e16]">{userDetails.whatsapp}</span>
              </div>
              <div className="grid grid-cols-3 p-4">
                <span className="text-gray-500 text-sm">Email</span>
                <span className="col-span-2 font-medium text-sm text-[#052e16]">{userDetails.email || '-'}</span>
              </div>
              <div className="grid grid-cols-3 p-4">
                <span className="text-gray-500 text-sm">Kota Asal</span>
                <span className="col-span-2 font-medium text-sm text-[#052e16]">{userDetails.city || '-'}</span>
              </div>
              <div className="grid grid-cols-3 p-4">
                <span className="text-gray-500 text-sm">Catatan</span>
                <span className="col-span-2 font-medium text-sm text-[#052e16]">{userDetails.notes || '-'}</span>
              </div>
            </div>
          </div>

          {/* Included Features */}
          <div className="bg-green-50 border border-green-200 p-5 rounded-xl space-y-3">
            <h3 className="font-bold text-green-700 text-xs tracking-wide">TERMASUK DALAM PAKET</h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-green-800">
              {selectedPackage?.includes?.map(item => (
                <div key={item} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Payment Box */}
          <div className="bg-[#052e16] rounded-xl p-5 flex items-center justify-between text-white shadow-lg">
            <div>
              <p className="text-sm text-green-200 mb-1">Total Pembayaran</p>
              <h2 className="text-2xl font-bold text-white">
                Rp {(selectedPackage ? selectedPackage.price * participants : 0).toLocaleString('id-ID')}
              </h2>
              <p className="text-xs text-green-300 mt-1">{participants} orang × Rp {selectedPackage?.price.toLocaleString('id-ID')}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
            </div>
          </div>

        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <BookingSummary 
              buttonText="Konfirmasi Pesanan" 
              onButtonClick={handleConfirm}
              buttonDisabled={!waNumber}
              showPaymentInfo={true}
            />
          </div>
        </div>
        
      </div>
    </BookingLayout>
  );
};

export default BookingPayment;
