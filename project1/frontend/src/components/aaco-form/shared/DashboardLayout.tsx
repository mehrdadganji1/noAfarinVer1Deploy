/**
 * Dashboard-style Layout for AACO Form
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { STEPS } from '../constants/form.constants';

interface DashboardLayoutProps {
  currentStep: number;
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentStep,
  children,
  sidebar
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden" dir="rtl">
      <div className="w-[90%] mx-auto py-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
          {/* Sidebar - Progress Tracker */}
          <div className="lg:col-span-3">
            <div className="space-y-3 lg:sticky lg:top-3">
              {sidebar}
              
              {/* Steps Progress */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-3"
              >
                <h3 className="text-xs font-bold text-gray-900 mb-2">مراحل تکمیل</h3>
                <div className="space-y-2">
                  {STEPS.map((step) => {
                    const isCompleted = step.id < currentStep;
                    const isCurrent = step.id === currentStep;
                    
                    return (
                      <div key={step.id} className="flex items-center gap-2">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-500' :
                          isCurrent ? 'bg-blue-500' :
                          'bg-gray-200'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <span className={`text-xs font-bold ${
                              isCurrent ? 'text-white' : 'text-gray-500'
                            }`}>
                              {step.id}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium truncate ${
                            isCurrent ? 'text-blue-600' : 
                            isCompleted ? 'text-green-600' : 
                            'text-gray-500'
                          }`}>
                            {step.title}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
