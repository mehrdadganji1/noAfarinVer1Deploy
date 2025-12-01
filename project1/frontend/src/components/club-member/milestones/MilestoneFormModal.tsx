import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Target } from 'lucide-react';
import { Milestone } from '@/types/project';
import MilestoneForm from './MilestoneForm';

interface MilestoneFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestone?: Milestone;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export default function MilestoneFormModal({
  open,
  onOpenChange,
  milestone,
  onSubmit,
  isLoading,
}: MilestoneFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">
                {milestone ? 'ویرایش مایلستون' : 'مایلستون جدید'}
              </DialogTitle>
              <DialogDescription>
                {milestone
                  ? 'اطلاعات مایلستون را ویرایش کنید'
                  : 'یک مایلستون جدید برای پروژه ایجاد کنید'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <MilestoneForm
          milestone={milestone}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
