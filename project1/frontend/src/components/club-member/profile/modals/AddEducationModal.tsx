import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';

interface AddEducationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (education: EducationData) => Promise<void>;
}

export interface EducationData {
    degree: string;
    field: string;
    institution: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    description?: string;
}

export default function AddEducationModal({ isOpen, onClose, onSave }: AddEducationModalProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<EducationData>({
        degree: '',
        field: '',
        institution: '',
        startDate: '',
        endDate: '',
        gpa: '',
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.degree || !formData.field || !formData.institution) {
            toast.error('لطفاً فیلدهای الزامی را پر کنید');
            return;
        }

        try {
            setIsSaving(true);
            await onSave(formData);
            toast.success('سابقه تحصیلی با موفقیت اضافه شد');
            onClose();
            setFormData({
                degree: '',
                field: '',
                institution: '',
                startDate: '',
                endDate: '',
                gpa: '',
                description: '',
            });
        } catch (error: any) {
            toast.error(error.message || 'خطا در افزودن سابقه تحصیلی');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            <GraduationCap className="w-6 h-6" />
                                        </div>
                                        <h2 className="text-2xl font-black">افزودن سابقه تحصیلی</h2>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            مقطع تحصیلی <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name="degree"
                                            value={formData.degree}
                                            onChange={handleChange}
                                            placeholder="مثال: کارشناسی"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            رشته تحصیلی <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name="field"
                                            value={formData.field}
                                            onChange={handleChange}
                                            placeholder="مثال: مهندسی کامپیوتر"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            نام دانشگاه/موسسه <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name="institution"
                                            value={formData.institution}
                                            onChange={handleChange}
                                            placeholder="مثال: دانشگاه تهران"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            تاریخ شروع
                                        </label>
                                        <Input
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            placeholder="مثال: 1398"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            تاریخ پایان
                                        </label>
                                        <Input
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            placeholder="مثال: 1402"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            معدل
                                        </label>
                                        <Input
                                            name="gpa"
                                            value={formData.gpa}
                                            onChange={handleChange}
                                            placeholder="مثال: 18.5"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            توضیحات
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={3}
                                            placeholder="توضیحات اضافی..."
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 rounded-xl"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                                                در حال ذخیره...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5 ml-2" />
                                                ذخیره
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={onClose}
                                        disabled={isSaving}
                                        variant="outline"
                                        className="px-8 py-3 rounded-xl font-bold"
                                    >
                                        انصراف
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
