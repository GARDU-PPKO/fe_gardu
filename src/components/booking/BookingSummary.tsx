import React from 'react';
import { useBooking } from '../../hooks/useBooking';

interface BookingSummaryProps {
  buttonText: string;
  onButtonClick: () => void;
  buttonDisabled?: boolean;
  showPaymentInfo?: boolean;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  buttonText,
  onButtonClick,
  buttonDisabled = false,
  showPaymentInfo = false,
}) => {
  const { bookingData } = useBooking();
  const { selectedPackage, date, session, participants } = bookingData;

  const total = selectedPackage ? selectedPackage.price * participants : 0;

  return (
    <div className="flex flex-col space-y-4">
      {/* Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover Image Placeholder */}
        <div className="h-32 bg-gray-200 relative overflow-hidden">
          {selectedPackage?.image && <img src={selectedPackage.image} alt={selectedPackage.name} className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white font-semibold">
            {selectedPackage ? selectedPackage.name : 'Pilih Paket'}
          </div>
        </div>
        
        <div className="p-5 space-y-4">
          <h3 className="font-bold text-gray-800 text-sm tracking-wide">RINGKASAN PESANAN</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Paket</span>
              <span className="font-medium text-right max-w-[150px]">{selectedPackage ? selectedPackage.name : '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tanggal</span>
              <span className="font-medium text-right">{date || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Sesi</span>
              <span className="font-medium text-right">{session || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Peserta</span>
              <span className="font-medium text-right">{participants} orang</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="font-bold text-gray-800">Total</span>
            <span className="font-bold text-primary text-lg">
              Rp {total.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      {showPaymentInfo && (
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-800 text-xs tracking-wide">INFORMASI PEMBAYARAN</h3>
          <ul className="text-xs text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">💳</span> Pembayaran dilakukan <strong>di lokasi</strong> saat kedatangan.
            </li>
            <li className="flex items-start">
              <span className="mr-2">📱</span> Konfirmasi booking via <strong>WhatsApp</strong> setelah submit.
            </li>
            <li className="flex items-start">
              <span className="mr-2">❌</span> Pembatalan gratis <strong>H-1</strong> sebelum tanggal kunjungan.
            </li>
          </ul>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={onButtonClick}
        disabled={buttonDisabled}
        className={`w-full py-3 rounded-lg font-bold text-white transition-colors flex items-center justify-center space-x-2 ${
          buttonDisabled
            ? 'bg-primary/50 cursor-not-allowed'
            : 'bg-primary hover:bg-primary-hover shadow-md shadow-primary/20'
        }`}
      >
        <span>{buttonText}</span>
        {!showPaymentInfo && <span>→</span>}
      </button>

      {/* Back to Home Button placeholder for layout matching */}
      {showPaymentInfo && (
        <button
          className="w-full py-3 rounded-lg font-medium text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          onClick={() => window.history.back()}
        >
          ← Kembali
        </button>
      )}
    </div>
  );
};

export default BookingSummary;
