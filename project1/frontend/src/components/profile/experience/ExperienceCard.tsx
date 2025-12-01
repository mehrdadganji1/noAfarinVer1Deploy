import { useState } from 'react'
import { Briefcase, MapPin, Calendar, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toPersianDate } from '@/utils/dateUtils'
import AddExperienceModal from './AddExperienceModal'
import type { WorkExperience } from '@/types/profile'

interface ExperienceCardProps {
  experience: WorkExperience
  onEdit?: (experience: WorkExperience) => Promise<void>
  onDelete?: () => Promise<void>
}

export default function ExperienceCard({ experience, onEdit, onDelete }: ExperienceCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const formatDate = (date: string) => {
    return toPersianDate(date, 'short')
  }

  const handleDelete = async () => {
    if (!onDelete) return
    setIsDeleting(true)
    try {
      await onDelete()
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = async (updated: WorkExperience) => {
    if (!onEdit) return
    await onEdit(updated)
    setIsEditModalOpen(false)
  }

  return (
    <>
      <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800">{experience.position}</h3>
              <p className="text-purple-600 font-medium">{experience.company}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(experience.startDate)} - {' '}
                    {experience.current ? 'اکنون' : formatDate(experience.endDate!)}
                  </span>
                </div>
                {experience.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{experience.location}</span>
                  </div>
                )}
              </div>

              {experience.description && (
                <p className="mt-3 text-gray-700 leading-relaxed whitespace-pre-line">
                  {experience.description}
                </p>
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
        <AddExperienceModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEdit}
          initialData={experience}
        />
      )}
    </>
  )
}
