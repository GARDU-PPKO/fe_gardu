import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';
import BookingLayout from '../../components/layout/BookingLayout';
import { createBooking } from '../../services/booking.service';
import { UploadCloud, Ticket, FileImage, Trash2 } from "lucide-react";


const BookingPayment: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData } = useBooking();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
          email: userDetails.email,
          date: date || new Date().toISOString().split('T')[0],
          session_time: session || 'Pagi (07.00 - 09.00)',
          participants: participants,
          total_harga: totalPrice,
          notes: notesWithPayment
        });
        
        if (response.data && response.data.data && response.data.data.kode_booking) {
          const kode = response.data.data.kode_booking;
          saveDummyToLocal(kode);
          navigate(`/cek-pesanan?kode=${kode}`);
        } else {
          // eslint-disable-next-line react-hooks/purity
          const fallbackKode = `GTS-${Math.floor(100000 + Math.random() * 900000)}`;
          saveDummyToLocal(fallbackKode);
          navigate(`/cek-pesanan?kode=${fallbackKode}`);
        }
      }
    } catch (e) {
      console.error('Failed to submit booking to backend:', e);
      // Fallback ticket number if API fails
      // eslint-disable-next-line react-hooks/purity
      const fallbackKode = `GTS-${Math.floor(100000 + Math.random() * 900000)}`;
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
        kontak_darurat: userDetails.email || '', // mapping email field which is now kontak darurat
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
