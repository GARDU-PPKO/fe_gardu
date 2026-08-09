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
      <div className="flex items-center justify-between px-4 sm:px-8 py-4 bg-white border-b border-[#c5d0ff] shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <img
            src={LogoGardu}
            alt="Logo Desa Getas"
            className="h-9 w-auto object-contain cursor-pointer"
            onClick={() => navigate('/')}
          />
          <div>
            <div className="font-bold text-[#091540] text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
              Pesan Paket Wisata Tubing
            </div>
            <div className="text-[#3d518c] text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
              Desa Getas · Sungai Blukar, Singorojo, Kendal
            </div>
          </div>
        </div>
        <button onClick={() => navigate('/')}
          className="w-9 h-9 rounded-full bg-[#eef2ff] hover:bg-[#e8edff] border border-[#c5d0ff] flex items-center justify-center text-[#3d518c] hover:text-[#091540] transition">
          <X size={17} />
        </button>
      </div>

      {/* ── Progress bar ── */}
      {currentStep > 0 && currentStep < 4 && <BookingStepper currentStep={currentStep} onBackClick={onBackClick} />}

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 w-full flex-1">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default BookingLayout;


