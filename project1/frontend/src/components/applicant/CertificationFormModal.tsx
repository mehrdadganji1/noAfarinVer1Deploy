import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PersianDatePicker } from '@/components/ui/persian-date-picker';
import { X, Award, Loader2 } from 'lucide-react';
import { Certification } from '@/hooks/useProfile';

interface CertificationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (certification: Certification) => void;
  initialData?: Certification;
  isLoading?: boolean;
}

export default function CertificationFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: CertificationFormModalProps) {
  const [formData, setFormData] = useState<Certification>({
    name: '',
    issuer: '',
    date: '',
    expiryDate: '',
    credentialId: '',
    url: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Certification, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: initialData.date ? initialData.date.substring(0, 7) : '',
        expiryDate: initialData.expiryDate ? initialData.expiryDate.substring(0, 7) : '',
      });
    } else {
      setFormData({
        name: '',
        issuer: '',
        date: '',
        expiryDate: '',
        credentialId: '',
        url: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (field: keyof Certification, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Certification, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'الزامی';
    if (!formData.issuer.trim()) newErrors.issuer = 'الزامی';
    if (!formData.date) newErrors.date = 'الزامی';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const submitData: Certification = {
      ...formData,
      _id: initialData?._id,
      date: formData.date ? `${formData.date}-01` : '',
      expiryDate: formData.expiryDate ? `${formData.expiryDate}-01` : undefined,
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
          <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                {initialData ? 'ویرایش' : 'افزودن'} گواهینامه
              </h2>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Compact Form - 2 Column Layout */}
          <form onSubmit={handleSubmit} className="p-5">
            <div className="grid grid-cols-2 gap-4">
              {/* Certificate Name - Full Width */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام گواهینامه <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="AWS Solutions Architect"
                  className={`h-10 ${errors.name ? 'border-red-500' : ''}`}
                />
              </div>

              {/* Issuer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  صادرکننده <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.issuer}
                  onChange={(e) => handleChange('issuer', e.target.value)}
                  placeholder="Amazon"
                  className={`h-10 ${errors.issuer ? 'border-red-500' : ''}`}
                />
              </div>

              {/* Credential ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">شناسه</label>
                <Input
                  value={formData.credentialId || ''}
                  onChange={(e) => handleChange('credentialId', e.target.value)}
                  placeholder="ABC123"
                  className="h-10"
                />
              </div>

              {/* Issue Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تاریخ صدور <span className="text-red-500">*</span>
                </label>
                <PersianDatePicker
                  value={formData.date}
                  onChange={(value) => handleChange('date', value)}
                  onlyMonthPicker
                  placeholder="انتخاب ماه و سال"
                  error={!!errors.date}
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ انقضا</label>
                <PersianDatePicker
                  value={formData.expiryDate || ''}
                  onChange={(value) => handleChange('expiryDate', value)}
                  onlyMonthPicker
                  placeholder="انتخاب ماه و سال"
                />
              </div>

              {/* URL - Full Width */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">لینک تایید</label>
                <Input
                  value={formData.url || ''}
                  onChange={(e) => handleChange('url', e.target.value)}
                  placeholder="https://credly.com/..."
                  className="h-10"
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
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90"
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
