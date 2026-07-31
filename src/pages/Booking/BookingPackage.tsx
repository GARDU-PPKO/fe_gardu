import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, BookOpen, Tent, LayoutGrid } from 'lucide-react';
import BookingLayout from '../../components/layout/BookingLayout';
import PackageCard from '../../components/booking/PackageCard';
import BookingSummary from '../../components/booking/BookingSummary';
import { useBooking } from '../../hooks/useBooking';
import { getBookingSessions } from '../../services/booking.service';
import { getTourPackages } from '../../services/tour-package.service';
import type { Package } from '../../types/booking';
import type { BookingSession, TourPackage } from '../../types';

const getCategory = (pkg: Package): string => {
  const text = `${pkg.name} ${pkg.description} ${pkg.tag || ''}`.toLowerCase();
  
  if (text.includes('edukasi') || text.includes('susu') || text.includes('kambing') || text.includes('kopi')) {
    return 'Edukasi';
  }
  if (text.includes('family') || text.includes('camping') || text.includes('keluarga')) {
    return 'Family';
  }
  if (text.includes('adventure') || text.includes('hiking') || text.includes('air terjun') || text.includes('sungai') || text.includes('tubing') || text.includes('river')) {
    return 'Adventure';
  }
  return 'Lainnya';
};

const CATEGORIES = [
  { id: 'Semua', label: 'Semua Paket', icon: <LayoutGrid size={16} strokeWidth={2.5} />, desc: 'Lihat semua pilihan paket wisata yang tersedia.' },
  { id: 'Adventure', label: 'Adventure', icon: <Compass size={16} strokeWidth={2.5} />, desc: 'Hiking air terjun, menelusuri sungai besar/kecil.' },
  { id: 'Edukasi', label: 'Edukasi', icon: <BookOpen size={16} strokeWidth={2.5} />, desc: 'Mengenal pengelolaan susu kambing, pengelolaan kopi.' },
  { id: 'Family', label: 'Family', icon: <Tent size={16} strokeWidth={2.5} />, desc: 'Camping dan kegiatan seru untuk keluarga.' }
];

const BookingPackage: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData, updatePackage, updateSchedule } = useBooking();
  const [packages, setPackages] = useState<Package[]>([]);
  const [sessions, setSessions] = useState<BookingSession[]>([]);
  const [activeCategory, setActiveCategory] = useState('Semua');

  useEffect(() => {
    getTourPackages().then(res => {
      const mapped: Package[] = res.data.map((p: TourPackage) => ({
        id: String(p.id),
        name: p.nama,
        description: p.deskripsi,
        price: Number(p.harga),
        unit: p.satuan === 'orang' ? 'orang' : 'grup',
        tag: p.tag ?? undefined,
        minParticipants: p.min_participants ?? undefined,
        maxParticipants: p.max_participants ?? undefined,
        image: p.gambar,
        duration: p.durasi,
        includes: p.includes?.map(item => item.item) ?? [],
      }));

      // Inject Edukasi if not present in DB
      const hasEdukasi = mapped.some(p => getCategory(p) === 'Edukasi');
      if (!hasEdukasi) {
        mapped.push({
          id: '999',
          name: 'Edu-Tour Kopi & Susu Kambing',
          description: 'Wisata edukasi mengenal proses pengelolaan kopi lokal dan cara memerah susu kambing etawa.',
          price: 45000,
          unit: 'orang',
          tag: 'Edukasi',
          minParticipants: 5,
          maxParticipants: 30,
          image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&h=320&fit=crop&auto=format',
          duration: '±3 jam',
          includes: ['Tour kebun kopi', 'Praktik perah susu', 'Tasting kopi & susu', 'Pemandu edukasi']
        });
      }

      // Add tag Adventure to River Exploration
      const fixedPackages = mapped.map(p => {
        if (p.name === 'River Exploration' && !p.tag) {
          return { ...p, tag: 'Adventure' };
        }
        return p;
      });

      setPackages(fixedPackages);
    });
  }, []);
  
  const [localDate, setLocalDate] = useState(bookingData.date);
  const [localSession, setLocalSession] = useState(bookingData.session);
  const [localParticipants, setLocalParticipants] = useState(bookingData.participants || 1);

  const currentPackage = bookingData.selectedPackage;
  const minParticipants = currentPackage?.minParticipants || 1;
  const maxParticipants = currentPackage?.maxParticipants || 10;

  useEffect(() => {
    if (!currentPackage || !localDate) {
      const timer = setTimeout(() => setSessions([]), 0);
      return () => clearTimeout(timer);
    }

    getBookingSessions({ package_id: Number(currentPackage.id), tanggal: localDate }).then(res => {
      setSessions(res.data.filter(item => item.kuota > item.terisi));
    });
  }, [currentPackage, localDate]);

  const handleSelectPackage = (pkg: Package) => {
    updatePackage(pkg);
    setLocalSession('');
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

  const filteredPackages = packages.filter(pkg => {
    if (activeCategory === 'Semua') return true;
    return getCategory(pkg) === activeCategory;
  });

  return (
    <BookingLayout currentStep={1}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column - Form/Selection */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Pilih Paket Section */}
          <section>
            <div className="flex flex-col mb-7">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl md:text-2xl font-extrabold text-[#1E293B]" style={{ fontFamily: "Poppins, sans-serif" }}>Pilih Paket</h2>
              </div>
              
              {/* Category Tabs */}
              <div>
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl border transition-all duration-300 ${
                        activeCategory === cat.id 
                          ? 'border-[#182CC1] bg-[#182CC1] text-white shadow-md shadow-[#182CC1]/30 font-bold scale-[1.02]' 
                          : 'border-gray-200/80 bg-white text-gray-600 hover:border-[#182CC1]/40 hover:bg-blue-50/50 hover:text-[#182CC1] font-semibold'
                      }`}
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      <span className={`${activeCategory === cat.id ? 'text-white' : 'text-[#182CC1]'}`}>
                        {cat.icon}
                      </span>
                      <span className="text-xs sm:text-sm tracking-wide">{cat.label}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <p className="text-xs sm:text-sm text-[#182CC1] bg-[#EFF2FC] inline-flex px-4 py-2.5 rounded-xl border border-blue-200/80 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                    {CATEGORIES.find(c => c.id === activeCategory)?.desc}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredPackages.length > 0 ? (
                filteredPackages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    isSelected={bookingData.selectedPackage?.id === pkg.id}
                    onSelect={handleSelectPackage}
                  />
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 py-12 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 rounded-3xl bg-white">
                  <span className="text-4xl mb-3">🌊</span>
                  <p className="font-bold text-[#1E293B]">Belum ada paket wisata untuk kategori ini.</p>
                  <p className="text-xs mt-1 text-gray-400">Silakan pilih kategori petualangan atau edukasi lainnya.</p>
                </div>
              )}
            </div>
          </section>

          {/* Jadwal & Peserta Section */}
          <section className="pt-2">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#1E293B]" style={{ fontFamily: "Poppins, sans-serif" }}>Jadwal & Peserta</h2>
            </div>
            
            <div className="bg-white rounded-3xl border border-blue-100/80 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-extrabold text-[#1E293B]" style={{ fontFamily: "Poppins, sans-serif" }}>Tanggal Kunjungan <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    value={localDate}
                    onChange={(e) => setLocalDate(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#182CC1] focus:border-[#182CC1] outline-none transition-all text-sm text-[#1E293B] font-semibold bg-[#F8FAFC]/50 hover:border-[#182CC1]/40"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-extrabold text-[#1E293B]" style={{ fontFamily: "Poppins, sans-serif" }}>Sesi Waktu <span className="text-red-500">*</span></label>
                  <select
                    value={localSession}
                    onChange={(e) => setLocalSession(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#182CC1] focus:border-[#182CC1] outline-none transition-all appearance-none bg-white text-sm font-semibold text-[#1E293B] hover:border-[#182CC1]/40"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <option value="" disabled>{currentPackage && localDate ? 'Pogi (07.00 - 09.00)' : 'Pagi (07.00 - 09.00)'}</option>
                    {sessions.length > 0 ? (
                      sessions.map(session => (
                        <option key={session.id} value={session.sesi}>
                          {session.sesi} (tersisa {session.kuota - session.terisi} kuota)
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Pagi (07.00 - 09.00)">Pagi (07.00 - 09.00)</option>
                        <option value="Siang (10.00 - 12.00)">Siang (10.00 - 12.00)</option>
                        <option value="Sore (14.00 - 16.00)">Sore (14.00 - 16.00)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-gray-100">
                <label className="block text-xs sm:text-sm font-extrabold text-[#1E293B]" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Jumlah Peserta <span className="text-[#182CC1] font-semibold text-xs">(min. {minParticipants}, maks. {maxParticipants})</span>
                </label>
                <div className="flex items-center justify-between sm:justify-start gap-6 pt-1">
                  <div className="flex items-center gap-5">
                    <button 
                      onClick={() => setLocalParticipants(Math.max(minParticipants, localParticipants - 1))}
                      disabled={localParticipants <= minParticipants}
                      type="button"
                      className="w-11 h-11 rounded-full border-2 border-[#182CC1] text-[#182CC1] flex items-center justify-center hover:bg-[#EFF2FC] active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs font-black text-xl"
                    >
                      –
                    </button>
                    <div className="flex items-baseline gap-1.5 min-w-[70px] justify-center">
                      <span className="font-black text-2xl sm:text-3xl text-[#1E293B]" style={{ fontFamily: "Poppins, sans-serif" }}>{localParticipants}</span>
                      <span className="text-gray-400 font-medium text-sm" style={{ fontFamily: "Inter, sans-serif" }}>orang</span>
                    </div>
                    <button 
                      onClick={() => setLocalParticipants(Math.min(maxParticipants, localParticipants + 1))}
                      disabled={localParticipants >= maxParticipants}
                      type="button"
                      className="w-11 h-11 rounded-full border-2 border-[#182CC1] text-[#182CC1] flex items-center justify-center hover:bg-[#EFF2FC] active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs font-black text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-3">
            <BookingSummary 
              buttonText="Lanjut ke Data Pemesan" 
              onButtonClick={handleNext}
              buttonDisabled={!isFormValid}
            />
            {!isFormValid && (
              <p className="text-xs text-center font-semibold text-gray-400 mt-2" style={{ fontFamily: "Inter, sans-serif" }}>
                Pilih tanggal kunjungan terlebih dahulu
              </p>
            )}
          </div>
        </div>
        
      </div>
    </BookingLayout>
  );
};

export default BookingPackage;

