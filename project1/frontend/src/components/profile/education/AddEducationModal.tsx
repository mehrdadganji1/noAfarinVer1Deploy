import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, GraduationCap, Building2, BookOpen, Calendar, Award, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Education } from '@/types/profile';

interface AddEducationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (education: Education) => Promise<void>;
  initialData?: Education;
}

export default function AddEducationModal({
  open,
  onOpenChange,
  onSubmit,
  initialData
}: AddEducationModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Education>({
    institution: '',
    degree: '',
    major: '',
    startDate: '',
    endDate: '',
    current: false,
    gpa: undefined,
    achievements: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        institution: '',
        degree: '',
        major: '',
        startDate: '',
        endDate: '',
        current: false,
        gpa: undefined,
        achievements: ''
      });
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting education:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseFloat(value) : undefined) : value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      current: checked,
      endDate: checked ? '' : prev.endDate
    }));
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {initialData ? 'ویرایش سابقه تحصیلی' : 'افزودن سابقه تحصیلی'}
                    </h2>
                    <p className="text-white/80 text-sm mt-1">
                      تحصیلات خود را به پروفایل اضافه کنید
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onOpenChange(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="md:col-span-2"
                >
                  <Label className="flex items-center gap-2 text-gray-700 mb-1.5 text-sm">
                    <Building2 className="w-3.5 h-3.5 text-green-600" />
                    نام موسسه آموزشی <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="مثال: دانشگاه تهران"
                    className="h-10"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <Label className="flex items-center gap-2 text-gray-700 mb-1.5 text-sm">
                    <Award className="w-3.5 h-3.5 text-green-600" />
                    مقطع تحصیلی <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    placeholder="مثال: کارشناسی"
                    className="h-10"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label className="flex items-center gap-2 text-gray-700 mb-1.5 text-sm">
                    <BookOpen className="w-3.5 h-3.5 text-green-600" />
                    رشته تحصیلی <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    placeholder="مثال: مهندسی کامپیوتر"
                    className="h-10"
                    required
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Label className="flex items-center gap-2 text-gray-700 mb-1.5 text-sm">
                    <Calendar className="w-3.5 h-3.5 text-green-600" />
                    تاریخ شروع <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="h-10"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label className="flex items-center gap-2 text-gray-700 mb-1.5 text-sm">
                    <Calendar className="w-3.5 h-3.5 text-green-600" />
                    تاریخ پایان
                  </Label>
                  <Input
                    type="date"
                    name="endDate"
                    value={formData.endDate || ''}
                    onChange={handleChange}
                    disabled={formData.current}
                    className="h-10"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <Label className="flex items-center gap-2 text-gray-700 mb-1.5 text-sm">
                    <Award className="w-3.5 h-3.5 text-green-600" />
                    معدل (GPA)
                  </Label>
                  <Input
                    type="number"
                    name="gpa"
                    value={formData.gpa || ''}
                    onChange={handleChange}
                    placeholder="مثال: 3.5"
                    step="0.01"
                    min="0"
                    max="4"
                    className="h-10"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 p-3 bg-green-50 rounded-lg"
              >
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.current}
                  onChange={(e) => handleCheckboxChange(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <label htmlFor="current" className="text-xs text-gray-700 font-medium">
                  در حال حاضر در این موسسه تحصیل می‌کنم
                </label>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <Label className="flex items-center gap-2 text-gray-700 mb-1.5 text-sm">
                  <FileText className="w-3.5 h-3.5 text-green-600" />
                  دستاوردها
                </Label>
                <textarea
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="دستاوردها و افتخارات..."
                />
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-3 pt-2"
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-10 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      در حال ذخیره...
                    </>
                  ) : (
                    initialData ? 'به‌روزرسانی' : 'افزودن'
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  variant="outline"
                  disabled={loading}
                  className="px-6 h-10 rounded-lg"
                >
                  انصراف
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
