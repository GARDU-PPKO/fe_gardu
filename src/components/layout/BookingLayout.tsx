import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import BookingStepper from '../booking/BookingStepper';
import Footer from './Footer';
import LogoGardu from '../../assets/Logo_Gardu_V2.png';

interface BookingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  onBackClick?: () => void;
}

const BookingLayout: React.FC<BookingLayoutProps> = ({ children, currentStep, onBackClick }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#eef2ff]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-3 sm:px-6 md:px-8 py-3 sm:py-4 bg-white border-b border-[#c5d0ff] shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img
            src={LogoGardu}
            alt="Logo Desa Getas"
            className="h-8 sm:h-9 w-auto object-contain cursor-pointer flex-shrink-0"
            onClick={() => navigate('/')}
          />
          <div className="min-w-0">
            <div className="font-bold text-[#091540] text-xs sm:text-sm truncate" style={{ fontFamily: "Poppins, sans-serif" }}>
              Pesan Paket Wisata
            </div>
            <div className="text-[#3d518c] text-[9px] sm:text-xs truncate hidden xs:block" style={{ fontFamily: "Inter, sans-serif" }}>
              Desa Getas · Singorojo, Kendal
            </div>
          </div>
        </div>
        <button onClick={() => navigate('/')}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#eef2ff] hover:bg-[#e8edff] border border-[#c5d0ff] flex items-center justify-center text-[#3d518c] hover:text-[#091540] transition flex-shrink-0">
          <X size={16} />
        </button>
      </div>

      {/* ── Progress bar ── */}
      {currentStep > 0 && currentStep < 4 && <BookingStepper currentStep={currentStep} onBackClick={onBackClick} />}

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 w-full flex-1">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default BookingLayout;


