import { Camera, Smartphone, ExternalLink, Box, RefreshCw, Zap } from "lucide-react";

export default function ARSection() {
  return (
    <section id="ar" className="min-h-screen py-20 px-4 sm:px-8 bg-[#02180b] relative overflow-hidden flex items-center">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(#16a34a 1px, transparent 1px), linear-gradient(90deg, #16a34a 1px, transparent 1px)', backgroundSize: '50px 50px' }}
      ></div>
      
      <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
        <div>
          <div className="text-green-500 text-xs font-bold uppercase tracking-widest mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
            WISATA · AUGMENTED REALITY
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
            Jelajahi Wisata <br />
            dalam Realita <br />
            <span className="text-green-400">Tertambah (AR)</span>
          </h2>
          <p className="text-white/70 text-base mb-8 max-w-lg leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
            Tempatkan model 3D destinasi wisata di ruangan Anda menggunakan teknologi AR di ponsel Anda, lalu nikmati pengalaman seru dan tak terlupakan!
          </p>
          
          <div className="grid sm:grid-cols-2 gap-3 mb-8 max-w-xl">
            {[
              { icon: Zap, title: "Surface Detection", desc: "Deteksi permukaan otomatis" },
              { icon: Box, title: "AR Ready", desc: "Model 3D destinasi wisata" },
              { icon: Smartphone, title: "Mobile Ready", desc: "Chrome Android & Safari iOS" },
              { icon: RefreshCw, title: "Interaktif", desc: "Putar, perbesar, pindah" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 rounded-full border border-green-500/30 flex items-center justify-center flex-shrink-0">
                  <f.icon size={14} className="text-green-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs" style={{ fontFamily: "Poppins, sans-serif" }}>{f.title}</h4>
                  <p className="text-white/50 text-[10px] leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-8 p-4 rounded-xl bg-[#1f1a0a]/40 border border-yellow-500/30 max-w-xl">
            <p className="text-yellow-500/90 text-[11px] leading-relaxed font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
              <span className="text-yellow-400 font-bold">Butuh perangkat mobile</span> - Gunakan Chrome (Android) atau Safari (iOS) dengan kamera aktif untuk pengalaman AR terbaik.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3.5 bg-green-500 hover:bg-green-400 text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]" style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
              <Camera size={18} />
              Buka Pengalaman AR
            </button>
            <button className="flex items-center gap-2 px-6 py-3.5 bg-transparent border border-white/20 hover:border-white/40 text-white font-bold rounded-full transition-all" style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
              <ExternalLink size={18} />
              Buka Tab Baru
            </button>
          </div>
        </div>

        {/* Right image/mockup */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-[280px] sm:w-[320px] aspect-[1/2] rounded-[2.5rem] bg-black border-[6px] border-[#1f2937] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1000&auto=format&fit=crop" 
              alt="AR View" 
              className="w-full h-full object-cover opacity-80"
            />
            {/* Safe area notch */}
            <div className="absolute top-0 inset-x-0 h-6 bg-black rounded-b-3xl mx-auto w-32 z-20"></div>

            {/* Scanning frame UI mock */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-24 h-24 border border-green-400/50 rounded-2xl flex items-center justify-center relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-400 rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-400 rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-400 rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-400 rounded-br-xl"></div>
                
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Box size={16} className="text-green-400" />
                </div>
              </div>
            </div>

            {/* floating labels */}
            <div className="absolute top-20 left-4 bg-white rounded-lg p-2 shadow-lg z-20">
              <div className="text-[10px] font-bold text-gray-800">WebXR</div>
              <div className="text-[8px] text-gray-500">ARCore + ARKit</div>
            </div>

            <div className="absolute bottom-32 right-4 bg-white rounded-lg p-2 shadow-lg z-20">
              <div className="text-[10px] font-bold text-gray-800">10 Lokasi</div>
              <div className="text-[8px] text-gray-500">Titik wisata AR</div>
            </div>
            
            <div className="absolute bottom-8 left-0 right-0 text-center z-20">
              <div className="w-12 h-12 border-4 border-white/50 rounded-full mx-auto flex items-center justify-center">
                <div className="w-10 h-10 bg-white rounded-full"></div>
              </div>
              <div className="text-white/80 text-[10px] mt-3">Tap permukaan untuk menempatkan</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
