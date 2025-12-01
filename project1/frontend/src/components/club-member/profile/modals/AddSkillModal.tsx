import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (skill: SkillData) => Promise<void>;
}

export interface SkillData {
  name: string;
  level: number;
  category: string;
}

export default function AddSkillModal({ isOpen, onClose, onSave }: AddSkillModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<SkillData>({
    name: '',
    level: 50,
    category: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.name === 'level' ? parseInt(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('لطفاً نام مهارت را وارد کنید');
      return;
    }
    try {
      setIsSaving(true);
      await onSave(formData);
      toast.success('مهارت با موفقیت اضافه شد');
      onClose();
      setFormData({ name: '', level: 50, category: '' });
    } catch (error: any) {
      toast.error(error.message || 'خطا در افزودن مهارت');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-3xl shadow-2xl max-w-lg w-full">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Zap className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black">افزودن مهارت</h2>
                  </div>
                  <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">نام مهارت <span className="text-red-500">*</span></label>
                  <Input name="name" value={formData.name} onChange={handleChange} placeholder="مثال: React" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">دسته‌بندی</label>
                  <Input name="category" value={formData.category} onChange={handleChange} placeholder="مثال: Frontend" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">سطح مهارت: {formData.level}%</label>
                  <input type="range" name="level" min="0" max="100" value={formData.level} onChange={handleChange} className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-purple-600" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>مبتدی</span>
                    <span>متوسط</span>
                    <span>پیشرفته</span>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={isSaving} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-xl">
                    {isSaving ? <><Loader2 className="w-5 h-5 ml-2 animate-spin" />در حال ذخیره...</> : <><Save className="w-5 h-5 ml-2" />ذخیره</>}
                  </Button>
                  <Button type="button" onClick={onClose} disabled={isSaving} variant="outline" className="px-8 py-3 rounded-xl font-bold">انصراف</Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
