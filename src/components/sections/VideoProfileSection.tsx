import { useState } from "react";
import { Play, Film, ExternalLink, Sparkles } from "lucide-react";

interface VideoProfileSectionProps {
  /**
   * Set to true to hide this section temporarily (as requested).
   * Default is true. Change to false or pass isHidden={false} to display it.
   */
  isHidden?: boolean;
  videoUrl?: string;
  title?: string;
  subtitle?: string;
}

export default function VideoProfileSection({
  isHidden = true,
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ", // Template / default embed URL
  title = "Video Profil Desa Wisata Getas",
  subtitle = "Saksikan keindahan alam Sungai Blukar, pesona wisata tubing genting, kearifan lokal, dan kehangatan masyarakat Desa Getas.",
}: VideoProfileSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // If set to hidden, do not render into the visual layout (or keep in DOM with 'hidden' style)
  if (isHidden) {
    return (
      <section
        id="video-profile"
        className="hidden"
        aria-hidden="true"
        data-status="prepared-and-ready"
      >
        {/* Section ini sudah disiapkan dan dapat ditampilkan kapan saja dengan mengubah isHidden={false} */}
      </section>
    );
  }

  // Helper to extract YouTube embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("embed/")) return url;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0` : url;
  };

  const embedSrc = getEmbedUrl(videoUrl);

  return (
    <section id="video-profile" className="py-14 sm:py-20 px-4 sm:px-8 bg-[#070e28] text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#182cc1]/20 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md border border-white/15 mb-3">
            <Film size={14} className="text-[#a5f3fc]" />
            <span>Video Profil Desa</span>
            <Sparkles size={12} className="text-[#fbbf24]" />
          </div>
          <h2
            className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {title}
          </h2>
          <p
            className="text-white/70 text-xs sm:text-sm leading-relaxed"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {subtitle}
          </p>
        </div>

        {/* Video Player Container */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 bg-[#091540]/80 backdrop-blur-xl shadow-2xl shadow-[#182cc1]/20 aspect-video group">
          {!isPlaying ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-[#091540] via-[#091540]/60 to-transparent">
              {/* Play Button Overlay */}
              <button
                onClick={() => setIsPlaying(true)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#182cc1] hover:bg-[#1524a3] text-white flex items-center justify-center shadow-xl shadow-[#182cc1]/50 hover:scale-110 active:scale-95 transition-all duration-300 group-hover:ring-8 group-hover:ring-white/10"
                aria-label="Putar Video Profil"
              >
                <Play size={28} className="fill-white translate-x-0.5" />
              </button>
              <div className="mt-4">
                <span className="text-sm font-semibold text-white tracking-wide" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Putar Video Profil di Website
                </span>
              </div>
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

        {/* Bottom info link */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/50" style={{ fontFamily: "Inter, sans-serif" }}>
          <span>Ingin menonton langsung di YouTube?</span>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#a5f3fc] hover:underline flex items-center gap-1 font-medium"
          >
            Buka di YouTube <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </section>
  );
}
