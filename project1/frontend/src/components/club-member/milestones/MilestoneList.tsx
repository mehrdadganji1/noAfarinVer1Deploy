import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Target } from 'lucide-react';
import { Milestone } from '@/types/project';
import MilestoneItem from './MilestoneItem';
import MilestoneProgress from './MilestoneProgress';
import MilestoneFormModal from './MilestoneFormModal';

interface MilestoneListProps {
  milestones: Milestone[];
  canEdit: boolean;
  onAdd?: (data: any) => void;
  onEdit?: (milestoneId: string, data: any) => void;
  onStatusChange?: (milestoneId: string, newStatus: string) => void;
  isLoading?: boolean;
}

export default function MilestoneList({
  milestones,
  canEdit,
  onAdd,
  onEdit,
  onStatusChange,
  isLoading,
}: MilestoneListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | undefined>();

  const handleOpenModal = (milestone?: Milestone) => {
    setEditingMilestone(milestone);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMilestone(undefined);
  };

  const handleSubmit = (data: any) => {
    if (editingMilestone && onEdit) {
      onEdit(editingMilestone._id!, data);
    } else if (onAdd) {
      onAdd(data);
    }
    handleCloseModal();
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            مایلستون‌ها ({milestones.length})
          </h3>
          {canEdit && onAdd && (
            <Button
              size="sm"
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <Plus className="h-4 w-4 ml-2" />
              مایلستون جدید
            </Button>
          )}
        </div>

        {/* Progress */}
        {milestones.length > 0 && (
          <div className="mb-6">
            <MilestoneProgress milestones={milestones} />
          </div>
        )}

        {/* List */}
        {milestones.length > 0 ? (
          <div className="space-y-3">
            {milestones.map((milestone) => (
              <MilestoneItem
                key={milestone._id}
                milestone={milestone}
                canEdit={canEdit}
                onEdit={canEdit && onEdit ? handleOpenModal : undefined}
                onStatusChange={canEdit ? onStatusChange : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">هنوز مایلستونی ایجاد نشده است</p>
            {canEdit && onAdd && (
              <Button
                variant="outline"
                onClick={() => handleOpenModal()}
                className="mx-auto"
              >
                <Plus className="h-4 w-4 ml-2" />
                ایجاد اولین مایلستون
              </Button>
            )}
          </div>
        )}

        {/* Modal */}
        {canEdit && (onAdd || onEdit) && (
          <MilestoneFormModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            milestone={editingMilestone}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </CardContent>
    </Card>
  );
}
