import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from '../pages/Home/HomePage';
import PackagesPage from '../pages/Packages/PackagesPage';
import BookingPackage from '../pages/Booking/BookingPackage';
import BookingFormPage from '../pages/Booking/BookingForm';
import PaymentPage from '../pages/Booking/PaymentPage';
import CheckBooking from '../pages/Booking/CheckBooking';
import { BookingProvider } from '../hooks/useBooking';
import { HomeDataProvider } from '../hooks/useHomeData';

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />

        <Route path="/packages" element={<PageWrapper><PackagesPage /></PageWrapper>} />

        <Route path="/payment/:kode" element={<PageWrapper><PaymentPage /></PageWrapper>} />

        <Route path="/cek-pesanan" element={<PageWrapper><CheckBooking /></PageWrapper>} />

        <Route path="/booking/*" element={
          <PageWrapper>
            <Routes>
              <Route path="package" element={<BookingPackage />} />
              <Route path="form" element={<BookingFormPage />} />
              <Route path="*" element={<Navigate to="package" replace />} />
            </Routes>
          </PageWrapper>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <BookingProvider>
        <HomeDataProvider>
          <AnimatedRoutes />
        </HomeDataProvider>
      </BookingProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
