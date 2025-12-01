import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

export default function UserGrowthChart() {
  // Mock data for demonstration
  const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور']
  const values = [45, 52, 61, 73, 89, 105]
  const maxValue = Math.max(...values)

  return (
    <Card className="border-2">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          رشد کاربران
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {months.map((month, index) => (
            <div key={month} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{month}</span>
                <span className="font-bold text-gray-900">{values[index]} کاربر</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(values[index] / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">میانگین رشد ماهانه</span>
            <span className="text-lg font-bold text-blue-600">+15.3%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
