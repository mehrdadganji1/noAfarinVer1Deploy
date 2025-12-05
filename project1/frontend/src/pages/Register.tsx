import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { User, Phone, Smartphone, Shield, Check, Sparkles, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { RegisterBackground } from '@/components/auth/RegisterBackground';
import { FormInput } from '@/components/auth/FormInput';
import { StepIndicator } from '@/components/auth/StepIndicator';
import { AuthHeroSection } from '@/components/auth/AuthHeroSection';

const steps = [
  { number: 1, title: 'اطلاعات شخصی' },
  { number: 2, title: 'تایید شماره' },
  { number: 3, title: 'کد تایید' },
];

export default function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // مرحله 1: دریافت اطلاعات شخصی
  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.firstName.trim()) {
      setError('نام الزامی است');
      return;
    }
    if (!formData.lastName.trim()) {
      setError('نام خانوادگی الزامی است');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setError('شماره موبایل الزامی است');
      return;
    }
    if (!/^09\d{9}$/.test(formData.phoneNumber)) {
      setError('شماره موبایل باید 11 رقم و با 09 شروع شود');
      return;
    }

    setCurrentStep(2);
  };

  // مرحله 2: ارسال کد تایید
  const handleSendCode = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/mobile-auth/register', formData);

      if (response.data.success) {
        setCurrentStep(3);
      } else {
        setError(response.data.message || 'خطا در ارسال کد تایید');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  // مرحله 3: تایید کد و ثبت‌نام
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/mobile-auth/verify-register', {
        ...formData,
        code
      });

      if (response.data.success) {
        // Use authStore to properly save auth state
        setAuth(response.data.data.user, response.data.data.token);
        
        // Navigate to dashboard based on role
        const userRole = Array.isArray(response.data.data.user.role) 
          ? response.data.data.user.role[0] 
          : response.data.data.user.role;
        
        // Small delay to ensure state is persisted
        setTimeout(() => {
          if (userRole === 'director') {
            navigate('/director/dashboard', { replace: true });
          } else if (userRole === 'club_member') {
            navigate('/club-member/dashboard', { replace: true });
          } else {
            // Default to applicant dashboard
            navigate('/applicant/dashboard', { replace: true });
          }
        }, 100);
      } else {
        setError(response.data.message || 'کد تایید نادرست است');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleCodeChange = (value: string) => {
    // فقط اعداد و حداکثر 6 رقم
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setCode(numericValue);
    setError('');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-0 px-4 sm:px-[5%] lg:px-[10%]" dir="rtl">
      <RegisterBackground />

      {/* Form Section */}
      <div className="flex items-center justify-center py-8 sm:py-12 lg:p-4 relative z-10 min-h-screen lg:min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full sm:w-[90%] lg:w-[80%] max-w-lg"
        >
        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">پویش ملّی نوآفرین</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-300">به جمع نوآوران موفق بپیوندید</p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-20" />

          {/* Card Content */}
          <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-purple-500/20 p-4 sm:p-6 lg:p-8">
            <StepIndicator steps={steps} currentStep={currentStep} />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-300 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 mt-4 sm:mt-6 text-xs sm:text-sm"
              >
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">

              {/* مرحله 1: اطلاعات شخصی */}
              {currentStep === 1 && (
                <motion.form
                  key="info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleInfoSubmit}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <FormInput
                      label="نام"
                      value={formData.firstName}
                      onChange={(value) => handleInputChange('firstName', value)}
                      icon={User}
                      required
                    />
                    <FormInput
                      label="نام خانوادگی"
                      value={formData.lastName}
                      onChange={(value) => handleInputChange('lastName', value)}
                      icon={User}
                      required
                    />
                  </div>

                  <FormInput
                    label="شماره موبایل"
                    value={formData.phoneNumber}
                    onChange={(value) => handleInputChange('phoneNumber', value)}
                    placeholder="09123456789"
                    icon={Phone}
                    required
                  />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center justify-center gap-2 h-10 sm:h-11 text-sm sm:text-base"
                  >
                    <span>ادامه</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </motion.form>
              )}

              {/* مرحله 2: تایید شماره */}
              {currentStep === 2 && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center space-y-4 sm:space-y-6"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/20 rounded-full mb-2 sm:mb-4">
                    <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                  </div>
                  
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                      تایید شماره موبایل
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">
                      کد تایید به شماره <span className="font-medium text-blue-400">{formData.phoneNumber}</span> ارسال خواهد شد
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                      className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-500/10 h-10 sm:h-11 text-sm"
                    >
                      بازگشت
                    </Button>
                    <Button
                      onClick={handleSendCode}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center justify-center gap-2 h-10 sm:h-11 text-sm"
                    >
                      {loading ? (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>ارسال کد</span>
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* مرحله 3: ورود کد تایید */}
              {currentStep === 3 && (
                <motion.form
                  key="code"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleVerifyCode}
                  className="text-center space-y-4 sm:space-y-6"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-500/20 rounded-full mb-2 sm:mb-4">
                    <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                  </div>
                  
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                      کد تایید را وارد کنید
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">
                      کد 6 رقمی ارسال شده به <span className="font-medium text-blue-400">{formData.phoneNumber}</span> را وارد کنید
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      className="w-40 sm:w-48 px-3 sm:px-4 py-2 sm:py-3 text-center text-xl sm:text-2xl font-mono bg-slate-800/50 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all tracking-widest text-white"
                      placeholder="123456"
                      maxLength={6}
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      variant="outline"
                      className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-500/10 h-10 sm:h-11 text-sm"
                    >
                      بازگشت
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || code.length !== 6}
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 flex items-center justify-center gap-2 h-10 sm:h-11 text-sm"
                    >
                      {loading ? (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>تایید و ثبت‌نام</span>
                          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Login Link */}
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-400">
                قبلاً ثبت‌نام کرده‌اید؟{' '}
                <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                  وارد شوید
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
      </div>

      {/* Hero Section - Hidden on mobile */}
      <div className="hidden lg:block">
        <AuthHeroSection />
      </div>
    </div>
  );
}
