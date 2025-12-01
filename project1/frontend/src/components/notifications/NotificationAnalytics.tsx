import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { 
  TrendingUp, 
  Eye, 
  Clock, 
  CheckCircle,
  Bell,
  Activity
} from 'lucide-react'
import api from '@/lib/api'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

interface NotificationStats {
  total: number
  read: number
  unread: number
  readRate: number
  avgResponseTime: number
  byType: { type: string; count: number }[]
  byDate: { date: string; count: number }[]
  byPriority: { priority: string; count: number }[]
}

export default function NotificationAnalytics() {
  const { data: stats, isLoading } = useQuery<NotificationStats>({
    queryKey: ['notification-analytics'],
    queryFn: async () => {
      const response = await api.get('/notifications/analytics')
      return response.data.data
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگذاری آمار...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">آماری برای نمایش وجود ندارد</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">کل اعلانات</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              تمام زمان‌ها
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">نرخ خواندن</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.readRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.read} از {stats.total} خوانده شده
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">میانگین زمان پاسخ</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.avgResponseTime.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              دقیقه
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">خوانده نشده</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.unread}</div>
            <p className="text-xs text-muted-foreground mt-1">
              نیاز به بررسی
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              روند اعلانات در طول زمان
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.byDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getMonth() + 1}/${date.getDate()}`
                  }}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString('fa-IR')
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="تعداد اعلانات"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Notifications by Type */}
        <Card>
          <CardHeader>
            <CardTitle>توزیع بر اساس نوع</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.byType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.type}: ${entry.count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.byType.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Notifications by Priority */}
        <Card>
          <CardHeader>
            <CardTitle>توزیع بر اساس اولویت</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.byPriority}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="priority" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8b5cf6" name="تعداد" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Read vs Unread */}
        <Card>
          <CardHeader>
            <CardTitle>وضعیت خواندن</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'خوانده شده', value: stats.read },
                    { name: 'خوانده نشده', value: stats.unread },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            تحلیل و بینش
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.readRate < 50 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  ⚠️ نرخ خواندن اعلانات شما کمتر از 50% است. توصیه می‌شود اعلانات خود را بیشتر بررسی کنید.
                </p>
              </div>
            )}

            {stats.readRate >= 50 && stats.readRate < 80 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  💡 نرخ خواندن اعلانات شما خوب است اما می‌توانید آن را بهبود دهید.
                </p>
              </div>
            )}

            {stats.readRate >= 80 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✅ عالی! شما به اعلانات خود به خوبی رسیدگی می‌کنید.
                </p>
              </div>
            )}

            {stats.avgResponseTime > 60 && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  ⏰ میانگین زمان پاسخ شما بیش از یک ساعت است. سعی کنید سریع‌تر به اعلانات پاسخ دهید.
                </p>
              </div>
            )}

            {stats.unread > 10 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  📬 شما {stats.unread} اعلان خوانده نشده دارید. وقت آن رسیده که آنها را بررسی کنید!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
