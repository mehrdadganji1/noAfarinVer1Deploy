/**
 * Step Navigation Component
 */

import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  isEditMode: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  isEditMode,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        ← قبلی
      </button>
      
      {/* Step Indicator */}
      <div className="text-xs text-gray-400 px-2">
        {currentStep}/{totalSteps}
      </div>
      
      {/* Next/Submit Button */}
      {currentStep < totalSteps ? (
        <button
          onClick={onNext}
          className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            isEditMode 
              ? 'bg-orange-500 hover:bg-orange-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          بعدی →
        </button>
      ) : (
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-60 ${
            isEditMode 
              ? 'bg-orange-500 hover:bg-orange-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {isEditMode ? 'به‌روزرسانی...' : 'ارسال...'}
            </span>
          ) : (
            isEditMode ? 'به‌روزرسانی' : 'ثبت نهایی'
          )}
        </button>
      )}
    </div>
  );
};
