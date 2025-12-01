/**
 * Welcome Hero Component
 * Displays personalized welcome message with gradient background
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ANIMATION_VARIANTS } from './constants';

interface WelcomeHeroProps {
  firstName?: string;
  delay?: number;
}

export const WelcomeHero: FC<WelcomeHeroProps> = ({ 
  firstName = 'کاربر',
  delay = 0 
}) => {
  return (
    <motion.div
      {...ANIMATION_VARIANTS.fadeInDown}
      transition={{ delay }}
      className="rounded-xl text-white relative overflow-hidden shadow-lg h-[180px] md:h-[200px] flex items-center"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/header1_min-min.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/75 via-blue-900/65 to-pink-900/75" />
      
      {/* Animated Background Blobs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-3xl animate-pulse" 
           style={{ animationDelay: '1s' }} />
      
      {/* Content */}
      <div className="relative z-10 w-full px-4 md:px-6 py-4 md:py-5">
        <div>
          <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-yellow-300 drop-shadow-lg" />
            </motion.div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold drop-shadow-lg">
              سلام {firstName} عزیز
            </h1>
          </div>
          <p className="text-white/95 text-sm md:text-base lg:text-lg drop-shadow-md">
            درخواست شما در حال بررسی است
          </p>
        </div>
      </div>
    </motion.div>
  );
};
