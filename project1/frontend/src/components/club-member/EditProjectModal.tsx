import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Plus, Loader2, Edit } from 'lucide-react';
import { Project, ProjectCategory, ProjectStatus, UpdateProjectInput } from '@/types/project';

interface EditProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onSubmit: (data: UpdateProjectInput) => void;
  isLoading?: boolean;
}

const categories = [
  { value: ProjectCategory.WEB_APP, label: 'وب', icon: '🌐' },
  { value: ProjectCategory.MOBILE_APP, label: 'موبایل', icon: '📱' },
  { value: ProjectCategory.AI_ML, label: 'هوش مصنوعی', icon: '🤖' },
  { value: ProjectCategory.IOT, label: 'IoT', icon: '🔌' },
  { value: ProjectCategory.BLOCKCHAIN, label: 'بلاکچین', icon: '⛓️' },
  { value: ProjectCategory.GAME, label: 'بازی', icon: '🎮' },
  { value: ProjectCategory.OTHER, label: 'سایر', icon: '📦' },
];

const statuses = [
  { value: ProjectStatus.PLANNING, label: 'در حال برنامه‌ریزی' },
  { value: ProjectStatus.IN_PROGRESS, label: 'در حال انجام' },
  { value: ProjectStatus.REVIEW, label: 'در حال بررسی' },
  { value: ProjectStatus.COMPLETED, label: 'تکمیل شده' },
  { value: ProjectStatus.ON_HOLD, label: 'متوقف شده' },
  { value: ProjectStatus.CANCELLED, label: 'لغو شده' },
];

export default function EditProjectModal({
  open,
  onOpenChange,
  project,
  onSubmit,
  isLoading,
}: EditProjectModalProps) {
  const [formData, setFormData] = useState<UpdateProjectInput>({
    title: project.title,
    description: project.description,
    category: project.category,
    status: project.status,
    maxTeamSize: project.maxTeamSize,
    technologies: project.technologies || [],
    tags: project.tags || [],
    goals: project.goals || '',
    challenges: project.challenges || '',
    achievements: project.achievements || '',
    repositoryUrl: project.repositoryUrl || '',
    demoUrl: project.demoUrl || '',
    documentationUrl: project.documentationUrl || '',
    isPublic: project.isPublic,
  });

  const [techInput, setTechInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        category: project.category,
        status: project.status,
        maxTeamSize: project.maxTeamSize,
        technologies: project.technologies || [],
        tags: project.tags || [],
        goals: project.goals || '',
        challenges: project.challenges || '',
        achievements: project.achievements || '',
        repositoryUrl: project.repositoryUrl || '',
        demoUrl: project.demoUrl || '',
        documentationUrl: project.documentationUrl || '',
        isPublic: project.isPublic,
      });
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Edit className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">ویرایش پروژه</DialogTitle>
              <DialogDescription>اطلاعات پروژه را بروزرسانی کنید</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">اطلاعات پایه</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">عنوان *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">توضیحات *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">دسته‌بندی</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value as ProjectCategory })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">وضعیت</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as ProjectStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxTeamSize">حداکثر اعضای تیم</Label>
              <Input
                id="maxTeamSize"
                type="number"
                min="1"
                max="20"
                value={formData.maxTeamSize}
                onChange={(e) =>
                  setFormData({ ...formData, maxTeamSize: parseInt(e.target.value) })
                }
              />
            </div>
          </div>

          {/* Technologies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">تکنولوژی‌ها</h3>
            <div className="flex gap-2">
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                placeholder="افزودن تکنولوژی"
              />
              <Button type="button" onClick={addTechnology} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.technologies && formData.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => removeTechnology(tech)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">برچسب‌ها</h3>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="افزودن برچسب"
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    #{tag}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">جزئیات</h3>
            
            <div className="space-y-2">
              <Label htmlFor="goals">اهداف</Label>
              <Textarea
                id="goals"
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="challenges">چالش‌ها</Label>
              <Textarea
                id="challenges"
                value={formData.challenges}
                onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="achievements">دستاوردها</Label>
              <Textarea
                id="achievements"
                value={formData.achievements}
                onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">لینک‌ها</h3>
            
            <div className="space-y-2">
              <Label htmlFor="repositoryUrl">مخزن کد</Label>
              <Input
                id="repositoryUrl"
                type="url"
                value={formData.repositoryUrl}
                onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
                placeholder="https://github.com/..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demoUrl">دمو</Label>
              <Input
                id="demoUrl"
                type="url"
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                placeholder="https://demo.example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentationUrl">مستندات</Label>
              <Input
                id="documentationUrl"
                type="url"
                value={formData.documentationUrl}
                onChange={(e) =>
                  setFormData({ ...formData, documentationUrl: e.target.value })
                }
                placeholder="https://docs.example.com"
              />
            </div>
          </div>

          {/* Public/Private */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <Label htmlFor="isPublic" className="cursor-pointer">
              پروژه عمومی (قابل مشاهده برای همه)
            </Label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-cyan-500"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  در حال بروزرسانی...
                </>
              ) : (
                'بروزرسانی پروژه'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
