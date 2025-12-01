/**
 * Quick Actions Grid Component
 * Displays action cards for quick navigation
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { QUICK_ACTIONS } from './constants';

interface QuickActionsProps {
  delay?: number;
}

export const QuickActions: FC<QuickActionsProps> = ({ delay = 0 }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      {QUICK_ACTIONS.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + index * 0.1, type: "spring" }}
          >
            <motion.button
              onClick={() => navigate(action.path)}
              className="w-full text-right"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="border-2 border-gray-200 hover:border-purple-400 hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden relative h-full">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-blue-500/0 to-indigo-500/0 group-hover:from-purple-500/10 group-hover:via-blue-500/10 group-hover:to-indigo-500/10 transition-all duration-500" />
                
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
                
                <CardContent className="p-4 relative z-10">
                  <div className="flex items-start justify-between gap-3">
                    {/* Right Side: Icon + Content */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Icon with Gradient Background */}
                      <motion.div 
                        className={`
                          w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} 
                          flex items-center justify-center flex-shrink-0 shadow-md
                          group-hover:shadow-lg transition-shadow duration-300
                        `}
                        whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-6 h-6 text-white drop-shadow-md" />
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title */}
                        <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-purple-700 transition-colors">
                          {action.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                          {action.description}
                        </p>
                      </div>
                    </div>

                    {/* Left Side: Arrow Button - Aligned with Title */}
                    <motion.div 
                      className="flex items-center text-purple-600 text-xs font-semibold flex-shrink-0 pt-0.5"
                      initial={{ x: 0 }}
                      whileHover={{ x: -3 }}
                    >
                      <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span>مشاهده</span>
                    </motion.div>
                  </div>
                </CardContent>

                {/* Bottom Accent Line */}
                <motion.div 
                  className="h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ transformOrigin: 'right' }}
                />
              </Card>
            </motion.button>
          </motion.div>
        );
      })}
    </div>
  );
};
