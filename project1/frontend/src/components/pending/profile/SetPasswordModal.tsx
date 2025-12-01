/**
 * Set Password Modal Component
 * Modal for setting password for the first time with SMS verification
 * @module SetPasswordModal
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Check, AlertCircle, Loader2, Smartphone, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface SetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 'request-otp' | 'verify-otp' | 'set-password' | 'success';

export const SetPasswordModal: React.FC<SetPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<Step>('request-otp');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  
  // OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setStep('request-otp');
      setOtp(['', '', '', '', '', '']);
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setCountdown(0);
    }
  }, [isOpen]);


  // Request OTP
  const handleRequestOTP = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/request-password-setup-otp');
      
      if (response.data.success) {
        setMaskedPhone(response.data.data.phoneNumber);
        setCountdown(response.data.data.expiresIn || 120);
        setStep('verify-otp');
        // Focus first OTP input
        setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
      }
    } catch (error: any) {
      setError(
        error.response?.data?.error ||
        'خطا در ارسال کد تایید. لطفاً دوباره تلاش کنید.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only keep last digit
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      setOtp(pastedData.split(''));
      otpInputRefs.current[5]?.focus();
    }
  };

  // Handle OTP keydown (backspace)
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP and move to password step
  const handleVerifyOTP = () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('لطفاً کد ۶ رقمی را کامل وارد کنید');
      return;
    }
    setStep('set-password');
  };

  // Set password with OTP
  const handleSetPassword = async () => {
    if (!newPassword) {
      setError('رمز عبور جدید را وارد کنید');
      return;
    }
    if (newPassword.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('تکرار رمز عبور مطابقت ندارد');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/set-password-with-otp', {
        code: otp.join(''),
        newPassword,
        confirmPassword,
      });

      if (response.data.success) {
        setStep('success');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      }
    } catch (error: any) {
      setError(
        error.response?.data?.error ||
        'خطا در تنظیم رمز عبور. لطفاً دوباره تلاش کنید.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/request-password-setup-otp');
      
      if (response.data.success) {
        setCountdown(response.data.data.expiresIn || 120);
        setOtp(['', '', '', '', '', '']);
        otpInputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      setError(
        error.response?.data?.error ||
        'خطا در ارسال مجدد کد تایید.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">تنظیم رمز عبور</h2>
                    <p className="text-white/80 text-sm">
                      {step === 'request-otp' && 'احراز هویت با پیامک'}
                      {step === 'verify-otp' && 'وارد کردن کد تایید'}
                      {step === 'set-password' && 'تعیین رمز عبور جدید'}
                      {step === 'success' && 'تکمیل شد'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Step: Request OTP */}
              {step === 'request-otp' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="w-10 h-10 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      احراز هویت با پیامک
                    </h3>
                    <p className="text-gray-600 text-sm">
                      برای تنظیم رمز عبور، یک کد تایید به شماره موبایل شما ارسال می‌شود.
                    </p>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{error}</p>
                    </motion.div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={loading}
                      className="flex-1"
                    >
                      انصراف
                    </Button>
                    <Button
                      onClick={handleRequestOTP}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        'ارسال کد تایید'
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step: Verify OTP */}
              {step === 'verify-otp' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">
                      کد تایید به شماره <span className="font-bold text-gray-800 ltr" dir="ltr">{maskedPhone}</span> ارسال شد
                    </p>
                    {countdown > 0 && (
                      <p className="text-sm text-amber-600">
                        زمان باقی‌مانده: <span className="font-bold">{formatCountdown(countdown)}</span>
                      </p>
                    )}
                  </div>

                  {/* OTP Input */}
                  <div className="flex justify-center gap-2" dir="ltr">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                        disabled={loading}
                      />
                    ))}
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{error}</p>
                    </motion.div>
                  )}

                  <div className="text-center">
                    <button
                      onClick={handleResendOTP}
                      disabled={countdown > 0 || loading}
                      className={`text-sm ${
                        countdown > 0 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-amber-600 hover:text-amber-700 cursor-pointer'
                      }`}
                    >
                      {countdown > 0 ? 'ارسال مجدد کد' : 'ارسال مجدد کد تایید'}
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep('request-otp')}
                      disabled={loading}
                      className="flex-1"
                    >
                      بازگشت
                    </Button>
                    <Button
                      onClick={handleVerifyOTP}
                      disabled={loading || otp.join('').length !== 6}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                      تایید کد
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step: Set Password */}
              {step === 'set-password' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رمز عبور جدید
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setError('');
                        }}
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        placeholder="رمز عبور جدید را وارد کنید"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">حداقل ۶ کاراکتر</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تکرار رمز عبور
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setError('');
                        }}
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        placeholder="رمز عبور را دوباره وارد کنید"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{error}</p>
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep('verify-otp')}
                      disabled={loading}
                      className="flex-1"
                    >
                      بازگشت
                    </Button>
                    <Button
                      onClick={handleSetPassword}
                      disabled={loading || !newPassword || !confirmPassword}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        'تنظیم رمز عبور'
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step: Success */}
              {step === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    رمز عبور با موفقیت تنظیم شد
                  </h3>
                  <p className="text-gray-600">
                    از این پس می‌توانید با رمز عبور جدید وارد شوید
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
