import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FileText, Clock, ArrowLeft, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'

interface PendingStats {
  total: number
  submitted: number
  underReview: number
}

export function PendingAACOWidget() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<PendingStats>({ total: 0, submitted: 0, underReview: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/aaco-applications?limit=1000')
        const applications = response.data.applications || []
        
        const submitted = applications.filter((app: any) => app.status === 'submitted').length
        const underReview = applications.filter((app: any) => app.status === 'under-review').length
        
        setStats({
          total: applications.length,
          submitted,
          underReview,
        })
      } catch (error) {
        console.error('Error fetching AACO stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const pendingCount = stats.submitted + stats.underReview

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 hover:shadow-2xl transition-all">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              درخواست‌های AACO
            </CardTitle>
            {pendingCount > 0 && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Badge className="bg-red-500 text-white">
                  {pendingCount} در انتظار
                </Badge>
              </motion.div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Users className="h-5 w-5 mx-auto mb-1 text-blue-500" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-xs text-gray-500">کل</p>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <FileText className="h-5 w-5 mx-auto mb-1 text-indigo-500" />
              <p className="text-2xl font-bold text-indigo-600">{stats.submitted}</p>
              <p className="text-xs text-gray-500">ارسال شده</p>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Clock className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
              <p className="text-2xl font-bold text-yellow-600">{stats.underReview}</p>
              <p className="text-xs text-gray-500">در حال بررسی</p>
            </div>
          </div>

          <Button
            onClick={() => navigate('/admin/aaco-applications')}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            مدیریت درخواست‌ها
            <ArrowLeft className="h-4 w-4 mr-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
