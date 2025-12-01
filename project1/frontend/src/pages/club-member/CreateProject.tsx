import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    ArrowRight,
    ArrowLeft,
    X,
    Plus,
    Loader2,
    Sparkles,
} from 'lucide-react';
import { useCreateProject } from '@/hooks/useProjects';
import { ProjectCategory, CreateProjectInput } from '@/types/project';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
    { value: ProjectCategory.WEB_APP, label: 'اپلیکیشن وب', icon: '🌐' },
    { value: ProjectCategory.MOBILE_APP, label: 'اپلیکیشن موبایل', icon: '📱' },
    { value: ProjectCategory.AI_ML, label: 'هوش مصنوعی', icon: '🤖' },
    { value: ProjectCategory.IOT, label: 'اینترنت اشیا', icon: '🔌' },
    { value: ProjectCategory.BLOCKCHAIN, label: 'بلاکچین', icon: '⛓️' },
    { value: ProjectCategory.GAME, label: 'بازی', icon: '🎮' },
    { value: ProjectCategory.OTHER, label: 'سایر', icon: '📦' },
];

export default function CreateProject() {
    const navigate = useNavigate();
    const { mutate: createProject, isPending } = useCreateProject();
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState<CreateProjectInput>({
        title: '',
        description: '',
        category: ProjectCategory.WEB_APP,
        startDate: new Date().toISOString().split('T')[0],
        maxTeamSize: 5,
        technologies: [],
        tags: [],
        goals: '',
        repositoryUrl: '',
        demoUrl: '',
        documentationUrl: '',
        isPublic: true,
    });

    const [techInput, setTechInput] = useState('');
    const [tagInput, setTagInput] = useState('');

    const handleSubmit = () => {
        createProject(formData, {
            onSuccess: () => {
                navigate('/club-member/projects');
            },
        });
    };

    const addTechnology = () => {
        if (techInput.trim() && !formData.technologies?.includes(techInput.trim())) {
            setFormData({
                ...formData,
                technologies: [...(formData.technologies || []), techInput.trim()],
            });
            setTechInput('');
        }
    };

    const removeTechnology = (tech: string) => {
        setFormData({
            ...formData,
            technologies: formData.technologies?.filter((t) => t !== tech) || [],
        });
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
            setFormData({
                ...formData,
                tags: [...(formData.tags || []), tagInput.trim()],
            });
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setFormData({
            ...formData,
            tags: formData.tags?.filter((t) => t !== tag) || [],
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-emerald-50/20 to-teal-50/30 p-6" dir="rtl">
            <div className="max-w-4xl mx-auto space-y-6">
                <Button variant="ghost" onClick={() => navigate('/club-member/projects')}>
                    <ArrowRight className="h-4 w-4 ml-2" />
                    بازگشت
                </Button>

                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                        <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">ایجاد پروژه جدید</h1>
                        <p className="text-gray-600">مرحله {currentStep} از 4</p>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-8 space-y-6">
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <h2 className="text-2xl font-bold mb-6">اطلاعات پایه</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <Label>عنوان پروژه *</Label>
                                            <Input
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="عنوان پروژه"
                                                className="h-12"
                                            />
                                        </div>
                                        <div>
                                            <Label>دسته‌بندی *</Label>
                                            <div className="grid grid-cols-4 gap-3 mt-2">
                                                {categories.map((cat) => (
                                                    <button
                                                        key={cat.value}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, category: cat.value })}
                                                        className={`p-4 rounded-xl border-2 ${formData.category === cat.value ? 'border-green-500 bg-green-50' : 'border-gray-200'
                                                            }`}
                                                    >
                                                        <div className="text-3xl mb-2">{cat.icon}</div>
                                                        <div className="text-sm font-semibold">{cat.label}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <h2 className="text-2xl font-bold mb-6">توضیحات</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <Label>توضیحات *</Label>
                                            <Textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                rows={6}
                                            />
                                        </div>
                                        <div>
                                            <Label>اهداف</Label>
                                            <Textarea
                                                value={formData.goals}
                                                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                                                rows={4}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <h2 className="text-2xl font-bold mb-6">تکنولوژی</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <Label>تکنولوژی‌ها</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={techInput}
                                                    onChange={(e) => setTechInput(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                                                />
                                                <Button type="button" onClick={addTechnology}>
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            {formData.technologies && formData.technologies.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {formData.technologies.map((tech) => (
                                                        <Badge key={tech}>
                                                            {tech}
                                                            <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeTechnology(tech)} />
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <Label>برچسب‌ها</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={tagInput}
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                                />
                                                <Button type="button" onClick={addTag}>
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            {formData.tags && formData.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {formData.tags.map((tag) => (
                                                        <Badge key={tag} variant="outline">
                                                            #{tag}
                                                            <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeTag(tag)} />
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 4 && (
                                <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <h2 className="text-2xl font-bold mb-6">تنظیمات</h2>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <Label>اعضای تیم</Label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    max="20"
                                                    value={formData.maxTeamSize}
                                                    onChange={(e) => setFormData({ ...formData, maxTeamSize: parseInt(e.target.value) })}
                                                />
                                            </div>
                                            <div>
                                                <Label>تاریخ شروع</Label>
                                                <Input
                                                    type="date"
                                                    value={typeof formData.startDate === 'string' ? formData.startDate : formData.startDate.toISOString().split('T')[0]}
                                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <Label>تاریخ پایان</Label>
                                                <Input
                                                    type="date"
                                                    value={formData.endDate ? (typeof formData.endDate === 'string' ? formData.endDate : formData.endDate.toISOString().split('T')[0]) : ''}
                                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Repository</Label>
                                            <Input
                                                value={formData.repositoryUrl}
                                                onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
                                                placeholder="https://github.com/..."
                                            />
                                        </div>
                                        <div>
                                            <Label>Demo</Label>
                                            <Input
                                                value={formData.demoUrl}
                                                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                                                placeholder="https://demo.com"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="isPublic"
                                                checked={formData.isPublic}
                                                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                                                className="w-4 h-4"
                                            />
                                            <Label htmlFor="isPublic">پروژه عمومی</Label>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex justify-between pt-6 border-t">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep(currentStep - 1)}
                                disabled={currentStep === 1}
                            >
                                <ArrowRight className="h-4 w-4 ml-2" />
                                قبلی
                            </Button>
                            {currentStep < 4 ? (
                                <Button onClick={() => setCurrentStep(currentStep + 1)}>
                                    بعدی
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                </Button>
                            ) : (
                                <Button onClick={handleSubmit} disabled={isPending} className="bg-green-600">
                                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'ایجاد پروژه'}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
