import React from 'react';
import { CheckCircle } from 'lucide-react';

interface StepperProps {
  currentStep: number;
}

const BookingStepper: React.FC<StepperProps> = ({ currentStep }) => {
  return (
    <div className="flex-shrink-0 px-4 sm:px-8 pt-4 pb-2 bg-white border-b border-[#c5d0ff]">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          {[
            { n: 1, label: "Pilih Paket & Jadwal" },
            { n: 2, label: "Data Pemesan" },
            { n: 3, label: "Konfirmasi" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                currentStep > s.n ? "bg-[#182cc1] text-white" :
                currentStep === s.n ? "bg-[#091540] text-white" :
                "bg-[#e8edff] text-[#3d518c]"
              }`} style={{ fontFamily: "Poppins, sans-serif" }}>
                {currentStep > s.n ? <CheckCircle size={14} /> : s.n}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${currentStep >= s.n ? "text-[#091540]" : "text-[#3d518c]"}`}
                style={{ fontFamily: "Inter, sans-serif" }}>{s.label}</span>
              {i < 2 && <div className={`flex-1 h-0.5 rounded-full mx-1 ${currentStep > s.n ? "bg-[#182cc1]" : "bg-[#c5d0ff]"}`} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingStepper;



