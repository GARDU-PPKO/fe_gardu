import { useState } from "react";
import { Camera, ExternalLink, Box, Scan, Smartphone, RotateCcw, X } from "lucide-react";

const AR_URL = "https://getas-gardu.vercel.app/";


export default function ARSection() {
  const [modal, setModal] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const openAR = () => {
    setModal(true);
    setLoaded(false);
    setIframeError(false);
  };

  const closeAR = () => {
    setModal(false);
    setLoaded(false);
  };

  const handleIframeError = () => {
    setIframeError(true);
  };

  return (
    <>
      <section id="ar" className="py-16 px-4 sm:px-8 bg-[#060d2e] overflow-hidden relative">
        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(120,150,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(120,150,255,1) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
        {/* glow blobs */}
        <div className="absolute top-0 left-1/3 w-96 h-80 rounded-full bg-[#182cc1]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#091540]/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left ── */}
          <div>
            {/* breadcrumb label */}
            <p className="text-[#7692ff]/70 text-xs font-bold uppercase tracking-[0.2em] mb-5"
              style={{ fontFamily: "Inter, sans-serif" }}>
              Wisata · Augmented Reality
            </p>

            <h2 className="font-black text-white leading-tight mb-4"
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(1.9rem, 4vw, 3.2rem)" }}>
              Jelajahi Wisata<br />
              dalam Realita<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7692ff] to-[#c5d0ff]">
                Tertambah (AR)
              </span>
            </h2>

            <p className="text-white/55 text-sm leading-relaxed mb-7 max-w-md"
              style={{ fontFamily: "Inter, sans-serif" }}>
              Tempatkan model 3D destinasi wisata di ruangan Anda menggunakan teknologi AR di ponsel Anda, lalu nikmati pengalaman seru dan tak terlupakan!
            </p>

            {/* 2×2 feature grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: Scan,       label: "Surface Detection", desc: "Deteksi permukaan otomatis" },
                { icon: Box,        label: "AR Ready",          desc: "Model 3D destinasi wisata" },
                { icon: Smartphone, label: "Mobile Ready",      desc: "Chrome Android & Safari iOS" },
                { icon: RotateCcw,  label: "Interaktif",        desc: "Putar, perbesar, pindah" },
              ].map(f => (
                <div key={f.label}
                  className="flex items-center gap-3 rounded-2xl p-3.5 border border-white/8 bg-white/[0.05] hover:bg-white/10 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#182cc1]/35 border border-[#7692ff]/20 flex items-center justify-center flex-shrink-0">
                    <f.icon size={16} className="text-[#7692ff]" />
                  </div>
                  <div>
                    <div className="text-white text-xs font-semibold leading-tight"
                      style={{ fontFamily: "Poppins, sans-serif" }}>{f.label}</div>
                    <div className="text-white/40 text-[10px] mt-0.5"
                      style={{ fontFamily: "Inter, sans-serif" }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* amber warning note */}
            <div className="flex items-start gap-2.5 bg-amber-400/10 border border-amber-400/25 rounded-xl px-4 py-3 mb-7">
              <Smartphone size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-amber-300/80 text-xs leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                <span className="font-semibold text-amber-300">Butuh perangkat mobile</span> · Gunakan Chrome (Android) atau Safari (iOS) dengan kamera aktif untuk pengalaman AR terbaik.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <button onClick={openAR}
                className="flex items-center gap-2 px-6 py-3 bg-[#182cc1] hover:bg-[#1524a3] text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-[#182cc1]/30 text-sm"
                style={{ fontFamily: "Poppins, sans-serif" }}>
                <Camera size={16} />
                Buka Pengalaman AR
              </button>
              <a href={AR_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-transparent border border-white/25 hover:bg-white/10 text-white font-semibold rounded-xl transition-all text-sm"
                style={{ fontFamily: "Poppins, sans-serif" }}>
                <ExternalLink size={14} />
                Buka Tab Baru
              </a>
            </div>
          </div>

          {/* ── Right — device frame with AR app preview ── */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* outer glow ring */}
              <div className="absolute -inset-3 rounded-[2.8rem] bg-gradient-to-br from-[#182cc1]/30 to-[#7692ff]/10 blur-xl" />

              {/* device shell */}
              <div className="relative w-60 sm:w-72 rounded-[2.5rem] border-[3px] border-white/15 shadow-2xl overflow-hidden bg-[#060d20]"
                style={{ height: "480px" }}>

                {/* status bar */}
                <div className="flex items-center justify-between px-5 pt-4 pb-2 bg-black/50">
                  <span className="text-white/50 text-[9px] font-semibold">9:41</span>
                  <div className="w-16 h-4 rounded-full bg-white/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="w-3 h-1.5 rounded-sm bg-white/40" />
                    <div className="w-1 h-1.5 rounded-sm bg-white/40" />
                  </div>
                </div>

                {/* AR viewport */}
                <div className="relative bg-[#060d2e]" style={{ height: "390px" }}>
                  <img
                    src="https://images.unsplash.com/photo-1627796863235-2dddce3e862d?w=400&h=500&fit=crop&auto=format"
                    alt="AR view sungai"
                    className="w-full h-full object-cover opacity-45"
                  />

                  {/* AR overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4">
                    {/* top HUD */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#7692ff] animate-pulse" />
                        <span className="text-white text-[9px] font-semibold">AR Aktif</span>
                      </div>
                      <div className="bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 text-white text-[9px]">
                        Sungai Blukar
                      </div>
                    </div>

                    {/* center scanner */}
                    <div className="flex items-center justify-center">
                      <div className="relative w-28 h-28">
                        {/* corner brackets */}
                        {[
                          "top-0 left-0 border-t-2 border-l-2 rounded-tl-lg",
                          "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg",
                          "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
                          "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg",
                        ].map((cls, i) => (
                          <div key={i} className={`absolute w-5 h-5 border-[#7692ff] ${cls}`} />
                        ))}
                        {/* animated scan line */}
                        <div className="absolute inset-x-2 top-1/2 h-px bg-gradient-to-r from-transparent via-[#7692ff]/80 to-transparent animate-pulse" />
                        {/* 3D box icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-xl bg-[#182cc1]/50 backdrop-blur-sm border border-[#7692ff]/40 flex items-center justify-center">
                            <Box size={24} className="text-[#c5d0ff]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* bottom hint */}
                    <div className="flex flex-col items-center gap-2.5">
                      <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-white/70 text-[9px]">Tap permukaan untuk menempatkan</span>
                      </div>
                      {/* shutter button */}
                      <div className="w-11 h-11 rounded-full border-2 border-white/40 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-white/80" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* home indicator */}
                <div className="flex items-center justify-center h-9 bg-black/40">
                  <div className="w-20 h-1 rounded-full bg-white/25" />
                </div>
              </div>

              {/* floating info cards */}
              <div className="absolute -left-10 top-16 bg-white rounded-2xl shadow-xl px-3.5 py-2.5 border border-[#c5d0ff]">
                <div className="text-[#091540] font-bold text-xs" style={{ fontFamily: "Poppins, sans-serif" }}>WebXR</div>
                <div className="text-[#3d518c] text-[10px]">ARCore + ARKit</div>
              </div>
              <div className="absolute -right-10 bottom-20 bg-white rounded-2xl shadow-xl px-3.5 py-2.5 border border-[#c5d0ff]">
                <div className="text-[#091540] font-bold text-xs" style={{ fontFamily: "Poppins, sans-serif" }}>10 Lokasi</div>
                <div className="text-[#3d518c] text-[10px]">Titik wisata AR</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AR Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col">
          {/* modal header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#091540] border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#182cc1] flex items-center justify-center">
                <Camera size={13} className="text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>AR Wisata Getas</div>
                <div className="text-white/50 text-[10px]" style={{ fontFamily: "Inter, sans-serif" }}>Powered by Tim IT PPK Ormawa BEM FIK 2026</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href={AR_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition"
                style={{ fontFamily: "Inter, sans-serif" }}>
                <ExternalLink size={12} /> Tab Baru
              </a>
              <button onClick={closeAR}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* iframe content */}
          <div className="relative flex-1 bg-black">
            {!loaded && !iframeError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#060d2e]">
                <div className="w-14 h-14 rounded-full border-4 border-[#182cc1]/30 border-t-[#7692ff] animate-spin" />
                <div className="text-white font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>Memuat pengalaman AR…</div>
                <div className="text-white/40 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>Pastikan Anda menggunakan perangkat mobile</div>
              </div>
            )}

            {iframeError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#060d2e] p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
                  <Smartphone size={26} className="text-amber-400" />
                </div>
                <div className="text-white font-bold text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>Tidak dapat dimuat di sini</div>
                <p className="text-white/60 text-sm max-w-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                  Situs AR memblokir pemuatan dalam iframe. Silakan buka di tab baru untuk pengalaman penuh.
                </p>
                <a href={AR_URL} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-[#182cc1] text-white font-bold rounded-xl hover:bg-[#1524a3] transition"
                  style={{ fontFamily: "Poppins, sans-serif" }}>
                  <ExternalLink size={16} /> Buka di Tab Baru
                </a>
              </div>
            ) : (
              <iframe
                src={AR_URL}
                title="AR Wisata Desa Getas"
                className="w-full h-full border-0"
                allow="camera; microphone; accelerometer; gyroscope; xr-spatial-tracking; geolocation"
                allowFullScreen
                onLoad={() => setLoaded(true)}
                onError={handleIframeError}
              />
            )}
          </div>

          {/* mobile hint bar */}
          <div className="flex items-center justify-center gap-2 py-2.5 bg-[#091540] border-t border-white/10 flex-shrink-0">
            <Smartphone size={12} className="text-[#7692ff]" />
            <span className="text-white/50 text-[10px]" style={{ fontFamily: "Inter, sans-serif" }}>
              Gunakan perangkat mobile untuk pengalaman AR terbaik
            </span>
          </div>
        </div>
      )}
    </>
  );
}
