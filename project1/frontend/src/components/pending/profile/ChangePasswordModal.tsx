/**
 * Change Password Modal Component
 * Modal for changing user password
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Eye, EyeOff, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError('رمز عبور فعلی را وارد کنید');
      return false;
    }
    if (!formData.newPassword) {
      setError('رمز عبور جدید را وارد کنید');
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError('رمز عبور جدید باید حداقل ۶ کاراکتر باشد');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('تکرار رمز عبور جدید مطابقت ندارد');
      return false;
    }
    if (formData.currentPassword === formData.newPassword) {
      setError('رمز عبور جدید باید متفاوت از رمز عبور فعلی باشد');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.put('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 1500);
      }
    } catch (error: any) {
      setError(
        error.response?.data?.error ||
        'خطا در تغییر رمز عبور. لطفاً دوباره تلاش کنید.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
    setError('');
    setSuccess(false);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      resetForm();
    }
  };

  const PasswordInput = ({
    label,
    field,
    placeholder,
    hint,
  }: {
    label: string;
    field: 'current' | 'new' | 'confirm';
    placeholder: string;
    hint?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPasswords[field] ? 'text' : 'password'}
          value={formData[field === 'current' ? 'currentPassword' : field === 'new' ? 'newPassword' : 'confirmPassword']}
          onChange={(e) => handleInputChange(
            field === 'current' ? 'currentPassword' : field === 'new' ? 'newPassword' : 'confirmPassword',
            e.target.value
          )}
          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          placeholder={placeholder}
          disabled={loading}
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility(field)}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPasswords[field] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );

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
                    <Lock className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold">تغییر رمز عبور</h2>
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
                    رمز عبور با موفقیت تغییر کرد
                  </h3>
                  <p className="text-gray-600">
                    رمز عبور جدید شما ذخیره شد
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <PasswordInput
                    label="رمز عبور فعلی"
                    field="current"
                    placeholder="رمز عبور فعلی را وارد کنید"
                  />

                  <PasswordInput
                    label="رمز عبور جدید"
                    field="new"
                    placeholder="رمز عبور جدید را وارد کنید"
                    hint="حداقل ۶ کاراکتر"
                  />

                  <PasswordInput
                    label="تکرار رمز عبور جدید"
                    field="confirm"
                    placeholder="رمز عبور جدید را دوباره وارد کنید"
                  />

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
                      disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        'تغییر رمز عبور'
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
