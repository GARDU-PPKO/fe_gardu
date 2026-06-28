import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingLayout from '../../components/layout/BookingLayout';
import BookingSummary from '../../components/booking/BookingSummary';
import { useBooking } from '../../hooks/useBooking';

const BookingPayment: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData } = useBooking();

  useEffect(() => {
    if (!bookingData.selectedPackage || !bookingData.userDetails.fullName) {
      navigate('/booking/package');
    }
  }, [bookingData, navigate]);

  const handleConfirm = () => {
    // Here you would typically send data to an API
    // For now, we simulate a successful booking
    navigate('/booking/success');
  };

  const { selectedPackage, date, session, participants, userDetails } = bookingData;

  return (
    <BookingLayout currentStep={3}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Review Data */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Review & Konfirmasi Pesanan</h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Banner */}
            <div className="h-32 bg-gray-800 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-4 left-6 text-white">
                <h3 className="font-bold text-xl">{selectedPackage?.name}</h3>
                <p className="text-sm text-gray-300">Sungai Blukar, Desa Getas</p>
              </div>
            </div>

            {/* Data Table */}
            <div className="divide-y divide-gray-100">
              <div className="grid grid-cols-3 p-4">
                <div className="text-gray-500 text-sm">Paket</div>
                <div className="col-span-2 font-medium text-sm text-gray-800">{selectedPackage?.name}</div>
              </div>
              <div className="grid grid-cols-3 p-4">
                <div className="text-gray-500 text-sm">Tanggal</div>
                <div className="col-span-2 font-medium text-sm text-gray-800">{date}</div>
              </div>
              <div className="grid grid-cols-3 p-4">
                <div className="text-gray-500 text-sm">Sesi</div>
                <div className="col-span-2 font-medium text-sm text-gray-800">{session}</div>
              </div>
              <div className="grid grid-cols-3 p-4">
                <div className="text-gray-500 text-sm">Peserta</div>
                <div className="col-span-2 font-medium text-sm text-gray-800">{participants} orang</div>
              </div>
              <div className="grid grid-cols-3 p-4">
                <div className="text-gray-500 text-sm">Nama Pemesan</div>
                <div className="col-span-2 font-medium text-sm text-gray-800 uppercase">{userDetails.fullName}</div>
              </div>
              <div className="grid grid-cols-3 p-4">
                <div className="text-gray-500 text-sm">No. WhatsApp</div>
                <div className="col-span-2 font-medium text-sm text-gray-800">{userDetails.whatsapp}</div>
              </div>
              <div className="grid grid-cols-3 p-4">
                <div className="text-gray-500 text-sm">Email</div>
                <div className="col-span-2 font-medium text-sm text-gray-800">{userDetails.email || '-'}</div>
              </div>
              <div className="grid grid-cols-3 p-4">
                <div className="text-gray-500 text-sm">Kota Asal</div>
                <div className="col-span-2 font-medium text-sm text-gray-800">{userDetails.city || '-'}</div>
              </div>
              <div className="grid grid-cols-3 p-4">
                <div className="text-gray-500 text-sm">Catatan</div>
                <div className="col-span-2 font-medium text-sm text-gray-800">{userDetails.notes || '-'}</div>
              </div>
            </div>
          </div>

          {/* Included Features */}
          <div className="bg-primary-light border border-primary/20 p-5 rounded-xl space-y-3">
            <h3 className="font-bold text-primary text-xs tracking-wide">TERMASUK DALAM PAKET</h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-green-800">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Pelampung & helm</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Pemandu lokal</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Air minum</span>
              </div>
            </div>
          </div>

          {/* Total Payment Box */}
          <div className="bg-[#0b2818] rounded-xl p-5 flex items-center justify-between text-white shadow-lg">
            <div>
              <p className="text-sm text-gray-300 mb-1">Total Pembayaran</p>
              <h2 className="text-2xl font-bold text-white">
                Rp {(selectedPackage ? selectedPackage.price * participants : 0).toLocaleString('id-ID')}
              </h2>
              <p className="text-xs text-gray-400 mt-1">{participants} orang × Rp {selectedPackage?.price.toLocaleString('id-ID')}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
            </div>
          </div>

        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <BookingSummary 
              buttonText="Konfirmasi Pesanan" 
              onButtonClick={handleConfirm}
              showPaymentInfo={true}
            />
          </div>
        </div>
        
      </div>
    </BookingLayout>
  );
};

export default BookingPayment;
