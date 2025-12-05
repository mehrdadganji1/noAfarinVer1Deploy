import { FC, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, FileText, Loader2, MapPin, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onUpdate: () => void;
}

export const EditProfileModal: FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdate,
}) => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    university: '',
    major: '',
    bio: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phoneNumber: profile.phoneNumber || '',
        university: profile.university || '',
        major: profile.major || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = profile?._id || (profile as any)?.id || user?._id;
      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await api.put(`/profile/${userId}`, formData);
      const updatedUser = response.data.data.user;
      useAuthStore.getState().setUser(updatedUser);

      onUpdate();
      onClose();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'خطا در به‌روزرسانی پروفایل');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999]">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        {/* Modal Container */}
        <div className="relative h-full flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden pointer-events-auto"
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
          {/* Header */}
          <div className="bg-gradient-to-l from-purple-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">ویرایش پروفایل</h2>
                  <p className="text-xs text-purple-100">اطلاعات شخصی خود را ویرایش کنید</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Name Row - 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                  <User className="w-3.5 h-3.5 text-purple-500" />
                  نام
                </label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="نام"
                  className="h-10"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  نام خانوادگی
                </label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="نام خانوادگی"
                  className="h-10"
                  required
                />
              </div>
            </div>

            {/* Contact Row - 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  ایمیل
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="email@example.com"
                  className="h-10 text-left direction-ltr"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                  <Phone className="w-3.5 h-3.5 text-green-500" />
                  شماره تماس
                </label>
                <Input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  placeholder="09123456789"
                  className="h-10 text-left direction-ltr"
                />
              </div>
            </div>

            {/* Academic Row - 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  دانشگاه
                </label>
                <Input
                  value={formData.university}
                  onChange={(e) => handleChange('university', e.target.value)}
                  placeholder="دانشگاه تهران"
                  className="h-10"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                  رشته تحصیلی
                </label>
                <Input
                  value={formData.major}
                  onChange={(e) => handleChange('major', e.target.value)}
                  placeholder="مهندسی کامپیوتر"
                  className="h-10"
                />
              </div>
            </div>

            {/* Bio - Full width but shorter */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                درباره من
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
                placeholder="چند خط درباره خودتان..."
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="px-5"
              >
                انصراف
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="px-5 bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                ) : null}
                ذخیره تغییرات
              </Button>
            </div>
          </form>
        </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default EditProfileModal;
