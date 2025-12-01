import { motion } from 'framer-motion'
import { Shield, Users, ClipboardCheck, TrendingUp, Settings, BarChart3, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PendingAACOWidget } from '@/components/admin/dashboard/PendingAACOWidget'

export default function AdminDashboard() {
  const navigate = useNavigate()

  const quickActions = [
    {
      title: 'مدیریت کاربران',
      description: 'مشاهده و مدیریت تمام کاربران سیستم',
      icon: Users,
      path: '/admin/users',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'درخواست‌های عضویت',
      description: 'بررسی و تایید درخواست‌های عضویت',
      icon: ClipboardCheck,
      path: '/admin/applications',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'درخواست‌های AACO',
      description: 'بررسی درخواست‌های پیش ثبت‌نام',
      icon: FileText,
      path: '/admin/aaco-applications',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      title: 'آمار و تحلیل',
      description: 'مشاهده آمار و گزارشات سیستم',
      icon: BarChart3,
      path: '/admin/analytics',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'رویدادها',
      description: 'مدیریت رویدادها و دوره‌های آموزشی',
      icon: TrendingUp,
      path: '/admin/events',
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'تنظیمات سیستم',
      description: 'پیکربندی و تنظیمات کلی سیستم',
      icon: Settings,
      path: '/admin/settings',
      color: 'from-violet-500 to-purple-500',
    },
  ]

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 mb-3"
              >
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Shield className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold">داشبورد مدیر سیستم</h1>
                  <p className="text-white/90 text-xl mt-2">
                    مدیریت کامل سیستم و دسترسی به تمام بخش‌ها
                  </p>
                </div>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/80 text-base max-w-3xl"
              >
                به پنل مدیریت سیستم خوش آمدید. از اینجا می‌توانید تمام جنبه‌های سیستم را مدیریت کنید.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 px-5 py-3 bg-white/20 backdrop-blur-sm rounded-full">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-semibold">مدیر سیستم</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-3 bg-green-500/30 backdrop-blur-sm rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-semibold">دسترسی کامل فعال</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* AACO Applications Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PendingAACOWidget />
        </div>
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-xl h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                خلاصه وضعیت سیستم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                از این بخش می‌توانید به سرعت به بخش‌های مختلف سیستم دسترسی پیدا کنید و وضعیت کلی را مشاهده نمایید.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.div
              key={action.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card 
                className="border-0 shadow-xl hover:shadow-2xl transition-all cursor-pointer group"
                onClick={() => navigate(action.path)}
              >
                <CardHeader className={`bg-gradient-to-br ${action.color} text-white`}>
                  <div className="flex items-center justify-between">
                    <Icon className="h-8 w-8" />
                    <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <CardTitle className="text-xl mb-2">{action.title}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {action.description}
                  </p>
                  <Button 
                    className="w-full mt-4"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(action.path)
                    }}
                  >
                    مشاهده
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* System Info */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <CardTitle>اطلاعات سیستم</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">نسخه سیستم</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">v1.0.0</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">وضعیت سرویس‌ها</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">فعال</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">سطح دسترسی</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">ADMIN</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
