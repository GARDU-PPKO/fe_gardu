/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { BookingState, Package, UserDetails, AddOnItem } from '../types/booking';
import { INITIAL_BOOKING_STATE } from '../types/booking';

interface BookingContextType {
  bookingData: BookingState;
  updatePackage: (pkg: Package) => void;
  updateSchedule: (date: string, session: string, participants: number) => void;
  updateAddOns: (addOns: AddOnItem[]) => void;
  updateUserDetails: (details: Partial<UserDetails>) => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);
const STORAGE_KEY = 'desa_getas_booking';

function getInitialBookingState(): BookingState {
  if (typeof window === 'undefined') return INITIAL_BOOKING_STATE;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? { ...INITIAL_BOOKING_STATE, ...JSON.parse(stored) } : INITIAL_BOOKING_STATE;
  } catch {
    return INITIAL_BOOKING_STATE;
  }
}

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookingData, setBookingData] = useState<BookingState>(getInitialBookingState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookingData));
  }, [bookingData]);

  const updatePackage = useCallback((pkg: Package) => {
    setBookingData((prev) => ({ ...prev, selectedPackage: pkg }));
  }, []);

  const updateSchedule = useCallback((date: string, session: string, participants: number) => {
    setBookingData((prev) => ({ ...prev, date, session, participants }));
  }, []);

  const updateAddOns = useCallback((addOns: AddOnItem[]) => {
    setBookingData((prev) => ({ ...prev, selectedAddOns: addOns }));
  }, []);

  const updateUserDetails = useCallback((details: Partial<UserDetails>) => {
    setBookingData((prev) => ({
      ...prev,
      userDetails: { ...prev.userDetails, ...details },
    }));
  }, []);

  const resetBooking = useCallback(() => {
    setBookingData(INITIAL_BOOKING_STATE);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        updatePackage,
        updateSchedule,
        updateAddOns,
        updateUserDetails,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
