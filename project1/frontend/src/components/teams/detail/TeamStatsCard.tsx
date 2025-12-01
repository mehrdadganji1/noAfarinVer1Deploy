import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Calendar, GraduationCap, ClipboardCheck, Award } from 'lucide-react'

interface TeamStatsCardProps {
  stats: any
  team: any
}

export default function TeamStatsCard({ stats, team }: TeamStatsCardProps) {
  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case 'ideation': return 'ایده‌پردازی'
      case 'aaco_event': return 'رویداد AACO'
      case 'training': return 'توانمندسازی'
      case 'mvp_development': return 'توسعه MVP'
      case 'pitch_preparation': return 'آماده‌سازی پیچ'
      case 'final_presentation': return 'ارائه نهایی'
      case 'park_entry': return 'ورود به پارک'
      default: return phase
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-6"
    >
      {/* Phase & Status Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="text-lg">وضعیت تیم</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
            <span className="text-sm text-gray-600">مرحله:</span>
            <span className="text-sm font-bold text-purple-700">
              {getPhaseLabel(team?.phase)}
            </span>
          </div>
          {team?.score && (
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">امتیاز:</span>
              <span className="text-sm font-bold text-yellow-600 flex items-center gap-1">
                <Award className="h-4 w-4" />
                {team.score}
              </span>
            </div>
          )}
          {team?.ranking && (
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">رتبه:</span>
              <span className="text-sm font-bold text-blue-600">
                #{team.ranking}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Stats Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            آمار فعالیت
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Calendar className="h-5 w-5" />
                <span className="text-xs font-semibold">رویدادها</span>
              </div>
              <p className="text-3xl font-bold text-blue-700">{stats?.eventsCount || 0}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="border-2 border-purple-200 rounded-xl p-4 bg-purple-50 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <GraduationCap className="h-5 w-5" />
                <span className="text-xs font-semibold">دوره‌ها</span>
              </div>
              <p className="text-3xl font-bold text-purple-700">{stats?.trainingsCount || 0}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="border-2 border-green-200 rounded-xl p-4 bg-green-50 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <ClipboardCheck className="h-5 w-5" />
                <span className="text-xs font-semibold">ارزیابی‌ها</span>
              </div>
              <p className="text-3xl font-bold text-green-700">{stats?.evaluationsCount || 0}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="border-2 border-orange-200 rounded-xl p-4 bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 text-orange-600 mb-2">
                <Award className="h-5 w-5" />
                <span className="text-xs font-semibold">میانگین امتیاز</span>
              </div>
              <p className="text-3xl font-bold text-orange-700">
                {stats?.avgScore ? Math.round(stats.avgScore) : 0}
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
