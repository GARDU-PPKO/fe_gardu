import { useState } from "react";
import { Play, CheckCircle2, ExternalLink } from "lucide-react";

interface VideoProfileSectionProps {
  isHidden?: boolean;
  videoUrl?: string;
  title?: string;
  subtitle?: string;
}

export default function VideoProfileSection({
  isHidden = true,
  videoUrl = "https://youtu.be/FbfdCUFcF2M?si=whhVVfyFpF8MKiaX",
  title = "Jelajahi Pesona Alam & Kehangatan Desa Getas",
  subtitle = "Saksikan keindahan alam Sungai Blukar, petualangan seru wisata tubing genting, serta kearifan lokal masyarakat Desa Wisata Getas.",
}: VideoProfileSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isHidden) return null;

  // Helper to extract YouTube ID
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const videoId = getYoutubeId(videoUrl);

  // Helper to extract YouTube embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("embed/")) return url;
    const id = getYoutubeId(url);
    return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` : url;
  };

  const embedSrc = getEmbedUrl(videoUrl);

  const features = [
    "Wisata River Tubing Sungai Blukar yang menantang",
    "Pemandangan alam asri & udara sejuk pedesaan",
    "Kearifan lokal, tradisi, dan ragam produk UMKM khas",
  ];

  return (
    <section id="video-profile" className="py-12 sm:py-20 px-4 sm:px-8 bg-white border-b border-[#f1f5f9]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ── Kiri: Tulisan / Penjelasan ── */}
          <div className="lg:col-span-5">
            <span
              className="text-xs font-bold uppercase tracking-widest text-[#182cc1]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Video Profil Desa
            </span>

            <h2
              className="text-2xl sm:text-3.5xl font-bold text-[#091540] mt-2 mb-4 leading-tight"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {title}
            </h2>

            <p
              className="text-[#3d518c] text-sm sm:text-base leading-relaxed mb-6"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {subtitle}
            </p>

            {/* Poin-poin Keunggulan */}
            <div className="space-y-3 mb-7">
              {features.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-[#091540]">
                  <CheckCircle2 size={18} className="text-[#182cc1] flex-shrink-0 mt-0.5" />
                  <span style={{ fontFamily: "Inter, sans-serif" }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Tombol Tonton di YouTube */}
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#c5d0ff] text-[#182cc1] hover:bg-[#e8edff] text-sm font-semibold transition shadow-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <span>Buka di YouTube</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* ── Kanan: Video Player ── */}
          <div className="lg:col-span-7">
            <div className="relative aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-[#e2e8f0] bg-slate-900 group">
              {!isPlaying ? (
                <div
                  className="relative w-full h-full flex items-center justify-center cursor-pointer select-none"
                  onClick={() => setIsPlaying(true)}
                >
                  {/* YouTube Thumbnail Background */}
                  {videoId && (
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                      alt={title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors" />

                  {/* Play Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPlaying(true);
                    }}
                    className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#182cc1] hover:bg-[#1524a3] text-white flex items-center justify-center shadow-2xl shadow-[#182cc1]/50 group-hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-white/30"
                    aria-label="Putar Video Profil"
                  >
                    <Play size={28} className="fill-white translate-x-0.5" />
                  </button>
                </div>
              ) : (
                <iframe
                  src={embedSrc}
                  title={title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
