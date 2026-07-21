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
      setSessions([]);
      return;
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Form/Selection */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Pilih Paket Section */}
          <section>
            <div className="flex flex-col mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shadow-sm">
                  <LayoutGrid size={20} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-bold text-[#0a1f0f]" style={{ fontFamily: "Poppins, sans-serif" }}>Pilih Paket Wisata</h2>
              </div>
              
              {/* Category Tabs */}
              <div className="mt-2">
                <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-hide">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all duration-300 ${
                        activeCategory === cat.id 
                          ? 'border-[#16a34a] bg-[#16a34a] text-white shadow-md shadow-green-200/50 scale-[1.02]' 
                          : 'border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50 hover:text-green-700'
                      }`}
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <span className={`${activeCategory === cat.id ? 'text-white' : 'text-green-600'}`}>
                        {cat.icon}
                      </span>
                      <span className="font-semibold text-sm tracking-wide">{cat.label}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <p className="text-sm text-[#4b7a55] bg-[#f0fdf4] inline-flex px-4 py-2 rounded-lg border border-[#bbf7d0]" style={{ fontFamily: "Inter, sans-serif" }}>
                    {CATEGORIES.find(c => c.id === activeCategory)?.desc}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="col-span-1 md:col-span-2 py-10 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                  <span className="text-4xl mb-3">🍃</span>
                  <p className="font-medium text-gray-600">Belum ada paket untuk kategori ini.</p>
                  <p className="text-sm mt-1">Silakan pilih kategori lainnya.</p>
                </div>
              )}
            </div>
          </section>

          {/* Jadwal & Peserta Section */}
          <section>
            <div className="flex items-center gap-3 mb-5 mt-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#0a1f0f]" style={{ fontFamily: "Poppins, sans-serif" }}>Jadwal & Peserta</h2>
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
                    <option value="" disabled>{currentPackage && localDate ? 'Pilih sesi...' : 'Pilih paket dan tanggal terlebih dahulu'}</option>
                    {sessions.map(session => (
                      <option key={session.id} value={session.sesi}>
                        {session.sesi} - tersisa {session.kuota - session.terisi} kuota
                      </option>
                    ))}
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
