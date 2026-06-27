import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BookingPackage from '../pages/Booking/BookingPackage';
import BookingFormPage from '../pages/Booking/BookingForm';
import BookingPayment from '../pages/Booking/BookingPayment';
import BookingSuccess from '../pages/Booking/BookingSuccess';
import { BookingProvider } from '../hooks/useBooking';

// Placeholder Home Page
const HomePlaceholder = () => (
  <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-gray-50">
    <h1 className="text-3xl font-bold">Gardu PPKO Frontend</h1>
    <a href="/booking/package" className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover">
      Mulai Booking Tubing
    </a>
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePlaceholder />} />
        
        {/* Booking Flow Routes wrapped with BookingProvider */}
        <Route path="/booking/*" element={
          <BookingProvider>
            <Routes>
              <Route path="package" element={<BookingPackage />} />
              <Route path="form" element={<BookingFormPage />} />
              <Route path="payment" element={<BookingPayment />} />
              <Route path="success" element={<BookingSuccess />} />
              <Route path="*" element={<Navigate to="package" replace />} />
            </Routes>
          </BookingProvider>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
