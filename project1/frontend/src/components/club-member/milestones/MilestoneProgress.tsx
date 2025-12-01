import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Milestone } from '@/types/project';

interface MilestoneProgressProps {
  milestones: Milestone[];
}

export default function MilestoneProgress({ milestones }: MilestoneProgressProps) {
  const total = milestones.length;
  const completed = milestones.filter((m) => m.status === 'completed').length;
  const inProgress = milestones.filter((m) => m.status === 'in_progress').length;
  const pending = milestones.filter((m) => m.status === 'pending').length;
  const cancelled = milestones.filter((m) => m.status === 'cancelled').length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">پیشرفت کلی</span>
          <span className="text-sm font-bold text-green-600">{completionRate}%</span>
        </div>
        <Progress value={completionRate} className="h-2" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <div>
            <p className="text-xs text-gray-600">تکمیل شده</p>
            <p className="text-lg font-bold text-green-600">{completed}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <Clock className="h-4 w-4 text-blue-600" />
          <div>
            <p className="text-xs text-gray-600">در حال انجام</p>
            <p className="text-lg font-bold text-blue-600">{inProgress}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Clock className="h-4 w-4 text-gray-600" />
          <div>
            <p className="text-xs text-gray-600">در انتظار</p>
            <p className="text-lg font-bold text-gray-600">{pending}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
          <XCircle className="h-4 w-4 text-red-600" />
          <div>
            <p className="text-xs text-gray-600">لغو شده</p>
            <p className="text-lg font-bold text-red-600">{cancelled}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
