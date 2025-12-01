import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Users, Calendar, Target, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Team {
  _id: string
  name: string
  ideaTitle: string
  members?: any[]
  status: string
  phase: string
  createdAt?: string
}

interface TeamCardProps {
  team: Team
  delay?: number
}

export default function TeamCard({ team, delay = 0 }: TeamCardProps) {
  // Determine the correct base path based on current location
  const currentPath = window.location.pathname
  const basePath = currentPath.includes('/director/') ? '/director' : '/admin'
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200'
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case 'ideation': return 'ایده‌پردازی'
      case 'aaco_event': return 'رویداد AACO'
      case 'training': return 'توانمندسازی'
      case 'development': return 'توسعه'
      default: return phase
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Link to={`${basePath}/teams/${team._id}`}>
        <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full group overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <CardHeader className="relative z-10">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-1">
                  {team.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <Users className="h-3 w-3" />
                  <span>{team.members?.length || 0} عضو</span>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
          </CardHeader>

          <CardContent className="relative z-10">
            {/* Idea Title */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                <Target className="h-3 w-3" />
                <span>ایده تیم</span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2 font-medium">
                {team.ideaTitle || 'بدون عنوان'}
              </p>
            </div>

            {/* Status & Phase */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(team.status)}`}>
                {getStatusLabel(team.status)}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                {getPhaseLabel(team.phase)}
              </span>
            </div>

            {/* Date */}
            {team.createdAt && (
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-3 pt-3 border-t">
                <Calendar className="h-3 w-3" />
                <span>{new Date(team.createdAt).toLocaleDateString('fa-IR')}</span>
              </div>
            )}
          </CardContent>

          {/* Bottom Accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </Card>
      </Link>
    </motion.div>
  )
}
