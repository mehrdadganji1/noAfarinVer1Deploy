import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PersianDatePicker } from '@/components/ui/persian-date-picker';
import { X, GraduationCap, Loader2, Calendar, Award, BookOpen } from 'lucide-react';
import { Education } from '@/hooks/useProfile';

interface EducationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (education: Education) => void;
  initialData?: Education;
  isLoading?: boolean;
}

const DEGREE_OPTIONS = [
  { value: 'دیپلم', label: 'دیپلم' },
  { value: 'کاردانی', label: 'کاردانی' },
  { value: 'کارشناسی', label: 'کارشناسی' },
  { value: 'کارشناسی ارشد', label: 'کارشناسی ارشد' },
  { value: 'دکتری', label: 'دکتری' },
];

export default function EducationFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: EducationFormModalProps) {
  const [formData, setFormData] = useState<Education>({
    institution: '',
    degree: '',
    major: '',
    startDate: '',
    endDate: '',
    current: false,
    gpa: undefined,
    achievements: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Education, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        startDate: initialData.startDate ? initialData.startDate.substring(0, 7) : '',
        endDate: initialData.endDate ? initialData.endDate.substring(0, 7) : '',
      });
    } else {
      setFormData({
        institution: '',
        degree: '',
        major: '',
        startDate: '',
        endDate: '',
        current: false,
        gpa: undefined,
        achievements: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (field: keyof Education, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Education, string>> = {};
    if (!formData.institution.trim()) newErrors.institution = 'الزامی';
    if (!formData.degree.trim()) newErrors.degree = 'الزامی';
    if (!formData.major.trim()) newErrors.major = 'الزامی';
    if (!formData.startDate) newErrors.startDate = 'الزامی';
    if (!formData.current && !formData.endDate) newErrors.endDate = 'الزامی';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const submitData: Education = {
      ...formData,
      _id: initialData?._id,
      startDate: formData.startDate ? `${formData.startDate}-01` : '',
      endDate: formData.current ? undefined : (formData.endDate ? `${formData.endDate}-01` : undefined),
      gpa: formData.gpa ? Number(formData.gpa) : undefined,
    };
    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden pointer-events-auto"
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-l from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {initialData ? 'ویرایش سابقه تحصیلی' : 'افزودن سابقه تحصیلی'}
                    </h2>
                    <p className="text-xs text-blue-100">سوابق تحصیلی خود را ثبت کنید</p>
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
              {/* Institution */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  نام موسسه / دانشگاه
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.institution}
                  onChange={(e) => handleChange('institution', e.target.value)}
                  placeholder="مثال: دانشگاه تهران"
                  className={`h-11 ${errors.institution ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                />
              </div>

              {/* Degree & Major - 2 columns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    مقطع تحصیلی <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.degree}
                    onChange={(e) => handleChange('degree', e.target.value)}
                    className={`w-full h-11 px-3 border rounded-lg bg-white text-sm transition-colors ${errors.degree ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                  >
                    <option value="">انتخاب کنید</option>
                    {DEGREE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    رشته تحصیلی <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.major}
                    onChange={(e) => handleChange('major', e.target.value)}
                    placeholder="مثال: مهندسی کامپیوتر"
                    className={`h-11 ${errors.major ? 'border-red-500' : ''}`}
                  />
                </div>
              </div>

              {/* Dates - 2 columns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    تاریخ شروع <span className="text-red-500">*</span>
                  </label>
                  <PersianDatePicker
                    value={formData.startDate}
                    onChange={(value) => handleChange('startDate', value)}
                    onlyMonthPicker
                    placeholder="انتخاب ماه و سال"
                    error={!!errors.startDate}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    تاریخ پایان {!formData.current && <span className="text-red-500">*</span>}
                  </label>
                  <PersianDatePicker
                    value={formData.endDate}
                    onChange={(value) => handleChange('endDate', value)}
                    onlyMonthPicker
                    placeholder="انتخاب ماه و سال"
                    disabled={formData.current}
                    error={!!errors.endDate}
                  />
                </div>
              </div>

              {/* Current Checkbox */}
              <label className="flex items-center gap-3 p-3 bg-gradient-to-l from-blue-50 to-indigo-50 rounded-xl cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors border border-blue-100">
                <input
                  type="checkbox"
                  checked={formData.current}
                  onChange={(e) => {
                    handleChange('current', e.target.checked);
                    if (e.target.checked) handleChange('endDate', '');
                  }}
                  className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">در حال حاضر در این موسسه تحصیل می‌کنم</span>
              </label>

              {/* GPA & Achievements - 2 columns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    معدل (اختیاری)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="20"
                    value={formData.gpa || ''}
                    onChange={(e) => handleChange('gpa', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="مثال: 17.5"
                    className="h-11"
                  />
                  <p className="text-xs text-gray-500 mt-1">معدل از 20</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    دستاوردها (اختیاری)
                  </label>
                  <Input
                    value={formData.achievements || ''}
                    onChange={(e) => handleChange('achievements', e.target.value)}
                    placeholder="رتبه اول، عضو انجمن علمی، ..."
                    className="h-11"
                  />
                  <p className="text-xs text-gray-500 mt-1">افتخارات و فعالیت‌ها</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-6"
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  ) : null}
                  {initialData ? 'به‌روزرسانی' : 'افزودن'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
