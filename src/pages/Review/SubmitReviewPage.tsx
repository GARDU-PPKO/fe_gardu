import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Send, CheckCircle2, AlertCircle, Sparkles, Calendar, Clock } from 'lucide-react';
import { checkReviewToken, submitReview, type CheckReviewTokenResponse } from '../../services/review.service';
import { resolveImageUrl } from '../../utils/image';

const RATING_LABELS: Record<number, { text: string; emoji: string; color: string }> = {
  1: { text: 'Sangat Kecewa', emoji: '😞', color: 'text-rose-500' },
  2: { text: 'Kurang Puas', emoji: '🙁', color: 'text-amber-600' },
  3: { text: 'Cukup Baik', emoji: '😐', color: 'text-yellow-600' },
  4: { text: 'Puas & Seru', emoji: '😊', color: 'text-emerald-600' },
  5: { text: 'Sangat Puas & Luar Biasa!', emoji: '🤩', color: 'text-emerald-600' },
};

export default function SubmitReviewPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<CheckReviewTokenResponse | null>(null);

  // Form states
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewerName, setReviewerName] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [submittedRating, setSubmittedRating] = useState<number>(5);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!token) {
      setErrorMessage('Token ulasan tidak ditemukan pada tautan.');
      setIsLoading(false);
      return;
    }

    checkReviewToken(token)
      .then(res => {
        const data = res.data;
        setBookingData(data);
        setReviewerName(data.customer_name || '');
        if (data.has_reviewed) {
          setIsSuccess(true);
          if (data.review) {
            setSubmittedRating(data.review.rating);
            setComment(data.review.komentar);
          }
        }
      })
      .catch((err) => {
        const msg = err?.response?.data?.meta?.message || 'Tautan ulasan tidak valid atau sudah kadaluarsa.';
        setErrorMessage(msg);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!rating || rating < 1 || rating > 5) {
      alert('Silakan pilih rating bintang 1 sampai 5.');
      return;
    }

    if (comment.trim().length < 3) {
      alert('Mohon tulis komentar ulasan minimal 3 karakter.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview({
        token,
        rating,
        komentar: comment.trim(),
        nama_pengulas: reviewerName.trim() || undefined,
      });

      setSubmittedRating(rating);
      setIsSuccess(true);
    } catch (err: any) {
      const msg = err?.response?.data?.meta?.message || err?.message || 'Gagal mengirim ulasan. Silakan coba lagi.';
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeRating = hoverRating ?? rating;

  return (
    <div className="h-screen max-h-screen bg-[#f8faff] text-[#091540] flex flex-col justify-between p-3 sm:p-5 relative overflow-hidden font-sans select-none">
      {/* Ambient background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-gradient-to-b from-[#182cc1]/10 via-[#7692ff]/5 to-transparent blur-3xl pointer-events-none" />

      {/* Sleek Minimal Header */}
      <header className="flex items-center justify-between z-10 max-w-md w-full mx-auto flex-shrink-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#3d518c] text-xs font-semibold hover:bg-[#e8edff] shadow-xs border border-[#e8edff] transition"
        >
          <ArrowLeft size={13} /> Beranda
        </button>
        <div className="flex items-center gap-1 text-[11px] font-bold text-[#182cc1]">
          <Sparkles size={12} />
          <span>Ulasan Wisata</span>
        </div>
      </header>

      {/* Main Content Area — Fits 100% in viewport without scroll */}
      <main className="flex-1 flex items-center justify-center py-2 z-10 overflow-hidden">
        <div className="max-w-md w-full">
          {isLoading ? (
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#e8edff] text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#182cc1] mx-auto" />
              <p className="text-xs font-semibold text-[#3d518c]">Memverifikasi tautan ulasan Anda...</p>
            </div>
          ) : errorMessage ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-red-100 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto text-xl">
                <AlertCircle size={24} />
              </div>
              <div className="space-y-1">
                <h1 className="text-base font-bold text-[#091540]" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Tautan Tidak Valid
                </h1>
                <p className="text-xs text-[#3d518c] leading-relaxed">
                  {errorMessage}
                </p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="px-5 py-2 bg-[#182cc1] hover:bg-[#1524a3] text-white text-xs font-bold rounded-xl transition shadow-md"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Kembali ke Beranda
              </button>
            </div>
          ) : isSuccess ? (
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-emerald-100 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={32} className="animate-bounce" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                  Ulasan Terkirim
                </span>
                <h1 className="text-lg sm:text-xl font-black text-[#091540]" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Terima Kasih Banyak!
                </h1>
                <p className="text-xs text-[#3d518c] leading-relaxed max-w-xs mx-auto">
                  Ulasanmu untuk <strong>{bookingData?.package?.nama ?? 'Paket Wisata'}</strong> sangat berarti bagi kami.
                </p>
              </div>

              {/* Summary of review */}
              <div className="bg-[#f8faff] rounded-xl p-3 border border-[#e8edff] text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#3d518c]">Penilaian Anda:</span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={`text-sm ${star <= submittedRating ? 'text-amber-400' : 'text-gray-200'}`}>
                        ★
                      </span>
                    ))}
                    <span className="text-xs font-bold text-[#091540] ml-1">({submittedRating}/5)</span>
                  </div>
                </div>
                {comment && (
                  <p className="text-xs text-[#3d518c] italic bg-white p-2.5 rounded-lg border border-[#e8edff] line-clamp-2">
                    "{comment}"
                  </p>
                )}
              </div>

              <button
                onClick={() => navigate('/')}
                className="w-full py-2.5 bg-[#182cc1] hover:bg-[#1524a3] text-white text-xs font-bold rounded-xl transition shadow-md shadow-[#182cc1]/20"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Jelajahi Paket Wisata Lainnya →
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl border border-[#e8edff] overflow-hidden">
              {/* Compact Header Banner */}
              <div className="px-5 py-3.5 bg-gradient-to-r from-[#091540] via-[#182cc1] to-[#3d518c] text-white flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-300 block">
                    Kunjungan Selesai
                  </span>
                  <h1 className="text-sm sm:text-base font-extrabold" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Bagikan Pengalamanmu
                  </h1>
                </div>
                <div className="text-lg">⭐</div>
              </div>

              {/* Compact Package Summary */}
              {bookingData?.package && (
                <div className="px-5 pt-3 pb-1">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#f8faff] border border-[#e8edff]">
                    {bookingData.package.gambar ? (
                      <img
                        src={resolveImageUrl(bookingData.package.gambar)}
                        alt={bookingData.package.nama}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0 shadow-2xs"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[#c5d0ff] flex items-center justify-center text-sm flex-shrink-0">
                        🏞️
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xs font-bold text-[#091540] truncate" style={{ fontFamily: "Poppins, sans-serif" }}>
                        {bookingData.package.nama}
                      </h2>
                      <div className="flex items-center gap-2.5 text-[10px] text-[#3d518c] mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} className="text-[#182cc1]" />
                          {bookingData.tanggal_kunjungan_formatted ?? '-'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} className="text-[#182cc1]" />
                          {bookingData.sesi}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Review Form — Compact */}
              <form onSubmit={handleSubmit} className="px-5 py-3 space-y-3">
                {/* 1. Star Rating Section */}
                <div className="space-y-1 text-center">
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5 py-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 transition-transform hover:scale-125 active:scale-95 focus:outline-none"
                      >
                        <span
                          className={`text-2xl sm:text-3xl transition-colors duration-150 drop-shadow-xs ${
                            star <= activeRating ? 'text-amber-400' : 'text-gray-200 hover:text-amber-200'
                          }`}
                        >
                          ★
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Sentiment Label */}
                  {activeRating > 0 && RATING_LABELS[activeRating] && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#f8faff] border border-[#e8edff]">
                      <span className="text-xs">{RATING_LABELS[activeRating].emoji}</span>
                      <span className={`text-[11px] font-bold ${RATING_LABELS[activeRating].color}`}>
                        {RATING_LABELS[activeRating].text} ({activeRating}/5)
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. Reviewer Name */}
                <div className="space-y-0.5">
                  <label className="block text-[11px] font-bold text-[#091540]">
                    Nama Pengulas
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={e => setReviewerName(e.target.value)}
                    placeholder="Nama lengkap Anda"
                    className="w-full px-3 py-1.5 rounded-xl bg-[#f8faff] border border-[#e8edff] text-xs text-[#091540] placeholder-gray-400 focus:outline-none focus:border-[#182cc1] focus:ring-1 focus:ring-[#182cc1]/20 transition"
                  />
                </div>

                {/* 3. Review Comment */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-[#091540]">
                      Pengalaman Anda <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[9px] text-gray-400 font-mono">
                      {comment.length} karakter
                    </span>
                  </div>
                  <textarea
                    required
                    rows={2}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Ceritakan keseruan tubing, keramahan pemandu, atau fasilitas..."
                    className="w-full p-2.5 rounded-xl bg-[#f8faff] border border-[#e8edff] text-xs text-[#091540] placeholder-gray-400 focus:outline-none focus:border-[#182cc1] focus:ring-1 focus:ring-[#182cc1]/20 transition leading-relaxed resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#182cc1] hover:bg-[#1524a3] text-white text-xs font-bold rounded-xl transition shadow-md shadow-[#182cc1]/20 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed group"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      <span>Kirim Ulasan Sekarang</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-1 text-center text-[10px] text-[#3d518c]/60 z-10 flex-shrink-0">
        © {new Date().getFullYear()} Desa Wisata Getas
      </footer>
    </div>
  );
}
