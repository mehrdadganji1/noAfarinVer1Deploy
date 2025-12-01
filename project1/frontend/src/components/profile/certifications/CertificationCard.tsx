import { motion } from 'framer-motion'
import { Award, Calendar, ExternalLink, Edit2, Trash2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toPersianDate } from '@/utils/dateUtils'

interface Certification {
  _id?: string
  name: string
  issuer: string
  date: string
  expiryDate?: string
  credentialId?: string
  url?: string
}

interface CertificationCardProps {
  certification: Certification
  onEdit?: () => void
  onDelete?: () => void
}

export default function CertificationCard({ certification, onEdit, onDelete }: CertificationCardProps) {
  const isExpired = certification.expiryDate && new Date(certification.expiryDate) < new Date()
  const isExpiringSoon = certification.expiryDate && 
    new Date(certification.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) &&
    !isExpired

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-100"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">{certification.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{certification.issuer}</p>
              </div>
              {isExpired && (
                <Badge className="bg-red-100 text-red-700 border-red-200">
                  منقضی شده
                </Badge>
              )}
              {isExpiringSoon && (
                <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                  نزدیک به انقضا
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>صادر شده: {toPersianDate(certification.date, 'short')}</span>
              </div>
              {certification.expiryDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>انقضا: {toPersianDate(certification.expiryDate, 'short')}</span>
                </div>
              )}
            </div>

            {certification.credentialId && (
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                <Shield className="w-3 h-3" />
                <span>شناسه: {certification.credentialId}</span>
              </div>
            )}

            {certification.url && (
              <a
                href={certification.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-sm text-purple-600 hover:text-purple-700"
              >
                <ExternalLink className="w-4 h-4" />
                مشاهده گواهینامه
              </a>
            )}
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-1">
            {onEdit && (
              <Button
                onClick={onEdit}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                onClick={onDelete}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
