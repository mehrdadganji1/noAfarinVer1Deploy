import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Milestone, MilestoneStatus } from '@/types/project';

interface MilestoneFormData {
  title: string;
  description: string;
  dueDate: string;
  status: MilestoneStatus;
}

interface MilestoneFormProps {
  milestone?: Milestone;
  onSubmit: (data: MilestoneFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const statusOptions = [
  { value: MilestoneStatus.PENDING, label: 'در انتظار' },
  { value: MilestoneStatus.IN_PROGRESS, label: 'در حال انجام' },
  { value: MilestoneStatus.COMPLETED, label: 'تکمیل شده' },
  { value: MilestoneStatus.CANCELLED, label: 'لغو شده' },
];

export default function MilestoneForm({
  milestone,
  onSubmit,
  onCancel,
  isLoading,
}: MilestoneFormProps) {
  const [formData, setFormData] = useState<MilestoneFormData>({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    status: MilestoneStatus.PENDING,
  });

  useEffect(() => {
    if (milestone) {
      setFormData({
        title: milestone.title,
        description: milestone.description || '',
        dueDate:
          typeof milestone.dueDate === 'string'
            ? milestone.dueDate.split('T')[0]
            : new Date(milestone.dueDate).toISOString().split('T')[0],
        status: milestone.status,
      });
    }
  }, [milestone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit(formData);
  };

  const isValid = formData.title.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">عنوان مایلستون *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="مثال: طراحی رابط کاربری"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">توضیحات</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="توضیحات تکمیلی..."
          rows={3}
        />
      </div>

      {/* Due Date */}
      <div className="space-y-2">
        <Label htmlFor="dueDate">تاریخ سررسید *</Label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          required
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">وضعیت</Label>
        <Select
          value={formData.status}
          onValueChange={(value) =>
            setFormData({ ...formData, status: value as MilestoneStatus })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          انصراف
        </Button>
        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className="bg-gradient-to-r from-green-500 to-emerald-500"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              در حال ذخیره...
            </>
          ) : (
            <>{milestone ? 'بروزرسانی' : 'ایجاد مایلستون'}</>
          )}
        </Button>
      </div>
    </form>
  );
}
