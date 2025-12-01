import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Edit, CheckCircle2 } from 'lucide-react';
import {
  Milestone,
  getMilestoneStatusLabel,
  getMilestoneStatusColor,
  formatProjectDate,
} from '@/types/project';

interface MilestoneItemProps {
  milestone: Milestone;
  canEdit: boolean;
  onEdit?: (milestone: Milestone) => void;
  onStatusChange?: (milestoneId: string, newStatus: string) => void;
}

const statusColorClasses = {
  gray: 'bg-gray-100 text-gray-800 border-gray-200',
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  green: 'bg-green-100 text-green-800 border-green-200',
  red: 'bg-red-100 text-red-800 border-red-200',
};

export default function MilestoneItem({
  milestone,
  canEdit,
  onEdit,
  onStatusChange,
}: MilestoneItemProps) {
  const statusColor = getMilestoneStatusColor(milestone.status);
  const isCompleted = milestone.status === 'completed';

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title & Status */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h4 className="font-semibold text-gray-900 truncate">{milestone.title}</h4>
            <Badge
              className={
                statusColorClasses[statusColor as keyof typeof statusColorClasses]
              }
            >
              {getMilestoneStatusLabel(milestone.status)}
            </Badge>
          </div>

          {/* Description */}
          {milestone.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {milestone.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatProjectDate(milestone.dueDate)}
            </span>
            {milestone.assignedTo && milestone.assignedTo.length > 0 && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {milestone.assignedTo.length} نفر
              </span>
            )}
            {milestone.completedAt && (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="h-3 w-3" />
                {formatProjectDate(milestone.completedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        {canEdit && (
          <div className="flex items-center gap-2">
            {!isCompleted && onStatusChange && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange(milestone._id!, 'completed')}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(milestone)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
