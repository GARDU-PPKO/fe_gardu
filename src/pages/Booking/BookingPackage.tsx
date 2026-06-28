import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingLayout from '../../components/layout/BookingLayout';
import PackageCard from '../../components/booking/PackageCard';
import BookingSummary from '../../components/booking/BookingSummary';
import { useBooking } from '../../hooks/useBooking';
import type { Package } from '../../types/booking';

const PACKAGES: Package[] = [
  {
    id: 'pkg-1',
    name: 'Tubing Adventure',
    description: 'Menyusuri Sungai Blukar sepanjang 1,5 km dengan arus alami.',
    price: 75000,
    unit: 'orang',
    tag: 'Terpopuler'
  },
  {
    id: 'pkg-2',
    name: 'River Exploration',
    description: 'Eksplorasi sungai bersama guide berpengalaman dan safety equipment lengkap.',
    price: 95000,
    unit: 'orang'
  },
  {
    id: 'pkg-3',
    name: 'Family Package',
    description: 'Paket keluarga lengkap — tubing, makan siang, foto dokumentasi.',
    price: 250000,
    unit: 'grup',
    tag: 'Promo'
  },
  {
    id: 'pkg-4',
    name: 'Group Package',
    description: 'Paket rombongan minimal 20 orang dengan guide dan makan siang.',
    price: 65000,
    unit: 'orang',
    minParticipants: 20,
    maxParticipants: 100
  }
];

const BookingPackage: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData, updatePackage, updateSchedule } = useBooking();
  
  const [localDate, setLocalDate] = useState(bookingData.date);
  const [localSession, setLocalSession] = useState(bookingData.session);
  const [localParticipants, setLocalParticipants] = useState(bookingData.participants || 1);

  const currentPackage = bookingData.selectedPackage;
  const minParticipants = currentPackage?.minParticipants || 1;
  const maxParticipants = currentPackage?.maxParticipants || 10;

  const handleSelectPackage = (pkg: Package) => {
    updatePackage(pkg);
    const min = pkg.minParticipants || 1;
    const max = pkg.maxParticipants || 10;
    if (localParticipants < min) setLocalParticipants(min);
    if (localParticipants > max) setLocalParticipants(max);
  };

  useEffect(() => {
    updateSchedule(localDate, localSession, localParticipants);
  }, [localDate, localSession, localParticipants, updateSchedule]);

  const handleNext = () => {
    navigate('/booking/form');
  };

  const isFormValid = bookingData.selectedPackage !== null && localDate !== '' && localSession !== '';

  return (
    <BookingLayout currentStep={1}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Form/Selection */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Pilih Paket Section */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-[#052e16]">Pilih Paket Wisata</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PACKAGES.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  isSelected={bookingData.selectedPackage?.id === pkg.id}
                  onSelect={handleSelectPackage}
                />
              ))}
            </div>
          </section>

          {/* Jadwal & Peserta Section */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-[#052e16]">Jadwal & Peserta</h2>
            </div>
            
            <div className="bg-white rounded-xl border border-green-100 p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-[#052e16]">Tanggal Kunjungan <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    value={localDate}
                    onChange={(e) => setLocalDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-[#052e16]">Sesi Waktu <span className="text-red-500">*</span></label>
                  <select
                    value={localSession}
                    onChange={(e) => setLocalSession(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow appearance-none bg-white text-sm"
                  >
                    <option value="" disabled>Pilih sesi...</option>
                    <option value="Pagi (07.00 - 09.00)">Pagi (07.00 - 09.00)</option>
                    <option value="Siang (10.00 - 12.00)">Siang (10.00 - 12.00)</option>
                    <option value="Sore (14.00 - 16.00)">Sore (14.00 - 16.00)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-[#052e16]">
                  Jumlah Peserta <span className="text-gray-400 font-normal text-xs">(min. {minParticipants}, maks. {maxParticipants})</span>
                </label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setLocalParticipants(Math.max(minParticipants, localParticipants - 1))}
                    disabled={localParticipants <= minParticipants}
                    className="w-10 h-10 rounded-full border-2 border-green-600 text-green-600 flex items-center justify-center hover:bg-green-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                  </button>
                  <span className="font-bold text-2xl w-8 text-center text-[#052e16]">{localParticipants}</span>
                  <button 
                    onClick={() => setLocalParticipants(Math.min(maxParticipants, localParticipants + 1))}
                    disabled={localParticipants >= maxParticipants}
                    className="w-10 h-10 rounded-full border-2 border-green-600 text-green-600 flex items-center justify-center hover:bg-green-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </button>
                  <span className="text-gray-500 text-sm">orang</span>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <BookingSummary 
              buttonText="Lanjut ke Data Pemesan" 
              onButtonClick={handleNext}
              buttonDisabled={!isFormValid}
            />
            {!isFormValid && (
              <p className="text-xs text-center text-gray-500 mt-3">
                Lengkapi pilihan paket & jadwal terlebih dahulu
              </p>
            )}
          </div>
        </div>
        
      </div>
    </BookingLayout>
  );
};

export default BookingPackage;
