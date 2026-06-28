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

  // Update context when local state changes
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
        <div className="lg:col-span-2 space-y-8">
          
          {/* Pilih Paket Section */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Pilih Paket</h2>
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
            <h2 className="text-xl font-bold text-gray-800 mb-4">Jadwal & Peserta</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-1">
                <label className="block text-sm font-bold text-gray-700">Tanggal Kunjungan <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  value={localDate}
                  onChange={(e) => setLocalDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-bold text-gray-700">Sesi Waktu <span className="text-red-500">*</span></label>
                <select
                  value={localSession}
                  onChange={(e) => setLocalSession(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow appearance-none bg-white"
                >
                  <option value="" disabled>Pilih sesi...</option>
                  <option value="Pagi (07.00 - 09.00)">Pagi (07.00 - 09.00)</option>
                  <option value="Siang (10.00 - 12.00)">Siang (10.00 - 12.00)</option>
                  <option value="Sore (14.00 - 16.00)">Sore (14.00 - 16.00)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                Jumlah Peserta <span className="text-gray-400 font-normal">(min. {minParticipants}, maks. {maxParticipants})</span>
              </label>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setLocalParticipants(Math.max(minParticipants, localParticipants - 1))}
                  className="w-10 h-10 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary/10 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                </button>
                <span className="font-bold text-2xl w-8 text-center">{localParticipants}</span>
                <button 
                  onClick={() => setLocalParticipants(Math.min(maxParticipants, localParticipants + 1))}
                  className="w-10 h-10 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary/10 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
                <span className="text-gray-500 text-sm mt-2 relative top-1">orang</span>
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
