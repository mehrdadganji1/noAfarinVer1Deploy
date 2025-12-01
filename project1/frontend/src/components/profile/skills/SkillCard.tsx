import { useState } from 'react'
import { Zap, Edit2, Trash2, ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSkillLevelLabel, getSkillLevelColor, type Skill } from '@/types/profile'
// @ts-ignore - IDE cache issue, file exists
import AddSkillModal from './AddSkillModal'

interface SkillCardProps {
  skill: Skill
  onEdit?: (skill: Skill) => Promise<void>
  onDelete?: () => Promise<void>
}

export default function SkillCard({ skill, onEdit, onDelete }: SkillCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const levelColor = getSkillLevelColor(skill.level)
  const levelLabel = getSkillLevelLabel(skill.level)

  const handleDelete = async () => {
    if (!onDelete) return
    setIsDeleting(true)
    try {
      await onDelete()
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = async (updated: Skill) => {
    if (!onEdit) return
    await onEdit(updated)
    setIsEditModalOpen(false)
  }

  return (
    <>
      <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className={`w-10 h-10 bg-${levelColor}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Zap className={`w-5 h-5 text-${levelColor}-600`} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800">{skill.name}</h3>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-${levelColor}-100 text-${levelColor}-700 mt-1`}>
                {levelLabel}
              </span>
              
              {skill.endorsements > 0 && (
                <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{skill.endorsements} تایید</span>
                </div>
              )}
            </div>
          </div>

          {(onEdit || onDelete) && (
            <div className="flex items-center gap-2 mr-2">
              {onEdit && (
                <Button
                  onClick={() => setIsEditModalOpen(true)}
                  size="sm"
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {onEdit && (
        <AddSkillModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEdit}
          initialData={skill}
        />
      )}
    </>
  )
}
