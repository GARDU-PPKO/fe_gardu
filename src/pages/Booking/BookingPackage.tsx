import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import BookingLayout from '../../components/layout/BookingLayout';
import BookingSummary from '../../components/booking/BookingSummary';
import { useBooking } from '../../hooks/useBooking';
import { getBookingSessions, getAddOns } from '../../services/booking.service';
import { getTourPackageDetail } from '../../services/tour-package.service';
import { resolveImageUrl } from '../../utils/image';
import { calculatePackagePrice } from '../../utils/pricing';
import type { AddOnOption } from '../../services/booking.service';
import type { BookingSession } from '../../types';

const BookingPackage: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData, updateSchedule, updateAddOns, updatePackage } = useBooking();
  const [sessions, setSessions] = useState<BookingSession[]>([]);

  const currentPackage = bookingData.selectedPackage;

  useEffect(() => {
    if (!bookingData.selectedPackage) {
      navigate('/packages', { replace: true });
    }
  }, [bookingData.selectedPackage, navigate]);

  const [localDate, setLocalDate] = useState(bookingData.date || '');
  const [localSession, setLocalSession] = useState(bookingData.session || '');
  const [localParticipants, setLocalParticipants] = useState(bookingData.participants || 1);
  const [localAddOns, setLocalAddOns] = useState<typeof bookingData.selectedAddOns>(bookingData.selectedAddOns || []);
  const [addOnOptions, setAddOnOptions] = useState<AddOnOption[]>([]);
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [packageDetail, setPackageDetail] = useState<{ min_participants: number; max_participants: number | null } | null>(null);

  const prevPkgIdRef = useRef(bookingData.selectedPackage?.id);
  useEffect(() => {
    if (prevPkgIdRef.current !== bookingData.selectedPackage?.id) {
      prevPkgIdRef.current = bookingData.selectedPackage?.id;
      setLocalDate(bookingData.date || '');
      setLocalSession(bookingData.session || '');
      setLocalAddOns(bookingData.selectedAddOns || []);
    }
  }, [bookingData.selectedPackage?.id, bookingData.date, bookingData.session, bookingData.selectedAddOns]);


  useEffect(() => {
    getAddOns().then(res => {
      setAddOnOptions(res.data);
    }).catch(() => setAddOnOptions([]));
  }, []);

  useEffect(() => {
    if (!currentPackage?.id) return;
    getTourPackageDetail(Number(currentPackage.id))
      .then(res => {
        const detail = res.data;
        const minP = detail?.min_participants ?? currentPackage.minParticipants ?? 1;
        const maxP = detail?.max_participants ?? currentPackage.maxParticipants ?? null;
        setPackageDetail({
          min_participants: minP,
          max_participants: maxP,
        });
        if (detail) {
          updatePackage({
            ...currentPackage,
            name: detail.nama,
            description: detail.deskripsi,
            price: Number(detail.harga),
            tipe_harga: detail.tipe_harga,
            kapasitas_per_unit: detail.kapasitas_per_unit,
            tiers: detail.tiers,
            unit: detail.satuan === 'orang' ? 'orang' : 'grup',
            tag: detail.tag ?? undefined,
            minParticipants: minP,
            maxParticipants: maxP ?? undefined,
            image: detail.gambar,
            duration: detail.durasi,
            includes: detail.includes?.map(i => i.item) ?? [],
          });
        }
      })
      .catch(() => setPackageDetail(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPackage?.id]);

  useEffect(() => {
    if (isAddonModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAddonModalOpen]);

  const minParticipants = packageDetail?.min_participants ?? currentPackage?.minParticipants ?? 1;
  const rawMax = packageDetail?.max_participants ?? currentPackage?.maxParticipants;
  const maxParticipants = rawMax && rawMax > minParticipants ? rawMax : 50;
  const participants = Math.max(minParticipants, Math.min(localParticipants, maxParticipants));

  const pricing = calculatePackagePrice(currentPackage, participants);

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
    updateSchedule(localDate, localSession, participants);
  }, [localDate, localSession, participants, updateSchedule]);

  useEffect(() => {
    updateAddOns(localAddOns);
  }, [localAddOns, updateAddOns]);

  const handleNext = () => {
    navigate('/booking/form');
  };

  const isFormValid = bookingData.selectedPackage !== null && localDate !== '' && localSession !== '';

  if (!currentPackage) return null;

  return (
    <BookingLayout currentStep={1} onBackClick={() => navigate('/packages')}>
      <div className="grid lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px] gap-6 sm:gap-8">
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-[#091540]" style={{ fontFamily: "Poppins, sans-serif" }}>
              Paket Terpilih
            </h3>
            <button onClick={handleSelectPackageAgain} className="text-sm font-semibold text-[#182cc1] hover:underline">
              Ganti Paket
            </button>
          </div>
          
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#c5d0ff] flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-8 shadow-sm">
            <div className="w-full sm:w-24 h-40 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#e8edff]">
              <img src={resolveImageUrl(currentPackage.image)} alt={currentPackage.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h4 className="font-bold text-[#091540] text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {currentPackage.name}
                </h4>
                {currentPackage.tag && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#182cc1]/10 text-[#182cc1]">
                    {currentPackage.tag}
                  </span>
                )}
              </div>
              <p className="text-[#3d518c] text-xs mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                {currentPackage.duration} · {currentPackage.unit === 'orang' ? 'Per Orang' : 'Per Grup'}
              </p>
              <div className="flex items-baseline gap-1.5 text-[#182cc1] font-bold text-lg">
                <span>Rp {pricing.unitPrice.toLocaleString('id-ID')}</span>
                <span className="text-xs font-normal text-[#3d518c]">/{pricing.unitLabel === 'orang' ? 'orang' : 'paket'}</span>
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
                <option value="" disabled>-- Pilih Sesi Waktu --</option>
                {sessions.length > 0 ? (
                  sessions.map((session) => {
                    const jamMulai = session.jam_mulai ? session.jam_mulai.slice(0, 5) : '';
                    const jamSelesai = session.jam_selesai ? session.jam_selesai.slice(0, 5) : '';
                    const label = jamMulai && jamSelesai
                      ? `${session.sesi} (${jamMulai} – ${jamSelesai})`
                      : session.sesi;
                    return (
                      <option key={session.id} value={label}>
                        {label}
                      </option>
                    );
                  })
                ) : (
                  <>
                    <option value="Pagi (07.00 - 10.00)">Pagi (07.00 - 10.00)</option>
                    <option value="Siang (10.00 - 13.00)">Siang (10.00 - 13.00)</option>
                    <option value="Sore (14.00 - 17.00)">Sore (14.00 - 17.00)</option>
                  </>
                )}
              </select>
            </div>
            {/* Persons */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-[#091540]" style={{ fontFamily: "Inter, sans-serif" }}>
                  Jumlah Peserta <span className="text-[#3d518c] font-normal">(min. {minParticipants}{rawMax && rawMax > minParticipants ? `, maks. ${rawMax}` : ''})</span>
                </label>
                {pricing.isTierPricing && (
                  <span className="text-xs text-[#182cc1] font-medium hidden sm:inline">
                    Diskon rombongan otomatis diterapkan
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between bg-[#f8faff] border border-[#c5d0ff] rounded-2xl p-2 shadow-inner">
                <button
                  type="button"
                  onClick={() => setLocalParticipants(Math.max(minParticipants, participants - 1))}
                  disabled={participants <= minParticipants}
                  className="w-12 h-12 rounded-xl bg-white border border-[#c5d0ff] text-[#182cc1] flex items-center justify-center hover:border-[#182cc1] hover:bg-[#eef2ff] hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                
                <div className="flex flex-col items-center justify-center px-6">
                  <span className="text-4xl font-black text-[#091540] tracking-tight leading-none" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {participants}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#182cc1] tracking-widest mt-1">
                    Orang
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setLocalParticipants(Math.min(maxParticipants, participants + 1))}
                  disabled={participants >= maxParticipants}
                  className="w-12 h-12 rounded-xl bg-[#182cc1] text-white flex items-center justify-center hover:bg-[#1524a3] hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 shadow-sm shadow-[#c5d0ff]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
              </div>

              {/* Clean Tier Pricing Grid below the counter */}
              {pricing.isTierPricing && pricing.tiers.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2.5 sm:gap-3">
                  {pricing.tiers.map((t, idx, arr) => {
                    const isActive = pricing.activeTier?.min_peserta === t.min_peserta;
                    const nextTier = arr[idx + 1];
                    const rangeLabel = nextTier
                      ? `${t.min_peserta} – ${nextTier.min_peserta - 1} orang`
                      : `≥ ${t.min_peserta} orang`;

                    return (
                      <div
                        key={t.min_peserta}
                        className={`p-3 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                          isActive
                            ? 'bg-[#eef2ff] border-[#182cc1] ring-2 ring-[#182cc1]/20 shadow-sm'
                            : 'bg-white border-[#c5d0ff]/70 hover:border-[#c5d0ff]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-xs font-semibold ${isActive ? 'text-[#182cc1]' : 'text-[#3d518c]'}`}>
                            {rangeLabel}
                          </span>
                          {isActive && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#182cc1] text-white">
                              Aktif
                            </span>
                          )}
                        </div>
                        <div className={`text-sm sm:text-base font-bold ${isActive ? 'text-[#091540]' : 'text-[#3d518c]'}`} style={{ fontFamily: "Poppins, sans-serif" }}>
                          Rp {t.harga_per_orang.toLocaleString('id-ID')}
                          <span className="text-[11px] font-normal text-[#3d518c]"> /org</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Add-Ons Section */}
          <h3 className="text-lg font-bold text-[#091540] mt-8 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
            Adds On (Opsional)
          </h3>
          <button
            type="button"
            onClick={() => setIsAddonModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-[#182cc1] text-[#182cc1] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#f8faff] hover:shadow-md transition-all active:scale-[0.98]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            Pilih Adds On
            {localAddOns.length > 0 && (
              <span className="ml-2 bg-[#182cc1] text-white text-xs px-2 py-0.5 rounded-full">
                {localAddOns.length} Terpilih
              </span>
            )}
          </button>

          {/* Add-on Modal Overlay */}
          {isAddonModalOpen && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091540]/60 backdrop-blur-sm overflow-y-auto"
              onClick={() => setIsAddonModalOpen(false)}
            >
              <div 
                className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50 flex-shrink-0">
                  <h3 className="text-lg font-bold text-[#091540]" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Adds On
                  </h3>
                  <button 
                    onClick={() => setIsAddonModalOpen(false)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
                
                {/* Modal Body */}
                <div className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-gray-50/50 flex-1 overscroll-contain">
                  {addOnOptions.length === 0 ? (
                    <div className="text-center py-8 text-sm text-[#3d518c]">
                      Belum ada layanan tambahan tersedia.
                    </div>
                  ) : addOnOptions.map(addon => {
                    const isSelected = localAddOns.some(a => a.id === String(addon.id));
                    const currentQty = localAddOns.find(a => a.id === String(addon.id))?.quantity ?? 1;
                    const isPerOrang = addon.satuan === 'per orang';
                    const unitLabel = isPerOrang ? 'orang' : 'unit';
                    const priceLabel = addon.is_free || addon.harga === 0
                      ? 'Gratis'
                      : isSelected && currentQty > 1
                        ? `+ Rp ${(addon.harga * currentQty).toLocaleString('id-ID')} (${currentQty} ${unitLabel})`
                        : `+ Rp ${addon.harga.toLocaleString('id-ID')} / ${unitLabel}`;

                    const toggleAddon = () => {
                      if (isSelected) {
                        setLocalAddOns(localAddOns.filter(a => a.id !== String(addon.id)));
                      } else {
                        setLocalAddOns([...localAddOns, {
                          id: String(addon.id),
                          name: addon.nama,
                          price: addon.harga,
                          description: addon.deskripsi,
                          satuan: addon.satuan,
                          isFree: addon.is_free,
                          quantity: 1,
                        }]);
                      }
                    };

                    const updateQty = (delta: number) => {
                      setLocalAddOns(localAddOns.map(a =>
                        a.id === String(addon.id)
                          ? { ...a, quantity: Math.max(1, (a.quantity ?? 1) + delta) }
                          : a
                      ));
                    };

                    return (
                      <div
                        key={addon.id}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col gap-3 ${
                          isSelected
                            ? 'border-[#182cc1] bg-[#f8faff] shadow-md shadow-[#182cc1]/10'
                            : 'border-[#c5d0ff] bg-white hover:border-[#182cc1] hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 cursor-pointer" onClick={toggleAddon}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-[#091540] text-sm sm:text-base">{addon.nama}</span>
                              {addon.is_free && (
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">FREE</span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-[#3d518c] leading-snug line-clamp-2 pr-2" style={{ fontFamily: "Inter, sans-serif" }}>
                              {addon.deskripsi}
                            </p>
                            <div className="mt-1.5 font-bold text-[#182cc1] text-xs sm:text-sm">
                              {priceLabel}
                            </div>
                          </div>

                          {/* Checkbox box indicator */}
                          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected ? 'bg-[#182cc1] border-[#182cc1]' : 'border-[#c5d0ff] bg-white'
                          }`}>
                            {isSelected && (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>

                        {/* Qty counter — muncul untuk SEMUA add-on yang dipilih */}
                        {isSelected && !addon.is_free && addon.harga > 0 && (
                          <div className="flex items-center justify-between bg-[#f0f3ff] rounded-xl px-3.5 py-2 border border-[#c5d0ff]/50">
                            <span className="text-xs font-semibold text-[#091540]" style={{ fontFamily: "Inter, sans-serif" }}>
                              {isPerOrang ? "Jumlah orang yang pesan:" : "Jumlah unit / item:"}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); updateQty(-1); }}
                                disabled={currentQty <= 1}
                                className="w-8 h-8 rounded-lg bg-white border border-[#c5d0ff] text-[#182cc1] flex items-center justify-center hover:border-[#182cc1] hover:bg-[#e8edff] transition disabled:opacity-40 flex-shrink-0"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                              </button>
                              <input
                                type="number"
                                min={1}
                                value={currentQty}
                                onChange={(e) => {
                                  const val = Math.max(1, parseInt(e.target.value) || 1);
                                  setLocalAddOns(localAddOns.map(a =>
                                    a.id === String(addon.id) ? { ...a, quantity: val } : a
                                  ));
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-12 h-8 text-center font-bold text-[#091540] text-sm bg-white border border-[#c5d0ff] rounded-lg p-0 focus:outline-none focus:border-[#182cc1] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                              />
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); updateQty(1); }}
                                className="w-8 h-8 rounded-lg bg-[#182cc1] text-white flex items-center justify-center hover:bg-[#1524a3] transition shadow-sm flex-shrink-0"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}


                </div>
                <div className="px-6 py-4 border-t bg-white flex justify-end">
                  <button 
                    onClick={() => setIsAddonModalOpen(false)}
                    className="px-6 py-2.5 bg-[#182cc1] text-white font-bold rounded-xl hover:bg-[#1524a3] transition-colors shadow-md shadow-[#c5d0ff]"
                  >
                    Simpan Pilihan
                  </button>
                </div>
              </div>
            </div>
          )}

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

        {/* Sticky summary sidebar — shows BELOW on mobile, beside on desktop */}
        <div className="lg:sticky lg:top-4 self-start order-last lg:order-none">
          <BookingSummary
            buttonText="Lanjut ke Data Pemesan"
            onButtonClick={handleNext}
            buttonDisabled={!isFormValid}
          />
          {!isFormValid && (
            <p className="text-xs text-[#3d518c] text-center mt-2" style={{ fontFamily: "Inter, sans-serif" }}>
              {localDate === "" ? "Pilih tanggal kunjungan terlebih dahulu" : localSession === "" ? "Pilih sesi waktu terlebih dahulu" : `Minimal ${minParticipants} peserta untuk paket ini`}
            </p>
          )}
        </div>
      </div>
    </BookingLayout>
  );
};

export default BookingPackage;
