import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { BookingProvider } from '../hooks/useBooking';
import { HomeDataProvider } from '../hooks/useHomeData';

const HomePage = lazy(() => import('../pages/Home/HomePage'));
const PackagesPage = lazy(() => import('../pages/Packages/PackagesPage'));
const PackageDetailRedirect = lazy(() => import('../pages/Packages/PackageDetailRedirect'));
const BookingPackage = lazy(() => import('../pages/Booking/BookingPackage'));
const BookingFormPage = lazy(() => import('../pages/Booking/BookingForm'));
const PaymentPage = lazy(() => import('../pages/Booking/PaymentPage'));
const CheckBooking = lazy(() => import('../pages/Booking/CheckBooking'));

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

        <Route path="/packages/:id" element={<PageWrapper><PackageDetailRedirect /></PageWrapper>} />

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

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f8faff]">
    <Loader2 className="w-8 h-8 animate-spin text-[#182cc1]" />
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <BookingProvider>
        <HomeDataProvider>
          <Suspense fallback={<PageLoader />}>
            <AnimatedRoutes />
          </Suspense>
        </HomeDataProvider>
      </BookingProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
