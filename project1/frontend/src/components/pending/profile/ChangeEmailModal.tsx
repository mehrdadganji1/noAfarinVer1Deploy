/**
 * Change Email Modal Component
 * Modal for changing user email address
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface ChangeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  onSuccess: (newEmail: string) => void;
}

export const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({
  isOpen,
  onClose,
  currentEmail,
  onSuccess,
}) => {
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { setUser, user } = useAuthStore();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmail.trim()) {
      setError('ایمیل جدید را وارد کنید');
      return;
    }

    if (!validateEmail(newEmail)) {
      setError('فرمت ایمیل نامعتبر است');
      return;
    }

    if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
      setError('ایمیل جدید باید متفاوت از ایمیل فعلی باشد');
      return;
    }

    if (!password) {
      setError('رمز عبور فعلی را وارد کنید');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.put('/auth/change-email', {
        newEmail: newEmail.trim().toLowerCase(),
        password,
      });

      if (response.data.success) {
        setSuccess(true);
        // Update user in store
        if (user) {
          setUser({ ...user, email: newEmail.trim().toLowerCase() });
        }
        // Update token if returned
        if (response.data.data?.token) {
          localStorage.setItem('token', response.data.data.token);
        }
        setTimeout(() => {
          onSuccess(newEmail.trim().toLowerCase());
          handleClose();
        }, 1500);
      }
    } catch (error: any) {
      setError(
        error.response?.data?.error ||
        'خطا در تغییر ایمیل. لطفاً دوباره تلاش کنید.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setNewEmail('');
      setPassword('');
      setError('');
      setSuccess(false);
    }
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
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold">تغییر ایمیل</h2>
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
              {success ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    ایمیل با موفقیت تغییر کرد
                  </h3>
                  <p className="text-gray-600">
                    ایمیل جدید شما: <span className="font-medium text-purple-600 ltr">{newEmail}</span>
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ایمیل فعلی
                    </label>
                    <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 ltr text-left">
                      {currentEmail}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ایمیل جدید
                    </label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ltr text-left"
                      placeholder="example@email.com"
                      disabled={loading}
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رمز عبور فعلی
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="رمز عبور فعلی را وارد کنید"
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      برای امنیت، رمز عبور فعلی خود را وارد کنید
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

                  <div className="flex gap-3 pt-2">
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
                      type="submit"
                      disabled={loading || !newEmail.trim() || !password}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        'تغییر ایمیل'
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
