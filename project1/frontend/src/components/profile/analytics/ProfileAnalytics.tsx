import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Eye, TrendingUp, Award, Users,
  Calendar, BarChart3, Activity
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

interface ProfileAnalyticsProps {
  userId: string
  stats: {
    totalViews: number
    weeklyViews: number
    totalEndorsements: number
    totalConnections: number
    profileCompleteness: number
  }
  viewsHistory?: Array<{ date: string; views: number }>
  endorsementsHistory?: Array<{ date: string; count: number }>
}

const ProfileAnalytics = ({
  stats,
  viewsHistory = [],
  endorsementsHistory = []
}: ProfileAnalyticsProps) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')

  // داده‌های نمونه برای نمودارها
  const defaultViewsData = [
    { date: '1 هفته پیش', views: 12 },
    { date: '6 روز پیش', views: 19 },
    { date: '5 روز پیش', views: 15 },
    { date: '4 روز پیش', views: 25 },
    { date: '3 روز پیش', views: 22 },
    { date: '2 روز پیش', views: 30 },
    { date: 'دیروز', views: 28 },
    { date: 'امروز', views: 35 }
  ]

  const defaultEndorsementsData = [
    { date: '4 هفته پیش', count: 5 },
    { date: '3 هفته پیش', count: 8 },
    { date: '2 هفته پیش', count: 12 },
    { date: 'هفته گذشته', count: 15 }
  ]

  const skillsDistribution = [
    { name: 'فرانت‌اند', value: 35, color: '#3b82f6' },
    { name: 'بک‌اند', value: 25, color: '#10b981' },
    { name: 'DevOps', value: 20, color: '#f59e0b' },
    { name: 'دیزاین', value: 20, color: '#8b5cf6' }
  ]

  const viewsData = viewsHistory.length > 0 ? viewsHistory : defaultViewsData
  const endorsementsData = endorsementsHistory.length > 0 ? endorsementsHistory : defaultEndorsementsData

  const statCards = [
    {
      title: 'بازدید کل',
      value: stats.totalViews,
      change: '+12%',
      icon: Eye,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      changeColor: 'text-green-600'
    },
    {
      title: 'بازدید هفتگی',
      value: stats.weeklyViews,
      change: '+8%',
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      changeColor: 'text-green-600'
    },
    {
      title: 'تاییدیه‌ها',
      value: stats.totalEndorsements,
      change: '+15%',
      icon: Award,
      color: 'amber',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      changeColor: 'text-green-600'
    },
    {
      title: 'ارتباطات',
      value: stats.totalConnections,
      change: '+5%',
      icon: Users,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      changeColor: 'text-green-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-xl p-6 border-2 border-${stat.color}-100`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${stat.changeColor} mt-2 flex items-center gap-1`}>
                    <TrendingUp className="w-4 h-4" />
                    {stat.change} این ماه
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          آمار تفصیلی
        </h3>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range === 'week' ? 'هفته' : range === 'month' ? 'ماه' : 'سال'}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Views Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl p-6 border-2 border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">بازدید پروفایل</h4>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={viewsData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorViews)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Endorsements Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border-2 border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-600" />
            <h4 className="font-semibold text-gray-900">رشد تاییدیه‌ها</h4>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={endorsementsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skills Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border-2 border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-gray-900">توزیع مهارت‌ها</h4>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={skillsDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {skillsDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {skillsDistribution.map((skill) => (
              <div key={skill.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: skill.color }}
                />
                <span className="text-sm text-gray-600">
                  {skill.name} ({skill.value}%)
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">خلاصه فعالیت</h4>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">پروژه‌های فعال</span>
              <span className="text-lg font-bold text-blue-600">8</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">دوره‌های در حال گذراندن</span>
              <span className="text-lg font-bold text-green-600">3</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">دستاوردهای کسب شده</span>
              <span className="text-lg font-bold text-amber-600">12</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">مشارکت‌ها</span>
              <span className="text-lg font-bold text-purple-600">24</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Profile Strength Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">قدرت پروفایل</h4>
            <p className="text-sm text-gray-600">
              پروفایل شما {stats.profileCompleteness}% تکمیل شده است
            </p>
          </div>
          <div className="text-4xl font-bold text-green-600">
            {stats.profileCompleteness}%
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.profileCompleteness}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
          />
        </div>
        {stats.profileCompleteness < 100 && (
          <p className="text-sm text-gray-600 mt-3">
            💡 برای افزایش قدرت پروفایل، بخش‌های ناقص را تکمیل کنید
          </p>
        )}
      </motion.div>
    </div>
  )
}

export default ProfileAnalytics
