import { useState } from "react";
import { Info, Users, MapPin, ExternalLink, Award } from "lucide-react";

export default function ProfilDesa() {
  const [activeTab, setActiveTab] = useState<"sejarah" | "visi" | "perangkat">("sejarah");

  return (
    <section id="profil" className="py-20 px-4 sm:px-8 bg-gray-50 border-t border-[#bbf7d0]/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2 block" style={{ fontFamily: "Inter, sans-serif" }}>Informasi Desa</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#052e16]" style={{ fontFamily: "Poppins, sans-serif" }}>Profil & Lokasi Desa Getas</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sejarah singkat, Visi & Perangkat (Tabbed layout) */}
          <div className="lg:col-span-2 bg-white border border-[#bbf7d0]/50 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[350px]">
            <div>
              {/* Tab headers */}
              <div className="flex gap-1 bg-gray-50 p-1 rounded-full border border-green-100/50 mb-6">
                {[
                  { id: "sejarah", label: "Sejarah", icon: Info },
                  { id: "visi", label: "Visi & Misi", icon: Award },
                  { id: "perangkat", label: "Pemerintahan", icon: Users },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center justify-center gap-1.5 flex-1 py-2 text-xs font-bold rounded-full transition-all ${activeTab === tab.id ? "bg-[#052e16] text-white shadow-sm" : "text-[#166534] hover:bg-green-50/50 active:scale-95"}`}
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    <tab.icon size={12} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="transition-all duration-300">
                {activeTab === "sejarah" && (
                  <div className="animate-fadeIn">
                    <h3 className="text-base font-bold text-[#052e16] mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>Sekilas Sejarah Desa Getas</h3>
                    <p className="text-[#4b7a55] text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                      Desa Getas di Kecamatan Singorojo, Kabupaten Kendal berdiri sejak sekitar tahun 1850. Desa ini dianugerahi keindahan Sungai Blukar yang mengalir jernih, bentangan persawahan organik yang subur, dan pesona alam yang asri. Dengan gotong royong warga, wisata tubing Sungai Blukar di Desa Getas telah berkembang pesat dan berhasil meraih penghargaan Desa Wisata Terbaik tingkat Kabupaten Kendal pada tahun 2025.
                    </p>
                  </div>
                )}

                {activeTab === "visi" && (
                  <div className="animate-fadeIn space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-[#052e16] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>Visi Desa</h3>
                      <p className="text-[#166534] text-sm font-semibold italic bg-[#f0fdf4] border-l-4 border-[#16a34a] rounded-r-xl px-4 py-3" style={{ fontFamily: "Poppins, sans-serif" }}>
                        "Desa Getas Maju, Mandiri, dan Sejahtera Berbasis Kearifan Lokal dan Teknologi Digital"
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#4b7a55] mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Misi Utama</h3>
                      <ul className="text-xs text-[#4b7a55] space-y-1.5 list-disc pl-4" style={{ fontFamily: "Inter, sans-serif" }}>
                        <li>Meningkatkan infrastruktur dan kebersihan area pariwisata alam.</li>
                        <li>Mengoptimalkan potensi beras organik dan produk anyaman bambu khas warga.</li>
                        <li>Menghadirkan pelayanan administrasi publik yang cepat berbasis teknologi digital.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "perangkat" && (
                  <div className="animate-fadeIn">
                    <h3 className="text-base font-bold text-[#052e16] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Struktur Organisasi Pemerintahan</h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {[
                        { jabatan: "Kepala Desa",   nama: "Suyitno, S.Pd." },
                        { jabatan: "Sekretaris",    nama: "Supartini" },
                        { jabatan: "Kasi Layanan",  nama: "Dwi Lestari" },
                      ].map(p => (
                        <div key={p.jabatan} className="flex items-center gap-2.5 bg-[#f0fdf4] border border-[#bbf7d0]/30 rounded-xl p-3">
                          <div className="w-8 h-8 rounded-full bg-[#16a34a]/15 flex items-center justify-center flex-shrink-0">
                            <Users size={14} className="text-[#16a34a]" />
                          </div>
                          <div>
                            <div className="text-[#052e16] text-xs font-bold leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>{p.jabatan}</div>
                            <div className="text-[#4b7a55] text-[10px] mt-0.5">{p.nama}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lokasi + Geografis */}
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-[#bbf7d0] rounded-2xl overflow-hidden shadow-sm flex-1 min-h-[220px] relative group/map">
              <iframe
                title="Peta Desa Getas"
                src="https://maps.google.com/maps?q=Desa+Getas,+Kecamatan+Singorojo,+Kabupaten+Kendal,+Jawa+Tengah&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full min-h-[200px] border-none"
                allowFullScreen loading="lazy"
              />
              <a 
                href="https://maps.google.com/?q=Desa+Getas,+Kecamatan+Singorojo,+Kabupaten+Kendal"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-green-200 text-[#16a34a] hover:bg-green-50 text-[10px] font-bold rounded-lg shadow-md transition-all active:scale-95 z-20"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                <MapPin size={10} />
                Buka Google Maps
                <ExternalLink size={8} />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Kecamatan", value: "Singorojo" },
                { label: "Kabupaten", value: "Kendal" },
                { label: "Wilayah",   value: "8 RW / 24 RT" },
                { label: "Kode Pos",  value: "51382" },
              ].map(i => (
                <div key={i.label} className="bg-white border border-[#bbf7d0] rounded-2xl p-4 shadow-sm flex flex-col justify-center">
                  <div className="text-[#4b7a55] text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{i.label}</div>
                  <div className="text-[#052e16] text-sm font-bold mt-1" style={{ fontFamily: "Poppins, sans-serif" }}>{i.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
