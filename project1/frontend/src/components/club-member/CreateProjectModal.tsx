import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { X, Plus, Loader2, Users, Calendar, Code2, Tag, Sparkles } from 'lucide-react';
import { useCreateProject } from '@/hooks/useProjects';
import { ProjectCategory, CreateProjectInput } from '@/types/project';

interface CreateProjectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const categories = [
    { value: ProjectCategory.WEB_APP, label: 'وب', icon: '🌐', color: 'from-blue-500 to-cyan-500' },
    { value: ProjectCategory.MOBILE_APP, label: 'موبایل', icon: '📱', color: 'from-purple-500 to-pink-500' },
    { value: ProjectCategory.AI_ML, label: 'هوش مصنوعی', icon: '🤖', color: 'from-orange-500 to-red-500' },
    { value: ProjectCategory.IOT, label: 'IoT', icon: '🔌', color: 'from-green-500 to-teal-500' },
    { value: ProjectCategory.BLOCKCHAIN, label: 'بلاکچین', icon: '⛓️', color: 'from-yellow-500 to-orange-500' },
    { value: ProjectCategory.GAME, label: 'بازی', icon: '🎮', color: 'from-pink-500 to-rose-500' },
    { value: ProjectCategory.OTHER, label: 'سایر', icon: '📦', color: 'from-gray-500 to-slate-500' },
];

function CreateProjectModal({ open, onOpenChange }: CreateProjectModalProps) {
    const { mutate: createProject, isPending } = useCreateProject();

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.description) {
            return;
        }

        createProject(formData, {
            onSuccess: () => {
                onOpenChange(false);
                setFormData({
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
                setTechInput('');
                setTagInput('');
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

    const selectedCategory = categories.find(c => c.value === formData.category);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-green-50/50 to-emerald-50/30">
                <DialogHeader className="space-y-3 pb-6 border-b border-green-100">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                            <Sparkles className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                ایجاد پروژه جدید
                            </DialogTitle>
                            <DialogDescription className="text-base text-gray-600 mt-1">
                                پروژه خود را با جزئیات کامل ایجاد کنید و تیم خود را تشکیل دهید
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                    {/* Basic Info Card */}
                    <Card className="border-l-4 border-l-green-500 shadow-sm">
                        <CardContent className="p-6 space-y-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                    <Sparkles className="h-4 w-4 text-green-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">اطلاعات اصلی</h3>
                            </div>

                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                                    عنوان پروژه *
                                </Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="مثال: سیستم مدیریت محتوا"
                                    className="h-11 text-base"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                                    توضیحات پروژه *
                                </Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="توضیحات کامل درباره پروژه، اهداف و ویژگی‌های آن..."
                                    rows={4}
                                    className="text-base resize-none"
                                    required
                                />
                            </div>

                            {/* Category & Team Size */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
                                        دسته‌بندی پروژه *
                                    </Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => setFormData({ ...formData, category: value as ProjectCategory })}
                                    >
                                        <SelectTrigger className="h-11">
                                            <SelectValue>
                                                <span className="flex items-center gap-2">
                                                    <span>{selectedCategory?.icon}</span>
                                                    <span>{selectedCategory?.label}</span>
                                                </span>
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.value} value={cat.value}>
                                                    <span className="flex items-center gap-2">
                                                        <span>{cat.icon}</span>
                                                        <span>{cat.label}</span>
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="maxTeamSize" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        حداکثر اعضای تیم
                                    </Label>
                                    <Input
                                        id="maxTeamSize"
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={formData.maxTeamSize}
                                        onChange={(e) => setFormData({ ...formData, maxTeamSize: parseInt(e.target.value) })}
                                        className="h-11"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline Card */}
                    <Card className="border-l-4 border-l-blue-500 shadow-sm">
                        <CardContent className="p-6 space-y-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">زمان‌بندی</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate" className="text-sm font-semibold text-gray-700">
                                        تاریخ شروع *
                                    </Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={typeof formData.startDate === 'string' ? formData.startDate : formData.startDate.toISOString().split('T')[0]}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="h-11"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="endDate" className="text-sm font-semibold text-gray-700">
                                        تاریخ پایان (اختیاری)
                                    </Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={formData.endDate ? (typeof formData.endDate === 'string' ? formData.endDate : formData.endDate.toISOString().split('T')[0]) : ''}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="h-11"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Technologies Card */}
                    <Card className="border-l-4 border-l-purple-500 shadow-sm">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <Code2 className="h-4 w-4 text-purple-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">تکنولوژی‌ها</h3>
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    value={techInput}
                                    onChange={(e) => setTechInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                                    placeholder="مثال: React, Node.js, MongoDB"
                                    className="h-11 flex-1"
                                />
                                <Button
                                    type="button"
                                    onClick={addTechnology}
                                    className="h-11 px-4 bg-purple-600 hover:bg-purple-700"
                                >
                                    <Plus className="h-5 w-5" />
                                </Button>
                            </div>

                            {formData.technologies && formData.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2 p-4 bg-purple-50 rounded-lg border border-purple-100">
                                    {formData.technologies.map((tech) => (
                                        <Badge key={tech} className="bg-purple-600 hover:bg-purple-700 text-white gap-2 py-1.5 px-3 text-sm">
                                            {tech}
                                            <button
                                                type="button"
                                                onClick={() => removeTechnology(tech)}
                                                className="hover:text-purple-200 transition-colors"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tags Card */}
                    <Card className="border-l-4 border-l-pink-500 shadow-sm">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                                    <Tag className="h-4 w-4 text-pink-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">برچسب‌ها</h3>
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    placeholder="مثال: open-source, startup, AI"
                                    className="h-11 flex-1"
                                />
                                <Button
                                    type="button"
                                    onClick={addTag}
                                    className="h-11 px-4 bg-pink-600 hover:bg-pink-700"
                                >
                                    <Plus className="h-5 w-5" />
                                </Button>
                            </div>

                            {formData.tags && formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 p-4 bg-pink-50 rounded-lg border border-pink-100">
                                    {formData.tags.map((tag) => (
                                        <Badge key={tag} variant="outline" className="border-pink-300 text-pink-700 gap-2 py-1.5 px-3 text-sm">
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="hover:text-pink-900 transition-colors"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Goals */}
                    <div className="space-y-2">
                        <Label htmlFor="goals" className="text-sm font-semibold text-gray-700">
                            اهداف پروژه
                        </Label>
                        <Textarea
                            id="goals"
                            value={formData.goals}
                            onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                            placeholder="اهداف و چشم‌انداز پروژه را شرح دهید..."
                            rows={3}
                            className="text-base resize-none"
                        />
                    </div>

                    {/* Links */}
                    <Card className="border-l-4 border-l-cyan-500 shadow-sm">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">لینک‌ها (اختیاری)</h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">مخزن کد (Repository)</Label>
                                    <Input
                                        value={formData.repositoryUrl}
                                        onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
                                        placeholder="https://github.com/username/project"
                                        type="url"
                                        className="h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">دمو پروژه</Label>
                                    <Input
                                        value={formData.demoUrl}
                                        onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                                        placeholder="https://demo.example.com"
                                        type="url"
                                        className="h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">مستندات</Label>
                                    <Input
                                        value={formData.documentationUrl}
                                        onChange={(e) => setFormData({ ...formData, documentationUrl: e.target.value })}
                                        placeholder="https://docs.example.com"
                                        type="url"
                                        className="h-11"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Public/Private */}
                    <Card className="border-l-4 border-l-amber-500 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isPublic"
                                    checked={formData.isPublic}
                                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                                <Label htmlFor="isPublic" className="cursor-pointer text-base font-medium text-gray-900">
                                    پروژه عمومی (قابل مشاهده برای همه اعضای باشگاه)
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 sticky bottom-0 bg-white/95 backdrop-blur-sm pb-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                            className="h-12 px-6"
                        >
                            انصراف
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending || !formData.title || !formData.description}
                            className="h-12 px-8 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                                    در حال ایجاد...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-5 w-5 ml-2" />
                                    ایجاد پروژه
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateProjectModal;
