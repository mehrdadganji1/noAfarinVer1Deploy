import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Clock, ArrowLeft, UserPlus, FileCheck, Calendar, Award, Users, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChartCard, ActivityItem } from '../base'
import { ANIMATION_VARIANTS } from '../constants'

interface Activity {
  id: string
  type: 'user_registered' | 'application_approved' | 'event_created' | 'team_created' | 'settings_changed'
  title: string
  description: string
  time: string
  metadata?: Record<string, any>
}

interface ActivityFeedProps {
  activities?: Activity[]
  loading?: boolean
  delay?: number
}

const activityConfig = {
  user_registered: {
    icon: UserPlus,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  application_approved: {
    icon: FileCheck,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  event_created: {
    icon: Calendar,
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  team_created: {
    icon: Award,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  settings_changed: {
    icon: Settings,
    iconBg: 'bg-gray-100 dark:bg-gray-700',
    iconColor: 'text-gray-600 dark:text-gray-400',
  },
}

// Mock data for demonstration
const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'user_registered',
    title: 'کاربر جدید ثبت‌نام کرد',
    description: 'محمد رضایی به عنوان متقاضی ثبت‌نام کرد',
    time: '5 دقیقه پیش',
  },
  {
    id: '2',
    type: 'application_approved',
    title: 'درخواست تایید شد',
    description: 'درخواست عضویت سارا احمدی تایید شد',
    time: '15 دقیقه پیش',
  },
  {
    id: '3',
    type: 'event_created',
    title: 'رویداد جدید ایجاد شد',
    description: 'کارگاه آموزشی React برنامه‌ریزی شد',
    time: '1 ساعت پیش',
  },
  {
    id: '4',
    type: 'team_created',
    title: 'تیم جدید ثبت شد',
    description: 'تیم "نوآوران فناوری" ایجاد شد',
    time: '2 ساعت پیش',
  },
]

export function ActivityFeed({ 
  activities = mockActivities, 
  loading = false,
  delay = 0 
}: ActivityFeedProps) {
  const navigate = useNavigate()

  const headerAction = (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={() => navigate('/admin/activity-log')}
      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
    >
      مشاهده همه
      <ArrowLeft className="mr-2 h-4 w-4" />
    </Button>
  )

  return (
    <ChartCard
      title="فعالیت‌های اخیر"
      subtitle="آخرین تغییرات سیستم"
      icon={Clock}
      iconColor="text-gray-600 dark:text-gray-400"
      loading={loading}
      delay={delay}
      actions={[
        { label: 'مشاهده همه', onClick: () => navigate('/admin/activity-log') },
        { label: 'تنظیمات اعلان‌ها', onClick: () => navigate('/admin/settings') },
      ]}
      contentClassName="p-4"
    >
      <motion.div
        variants={ANIMATION_VARIANTS.stagger}
        initial="initial"
        animate="animate"
        className="space-y-3"
      >
        {activities.map((activity, index) => {
          const config = activityConfig[activity.type]
          return (
            <ActivityItem
              key={activity.id}
              icon={config.icon}
              iconBg={config.iconBg}
              iconColor={config.iconColor}
              title={activity.title}
              description={activity.description}
              time={activity.time}
              delay={delay + 0.1 + index * 0.05}
            />
          )
        })}
      </motion.div>

      {/* View All Button */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('/admin/activity-log')}
        >
          مشاهده تمام فعالیت‌ها
          <ArrowLeft className="mr-2 h-4 w-4" />
        </Button>
      </div>
    </ChartCard>
  )
}

export default ActivityFeed
