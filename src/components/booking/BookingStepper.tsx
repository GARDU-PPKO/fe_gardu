import React from 'react';

interface StepperProps {
  currentStep: number;
}

const steps = [
  { id: 1, label: 'Pilih Paket & Jadwal' },
  { id: 2, label: 'Data Pemesan' },
  { id: 3, label: 'Konfirmasi' },
];

const BookingStepper: React.FC<StepperProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center w-full py-4 bg-white border-b border-blue-100/80 shadow-2xs">
      <div className="flex items-center space-x-2 sm:space-x-4 px-4 overflow-x-auto scrollbar-hide">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center space-x-2.5 flex-shrink-0">
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300 shadow-sm ${
                  currentStep >= step.id
                    ? 'bg-[#182CC1] text-white shadow-md shadow-[#182CC1]/30 ring-4 ring-blue-50'
                    : 'bg-[#EFF2FC] text-[#182CC1] border border-blue-200/80 font-semibold'
                }`}
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {currentStep > step.id ? '✓' : step.id}
              </div>
              <span
                className={`text-xs sm:text-sm tracking-wide ${
                  currentStep >= step.id ? 'text-[#1E293B] font-extrabold' : 'text-gray-400 font-semibold'
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-8 sm:w-16 h-0.5 rounded-full transition-colors ${
                  currentStep > step.id ? 'bg-[#182CC1]' : 'bg-blue-100'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BookingStepper;

