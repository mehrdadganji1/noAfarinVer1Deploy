/**
 * Status Timeline Widget
 * Shows application progress timeline
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, ListChecks } from 'lucide-react';
import type { ApplicationStatus, TimelineStep } from '../types';

interface StatusTimelineProps {
  status: ApplicationStatus;
}

const getTimelineSteps = (currentStatus: ApplicationStatus): TimelineStep[] => {
  const steps: TimelineStep[] = [
    {
      id: 'submitted',
      title: 'ثبت درخواست',
      description: 'ارسال فرم',
      status: 'completed'
    },
    {
      id: 'under-review',
      title: 'بررسی مدارک',
      description: 'بررسی توسط تیم',
      status: currentStatus === 'submitted' ? 'pending' : 
              currentStatus === 'under-review' ? 'active' : 'completed'
    },
    {
      id: 'approved',
      title: 'تایید نهایی',
      description: 'تایید و پذیرش',
      status: currentStatus === 'approved' ? 'completed' : 'pending'
    }
  ];

  return steps;
};

export const StatusTimeline: FC<StatusTimelineProps> = ({ status }) => {
  const steps = getTimelineSteps(status);

  return (
    <Card className="border-2 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <ListChecks className="w-5 h-5 text-blue-600" />
          مراحل بررسی
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          
          return (
            <div key={step.id} className="relative">
              <motion.div
                className={`
                  flex items-start gap-3 p-3 rounded-xl transition-all
                  ${step.status === 'completed' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' : 
                    step.status === 'active' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-sm' : 
                    'bg-gray-50/50 border-2 border-gray-200/50'}
                `}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Icon */}
                <motion.div
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm
                    ${step.status === 'completed' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 
                      step.status === 'active' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 
                      'bg-gradient-to-br from-gray-300 to-gray-400'}
                  `}
                  animate={step.status === 'active' ? { 
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <Circle className={`w-4 h-4 ${step.status === 'active' ? 'text-white' : 'text-gray-600'}`} />
                  )}
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`
                    text-sm font-bold
                    ${step.status === 'completed' ? 'text-green-800' : 
                      step.status === 'active' ? 'text-blue-800' : 
                      'text-gray-600'}
                  `}>
                    {step.title}
                  </p>
                  <p className={`
                    text-xs mt-0.5
                    ${step.status === 'completed' ? 'text-green-600' : 
                      step.status === 'active' ? 'text-blue-600' : 
                      'text-gray-500'}
                  `}>
                    {step.description}
                  </p>
                </div>

                {/* Status Badge */}
                {step.status === 'active' && (
                  <motion.span 
                    className="text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-1 rounded-full"
                    animate={{ 
                      boxShadow: [
                        '0 0 0 0 rgba(59, 130, 246, 0)',
                        '0 0 0 4px rgba(59, 130, 246, 0.3)',
                        '0 0 0 0 rgba(59, 130, 246, 0)'
                      ]
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    در حال انجام
                  </motion.span>
                )}
                {step.status === 'completed' && (
                  <span className="text-xs font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white px-2 py-1 rounded-full">
                    ✓
                  </span>
                )}
              </motion.div>

              {/* Connecting Line */}
              {!isLast && (
                <div 
                  className={`
                    absolute right-[19px] top-[52px] w-0.5 h-6
                    ${step.status === 'completed' ? 'bg-gradient-to-b from-green-400 to-green-300' : 
                      'bg-gray-300'}
                  `}
                />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
