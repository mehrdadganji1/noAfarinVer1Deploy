/**
 * Timeline Component
 * Shows application review stages with current status
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { ApplicationStatus } from './types';
import { TIMELINE_STEPS } from './constants';

interface TimelineProps {
  currentStatus: ApplicationStatus;
}

interface TimelineStepProps {
  title: string;
  description?: string;
  state: 'completed' | 'active' | 'pending';
  stepNumber: number;
}

const TimelineStep: FC<TimelineStepProps> = ({ 
  title, 
  description,
  state,
  stepNumber
}) => {
  const isCompleted = state === 'completed';
  const isActive = state === 'active';
  const isPending = state === 'pending';

  return (
    <motion.div 
      className={`
        flex items-start gap-3 p-3 rounded-xl transition-all duration-300 group relative cursor-default
        ${isCompleted ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-300' : 
          isActive ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-md hover:border-blue-400' : 
          'bg-gray-50/50 border-2 border-gray-200/50 hover:border-gray-300 hover:bg-gray-100/50'}
      `}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 100, delay: stepNumber * 0.1 }}
      whileHover={{ 
        y: -2,
        transition: { type: "spring", stiffness: 400, damping: 15 }
      }}
    >
      {/* Step Number/Icon */}
      <motion.div 
        className={`
          w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-md relative z-10
          ${isCompleted ? 'bg-gradient-to-br from-green-500 to-emerald-600 ring-4 ring-green-200 group-hover:ring-green-300 group-hover:shadow-lg' : 
            isActive ? 'bg-gradient-to-br from-blue-500 to-indigo-600 ring-4 ring-blue-200 group-hover:ring-blue-300 group-hover:shadow-xl' : 
            'bg-gradient-to-br from-gray-300 to-gray-400 group-hover:from-gray-400 group-hover:to-gray-500'}
        `}
        animate={isActive ? { 
          scale: [1, 1.1, 1],
          boxShadow: [
            '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            '0 10px 15px -3px rgba(59, 130, 246, 0.4)',
            '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          ]
        } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
        whileHover={{ 
          scale: 1.1,
          rotate: isCompleted ? 360 : 0,
          transition: { type: "spring", stiffness: 300, damping: 10 }
        }}
      >
        {isCompleted ? (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 className="w-6 h-6 text-white drop-shadow-md" />
          </motion.div>
        ) : (
          <span className={`
            text-sm font-bold transition-all
            ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-700'}
          `}>
            {stepNumber}
          </span>
        )}
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <span className={`
          text-sm font-bold block transition-all duration-200
          ${isCompleted ? 'text-green-800 group-hover:text-green-900' : 
            isActive ? 'text-blue-800 group-hover:text-blue-900' : 
            'text-gray-600 group-hover:text-gray-800'}
        `}>
          {title}
        </span>
        {description && (
          <span className={`
            text-xs block mt-1 transition-all duration-200
            ${isCompleted ? 'text-green-600 group-hover:text-green-700' : 
              isActive ? 'text-blue-600 group-hover:text-blue-700' : 
              'text-gray-500 group-hover:text-gray-600'}
          `}>
            {description}
          </span>
        )}
      </div>

      {/* Status Badge */}
      {isActive && (
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.span 
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transition-all duration-200 group-hover:shadow-lg group-hover:from-blue-700 group-hover:to-indigo-700"
            animate={{ 
              boxShadow: [
                '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                '0 10px 15px -3px rgba(59, 130, 246, 0.5)',
                '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              ]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            در حال انجام
          </motion.span>
        </motion.div>
      )}
      {isCompleted && (
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:from-green-700 group-hover:to-emerald-700">
            ✓ تکمیل شد
          </span>
        </motion.div>
      )}
      {isPending && (
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-600 transition-all duration-200 group-hover:bg-gray-300 group-hover:text-gray-700">
            در انتظار
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export const Timeline: FC<TimelineProps> = ({ currentStatus }) => {
  // Find current step index - find the LAST step that includes the current status
  // This ensures that completed steps are shown correctly
  // For example, if status is 'approved', steps 0,1,2 all include it,
  // but step 2 (pre-approval) should be the active one
  const currentStepIndex = TIMELINE_STEPS.reduce((lastIndex, step, index) => {
    if (step.requiredStatuses.includes(currentStatus)) {
      return index;
    }
    return lastIndex;
  }, -1);

  const getStepState = (index: number) => {
    if (currentStepIndex === -1) return 'pending'; // No matching status
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="space-y-3">
      {TIMELINE_STEPS.map((step, index) => {
        const state = getStepState(index);
        const isLast = index === TIMELINE_STEPS.length - 1;

        return (
          <div key={step.id} className="relative">
            <TimelineStep
              title={step.title}
              description={step.description}
              state={state}
              stepNumber={index + 1}
            />
            {/* Connecting Line */}
            {!isLast && (
              <motion.div 
                className={`
                  absolute right-[19px] top-[52px] w-0.5 h-6 transition-colors
                  ${state === 'completed' ? 'bg-gradient-to-b from-green-400 to-green-300' : 
                    state === 'active' ? 'bg-gradient-to-b from-blue-400 to-gray-300' : 
                    'bg-gray-300'}
                `}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
