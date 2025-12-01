import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Lock, Mail, CheckCircle2, Sparkles, ArrowRight, KeyRound, Smartphone, MessageSquare } from 'lucide-react';
import api from '@/lib/api';
import { LoginBackground } from '@/components/auth/LoginBackground';
import { FormInput } from '@/components/auth/FormInput';
import { RememberMeCheckbox } from '@/components/auth/RememberMeCheckbox';
import { AuthHeroSection } from '@/components/auth/AuthHeroSection';
import { getDashboardPath, getDashboardPathWithStatus } from '@/utils/roleUtils';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fromVerification, setFromVerification] = useState(false);

  useEffect(() => {
    const isFromVerification = localStorage.getItem('fromVerification') === 'true';

    if (isFromVerification) {
      const tempEmail = localStorage.getItem('tempLoginEmail');
      const tempPassword = localStorage.getItem('tempLoginPassword');

      if (tempEmail && tempPassword) {
        setEmail(tempEmail);
        setPassword(tempPassword);
        setFromVerification(true);
      }

      localStorage.removeItem('fromVerification');
      localStorage.removeItem('tempLoginEmail');
      localStorage.removeItem('tempLoginPassword');

      setTimeout(() => {
        setFromVerification(false);
      }, 5000);
    }
  }, []);

  const handleSendOTP = async () => {
    setError('');
    setLoading(true);

    try {
      await api.post('/mobile-auth/send-otp', { phoneNumber });
      setOtpSent(true);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'خطا در ارسال کد');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/mobile-auth/verify-otp', { phoneNumber, otp });
      const { user, token } = response.data.data;

      setAuth(user, token);
      await new Promise(resolve => setTimeout(resolve, 100));

      // Use centralized role utility for consistent navigation
      const dashboardPath = getDashboardPath(user.role);
      console.log('→ Navigating to:', dashboardPath);
      navigate(dashboardPath, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'کد وارد شده صحیح نیست');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginMethod === 'otp') {
      if (!otpSent) {
        handleSendOTP();
      } else {
        handleVerifyOTP();
      }
      return;
    }

    setError('');
    setLoading(true);

    // Clear any old tokens before login attempt
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth-storage');

    // Debug: Log credentials being sent
    console.log('🔐 Login attempt:', {
      email,
      passwordLength: password.length,
      passwordFirstChar: password[0],
      passwordLastChar: password[password.length - 1]
    });

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data;

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userEmail', email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('userEmail');
      }

      console.log('🔐 Login successful, setting auth...');
      console.log('User:', user);
      console.log('Token:', token?.substring(0, 20) + '...');
      
      setAuth(user, token);
      
      // Wait a bit for state to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('✅ Auth set, determining dashboard...');

      // Smart redirect based on role and status
      let dashboardPath: string;

      if (user.role.includes('applicant')) {
        // Fetch application status for applicants
        // Check both regular application and AACO application
        try {
          let applicationStatus = 'not_submitted';

          // First check AACO application status
          try {
            const aacoResponse = await api.get('/aaco-applications/my-application', {
              validateStatus: (status) => status === 200 || status === 404,
            });
            if (aacoResponse.status === 200 && aacoResponse.data.application) {
              applicationStatus = aacoResponse.data.application.status;
              console.log('📊 AACO Application status:', applicationStatus);
            }
          } catch {
            console.log('📊 No AACO application found');
          }

          // If no AACO status, check regular application
          if (applicationStatus === 'not_submitted') {
            try {
              const appResponse = await api.get('/applications/my-application', {
                validateStatus: (status) => status === 200 || status === 404,
              });
              if (appResponse.status === 200 && appResponse.data.data) {
                applicationStatus = appResponse.data.data.status;
                console.log('📊 Regular Application status:', applicationStatus);
              }
            } catch {
              console.log('📊 No regular application found');
            }
          }

          dashboardPath = getDashboardPathWithStatus(user.role, applicationStatus);

          console.log('📊 Final application status:', applicationStatus);
          console.log('→ Redirecting to:', dashboardPath);
        } catch (error) {
          console.error('Failed to fetch application status:', error);
          // Fallback to pending dashboard for safety
          dashboardPath = '/pending';
          console.log('⚠️  Fallback to:', dashboardPath);
        }
      } else {
        // Non-applicants use standard routing
        dashboardPath = getDashboardPath(user.role);
        console.log('User roles:', user.role);
        console.log('→ Redirecting to:', dashboardPath);
      }

      navigate(dashboardPath, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'خطا در ورود به سیستم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-0 px-4 sm:px-[5%] lg:px-[10%]" dir="rtl">
      <LoginBackground />

      {/* Form Section */}
      <div className="flex items-center justify-center py-8 sm:py-12 lg:p-4 relative z-10 min-h-screen lg:min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50"
            >
              <KeyRound className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">ورود به سیستم</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-300">به پویش ملّی نوآفرین خوش آمدید</p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-20" />

          {/* Card Content */}
          <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-purple-500/20 p-4 sm:p-6 lg:p-8">
            {/* Success Alert */}
            {fromVerification && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 sm:mb-6 bg-green-500/10 border border-green-500/30 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3"
              >
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-green-300">
                  ایمیل شما با موفقیت تایید شد! اطلاعات ورود برای راحتی شما پر شده است.
                </p>
              </motion.div>
            )}

            {/* Login Method Tabs */}
            <div className="flex gap-1 sm:gap-2 p-1 bg-slate-800/50 rounded-lg mb-4 sm:mb-6">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('password');
                  setError('');
                  setOtpSent(false);
                }}
                className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  loginMethod === 'password'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Lock className="w-3 h-3 sm:w-4 sm:h-4 inline-block ml-1 sm:ml-2" />
                رمز عبور
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('otp');
                  setError('');
                }}
                className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  loginMethod === 'otp'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 inline-block ml-1 sm:ml-2" />
                کد یکبار مصرف
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              {loginMethod === 'password' ? (
                <>
                  <FormInput
                    label="ایمیل"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="example@email.com"
                    icon={Mail}
                    required
                  />

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-200">رمز عبور</label>
                      <Link
                        to="/forgot-password"
                        className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        فراموشی رمز عبور
                      </Link>
                    </div>
                    <FormInput
                      label=""
                      type="password"
                      value={password}
                      onChange={setPassword}
                      placeholder="••••••••"
                      icon={Lock}
                      required
                    />
                  </div>

                  <RememberMeCheckbox checked={rememberMe} onChange={setRememberMe} />
                </>
              ) : (
                <>
                  <FormInput
                    label="شماره موبایل"
                    type="tel"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    placeholder="09123456789"
                    icon={Smartphone}
                    required
                    disabled={otpSent}
                  />

                  {otpSent && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <FormInput
                        label="کد تایید"
                        type="text"
                        value={otp}
                        onChange={setOtp}
                        placeholder="کد 6 رقمی"
                        icon={MessageSquare}
                        required
                        maxLength={6}
                      />
                      <p className="text-xs text-gray-400 mt-2">
                        کد تایید به شماره {phoneNumber} ارسال شد
                      </p>
                    </motion.div>
                  )}
                </>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-10 sm:h-12 text-sm sm:text-base font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <>
                    {loginMethod === 'otp' && !otpSent ? 'ارسال کد' : 'ورود به سیستم'}
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </>
                )}
              </Button>

              {loginMethod === 'otp' && otpSent && (
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                    setError('');
                  }}
                  className="w-full text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  ویرایش شماره موبایل
                </button>
              )}
            </form>

            {/* Divider */}
            <div className="relative my-4 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-900/90 px-4 text-gray-400">یا</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">حساب کاربری ندارید؟</p>
              <Link to="/register">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50 h-10 sm:h-11 text-sm"
                >
                  ثبت‌نام کنید
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 sm:mt-6 text-center"
        >
          <p className="text-[10px] sm:text-xs text-gray-400">
            با ورود به سیستم، شما{' '}
            <Link to="/terms" className="text-purple-400 hover:text-purple-300">
              قوانین و مقررات
            </Link>{' '}
            را می‌پذیرید
          </p>
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
