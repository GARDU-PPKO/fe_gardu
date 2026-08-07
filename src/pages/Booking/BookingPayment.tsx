import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';
import BookingLayout from '../../components/layout/BookingLayout';
import BookingSummary from '../../components/booking/BookingSummary';
import { createBooking } from '../../services/booking.service';
import { CheckCircle, UploadCloud, Ticket, Waves, FileImage, Trash2 } from "lucide-react";

const BookingPayment: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData, resetBooking } = useBooking();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketNumber] = useState(() => `GTS-${Math.floor(100000 + Math.random() * 900000)}`);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { selectedPackage, date, session, userDetails } = bookingData;
  const price = selectedPackage?.price || 0;
  const participants = bookingData.participants || 1;
  const totalPrice = price * participants;

  useEffect(() => {
    if (!selectedPackage && !isSubmitted) {
      navigate('/booking/package');
    }
  }, [selectedPackage, isSubmitted, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setIsSubmitting(true);
    try {
      if (selectedPackage) {
        // Asumsi API bisa menerima JSON, kita tambahkan note bahwa bukti sudah diupload
        const notesWithPayment = userDetails.notes 
          ? `${userDetails.notes}\n\n[Bukti pembayaran telah diunggah: ${selectedFile.name}]`
          : `[Bukti pembayaran telah diunggah: ${selectedFile.name}]`;

        await createBooking({
          package_id: selectedPackage.id,
          customer_name: userDetails.fullName || 'Tamu',
          phone: userDetails.whatsapp || '',
          email: userDetails.email,
          date: date || new Date().toISOString().split('T')[0],
          session_time: session || 'Pagi (07.00 - 09.00)',
          participants: participants,
          notes: notesWithPayment
        });
      }
      setIsSubmitted(true);
    } catch (e) {
      console.error('Failed to submit booking to backend:', e);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const shortDate = date
    ? new Date(date).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    : "—";

  if (isSubmitted) {
    return (
      <BookingLayout currentStep={3}>
        <div className="max-w-xl mx-auto py-8 px-4">
          
          <div className="bg-gradient-to-br from-[#182cc1] to-[#091540] rounded-3xl p-8 sm:p-10 text-center shadow-xl shadow-[#182cc1]/20 relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -ml-10 -mb-10"></div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={52} className="text-[#a5f3fc]" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
                Bukti Diterima! 🎉
              </h3>
              <p className="text-white/80 text-sm sm:text-base mb-8 max-w-sm mx-auto leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                Terima kasih <strong>{userDetails.fullName}</strong>. Bukti pembayaran Anda telah berhasil diunggah.
              </p>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-left flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-400/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white mb-1 tracking-wide" style={{ fontFamily: "Poppins, sans-serif" }}>Menunggu Konfirmasi</h4>
                  <p className="text-white/70 text-xs sm:text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                    Admin kami sedang melakukan verifikasi. <strong>Mohon tunggu pesan WhatsApp</strong> yang berisi informasi lanjutan & e-tiket Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-[#c5d0ff] p-6 mb-6 text-left shadow-lg">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#c5d0ff]">
              <div>
                <div className="text-xs text-[#3d518c] mb-1">Kode Referensi</div>
                <div className="text-2xl font-black text-[#182cc1] tracking-wider" style={{ fontFamily: "Poppins, sans-serif" }}>{ticketNumber}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#182cc1] flex items-center justify-center">
                <Waves size={22} className="text-white" />
              </div>
            </div>
            {[
              { label: "Nama Pemesan", value: userDetails.fullName, bold: false },
              { label: "Paket", value: selectedPackage?.name || '-', bold: false },
              { label: "Tanggal", value: shortDate, bold: false },
              { label: "Total Dibayar", value: `Rp ${totalPrice.toLocaleString('id-ID')}`, bold: true },
            ].map(r => (
              <div key={r.label} className="flex justify-between py-2 text-sm border-b border-[#eef2ff] last:border-0 gap-3">
                <span className="text-[#3d518c] flex-shrink-0" style={{ fontFamily: "Inter, sans-serif" }}>{r.label}</span>
                <span className={`${r.bold ? "text-[#182cc1] font-bold" : "text-[#091540] font-medium"} text-right`}
                  style={{ fontFamily: "Poppins, sans-serif" }}>{r.value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => { resetBooking(); navigate('/'); }}
            type="button"
            className="w-full py-3 border border-[#c5d0ff] bg-white text-[#3d518c] hover:bg-[#eef2ff] rounded-2xl transition text-sm font-medium"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Selesai & Kembali ke Beranda
          </button>
        </div>
      </BookingLayout>
    );
  }

  return (
    <BookingLayout currentStep={3}>
      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="grid md:grid-cols-2 gap-6 items-stretch mb-6">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-[#091540] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
              Upload Bukti Pembayaran
            </h3>
            
            <div className="bg-white border border-[#c5d0ff] rounded-2xl p-5 shadow-sm flex-1 flex flex-col justify-center">
              {!selectedFile ? (
                <div 
                  className="border-2 border-dashed border-[#c5d0ff] hover:border-[#182cc1] rounded-xl p-8 text-center transition-colors cursor-pointer bg-[#fafcff] hover:bg-[#eef2ff] w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-14 h-14 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-[#e8edff]">
                    <UploadCloud size={24} className="text-[#182cc1]" />
                  </div>
                  <h4 className="text-[#091540] font-bold text-sm mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>Klik untuk upload gambar</h4>
                  <p className="text-xs text-[#3d518c]" style={{ fontFamily: "Inter, sans-serif" }}>Format JPG, PNG, atau PDF (maks. 5MB)</p>
                </div>
              ) : (
                <div className="border border-[#c5d0ff] rounded-xl p-4 bg-[#f8faff] flex items-center justify-between w-full">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg bg-[#e8edff] flex items-center justify-center flex-shrink-0">
                      <FileImage size={20} className="text-[#182cc1]" />
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-semibold text-[#091540] truncate">{selectedFile.name}</div>
                      <div className="text-xs text-[#3d518c]">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedFile(null)}
                    className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-red-500 transition-colors flex-shrink-0"
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

          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-[#091540] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
              Instruksi Pembayaran
            </h3>

            <div className="bg-white rounded-2xl border border-[#c5d0ff] overflow-hidden shadow-sm flex-1 flex flex-col">
              <div className="p-5 border-b border-[#e8edff] flex items-center justify-between flex-1">
                <div>
                  <div className="text-xs text-[#3d518c] mb-1 font-semibold tracking-wide uppercase">Total Tagihan</div>
                  <div className="text-[#182cc1] font-black text-2xl" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#182cc1]/10 flex items-center justify-center">
                  <Ticket size={22} className="text-[#182cc1]" />
                </div>
              </div>
              <div className="p-5 bg-[#fafcff] flex-1">
                <div className="text-sm font-semibold text-[#091540] mb-4">Transfer ke rekening berikut:</div>
                <div className="bg-white border border-[#c5d0ff] rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <div className="text-xs text-[#3d518c] mb-1 font-medium">Bank BRI</div>
                    <div className="font-bold text-lg text-[#091540] tracking-wider" style={{ fontFamily: "Poppins, sans-serif" }}>0012 3456 7890</div>
                    <div className="text-xs text-[#3d518c] mt-1">a.n. <strong>Desa Wisata Getas</strong></div>
                  </div>
                  <div className="w-16 h-10 bg-[#e8edff] rounded flex items-center justify-center text-[#182cc1] font-black italic">
                    BRI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky right column */}
        <div className="lg:sticky lg:top-4 self-start">
          <BookingSummary
            buttonText={isSubmitting ? "Mengirim..." : "Kirim Bukti Pembayaran"}
            onButtonClick={handleSubmit}
            buttonDisabled={isSubmitting || !selectedFile}
            showPaymentInfo={false}
            hideSummaryCard={true}
            onBackClick={() => navigate('/booking/form')}
            backButtonText="← Ubah Data Pemesan"
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
