import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage';
import BookingPackage from '../pages/Booking/BookingPackage';
import BookingFormPage from '../pages/Booking/BookingForm';
import BookingPayment from '../pages/Booking/BookingPayment';
import BookingSuccess from '../pages/Booking/BookingSuccess';
import { BookingProvider } from '../hooks/useBooking';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
