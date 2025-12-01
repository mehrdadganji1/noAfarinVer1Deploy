import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CertificationCard from './CertificationCard.tsx'
import AddCertificationModal from './AddCertificationModal.tsx'

interface Certification {
  _id?: string
  name: string
  issuer: string
  date: string
  expiryDate?: string
  credentialId?: string
  url?: string
}

interface CertificationsSectionProps {
  certifications: Certification[]
  onAdd: (cert: Certification) => Promise<void>
  onEdit: (certId: string, cert: Certification) => Promise<void>
  onDelete: (certId: string) => Promise<void>
  isOwnProfile: boolean
}

export default function CertificationsSection({
  certifications,
  onAdd,
  onEdit,
  onDelete,
  isOwnProfile
}: CertificationsSectionProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingCert, setEditingCert] = useState<Certification | null>(null)

  const handleAdd = async (cert: Certification) => {
    await onAdd(cert)
    setIsAddModalOpen(false)
  }

  const handleEdit = async (cert: Certification) => {
    if (editingCert?._id) {
      await onEdit(editingCert._id, cert)
      setEditingCert(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-600" />
          گواهینامه‌ها و مدارک
        </h3>
        {isOwnProfile && (
          <Button
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
            className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600"
          >
            <Plus className="w-4 h-4" />
            افزودن گواهینامه
          </Button>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {certifications.length > 0 ? (
          <div className="space-y-3">
            {certifications.map((cert) => (
              <CertificationCard
                key={cert._id}
                certification={cert}
                onEdit={isOwnProfile ? () => setEditingCert(cert) : undefined}
                onDelete={isOwnProfile ? () => onDelete(cert._id!) : undefined}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-gray-50 rounded-xl"
          >
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {isOwnProfile ? 'هنوز گواهینامه‌ای اضافه نکرده‌اید' : 'گواهینامه‌ای ثبت نشده است'}
            </p>
            {isOwnProfile && (
              <Button
                onClick={() => setIsAddModalOpen(true)}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                <Plus className="w-4 h-4 ml-2" />
                افزودن اولین گواهینامه
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AddCertificationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAdd}
      />

      <AddCertificationModal
        isOpen={!!editingCert}
        onClose={() => setEditingCert(null)}
        onSubmit={handleEdit}
        initialData={editingCert || undefined}
        isEdit
      />
    </div>
  )
}
