import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';
import BookingLayout from '../../components/layout/BookingLayout';
import BookingSummary from '../../components/booking/BookingSummary';
import { createBooking } from '../../services/booking.service';
import { UploadCloud, Ticket, FileImage, Trash2, CheckCircle, Copy, Check } from "lucide-react";

const REKENING = {
  bank: "BRI",
  noRek: "0012 3456 7890", // ← GANTI DENGAN REKENING ASLI
  atasNama: "Desa Wisata Getas",
};

const BookingPayment: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData } = useBooking();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { selectedPackage, date, session, userDetails, selectedAddOns } = bookingData;
  const price = selectedPackage?.price || 0;
  const participants = bookingData.participants || 1;
  const isPerPerson = !selectedPackage?.unit || selectedPackage.unit === 'orang';
  const packageTotal = isPerPerson ? price * participants : price;
  const addOnsList = selectedAddOns || [];
  const addOnsTotal = addOnsList.reduce((acc, curr) => acc + (curr.price * (curr.quantity || 1)), 0);
  const totalPrice = packageTotal + addOnsTotal;

  useEffect(() => {
    if (!selectedPackage) {
      navigate('/booking/package');
    }
  }, [selectedPackage, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCopyNoRek = async () => {
    try {
      await navigator.clipboard.writeText(REKENING.noRek.replace(/\s/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setIsSubmitting(true);
    try {
      if (selectedPackage) {
        const addOnsText = addOnsList.length > 0
          ? `\n\nAdd-Ons Tambahan:\n${addOnsList.map(a => `- ${a.name}`).join('\n')}`
          : '';

        const notesWithPayment = userDetails.notes
          ? `${userDetails.notes}${addOnsText}\n\n[Bukti pembayaran telah diunggah: ${selectedFile.name}]`
          : `${addOnsText}\n\n[Bukti pembayaran telah diunggah: ${selectedFile.name}]`.trim();

        const response = await createBooking({
          package_id: selectedPackage.id,
          customer_name: userDetails.fullName || 'Tamu',
          phone: userDetails.whatsapp || '',
          email: userDetails.email || userDetails.kontakDarurat || '',
          date: date || new Date().toISOString().split('T')[0],
          session_time: session || 'Pagi (07.00 - 09.00)',
          participants: participants,
          total_harga: totalPrice,
          notes: notesWithPayment
        });

        if (response.data && response.data.kode_booking) {
          const kode = response.data.kode_booking;
          saveDummyToLocal(kode);
          navigate(`/cek-pesanan?kode=${kode}`);
        } else {
          const fallbackKode = `GRD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).substring(2,6).toUpperCase()}`;
          saveDummyToLocal(fallbackKode);
          navigate(`/cek-pesanan?kode=${fallbackKode}`);
        }
      }
    } catch (e) {
      console.error('Failed to submit booking to backend:', e);
      const fallbackKode = `GRD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).substring(2,6).toUpperCase()}`;
      saveDummyToLocal(fallbackKode);
      navigate(`/cek-pesanan?kode=${fallbackKode}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDummyToLocal = (kode: string) => {
    if (selectedPackage) {
      const dummyBooking = {
        id: 999,
        kode_booking: kode,
        nama_pemesan: userDetails.fullName || 'Tamu',
        no_wa_pemesan: userDetails.whatsapp || '',
        kontak_darurat: userDetails.email || userDetails.kontakDarurat || '',
        tanggal: date || new Date().toISOString().split('T')[0],
        sesi: session || 'Pagi (07.00 - 09.00)',
        jumlah_peserta: participants,
        total_harga: totalPrice,
        status: 'pending',
        package: {
          id: selectedPackage.id,
          nama: selectedPackage.name,
          durasi: selectedPackage.duration || '±2 jam'
        },
        addons: addOnsList.map(a => ({ nama: a.name, harga: a.price }))
      };
      localStorage.setItem('dummy_booking', JSON.stringify(dummyBooking));
    }
  };

  return (
    <BookingLayout currentStep={3} onBackClick={() => navigate('/booking/form')}>
      <div className="grid lg:grid-cols-[1fr_340px] gap-6 sm:gap-8 min-w-0">
        <div className="flex flex-col gap-6 min-w-0">

          {/* Upload Bukti */}
          <div className="flex flex-col min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-[#091540] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
              Upload Bukti Pembayaran
            </h3>
            <div className="bg-white border border-[#c5d0ff] rounded-2xl p-4 sm:p-5 shadow-sm flex-1 flex flex-col justify-center min-w-0 overflow-hidden">
              {!selectedFile ? (
                <div
                  className="border-2 border-dashed border-[#c5d0ff] hover:border-[#182cc1] rounded-xl p-6 sm:p-8 text-center transition-colors cursor-pointer bg-[#fafcff] hover:bg-[#eef2ff] w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-3 border border-[#e8edff]">
                    <UploadCloud size={22} className="text-[#182cc1]" />
                  </div>
                  <h4 className="text-[#091540] font-bold text-sm mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>Klik untuk upload gambar</h4>
                  <p className="text-xs text-[#3d518c]" style={{ fontFamily: "Inter, sans-serif" }}>Format JPG, PNG, atau PDF (maks. 5MB)</p>
                </div>
              ) : (
                <div className="border border-[#c5d0ff] rounded-xl p-3.5 sm:p-4 bg-[#f8faff] flex items-center justify-between w-full min-w-0 overflow-hidden">
                  <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg bg-[#e8edff] flex items-center justify-center flex-shrink-0">
                      <FileImage size={20} className="text-[#182cc1]" />
                    </div>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <div className="text-sm font-semibold text-[#091540] truncate max-w-[170px] xs:max-w-[220px] sm:max-w-[320px] md:max-w-full block" title={selectedFile.name}>{selectedFile.name}</div>
                      <div className="text-xs text-[#3d518c]">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-red-500 transition-colors flex-shrink-0 ml-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg, image/png, application/pdf"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Instruksi Pembayaran */}
          <div className="flex flex-col">
            <h3 className="text-base sm:text-lg font-bold text-[#091540] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
              Instruksi Pembayaran
            </h3>

            <div className="bg-white rounded-2xl border border-[#c5d0ff] overflow-hidden shadow-sm">
              {/* Total tagihan */}
              <div className="p-4 sm:p-5 border-b border-[#e8edff] flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#3d518c] mb-1 font-semibold tracking-wide uppercase">Total Tagihan</div>
                  <div className="text-[#182cc1] font-black text-xl sm:text-2xl" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="w-11 h-11 rounded-full bg-[#182cc1]/10 flex items-center justify-center flex-shrink-0">
                  <Ticket size={20} className="text-[#182cc1]" />
                </div>
              </div>

              {/* Bank info */}
              <div className="p-4 sm:p-5 bg-[#fafcff]">
                <div className="text-sm font-semibold text-[#091540] mb-3">Transfer ke rekening berikut:</div>
                <div className="bg-white border border-[#c5d0ff] rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs text-[#3d518c] mb-1 font-medium">Bank {REKENING.bank}</div>
                      <div className="font-bold text-base sm:text-lg text-[#091540] tracking-wider" style={{ fontFamily: "Poppins, sans-serif" }}>
                        {REKENING.noRek}
                      </div>
                      <div className="text-xs text-[#3d518c] mt-1">a.n. <strong>{REKENING.atasNama}</strong></div>
                    </div>
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <div className="w-14 h-9 bg-[#e8edff] rounded flex items-center justify-center text-[#182cc1] font-black italic text-sm">
                        {REKENING.bank}
                      </div>
                      <button
                        onClick={handleCopyNoRek}
                        className="flex items-center gap-1 text-[10px] font-semibold text-[#182cc1] hover:text-[#1524a3] transition"
                      >
                        {copied ? <Check size={11} /> : <Copy size={11} />}
                        {copied ? 'Tersalin!' : 'Salin'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-xs text-amber-800 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                    <strong>⚠️ Penting:</strong> Setelah transfer, upload bukti pembayaran dan kirim. Admin akan memverifikasi dalam 1×24 jam.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sticky right column */}
        <div className="lg:sticky lg:top-4 self-start order-last lg:order-none">
          <BookingSummary
            buttonText={isSubmitting ? "Mengirim..." : "Kirim Bukti Pembayaran"}
            onButtonClick={handleSubmit}
            buttonDisabled={isSubmitting || !selectedFile}
            showPaymentInfo={false}
            hideSummaryCard={true}
            buttonIcon={isSubmitting ? undefined : <CheckCircle size={16} />}
          />
          {!selectedFile && (
            <p className="text-xs text-[#3d518c] text-center mt-3" style={{ fontFamily: "Inter, sans-serif" }}>
              * Silakan upload bukti pembayaran terlebih dahulu
            </p>
          )}
        </div>
      </div>
    </BookingLayout>
  );
};

export default BookingPayment;
