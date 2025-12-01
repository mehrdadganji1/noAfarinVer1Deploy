import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EducationCard from './EducationCard';
import AddEducationModal from './AddEducationModal';
import type { Education } from '@/types/profile';

interface EducationSectionProps {
  educationHistory: Education[];
  isOwnProfile: boolean;
  onAdd: (education: Education) => Promise<void>;
  onEdit: (id: string, education: Education) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function EducationSection({
  educationHistory,
  isOwnProfile,
  onAdd,
  onEdit,
  onDelete
}: EducationSectionProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);

  const handleEdit = (education: Education) => {
    setEditingEducation(education);
    setShowAddModal(true);
  };

  const handleSubmit = async (education: Education) => {
    if (editingEducation && editingEducation._id) {
      await onEdit(editingEducation._id, education);
    } else {
      await onAdd(education);
    }
    setEditingEducation(null);
  };

  const handleModalClose = (open: boolean) => {
    setShowAddModal(open);
    if (!open) {
      setEditingEducation(null);
    }
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            سوابق تحصیلی
          </h3>
          {isOwnProfile && (
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <Plus className="w-4 h-4" />
              افزودن
            </Button>
          )}
        </div>

        {educationHistory && educationHistory.length > 0 ? (
          <div className="space-y-4">
            {educationHistory.map((edu, index) => (
              <motion.div
                key={edu._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <EducationCard
                  education={edu}
                  onEdit={handleEdit}
                  onDelete={onDelete}
                  isOwnProfile={isOwnProfile}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-gray-50 rounded-xl"
          >
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {isOwnProfile
                ? 'هنوز سابقه تحصیلی اضافه نکرده‌اید'
                : 'سابقه تحصیلی ثبت نشده است'}
            </p>
            {isOwnProfile && (
              <Button onClick={() => setShowAddModal(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                افزودن اولین سابقه تحصیلی
              </Button>
            )}
          </motion.div>
        )}
      </div>

      <AddEducationModal
        open={showAddModal}
        onOpenChange={handleModalClose}
        onSubmit={handleSubmit}
        initialData={editingEducation || undefined}
      />
    </>
  );
}
