import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, ArrowRight, UserPlus, FileCheck, Calendar, Award } from 'lucide-react'

export default function RecentActivity() {

  const activities = [
    {
      icon: UserPlus,
      title: 'کاربر جدید ثبت‌نام کرد',
      description: 'محمد رضایی به عنوان متقاضی ثبت‌نام کرد',
      time: '5 دقیقه پیش',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: FileCheck,
      title: 'درخواست تایید شد',
      description: 'درخواست عضویت سارا احمدی تایید شد',
      time: '15 دقیقه پیش',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: Calendar,
      title: 'رویداد جدید ایجاد شد',
      description: 'کارگاه آموزشی React برنامه‌ریزی شد',
      time: '1 ساعت پیش',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: Award,
      title: 'تیم جدید ثبت شد',
      description: 'تیم "نوآوران فناوری" ایجاد شد',
      time: '2 ساعت پیش',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <Card className="border-2">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-600" />
          فعالیت‌های اخیر
        </CardTitle>
        <Button variant="ghost" size="sm">
          مشاهده همه
          <ArrowRight className="mr-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-gray-100 hover:to-gray-50 cursor-pointer transition-all duration-300 border border-gray-200 hover:border-gray-300"
            >
              <div className={`p-3 ${activity.bgColor} rounded-xl`}>
                <activity.icon className={`h-5 w-5 ${activity.color}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{activity.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
