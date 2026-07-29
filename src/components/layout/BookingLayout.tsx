import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookingStepper from '../booking/BookingStepper';

interface BookingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
}

const BookingLayout: React.FC<BookingLayoutProps> = ({ children, currentStep }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F4F7FF] font-sans flex flex-col selection:bg-blue-200">
      {/* Header */}
      <header className="bg-white border-b border-blue-100/80 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 bg-[#182CC1] rounded-full flex items-center justify-center text-white shadow-md shadow-[#182CC1]/30 flex-shrink-0">
            {/* Waves Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 0 4 4 0 014 0 4 4 0 004 0 4 4 0 014 0v2a4 4 0 01-4 0 4 4 0 00-4 0 4 4 0 01-4 0 4 4 0 00-4 0 4 4 0 01-4 0v-2zM3 9a4 4 0 004 0 4 4 0 014 0 4 4 0 004 0 4 4 0 014 0v2a4 4 0 01-4 0 4 4 0 00-4 0 4 4 0 01-4 0 4 4 0 00-4 0 4 4 0 01-4 0V9z" />
            </svg>
          </div>
          <div>
            <h1 className="font-extrabold text-[#1E293B] text-base md:text-lg leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>Pesan Paket Wisata Tubing</h1>
            <p className="text-xs font-medium text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>Desa Getas · Sungai Blukar, Singorojo, Kendal</p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/')}
          aria-label="Tutup pemesanan"
          className="w-10 h-10 rounded-full bg-blue-50/80 border border-blue-200 text-[#182CC1] flex items-center justify-center hover:bg-[#182CC1] hover:text-white hover:border-[#182CC1] transition-all duration-300 shadow-sm hover:rotate-90"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      {/* Stepper */}
      {currentStep > 0 && <BookingStepper currentStep={currentStep} />}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
};

export default BookingLayout;

