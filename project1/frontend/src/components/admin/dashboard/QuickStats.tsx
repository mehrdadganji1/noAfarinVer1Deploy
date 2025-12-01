import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Users, FolderKanban, Award } from 'lucide-react'
import { AdminStats } from '@/hooks/useAdminStats'

interface QuickStatsProps {
    stats: AdminStats | undefined
}

export default function QuickStats({ stats }: QuickStatsProps) {
    const quickStats = [
        {
            icon: Calendar,
            label: 'رویدادهای آینده',
            value: stats?.events.upcoming || 0,
            total: stats?.events.total || 0,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            icon: Users,
            label: 'تیم‌های فعال',
            value: stats?.teams.active || 0,
            total: stats?.teams.total || 0,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            icon: FolderKanban,
            label: 'پروژه‌های فعال',
            value: stats?.projects.active || 0,
            total: stats?.projects.total || 0,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
        {
            icon: Award,
            label: 'میانگین حضور',
            value: stats?.events.avgAttendance || 0,
            suffix: 'نفر',
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
                <Card key={index} className="border-2 hover:shadow-lg transition-all duration-300">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stat.value}
                                    {stat.suffix && <span className="text-sm font-normal text-gray-600 mr-1">{stat.suffix}</span>}
                                </p>
                                {stat.total !== undefined && (
                                    <p className="text-xs text-gray-500">از {stat.total}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
