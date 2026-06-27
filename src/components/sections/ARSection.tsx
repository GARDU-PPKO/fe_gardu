import { Camera, ExternalLink, Box } from "lucide-react";

export default function ARSection() {
  return (
    <section id="ar" className="min-h-screen py-20 px-4 sm:px-8 bg-[#02180b] relative overflow-hidden flex items-center">
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 0.8; }
          100% { top: 0%; opacity: 0.8; }
        }
        .laser-line {
          animation: scan 4s linear infinite;
        }
      `}</style>

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
          
          {/* Step by step instructions */}
          <div className="space-y-3 mb-8 max-w-xl">
            {[
              { num: "1", title: "Scan QR atau Buka Link", desc: "Arahkan kamera HP Anda ke QR Code atau klik Buka AR di bawah" },
              { num: "2", title: "Deteksi Permukaan", desc: "Arahkan kamera ke area datar (lantai/meja) untuk memosisikan model 3D" },
              { num: "3", title: "Jelajahi & Interaksi", desc: "Model 3D wisata akan muncul! Putar, cubit untuk zoom, atau foto bersama" },
            ].map((s, i) => (
              <div key={i} className="flex gap-4 p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {s.num}
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs" style={{ fontFamily: "Poppins, sans-serif" }}>{s.title}</h4>
                  <p className="text-white/50 text-[10px] leading-relaxed mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-8 p-4 rounded-xl bg-[#1f1a0a]/40 border border-yellow-500/30 max-w-xl">
            <p className="text-yellow-500/90 text-[11px] leading-relaxed font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
              <span className="text-yellow-400 font-bold">Pengguna Desktop?</span> Scan QR Code di samping kanan menggunakan kamera smartphone Anda untuk memulainya secara langsung.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3.5 bg-green-500 hover:bg-green-400 text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] active:scale-95" style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
              <Camera size={18} />
              Buka Pengalaman AR
            </button>
            <button className="flex items-center gap-2 px-6 py-3.5 bg-transparent border border-white/20 hover:border-white/40 text-white font-bold rounded-full transition-all active:scale-95" style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
              <ExternalLink size={18} />
              Buka Tab Baru
            </button>
          </div>
        </div>

        {/* Right image/mockup + QR Code */}
        <div className="relative flex flex-col sm:flex-row items-center gap-8 justify-center lg:justify-end">
          {/* Desktop QR Code block */}
          <div className="hidden sm:flex flex-col items-center bg-white/5 border border-white/10 rounded-3xl p-5 w-44 text-center">
            <div className="bg-white p-3 rounded-2xl flex-shrink-0 mb-3">
              {/* SVG QR Code */}
              <svg width="100" height="100" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#02180b]">
                <path d="M0 0h9v9H0V0zm1 1v7h7V1H1zm11 0h9v9h-9V1zm1 1v7h7V2h-7zM0 12h9v9H0v-9zm1 1v7h7v-7H1zm11 0h9v9h-9v-9zm1 1v7h7v-7h-7zM0 24h9v5H0v-5zm1 1v3h7v-3H1zm11 0h9v5h-9v-5zm1 1v3h7v-3h-7zm11-24h5v5h-5V2zm1 1v3h3V3h-3zm0 8h3v3h-3v-3zm0 5h5v5h-5v-5zm1 1v3h3v-3h-3zm-6-2h3v3h-3v-3zm5 8h3v3h-3v-3z" fill="currentColor"/>
              </svg>
            </div>
            <h4 className="text-white font-bold text-xs" style={{ fontFamily: "Poppins, sans-serif" }}>Scan di HP</h4>
            <p className="text-white/40 text-[9px] leading-relaxed mt-1">Gunakan ponsel untuk membuka objek 3D di ruangan Anda.</p>
          </div>

          {/* Smartphone Mockup */}
          <div className="relative w-[280px] sm:w-[300px] aspect-[1/2] rounded-[2.5rem] bg-black border-[6px] border-[#1f2937] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1000&auto=format&fit=crop" 
              alt="AR View" 
              className="w-full h-full object-cover opacity-80"
            />
            {/* Safe area notch */}
            <div className="absolute top-0 inset-x-0 h-6 bg-black rounded-b-3xl mx-auto w-32 z-20"></div>

            {/* Scanning frame UI mock */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-44 h-44 border border-green-400/50 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-400 rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-400 rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-400 rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-400 rounded-br-xl"></div>
                
                {/* Laser animation */}
                <div className="absolute left-0 right-0 h-0.5 bg-green-400 shadow-[0_0_8px_#22c55e] laser-line pointer-events-none" />

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
