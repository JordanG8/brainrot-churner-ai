import React from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

export default function ProgressBar({ currentStep, onNext, onBack }) {
  const steps = ['Text', 'Video', 'Preview', 'Export'];
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto flex items-center gap-4">
        <button 
          onClick={onBack}
          disabled={currentStep === 0}
          className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiArrowLeft size={24} />
        </button>

        <div className="flex-1 flex">
          {steps.map((step, index) => (
            <div key={step} className="flex-1 relative">
              <div 
                className={`h-2 ${index === 0 ? 'rounded-l-full' : ''} ${
                  index === steps.length - 1 ? 'rounded-r-full' : ''
                } ${index <= currentStep ? 'bg-blue-500' : 'bg-gray-800'} 
                ${index !== steps.length - 1 ? 'mr-[2px]' : ''}`}
              />
              <div className={`absolute top-4 left-1/2 -translate-x-1/2 mt-2 text-sm ${
                index <= currentStep ? 'text-white' : 'text-gray-500'
              }`}>
                {step}
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={onNext}
          disabled={currentStep === steps.length - 1}
          className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiArrowRight size={24} />
        </button>
      </div>
    </div>
  );
}
