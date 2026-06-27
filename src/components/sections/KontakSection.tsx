import { MapPin, Phone, Mail, Clock, Globe } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

export default function KontakSection() {
  return (
    <section id="kontak" className="py-20 px-4 sm:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#16a34a] mb-2 block" style={{ fontFamily: "Inter, sans-serif" }}>
            Hubungi Kami
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a1f0f]" style={{ fontFamily: "Poppins, sans-serif" }}>
            Kontak & Lokasi
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Info */}
          <div className="space-y-3">
            {[
              { icon: MapPin, title: "Alamat", desc: "Jl. Raya Getas No. 1, Kec. Singorojo, Kab. Kendal 51382" },
              { icon: Phone, title: "Telepon", desc: "(0294) 381-XXX" },
              { icon: Mail, title: "Email", desc: "desagetas@kendalkab.go.id" },
              { icon: Clock, title: "Jam Pelayanan", desc: "Senin–Jumat: 08.00–15.00 WIB" },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 sm:p-5 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0]/60 items-center">
                <div className="w-10 h-10 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-500 text-xs mb-0.5" style={{ fontFamily: "Inter, sans-serif" }}>{item.title}</h4>
                  <p className="text-[#0a1f0f] text-sm font-semibold whitespace-pre-line leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
            
            {/* Social Media */}
            <div className="flex flex-col gap-2.5 p-4 sm:p-5 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0]/60">
               <h4 className="font-medium text-gray-500 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>Media Sosial</h4>
               <div className="flex gap-3">
                 <a href="#" className="w-8 h-8 rounded-full border border-[#bbf7d0] bg-white flex items-center justify-center text-[#16a34a] hover:bg-[#16a34a] hover:text-white transition-colors">
                   <FaFacebook size={14} />
                 </a>
                 <a href="#" className="w-8 h-8 rounded-full border border-[#bbf7d0] bg-white flex items-center justify-center text-[#16a34a] hover:bg-[#16a34a] hover:text-white transition-colors">
                   <FaInstagram size={14} />
                 </a>
                 <a href="#" className="w-8 h-8 rounded-full border border-[#bbf7d0] bg-white flex items-center justify-center text-[#16a34a] hover:bg-[#16a34a] hover:text-white transition-colors">
                   <FaYoutube size={14} />
                 </a>
                 <a href="#" className="w-8 h-8 rounded-full border border-[#bbf7d0] bg-white flex items-center justify-center text-[#16a34a] hover:bg-[#16a34a] hover:text-white transition-colors">
                   <Globe size={14} />
                 </a>
               </div>
            </div>
          </div>

          {/* Right: Map */}
          <div className="h-full min-h-[400px] rounded-3xl overflow-hidden border border-gray-200 shadow-sm relative">
             <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63321.43981180295!2d110.22271835!3d-7.173873499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e707dc871e05d01%3A0x5027a76e3568c00!2sGetas%2C%20Kec.%20Singorojo%2C%20Kabupaten%20Kendal%2C%20Jawa%20Tengah!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                width="100%" 
                height="100%" 
                style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
             ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
