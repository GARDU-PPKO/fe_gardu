import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingLayout from '../../components/layout/BookingLayout';
import BookingSummary from '../../components/booking/BookingSummary';
import { useBooking } from '../../hooks/useBooking';
import { getBookingSessions } from '../../services/booking.service';
import type { BookingSession } from '../../types';

const BookingPackage: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData, updateSchedule } = useBooking();
  const [sessions, setSessions] = useState<BookingSession[]>([]);

  useEffect(() => {
    if (!bookingData.selectedPackage) {
      navigate('/packages', { replace: true });
    }
  }, [bookingData.selectedPackage, navigate]);

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

  const handleSelectPackageAgain = () => {
    navigate('/packages');
  };

  useEffect(() => {
    updateSchedule(localDate, localSession, localParticipants);
  }, [localDate, localSession, localParticipants, updateSchedule]);

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
