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
      <div className="bg-white rounded-3xl shadow-sm border border-blue-100/80 overflow-hidden">
        {/* Cover Image Placeholder */}
        <div className="h-36 bg-gray-200 relative overflow-hidden">
          {selectedPackage?.image ? (
            <img src={selectedPackage.image} alt={selectedPackage.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#182CC1]/30 to-[#8B5A2B]/20 flex items-center justify-center text-xs text-gray-500 font-medium">Belum Dipilih</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-3.5 left-5 right-5 text-white font-black text-lg truncate drop-shadow-md" style={{ fontFamily: "Poppins, sans-serif" }}>
            {selectedPackage ? selectedPackage.name : 'Pilih Paket'}
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <h3 className="font-extrabold text-[#1E293B] text-xs tracking-wider uppercase" style={{ fontFamily: "Poppins, sans-serif" }}>RINGKASAN PESANAN</h3>
          
          <div className="space-y-3 text-xs sm:text-sm font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Paket</span>
              <span className="text-[#1E293B] font-bold text-right max-w-[170px] truncate">{selectedPackage ? selectedPackage.name : '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Tanggal</span>
              <span className="text-[#1E293B] font-bold text-right">{date || '—'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Sesi</span>
              <span className="text-[#1E293B] font-bold text-right">{session || 'Pagi'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Peserta</span>
              <span className="text-[#1E293B] font-bold text-right">{participants} orang</span>
            </div>
            {selectedPackage?.duration && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Durasi</span>
                <span className="text-[#1E293B] font-bold text-right">±2 jam</span>
              </div>
            )}
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="font-black text-[#1E293B] text-base" style={{ fontFamily: "Poppins, sans-serif" }}>Total</span>
            <span className="font-black text-[#182CC1] text-lg sm:text-xl" style={{ fontFamily: "Poppins, sans-serif" }}>
              Rp {total.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      {showPaymentInfo && (
        <div className="bg-[#EFF2FC] p-5 rounded-2xl border border-blue-200/60 shadow-xs space-y-3">
          <h3 className="font-extrabold text-[#182CC1] text-xs tracking-wide uppercase" style={{ fontFamily: "Poppins, sans-serif" }}>INFORMASI PEMBAYARAN</h3>
          <ul className="text-xs text-gray-700 space-y-2.5 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#182CC1] mt-1.5 flex-shrink-0" />
              <span>Pembayaran dilakukan <strong className="text-[#1E293B]">di lokasi</strong> saat kedatangan.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#182CC1] mt-1.5 flex-shrink-0" />
              <span>Konfirmasi booking via <strong className="text-[#1E293B]">WhatsApp</strong> setelah submit.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
              <span>Pembatalan gratis <strong className="text-[#1E293B]">H-1</strong> sebelum tanggal kunjungan.</span>
            </li>
          </ul>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={onButtonClick}
        disabled={buttonDisabled}
        className={`w-full py-4 rounded-2xl font-bold text-sm text-white transition-all duration-300 flex items-center justify-center space-x-2.5 active:scale-95 ${
          buttonDisabled
            ? 'bg-[#94A3B8]/70 text-white cursor-not-allowed shadow-none font-semibold'
            : 'bg-[#182CC1] hover:bg-[#122190] shadow-lg shadow-[#182CC1]/30 hover:shadow-xl'
        }`}
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        <span>{buttonText}</span>
        {!showPaymentInfo && <span className="text-base leading-none">→</span>}
      </button>

      {/* Back to Home Button placeholder for layout matching */}
      {showPaymentInfo && (
        <button
          className="w-full py-3.5 rounded-2xl font-bold text-sm text-[#182CC1] border-2 border-blue-200 bg-white hover:bg-blue-50/80 transition-all duration-300 shadow-xs active:scale-95"
          onClick={() => window.history.back()}
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          ← Ubah Data
        </button>
      )}
    </div>
  );
};

export default BookingSummary;

