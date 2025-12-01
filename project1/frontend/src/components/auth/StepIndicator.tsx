import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between mb-4 sm:mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`
                w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base
                transition-all duration-300
                ${
                  currentStep > step.number
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : currentStep === step.number
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 ring-2 sm:ring-4 ring-purple-500/30'
                    : 'bg-white/10 border-2 border-white/20'
                }
              `}
            >
              {currentStep > step.number ? (
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              ) : (
                <span className="text-white">{step.number}</span>
              )}
            </motion.div>
            <span
              className={`
                mt-1 sm:mt-2 text-[10px] sm:text-xs font-medium transition-colors text-center
                ${currentStep >= step.number ? 'text-purple-300' : 'text-gray-400'}
              `}
            >
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-0.5 mx-1 sm:mx-2 relative">
              <div className="absolute inset-0 bg-white/10" />
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: currentStep > step.number ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 origin-left"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
