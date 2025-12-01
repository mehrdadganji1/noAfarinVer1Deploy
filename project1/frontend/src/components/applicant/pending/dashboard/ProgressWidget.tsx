import { FC } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useApplicationProgress } from '@/hooks/useApplicationProgress';
import { CheckCircle2, Circle } from 'lucide-react';

/**
 * Progress Widget Component
 * Shows application completion progress with circular indicator
 */
export const ProgressWidget: FC = () => {
  const { percentage, completedSteps, totalSteps, steps } = useApplicationProgress();

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="border-2 shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6">پیشرفت درخواست</h3>
        
        <div className="flex items-center gap-6">
          {/* Circular Progress */}
          <div className="relative flex-shrink-0">
            <svg className="w-32 h-32 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r="45"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <motion.circle
                cx="64"
                cy="64"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Percentage Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {percentage}%
                </motion.div>
                <div className="text-xs text-gray-500 mt-1">
                  {completedSteps}/{totalSteps}
                </div>
              </div>
            </div>
          </div>

          {/* Steps List */}
          <div className="flex-1 space-y-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-3"
              >
                {step.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                )}
                <span className={`text-sm ${step.completed ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
