/**
 * Account Settings Component
 * Displays account settings with options to change email and password
 * - Verified email and phone cannot be changed
 * - First-time password setup requires SMS verification
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Settings, Edit3, Shield, Phone, CheckCircle, AlertCircle, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChangeEmailModal } from './ChangeEmailModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import { SetPasswordModal } from './SetPasswordModal';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/components/ui/toast';

export const AccountSettings: React.FC = () => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const { user, refreshUser } = useAuthStore();

  // Check verification status
  const isEmailVerified = user?.emailVerified || user?.isVerified;
  const isPhoneVerified = user?.phoneVerified;
  const hasPassword = user?.hasPassword;

  const handleEmailSuccess = (_newEmail: string) => {
    toast.success('ایمیل با موفقیت تغییر کرد');
    refreshUser?.();
  };

  const handlePasswordSuccess = () => {
    toast.success('رمز عبور با موفقیت تغییر کرد');
    refreshUser?.();
  };

  const handleSetPasswordSuccess = () => {
    toast.success('رمز عبور با موفقیت تنظیم شد');
    refreshUser?.();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">تنظیمات حساب کاربری</h2>
              <p className="text-white/80 text-sm">مدیریت اطلاعات ورود به سیستم</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Email Section */}
          <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
            isEmailVerified 
              ? 'bg-green-50 border-green-200' 
              : 'bg-gray-50 border-gray-200 hover:border-purple-200'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isEmailVerified ? 'bg-green-100' : 'bg-purple-100'
              }`}>
                <Mail className={`w-6 h-6 ${isEmailVerified ? 'text-green-600' : 'text-purple-600'}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">ایمیل</h3>
                  {isEmailVerified && (
                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      احراز شده
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm ltr text-left">
                  {user?.email || 'تعریف نشده'}
                </p>
              </div>
            </div>
            {isEmailVerified ? (
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <Shield className="w-4 h-4" />
                غیرقابل تغییر
              </div>
            ) : (
              <Button
                onClick={() => setShowEmailModal(true)}
                variant="outline"
                size="sm"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Edit3 className="w-4 h-4 ml-2" />
                تغییر
              </Button>
            )}
          </div>

          {/* Phone Section */}
          <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
            isPhoneVerified 
              ? 'bg-green-50 border-green-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isPhoneVerified ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Phone className={`w-6 h-6 ${isPhoneVerified ? 'text-green-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">شماره موبایل</h3>
                  {isPhoneVerified && (
                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      احراز شده
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm ltr text-left" dir="ltr">
                  {user?.phoneNumber || 'تعریف نشده'}
                </p>
              </div>
            </div>
            {isPhoneVerified ? (
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <Shield className="w-4 h-4" />
                غیرقابل تغییر
              </div>
            ) : (
              <div className="text-sm text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                احراز نشده
              </div>
            )}
          </div>

          {/* Password Section */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                hasPassword ? 'bg-blue-100' : 'bg-amber-100'
              }`}>
                {hasPassword ? (
                  <Lock className="w-6 h-6 text-blue-600" />
                ) : (
                  <Key className="w-6 h-6 text-amber-600" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">رمز عبور</h3>
                  {!hasPassword && (
                    <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3" />
                      تنظیم نشده
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">
                  {hasPassword ? '••••••••' : 'رمز عبور تنظیم نشده است'}
                </p>
              </div>
            </div>
            {hasPassword ? (
              <Button
                onClick={() => setShowPasswordModal(true)}
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Edit3 className="w-4 h-4 ml-2" />
                تغییر
              </Button>
            ) : (
              <Button
                onClick={() => setShowSetPasswordModal(true)}
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                <Key className="w-4 h-4 ml-2" />
                تنظیم رمز عبور
              </Button>
            )}
          </div>

          {/* Security Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">نکات امنیتی</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• از رمز عبور قوی استفاده کنید (حداقل ۶ کاراکتر)</li>
                  <li>• رمز عبور خود را به صورت منظم تغییر دهید</li>
                  <li>• از اشتراک‌گذاری اطلاعات ورود خودداری کنید</li>
                  {!hasPassword && (
                    <li className="text-amber-800 font-medium">• برای امنیت بیشتر، رمز عبور خود را تنظیم کنید</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      {!isEmailVerified && (
        <ChangeEmailModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          currentEmail={user?.email || ''}
          onSuccess={handleEmailSuccess}
        />
      )}

      {hasPassword && (
        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onSuccess={handlePasswordSuccess}
        />
      )}

      {!hasPassword && (
        <SetPasswordModal
          isOpen={showSetPasswordModal}
          onClose={() => setShowSetPasswordModal(false)}
          onSuccess={handleSetPasswordSuccess}
        />
      )}
    </>
  );
};
