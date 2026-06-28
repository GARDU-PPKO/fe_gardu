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
    <div className="min-h-screen bg-green-50/50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">Pesan Paket Wisata Tubing</h1>
            <p className="text-xs text-gray-500">Desa Getas - Sungai Blukar, Singorojo, Kendal</p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      {/* Stepper */}
      {currentStep > 0 && <BookingStepper currentStep={currentStep} />}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
};

export default BookingLayout;
