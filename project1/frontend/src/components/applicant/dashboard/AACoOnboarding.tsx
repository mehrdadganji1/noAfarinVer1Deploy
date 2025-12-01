import { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  ArrowRight, 
  Sparkles,
  Users,
  Target,
  Trophy
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface AACoOnboardingProps {
  onComplete: () => void;
  // onSkip removed - Registration is mandatory for all applicants
}

export const AACoOnboarding: FC<AACoOnboardingProps> = ({ onComplete }) => {
  const navigate = useNavigate();

  const handleStartApplication = () => {
    onComplete();
    // Small delay to ensure state is saved before navigation
    setTimeout(() => {
      navigate('/application-form');
    }, 100);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <Card className="relative overflow-hidden border-0 shadow-2xl">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

          {/* Close Button - REMOVED: Registration is mandatory */}

          <CardContent className="relative p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                  <Rocket className="w-10 h-10 text-white" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  به رویداد AACO خوش آمدید! 🎉
                </h1>
                
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  اولین قدم برای پیوستن به بزرگترین جامعه نوآوری کشور را بردارید
                </p>

                <Badge className="mt-4 bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2 text-sm">
                  <Sparkles className="w-4 h-4 ml-2" />
                  فرصت محدود - همین حالا ثبت‌نام کنید
                </Badge>
              </motion.div>

              {/* Features Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                {[
                  {
                    icon: Users,
                    title: 'تیم‌سازی',
                    description: 'با افراد با استعداد همکاری کنید'
                  },
                  {
                    icon: Target,
                    title: 'آموزش',
                    description: 'دوره‌های تخصصی و منتورینگ'
                  },
                  {
                    icon: Trophy,
                    title: 'جوایز',
                    description: 'جوایز نقدی و فرصت‌های شغلی'
                  }
                ].map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="p-3 bg-white/20 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-white/80">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* CTA Button - Registration is MANDATORY */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col gap-4 justify-center items-center"
              >
                <Button
                  onClick={handleStartApplication}
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 group px-8 py-6 text-lg font-bold"
                >
                  <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                  شروع ثبت‌نام در AACO
                  <ArrowRight className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                </Button>

                {/* Skip button removed - Registration is mandatory for all applicants */}
                <p className="text-sm text-white/90 font-medium">
                  ⚠️ تکمیل این فرم برای همه متقاضیان الزامی است
                </p>
              </motion.div>

              {/* Info Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 text-center space-y-2"
              >
                <p className="text-sm text-white/90 font-medium">
                  ✨ تکمیل فرم ثبت‌نام تنها 5 دقیقه زمان می‌برد
                </p>
                <p className="text-xs text-white/70">
                  بدون تکمیل این فرم، امکان دسترسی به سایر بخش‌های داشبورد وجود ندارد
                </p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
