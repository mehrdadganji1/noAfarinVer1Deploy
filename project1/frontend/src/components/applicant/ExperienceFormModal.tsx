import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PersianDatePicker } from '@/components/ui/persian-date-picker';
import { X, Briefcase, Loader2 } from 'lucide-react';
import { WorkExperience } from '@/hooks/useProfile';

interface ExperienceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (experience: WorkExperience) => void;
  initialData?: WorkExperience;
  isLoading?: boolean;
}

export default function ExperienceFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: ExperienceFormModalProps) {
  const [formData, setFormData] = useState<WorkExperience>({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof WorkExperience, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        startDate: initialData.startDate ? initialData.startDate.substring(0, 7) : '',
        endDate: initialData.endDate ? initialData.endDate.substring(0, 7) : '',
      });
    } else {
      setFormData({
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (field: keyof WorkExperience, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof WorkExperience, string>> = {};
    if (!formData.company.trim()) newErrors.company = 'الزامی';
    if (!formData.position.trim()) newErrors.position = 'الزامی';
    if (!formData.startDate) newErrors.startDate = 'الزامی';
    if (!formData.current && !formData.endDate) newErrors.endDate = 'الزامی';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const submitData: WorkExperience = {
      ...formData,
      _id: initialData?._id,
      startDate: formData.startDate ? `${formData.startDate}-01` : '',
      endDate: formData.current ? undefined : (formData.endDate ? `${formData.endDate}-01` : undefined),
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
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        {/* Modal Container */}
        <div className="relative h-full flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
          {/* Compact Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                {initialData ? 'ویرایش' : 'افزودن'} سابقه کاری
              </h2>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Compact Form - 2 Column Layout */}
          <form onSubmit={handleSubmit} className="p-5">
            <div className="grid grid-cols-2 gap-4">
              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  شرکت <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="نام شرکت"
                  className={`h-10 ${errors.company ? 'border-red-500' : ''}`}
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  سمت <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  placeholder="عنوان شغلی"
                  className={`h-10 ${errors.position ? 'border-red-500' : ''}`}
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">محل کار</label>
                <Input
                  value={formData.location || ''}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="تهران"
                  className="h-10"
                />
              </div>

              {/* Current Checkbox */}
              <div className="flex items-end">
                <label className="flex items-center gap-2 p-2.5 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors w-full">
                  <input
                    type="checkbox"
                    checked={formData.current}
                    onChange={(e) => {
                      handleChange('current', e.target.checked);
                      if (e.target.checked) handleChange('endDate', '');
                    }}
                    className="h-4 w-4 text-purple-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">شغل فعلی</span>
                </label>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  شروع <span className="text-red-500">*</span>
                </label>
                <PersianDatePicker
                  value={formData.startDate}
                  onChange={(value) => handleChange('startDate', value)}
                  onlyMonthPicker
                  placeholder="انتخاب ماه و سال"
                  error={!!errors.startDate}
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  پایان {!formData.current && <span className="text-red-500">*</span>}
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

              {/* Description - Full Width */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">شرح وظایف</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="خلاصه‌ای از وظایف و دستاوردها..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                انصراف
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : initialData ? 'به‌روزرسانی' : 'افزودن'}
              </Button>
            </div>
          </form>
        </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
