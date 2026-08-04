import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingLayout from '../../components/layout/BookingLayout';
import PackageCard from '../../components/booking/PackageCard';
import BookingSummary from '../../components/booking/BookingSummary';
import { useBooking } from '../../hooks/useBooking';
import { getBookingSessions } from '../../services/booking.service';
import { getTourPackages } from '../../services/tour-package.service';
import type { Package } from '../../types/booking';
import type { BookingSession, TourPackage } from '../../types';

const FALLBACK_PACKAGES: Package[] = [
  {
    id: "1",
    name: "Tubing Adventure",
    duration: "±2 jam",
    price: 75000,
    unit: "orang",
    tag: "Terpopuler",
    minParticipants: 1,
    maxParticipants: 10,
    image: "https://images.unsplash.com/photo-1546058914-5000137323f0?w=500&h=320&fit=crop&auto=format",
    description: "Menyusuri Sungai Blukar sepanjang 1,5 km dengan arus alami.",
    includes: ["Pelampung & helm", "Pemandu lokal", "Air minum"],
  },
  {
    id: "2",
    name: "River Exploration",
    duration: "±3 jam",
    price: 95000,
    unit: "orang",
    minParticipants: 1,
    maxParticipants: 8,
    image: "https://images.unsplash.com/photo-1561774711-b0fa364863b7?w=500&h=320&fit=crop&auto=format",
    description: "Eksplorasi sungai bersama guide berpengalaman dan safety equipment lengkap.",
    includes: ["Full safety gear", "Pemandu senior", "Foto dokumentasi", "Air minum"],
  },
  {
    id: "3",
    name: "Family Package",
    duration: "½ hari",
    price: 250000,
    unit: "grup",
    tag: "Promo",
    minParticipants: 2,
    maxParticipants: 6,
    image: "https://images.unsplash.com/photo-1520329612326-d6038d1395a1?w=500&h=320&fit=crop&auto=format",
    description: "Paket keluarga lengkap — tubing, makan siang, foto dokumentasi.",
    includes: ["Full safety gear", "Pemandu keluarga", "Makan siang", "Foto & video", "Suvenir"],
  },
  {
    id: "4",
    name: "Group Package",
    duration: "½ hari",
    price: 65000,
    unit: "orang",
    minParticipants: 20,
    maxParticipants: 100,
    image: "https://images.unsplash.com/photo-1643215721864-cd4c354ac298?w=500&h=320&fit=crop&auto=format",
    description: "Paket rombongan minimal 20 orang dengan guide dan makan siang.",
    includes: ["Safety equipment", "Multiple guide", "Makan siang", "Area gathering"],
  },
];

const BookingPackage: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData, updatePackage, updateSchedule } = useBooking();
  const [packages, setPackages] = useState<Package[]>(FALLBACK_PACKAGES);
  const [sessions, setSessions] = useState<BookingSession[]>([]);

  useEffect(() => {
    if (!bookingData.selectedPackage && FALLBACK_PACKAGES.length > 0) {
      updatePackage(FALLBACK_PACKAGES[0]);
    }

    getTourPackages()
      .then(res => {
        if (res?.data && res.data.length > 0) {
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

          // Set default tags if missing in DB to match reference design
          const fixedPackages = mapped.map(p => {
            if (p.name === 'Tubing Adventure' && !p.tag) return { ...p, tag: 'Terpopuler' };
            if (p.name === 'Family Package' && !p.tag) return { ...p, tag: 'Promo' };
            return p;
          });

          setPackages(fixedPackages);

          if (!bookingData.selectedPackage && fixedPackages.length > 0) {
            updatePackage(fixedPackages[0]);
          }
        }
      })
      .catch(() => {
        // Retain fallback packages if API fails or is unreachable
      });
  }, []);
  
  const [localDate, setLocalDate] = useState(bookingData.date);
  const [localSession, setLocalSession] = useState(bookingData.session || 'Pagi (07.00 - 09.00)');
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
    setLocalSession('Pagi (07.00 - 09.00)');
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
      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        <div>
          <h3 className="text-lg font-bold text-[#091540] mb-5" style={{ fontFamily: "Poppins, sans-serif" }}>
            Pilih Paket
          </h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                isSelected={bookingData.selectedPackage?.id === pkg.id}
                onSelect={handleSelectPackage}
              />
            ))}
          </div>

          <h3 className="text-lg font-bold text-[#091540] mb-5" style={{ fontFamily: "Poppins, sans-serif" }}>
            Jadwal & Peserta
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-[#091540] mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                Tanggal Kunjungan <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={localDate}
                onChange={(e) => setLocalDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#c5d0ff] bg-white text-[#091540] text-sm focus:outline-none focus:border-[#182cc1] focus:ring-2 focus:ring-[#e8edff] transition"
                style={{ fontFamily: "Inter, sans-serif" }}
              />
            </div>
            {/* Sesi */}
            <div>
              <label className="block text-sm font-semibold text-[#091540] mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                Sesi Waktu <span className="text-red-500">*</span>
              </label>
              <select
                value={localSession}
                onChange={(e) => setLocalSession(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#c5d0ff] bg-white text-[#091540] text-sm focus:outline-none focus:border-[#182cc1] focus:ring-2 focus:ring-[#e8edff] transition"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {sessions.length > 0 ? (
                  sessions.map((session) => (
                    <option key={session.id} value={session.sesi}>
                      {session.sesi}
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
            {/* Persons */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-[#091540] mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                Jumlah Peserta <span className="text-[#3d518c] font-normal">(min. {minParticipants}, maks. {maxParticipants})</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLocalParticipants(Math.max(minParticipants, localParticipants - 1))}
                  disabled={localParticipants <= minParticipants}
                  className="w-11 h-11 rounded-xl border-2 border-[#c5d0ff] bg-white text-[#091540] flex items-center justify-center text-xl font-bold hover:border-[#182cc1] hover:bg-[#eef2ff] transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <div className="flex-1 text-center">
                  <span className="text-3xl font-black text-[#091540]" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {localParticipants}
                  </span>
                  <span className="text-sm text-[#3d518c] ml-2">orang</span>
                </div>
                <button
                  type="button"
                  onClick={() => setLocalParticipants(Math.min(maxParticipants, localParticipants + 1))}
                  disabled={localParticipants >= maxParticipants}
                  className="w-11 h-11 rounded-xl border-2 border-[#c5d0ff] bg-white text-[#091540] flex items-center justify-center text-xl font-bold hover:border-[#182cc1] hover:bg-[#eef2ff] transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky summary sidebar */}
        <div className="lg:sticky lg:top-4 self-start">
          <BookingSummary
            buttonText="Lanjut ke Data Pemesan"
            onButtonClick={handleNext}
            buttonDisabled={!isFormValid}
          />
          {!isFormValid && (
            <p className="text-xs text-[#3d518c] text-center mt-2" style={{ fontFamily: "Inter, sans-serif" }}>
              {localDate === "" ? "Pilih tanggal kunjungan terlebih dahulu" : `Minimal ${minParticipants} peserta untuk paket ini`}
            </p>
          )}
        </div>
      </div>
    </BookingLayout>
  );
};

export default BookingPackage;


