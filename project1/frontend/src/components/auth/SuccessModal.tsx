import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface SuccessModalProps {
  isOpen: boolean;
  email: string;
  onResendEmail: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, email, onResendEmail }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl" />
            
            {/* Card */}
            <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center text-white mb-2">
                ثبت‌نام موفقیت‌آمیز!
              </h2>
              <p className="text-center text-gray-300 mb-6">
                ایمیل تایید به آدرس زیر ارسال شد:
              </p>

              {/* Email Display */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium break-all">{email}</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-200 font-medium mb-2">مراحل بعدی:</p>
                <ul className="text-sm text-yellow-100 space-y-1 list-disc list-inside">
                  <li>صندوق ورودی ایمیل خود را بررسی کنید</li>
                  <li>روی لینک تایید کلیک کنید</li>
                  <li>به صفحه ورود بروید</li>
                </ul>
              </div>

              {/* Resend Email */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-400 mb-2">ایمیلی دریافت نکردید؟</p>
                <button
                  onClick={onResendEmail}
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium underline"
                >
                  ارسال مجدد ایمیل تایید
                </button>
              </div>

              {/* Login Button */}
              <Link to="/login" className="block">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  ورود به حساب کاربری
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
