import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useBooking } from '../../hooks/useBooking';
import type { AddOnItem } from '../../types/booking';

interface BookingSummaryProps {
  buttonText: string;
  onButtonClick: () => void;
  buttonDisabled?: boolean;
  showPaymentInfo?: boolean;
  hideSummaryCard?: boolean;
  buttonIcon?: React.ReactNode;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  buttonText,
  onButtonClick,
  buttonDisabled = false,
  showPaymentInfo = false,
  hideSummaryCard = false,
  buttonIcon,
}) => {
  const { bookingData } = useBooking();
  const { selectedPackage, date, session, participants, userDetails, selectedAddOns } = bookingData;
  const name = userDetails?.fullName;

  const packageTotal = selectedPackage ? selectedPackage.price * participants : 0;
  const isPerOrang = (addon: AddOnItem) => addon.satuan === 'per orang';
  const addOnsTotal = (selectedAddOns || []).reduce((acc, curr) => {
    const qty = isPerOrang(curr) ? participants : (curr.quantity || 1);
    return acc + (curr.price * qty);
  }, 0);
  const total = packageTotal + addOnsTotal;

  const formattedDate = date
    ? (() => {
        try {
          const parts = date.split('-');
          if (parts.length === 3) {
            const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
            return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
          }
          return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
        } catch {
          return date;
        }
      })()
    : "—";

  const formattedSession = session ? session.split(" ")[0] : "—";

  const addOnsRows = (selectedAddOns || []).map(addon => {
    const qty = isPerOrang(addon) ? participants : (addon.quantity || 1);
    const label = isPerOrang(addon) ? `+ ${addon.name} × ${participants} orang` : `+ ${addon.name}`;
    const value = addon.price === 0 ? "Gratis" : `Rp ${(addon.price * qty).toLocaleString('id-ID')}`;
    return { label, value };
  });

  const rows = [
    { label: "Paket", value: selectedPackage ? selectedPackage.name : "-" },
    ...(name?.trim() ? [{ label: "Nama Pemesan", value: name.trim() }] : []),
    { label: "Tanggal", value: formattedDate },
    { label: "Sesi", value: formattedSession },
    { label: "Peserta", value: `${participants} orang` },
    ...(selectedPackage ? [{ label: "Durasi", value: selectedPackage.duration || "±2 jam" }] : []),
    ...addOnsRows,
  ];

  return (
    <div className="flex flex-col space-y-3">
      {!hideSummaryCard && (
        <div className="bg-white rounded-2xl border border-[#c5d0ff] overflow-hidden shadow-sm">
          <div className="relative h-28">
            {selectedPackage?.image ? (
              <img src={selectedPackage.image} alt={selectedPackage.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[#182cc1]/20 to-[#eef2ff]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#091540]/70 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-3">
              <div className="text-white font-bold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                {selectedPackage ? selectedPackage.name : "Pilih Paket"}
              </div>
            </div>
          </div>
          <div className="p-4 space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-widest text-[#3d518c] mb-2">Ringkasan Pesanan</div>
            {rows.map(r => (
              <div key={r.label} className="flex justify-between text-xs gap-2">
                <span className="text-[#3d518c] flex-shrink-0" style={{ fontFamily: "Inter, sans-serif" }}>{r.label}</span>
                <span className="text-[#091540] font-medium text-right" style={{ fontFamily: "Poppins, sans-serif" }}>{r.value}</span>
              </div>
            ))}
            <div className="border-t border-[#c5d0ff] pt-3 flex justify-between items-center">
              <span className="text-[#091540] font-bold text-sm">Total</span>
              <span className="text-[#182cc1] font-black text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      )}

      {showPaymentInfo && (
        <div className="bg-white rounded-2xl border border-[#c5d0ff] p-4">
          <div className="text-xs font-bold uppercase tracking-widest text-[#3d518c] mb-3">Informasi Pembayaran</div>
          <div className="space-y-2 text-sm text-[#3d518c]" style={{ fontFamily: "Inter, sans-serif" }}>
            <p>💳 Pembayaran dilakukan <strong className="text-[#091540]">di lokasi</strong> saat kedatangan.</p>
            <p>📲 Konfirmasi booking via <strong className="text-[#091540]">WhatsApp</strong> setelah submit.</p>
            <p>❌ Pembatalan gratis <strong className="text-[#091540]">H-1</strong> sebelum tanggal kunjungan.</p>
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        type="button"
        onClick={onButtonClick}
        disabled={buttonDisabled}
        className="w-full py-3.5 bg-[#182cc1] hover:bg-[#1524a3] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-[#c5d0ff]"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {buttonIcon || null}
        <span>{buttonText}</span>
        {!buttonIcon && !showPaymentInfo && <ArrowRight size={16} />}
      </button>
    </div>
  );
};

export default BookingSummary;




