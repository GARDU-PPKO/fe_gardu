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
    <div className="flex items-center justify-center w-full py-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center space-x-2">
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                  currentStep >= step.id
                    ? 'bg-primary text-white'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {currentStep > step.id ? '✓' : step.id}
              </div>
              <span
                className={`text-sm ${
                  currentStep >= step.id ? 'text-gray-800 font-medium' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-gray-200'
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
