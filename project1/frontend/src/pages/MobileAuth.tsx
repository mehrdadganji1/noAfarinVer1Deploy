import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, ArrowRight, Shield, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const MobileAuth: FC = () => {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate phone number
    if (phoneNumber.length !== 11 || !phoneNumber.startsWith('09')) {
      setError('شماره موبایل معتبر نیست');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/mobile-auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'خطا در ارسال کد');
      }
      
      setStep('code');
    } catch (err: any) {
      setError(err.message || 'خطا در ارسال کد. لطفا دوباره تلاش کنید');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      setError('کد تایید باید 6 رقم باشد');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/mobile-auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, code: verificationCode })
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'کد تایید نادرست است');
      }
      
      // Save authentication state using authStore
      console.log('✅ Login successful!', data.data.user);
      
      // Use authStore to properly save auth state
      setAuth(data.data.user, data.data.token);
      
      // Navigate to dashboard based on role
      const userRole = Array.isArray(data.data.user.role) ? data.data.user.role[0] : data.data.user.role;
      console.log('🔄 Redirecting to dashboard for role:', userRole);
      
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
    } catch (err: any) {
      setError(err.message || 'کد تایید نادرست است');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AACO
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              ورود با شماره موبایل
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.form
                key="phone"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendCode}
                className="space-y-6"
              >
                {/* Phone Number Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    شماره موبایل
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Smartphone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="09123456789"
                      maxLength={11}
                      className="block w-full pr-10 pl-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                      dir="ltr"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>دریافت کد تایید</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Back to Login */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    بازگشت به ورود با ایمیل
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="code"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleVerifyCode}
                className="space-y-6"
              >
                {/* Info */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
                    <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    کد تایید به شماره
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1" dir="ltr">
                    {phoneNumber}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    ارسال شد
                  </p>
                </div>

                {/* Code Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
                    کد تایید 6 رقمی
                  </label>
                  <div className="flex gap-2 justify-center" dir="ltr">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        maxLength={1}
                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>تایید و ورود</span>
                      <Check className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Resend Code */}
                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={() => handleSendCode(new Event('submit') as any)}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    ارسال مجدد کد
                  </button>
                  <br />
                  <button
                    type="button"
                    onClick={() => {
                      setStep('phone');
                      setCode(['', '', '', '', '', '']);
                      setError('');
                    }}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
                  >
                    تغییر شماره موبایل
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 grid grid-cols-3 gap-4"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">🔒</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">امن</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">⚡</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">سریع</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">✨</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">آسان</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        
        <div className="relative h-full flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mb-8"
            >
              <Smartphone className="w-32 h-32 mx-auto mb-6" />
            </motion.div>
            
            <h2 className="text-4xl font-bold mb-4">
              ورود سریع و امن
            </h2>
            <p className="text-xl text-purple-100 max-w-md mx-auto">
              با استفاده از شماره موبایل خود، به راحتی وارد حساب کاربری شوید
            </p>

            <div className="mt-12 space-y-4">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <p className="text-right">بدون نیاز به رمز عبور</p>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <p className="text-right">احراز هویت دو مرحله‌ای</p>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <p className="text-right">ورود در کمتر از 30 ثانیه</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MobileAuth;
