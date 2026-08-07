import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Waves, X } from 'lucide-react';
import BookingStepper from '../booking/BookingStepper';
import Footer from './Footer';

interface BookingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
}

const BookingLayout: React.FC<BookingLayoutProps> = ({ children, currentStep }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#eef2ff]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-4 bg-white border-b border-[#c5d0ff] shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#182cc1] flex items-center justify-center">
            <Waves size={16} className="text-white" />
          </div>
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
      {currentStep > 0 && currentStep < 4 && <BookingStepper currentStep={currentStep} />}

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


