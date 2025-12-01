/**
 * AACo Registration Banner Component
 * Displays a prominent banner encouraging users to register for AACo event
 * Shows only if user hasn't completed the registration form
 */

import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Rocket, X, Sparkles, ArrowLeft, CheckCircle, Users, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AACORegistrationBannerProps {
  delay?: number;
}

const STORAGE_KEY = 'aaco_banner_dismissed';

export const AACORegistrationBanner: FC<AACORegistrationBannerProps> = ({ delay = 0 }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // No token, show banner
          const dismissed = localStorage.getItem(STORAGE_KEY);
          if (!dismissed) {
            setIsVisible(true);
          }
          return;
        }

        // Use axios with proper baseURL
        const { default: api } = await import('@/lib/api');
        const response = await api.get('/aaco-applications/check-status');
        
        // Show banner only if user hasn't submitted application
        const dismissed = localStorage.getItem(STORAGE_KEY);
        if (!response.data.hasApplication && !dismissed) {
          setIsVisible(true);
        }
      } catch (error: any) {
        console.error('Error checking AACo application status:', error);
        // Fallback to localStorage - show banner if not dismissed
        const dismissed = localStorage.getItem(STORAGE_KEY);
        if (!dismissed) {
          setIsVisible(true);
        }
      }
    };

    checkApplicationStatus();
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
  };

  const handleRegister = () => {
    navigate('/pending/aaco-application');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ 
          delay: delay * 0.1,
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
        className="relative"
      >
        <Card 
          className="relative overflow-hidden border-0 shadow-2xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600" />
          
          {/* Animated Overlay Pattern */}
          <motion.div 
            className="absolute inset-0 opacity-10"
            animate={{
              backgroundPosition: isHovered ? ['0% 0%', '100% 100%'] : '0% 0%',
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />

          {/* Glow Effect */}
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-pink-600 rounded-xl opacity-50 blur-2xl"
            animate={{
              opacity: isHovered ? [0.5, 0.8, 0.5] : 0.5,
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Content */}
          <div className="relative z-10 p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              {/* Right Side: Icon + Content */}
              <div className="flex items-start gap-4 md:gap-6 flex-1">
                {/* Animated Icon */}
                <motion.div
                  className="flex-shrink-0"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl border-2 border-white/30">
                    <Rocket className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                </motion.div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: delay * 0.1 + 0.2 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-3"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-200" />
                    <span className="text-xs md:text-sm font-bold text-white">
                      فرصت ویژه
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: delay * 0.1 + 0.3 }}
                    className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight"
                  >
                    🚀 به رویداد AACo بپیوندید!
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: delay * 0.1 + 0.4 }}
                    className="text-base md:text-lg text-white/95 mb-4 leading-relaxed"
                  >
                    برای دسترسی به تمامی امکانات پلتفرم، منتورینگ تخصصی، و شبکه‌سازی با سرمایه‌گذاران،
                    <span className="font-bold"> در پیش‌رویداد AACo ثبت‌نام کنید</span> و سفر استارتاپی خود را با ما شروع کنید.
                  </motion.p>

                  {/* Features List */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: delay * 0.1 + 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6"
                  >
                    <div className="flex items-center gap-2 text-white/90">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">منتورینگ تخصصی</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <Users className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">شبکه‌سازی حرفه‌ای</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <Lightbulb className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">آموزش‌های کاربردی</span>
                    </div>
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: delay * 0.1 + 0.6 }}
                  >
                    <Button
                      onClick={handleRegister}
                      size="lg"
                      className="bg-white text-orange-600 hover:bg-gray-50 font-bold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                      <span>شروع ثبت‌نام رایگان</span>
                      <ArrowLeft className="w-5 h-5 mr-2" />
                    </Button>
                  </motion.div>
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                onClick={handleDismiss}
                className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors border border-white/20 hover:border-white/40"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>

          {/* Bottom Shine Effect */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
