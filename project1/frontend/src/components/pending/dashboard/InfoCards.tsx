/**
 * Info Cards Component
 * Displays informational cards about the process
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { INFO_CARDS } from './constants';

interface InfoCardsProps {
  delay?: number;
  singleColumn?: boolean;
}

export const InfoCards: FC<InfoCardsProps> = ({ delay = 0, singleColumn = false }) => {
  return (
    <div className={`grid gap-3 md:gap-4 ${singleColumn ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
      {INFO_CARDS.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + index * 0.1, type: "spring" }}
          >
            <Card className="border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 h-full overflow-hidden relative group hover:-translate-y-1">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/50 transition-all duration-500" />
                
                {/* Decorative Circle */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                
                <CardContent className="p-5 relative z-10">
                  <div className="flex items-start gap-4">
                    {/* Icon Container */}
                    <motion.div 
                      className={`p-3.5 ${card.color} rounded-2xl flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow`}
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 mb-2 text-base group-hover:text-blue-700 transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </CardContent>

                {/* Bottom Accent */}
                <motion.div 
                  className="h-1 bg-gradient-to-r from-blue-400 to-purple-400"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ transformOrigin: 'right' }}
                />
              </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
