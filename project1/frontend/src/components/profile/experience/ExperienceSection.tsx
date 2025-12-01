import { useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ExperienceCard from './ExperienceCard'
// @ts-ignore - IDE cache issue, file exists
import AddExperienceModal from './AddExperienceModal'
import type { WorkExperience } from '@/types/profile'

interface ExperienceSectionProps {
  experiences: WorkExperience[]
  onAdd: (experience: WorkExperience) => Promise<void>
  onUpdate: (expId: string, experience: WorkExperience) => Promise<void>
  onDelete: (expId: string) => Promise<void>
  isOwnProfile?: boolean
}

export default function ExperienceSection({
  experiences,
  onAdd,
  onUpdate,
  onDelete,
  isOwnProfile = false
}: ExperienceSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
            سوابق شغلی
          </h3>
          {isOwnProfile && (
            <Button
              onClick={() => setIsModalOpen(true)}
              size="sm"
              className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <Plus className="w-4 h-4" />
              افزودن
            </Button>
          )}
        </div>

        {experiences && experiences.length > 0 ? (
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ExperienceCard
                  experience={exp}
                  onEdit={isOwnProfile ? (updated) => onUpdate(exp._id!, updated) : undefined}
                  onDelete={isOwnProfile ? () => onDelete(exp._id!) : undefined}
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
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {isOwnProfile ? 'هنوز سابقه شغلی اضافه نکرده‌اید' : 'سابقه شغلی ثبت نشده'}
            </p>
            {isOwnProfile && (
              <Button
                onClick={() => setIsModalOpen(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                افزودن اولین سابقه شغلی
              </Button>
            )}
          </motion.div>
        )}
      </div>

      <AddExperienceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onAdd}
      />
    </>
  )
}
