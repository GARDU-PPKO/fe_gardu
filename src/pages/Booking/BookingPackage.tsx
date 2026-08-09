import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Coffee, Bike, Target } from 'lucide-react';
import BookingLayout from '../../components/layout/BookingLayout';
import BookingSummary from '../../components/booking/BookingSummary';
import { useBooking } from '../../hooks/useBooking';
import { getBookingSessions } from '../../services/booking.service';
import type { BookingSession } from '../../types';

import imgBbq from '../../assets/addons/addon_bbq_1786241504347.png';
import imgSnack from '../../assets/addons/addon_snack_1786241515770.png';
import imgAtv from '../../assets/addons/addon_atv_1786241528213.png';
import imgArchery from '../../assets/addons/addon_archery_1786241541072.png';

const BookingPackage: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData, updateSchedule, updateAddOns } = useBooking();
  const [sessions, setSessions] = useState<BookingSession[]>([]);

  useEffect(() => {
    if (!bookingData.selectedPackage) {
      navigate('/packages', { replace: true });
    }
  }, [bookingData.selectedPackage, navigate]);

  const [localDate, setLocalDate] = useState(bookingData.date);
  const [localSession, setLocalSession] = useState(bookingData.session || 'Pagi (07.00 - 09.00)');
  const [localParticipants, setLocalParticipants] = useState(bookingData.participants || 1);
  const [localAddOns, setLocalAddOns] = useState(bookingData.selectedAddOns || []);

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

  const handleSelectPackageAgain = () => {
    navigate('/packages');
  };

  useEffect(() => {
    updateSchedule(localDate, localSession, localParticipants);
  }, [localDate, localSession, localParticipants, updateSchedule]);

  useEffect(() => {
    updateAddOns(localAddOns);
  }, [localAddOns, updateAddOns]);

  const handleNext = () => {
    navigate('/booking/form');
  };

  const isFormValid = bookingData.selectedPackage !== null && localDate !== '' && localSession !== '';

  if (!currentPackage) return null;

  return (
    <BookingLayout currentStep={1}>
      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-[#091540]" style={{ fontFamily: "Poppins, sans-serif" }}>
              Paket Terpilih
            </h3>
            <button onClick={handleSelectPackageAgain} className="text-sm font-semibold text-[#182cc1] hover:underline">
              Ganti Paket
            </button>
          </div>
          
          <div className="bg-white rounded-2xl p-4 border border-[#c5d0ff] flex gap-4 items-center mb-8 shadow-sm">
            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#e8edff]">
              <img src={currentPackage.image} alt={currentPackage.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-[#091540] text-lg mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>{currentPackage.name}</h4>
              <p className="text-[#3d518c] text-sm mb-2" style={{ fontFamily: "Inter, sans-serif" }}>{currentPackage.duration} · {currentPackage.unit === 'orang' ? 'Per Orang' : 'Per Grup'}</p>
              <div className="text-[#182cc1] font-bold">
                {`Rp ${Number(currentPackage.price).toLocaleString('id-ID')}`}
              </div>
            </div>
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
              <div className="flex items-center justify-between bg-[#f8faff] border border-[#c5d0ff] rounded-2xl p-2 shadow-inner">
                <button
                  type="button"
                  onClick={() => setLocalParticipants(Math.max(minParticipants, localParticipants - 1))}
                  disabled={localParticipants <= minParticipants}
                  className="w-12 h-12 rounded-xl bg-white border border-[#c5d0ff] text-[#182cc1] flex items-center justify-center hover:border-[#182cc1] hover:bg-[#eef2ff] hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                
                <div className="flex flex-col items-center justify-center px-6">
                  <span className="text-4xl font-black text-[#091540] tracking-tight leading-none" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {localParticipants}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#182cc1] tracking-widest mt-1">
                    Orang
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setLocalParticipants(Math.min(maxParticipants, localParticipants + 1))}
                  disabled={localParticipants >= maxParticipants}
                  className="w-12 h-12 rounded-xl bg-[#182cc1] text-white flex items-center justify-center hover:bg-[#1524a3] hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 shadow-sm shadow-[#c5d0ff]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Add-Ons Section */}
          <h3 className="text-lg font-bold text-[#091540] mt-8 mb-5" style={{ fontFamily: "Poppins, sans-serif" }}>
            Fasilitas Tambahan (Opsional)
          </h3>
          <div className="grid gap-4">
            {[
              { 
                id: '1', 
                name: 'Alat Bakaran', 
                price: 35000, 
                desc: 'Lengkap dengan arang, capitan, kipas, dan panggangan. Cocok untuk BBQ malam.',
                image: imgBbq
              },
              { 
                id: '2', 
                name: 'Paket Snack Lokal', 
                price: 15000, 
                desc: 'Kopi/teh hangat, ubi rebus, kacang rebus, dan jajanan tradisional khas Getas.',
                image: imgSnack
              },
              { 
                id: '3', 
                name: 'ATV Ride Adventure', 
                price: 50000, 
                desc: 'Sewa ATV 30 menit di sirkuit mini off-road kami. Sudah termasuk helm.',
                image: imgAtv
              },
              { 
                id: '4', 
                name: 'Area Panahan (Archery)', 
                price: 0, 
                desc: 'Gratis! Coba 3 anak panah dengan target sasaran di area khusus.',
                image: imgArchery
              }
            ].map(addon => {
              const isSelected = localAddOns.some(a => a.id === addon.id);
              return (
                <label key={addon.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${isSelected ? 'border-[#182cc1] bg-[#f8faff] shadow-md shadow-[#182cc1]/10' : 'border-[#c5d0ff] bg-white hover:border-[#182cc1] hover:shadow-sm'}`}>
                  <div className="flex items-center gap-4 w-full">
                    {/* Add-on Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#e8edff]">
                      <img src={addon.image} alt={addon.name} className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Text Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#091540] text-sm sm:text-base">{addon.name}</span>
                        {addon.price === 0 && (
                          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">FREE</span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-[#3d518c] leading-snug line-clamp-2 pr-2" style={{ fontFamily: "Inter, sans-serif" }}>
                        {addon.desc}
                      </p>
                      
                      {/* Mobile Layout Price (shows up on small screens instead of far right) */}
                      <div className="sm:hidden mt-2 font-bold text-[#182cc1] text-sm">
                        {addon.price === 0 ? 'Gratis' : `+ Rp ${addon.price.toLocaleString('id-ID')}`}
                      </div>
                    </div>
                  </div>
                  
                  {/* Desktop Right Side: Price & Checkbox */}
                  <div className="hidden sm:flex items-center gap-4 flex-shrink-0 pl-4 border-l border-transparent">
                    <span className="text-[#182cc1] font-bold whitespace-nowrap">
                      {addon.price === 0 ? 'Gratis' : `+ Rp ${addon.price.toLocaleString('id-ID')}`}
                    </span>
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-[#182cc1] border-[#182cc1]' : 'border-[#c5d0ff] bg-white'}`}>
                      {isSelected && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                    </div>
                  </div>

                  {/* Mobile Layout Checkbox (absolute top right for mobile) */}
                  <div className="sm:hidden absolute right-4 top-4">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-[#182cc1] border-[#182cc1]' : 'border-[#c5d0ff] bg-white'}`}>
                      {isSelected && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                    </div>
                  </div>

                  <input type="checkbox" className="hidden" checked={isSelected} onChange={(e) => {
                    if (e.target.checked) {
                      setLocalAddOns([...localAddOns, { id: addon.id, name: addon.name, price: addon.price, quantity: 1 }]);
                    } else {
                      setLocalAddOns(localAddOns.filter(a => a.id !== addon.id));
                    }
                  }} />
                </label>
              );
            })}
          </div>

          {/* Rules Section */}
          <h3 className="text-lg font-bold text-[#091540] mt-8 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
            Peraturan & Kebijakan
          </h3>
          <div className="bg-[#fff9e6] border border-[#ffe082] rounded-xl p-4 space-y-3 mb-8">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <p className="text-sm text-orange-900 leading-relaxed">
                <strong>Waktu Check-in & Check-out:</strong><br />
                Check-in mulai pukul 13.00 WIB.<br />
                Check-out maksimal pukul 11.00 WIB.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"></path></svg>
              <p className="text-sm text-orange-900 leading-relaxed">
                <strong>Kebijakan Pembatalan:</strong><br />
                Pembatalan atau reschedule maksimal 8 jam sebelum waktu kedatangan.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              <p className="text-sm text-orange-900 leading-relaxed">
                <strong>Jam Malam:</strong><br />
                Peraturan jam malam dan ketenangan berlaku mulai pukul 22.00 WIB (10 malam).
              </p>
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
