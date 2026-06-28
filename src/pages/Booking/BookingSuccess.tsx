import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';

const BookingSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData, resetBooking } = useBooking();
  const [bookingCode] = useState(() => `TBG-${Math.floor(10000 + Math.random() * 90000)}`);

  useEffect(() => {
    if (!bookingData.selectedPackage) {
      navigate('/booking/package');
    }
  }, [bookingData, navigate]);

  const handleFinish = () => {
    resetBooking();
    navigate('/');
  };

  const handleWhatsApp = () => {
    // Normally would open whatsapp url
    alert('Buka WhatsApp untuk konfirmasi');
  };

  const { selectedPackage, date, session, participants, userDetails } = bookingData;
  const total = selectedPackage ? selectedPackage.price * participants : 0;

  return (
    <div className="min-h-screen bg-green-50/50 font-sans flex flex-col items-center">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">Pesan Paket Wisata Tubing</h1>
            <p className="text-xs text-gray-500">Desa Getas - Sungai Blukar, Singorojo, Kendal</p>
          </div>
        </div>
        
        <button 
          onClick={handleFinish}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto p-6 flex flex-col items-center justify-center space-y-6">
        
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-primary mb-2">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-gray-800">Pesanan Berhasil! 🎉</h2>
          <p className="text-gray-600">
            Terima kasih, <strong className="uppercase">{userDetails.fullName}</strong>! Pesanan Anda telah diterima dan sedang diproses.
          </p>
        </div>

        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-500 font-medium">Kode Pemesanan</p>
              <p className="text-2xl font-black text-primary tracking-wide">{bookingCode}</p>
            </div>
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Nama Pemesan</span>
              <span className="font-bold text-sm text-gray-800 uppercase">{userDetails.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Paket</span>
              <span className="font-bold text-sm text-gray-800">{selectedPackage?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Tanggal</span>
              <span className="font-bold text-sm text-gray-800">{date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Sesi</span>
              <span className="font-bold text-sm text-gray-800">{session}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Peserta</span>
              <span className="font-bold text-sm text-gray-800">{participants} orang</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <span className="text-gray-500 text-sm">Total</span>
              <span className="font-bold text-primary">Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        <div className="w-full space-y-3 pt-2">
          <button 
            onClick={handleWhatsApp}
            className="w-full py-4 rounded-xl font-bold text-white bg-[#00a651] hover:bg-[#008a43] shadow-lg shadow-green-200 transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span>Konfirmasi via WhatsApp</span>
          </button>
          <button 
            onClick={handleFinish}
            className="w-full py-4 rounded-xl font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Kembali ke Beranda
          </button>
          
          <p className="text-center text-xs text-gray-400 mt-4">Screenshot kode pemesanan ini dan tunjukkan saat kedatangan.</p>
        </div>
      </main>
    </div>
  );
};

export default BookingSuccess;
