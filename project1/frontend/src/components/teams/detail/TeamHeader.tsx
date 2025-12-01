import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Trash2, Users, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface TeamHeaderProps {
  team: any
  canEdit: boolean
  onEdit: () => void
  onDelete: () => void
}

export default function TeamHeader({ team, canEdit, onEdit, onDelete }: TeamHeaderProps) {
  const navigate = useNavigate()
  const currentPath = window.location.pathname
  const basePath = currentPath.includes('/director/') ? '/director' : '/admin'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'draft': return 'bg-gray-100 text-gray-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'فعال'
      case 'draft': return 'پیش‌نویس'
      case 'completed': return 'تکمیل شده'
      default: return status
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white shadow-lg mb-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{team?.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(team?.status)}`}>
                {getStatusLabel(team?.status)}
              </span>
              <span className="text-xs text-white/80">
                {team?.members?.length || 0} عضو
              </span>
              {team?.score && (
                <span className="text-xs text-white/80 flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {team.score}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="text-white hover:bg-white/20"
              >
                <Edit className="h-4 w-4 ml-1" />
                ویرایش
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-white hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4 ml-1" />
                حذف
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`${basePath}/teams`)}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 ml-1" />
            بازگشت
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
