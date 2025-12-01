import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
    ArrowRight, Calendar, MapPin, Users, Clock, Edit, Trash2,
    Download, Share2, Mail, CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageSkeleton } from '@/components/ui/page-skeleton'
import api from '@/lib/api'

export default function DirectorEventDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<'details' | 'participants' | 'analytics'>('details')

    const { data: event, isLoading } = useQuery({
        queryKey: ['event', id],
        queryFn: async () => {
            const response = await api.get(`/events/${id}`)
            return response.data.data
        },
    })

    const deleteMutation = useMutation({
        mutationFn: async () => {
            await api.delete(`/events/${id}`)
        },
        onSuccess: () => {
            console.log('رویداد با موفقیت حذف شد')
            navigate('/director/events')
        },
    })

    if (isLoading) {
        return <PageSkeleton showHeader showStats statsCount={3} itemsCount={5} />
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">رویداد یافت نشد</h2>
                    <Button onClick={() => navigate('/director/events')}>بازگشت به لیست</Button>
                </div>
            </div>
        )
    }

    const attendanceRate = event.registered > 0
        ? Math.round((event.attendees?.length || 0) / event.registered * 100)
        : 0
    const capacityRate = Math.round((event.registered / event.capacity) * 100)

    return (
        <div className="h-[calc(100vh-4rem)] w-full max-w-full overflow-x-hidden overflow-y-auto p-3 flex flex-col gap-2" dir="rtl">
            {/* Compact Header with Stats */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-3 text-white shadow-lg flex-shrink-0"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/director/events')}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <ArrowRight className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold">{event.title}</h1>
                            <p className="text-white/80 text-sm">
                                {event.registered} شرکت‌کننده از {event.capacity} نفر
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="text-center px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                            <p className="text-xl font-bold">{capacityRate}%</p>
                            <p className="text-xs opacity-80">ظرفیت</p>
                        </div>
                        <div className="text-center px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                            <p className="text-xl font-bold text-green-300">{attendanceRate}%</p>
                            <p className="text-xs opacity-80">حضور</p>
                        </div>
                        <div className="text-center px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                            <p className="text-xl font-bold text-blue-300">{event.attendees?.length || 0}</p>
                            <p className="text-xs opacity-80">حاضر</p>
                        </div>
                        <Button
                            onClick={() => navigate(`/director/events/${id}/edit`)}
                            className="bg-white/20 hover:bg-white/30"
                            size="sm"
                        >
                            <Edit className="h-4 w-4 ml-2" />
                            ویرایش
                        </Button>
                        <Button
                            onClick={() => {
                                if (confirm('آیا از حذف این رویداد اطمینان دارید؟')) {
                                    deleteMutation.mutate()
                                }
                            }}
                            className="bg-red-500 hover:bg-red-600"
                            size="sm"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Tabs */}
            <Card className="border-0 shadow flex-shrink-0">
                <CardContent className="p-2">
                    <div className="flex gap-1">
                        <Button
                            onClick={() => setActiveTab('details')}
                            variant={activeTab === 'details' ? 'default' : 'ghost'}
                            size="sm"
                        >
                            جزئیات
                        </Button>
                        <Button
                            onClick={() => setActiveTab('participants')}
                            variant={activeTab === 'participants' ? 'default' : 'ghost'}
                            size="sm"
                        >
                            شرکت‌کنندگان ({event.registered})
                        </Button>
                        <Button
                            onClick={() => setActiveTab('analytics')}
                            variant={activeTab === 'analytics' ? 'default' : 'ghost'}
                            size="sm"
                        >
                            آمار و تحلیل
                        </Button>
                        <div className="flex-1" />
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                                try {
                                    await navigator.clipboard.writeText(window.location.href)
                                    alert('✅ لینک رویداد کپی شد!')
                                } catch (err) {
                                    alert('❌ خطا در کپی لینک')
                                }
                            }}
                        >
                            <Share2 className="h-4 w-4 ml-2" />
                            اشتراک
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                alert('📥 قابلیت دانلود به زودی اضافه می‌شود')
                            }}
                        >
                            <Download className="h-4 w-4 ml-2" />
                            خروجی
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-full">
                    {/* Main Content */}
                    <div className="lg:col-span-2 overflow-y-auto space-y-2">
                        {activeTab === 'details' && (
                            <>
                                <Card className="border-0 shadow">
                                    <CardContent className="p-4">
                                        <h2 className="text-lg font-bold mb-3">توضیحات</h2>
                                        <p className="text-gray-700 leading-relaxed text-sm">{event.description}</p>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow">
                                    <CardContent className="p-4">
                                        <h2 className="text-lg font-bold mb-3">اطلاعات رویداد</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <InfoItem
                                                icon={Calendar}
                                                label="تاریخ"
                                                value={new Date(event.date).toLocaleDateString('fa-IR')}
                                            />
                                            <InfoItem
                                                icon={Clock}
                                                label="ساعت"
                                                value={new Date(event.date).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                                            />
                                            <InfoItem
                                                icon={MapPin}
                                                label="مکان"
                                                value={event.location}
                                            />
                                            <InfoItem
                                                icon={Users}
                                                label="ظرفیت"
                                                value={`${event.registered} / ${event.capacity}`}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        {activeTab === 'participants' && (
                            <Card className="border-0 shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-lg font-bold">لیست شرکت‌کنندگان</h2>
                                        <Button size="sm" variant="outline">
                                            <Download className="h-4 w-4 ml-2" />
                                            خروجی Excel
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {event.registeredParticipants?.length > 0 ? (
                                            event.registeredParticipants.map((participant: any, index: number) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">شرکت‌کننده {index + 1}</p>
                                                            <p className="text-xs text-gray-600">ثبت‌نام شده</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {event.attendees?.includes(participant) && (
                                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
                                                                <CheckCircle className="h-3 w-3" />
                                                                حضور داشته
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                                                <p>هنوز کسی ثبت‌نام نکرده است</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'analytics' && (
                            <>
                                <Card className="border-0 shadow">
                                    <CardContent className="p-4">
                                        <h2 className="text-lg font-bold mb-3">آمار کلی</h2>
                                        <div className="grid grid-cols-2 gap-3">
                                            <StatBox label="ثبت‌نام" value={event.registered} color="blue" />
                                            <StatBox label="حضور" value={event.attendees?.length || 0} color="green" />
                                            <StatBox label="نرخ حضور" value={`${attendanceRate}%`} color="purple" />
                                            <StatBox label="ظرفیت باقی" value={event.capacity - event.registered} color="yellow" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow">
                                    <CardContent className="p-4">
                                        <h2 className="text-lg font-bold mb-3">نمودار پیشرفت</h2>
                                        <div className="space-y-3">
                                            <ProgressBar
                                                label="ثبت‌نام"
                                                value={event.registered}
                                                max={event.capacity}
                                                color="blue"
                                            />
                                            <ProgressBar
                                                label="حضور"
                                                value={event.attendees?.length || 0}
                                                max={event.registered || 1}
                                                color="green"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="overflow-y-auto space-y-2">
                        <Card className="border-0 shadow">
                            <CardContent className="p-4">
                                <h3 className="font-bold mb-3 text-sm">وضعیت رویداد</h3>
                                <div className="space-y-2">
                                    <StatusBadge status={event.status} />
                                    <TypeBadge type={event.type} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow">
                            <CardContent className="p-4">
                                <h3 className="font-bold mb-3 text-sm">اقدامات سریع</h3>
                                <div className="space-y-2">
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            alert('📧 قابلیت ارسال ایمیل به زودی اضافه می‌شود')
                                        }}
                                    >
                                        <Mail className="h-4 w-4 ml-2" />
                                        ارسال ایمیل
                                    </Button>
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            alert('📥 قابلیت دانلود گزارش به زودی اضافه می‌شود')
                                        }}
                                    >
                                        <Download className="h-4 w-4 ml-2" />
                                        دانلود گزارش
                                    </Button>
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        size="sm"
                                        onClick={async () => {
                                            try {
                                                await navigator.clipboard.writeText(window.location.href)
                                                alert('✅ لینک رویداد کپی شد!')
                                            } catch (err) {
                                                alert('❌ خطا در کپی لینک')
                                            }
                                        }}
                                    >
                                        <Share2 className="h-4 w-4 ml-2" />
                                        اشتراک‌گذاری
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow">
                            <CardContent className="p-4">
                                <h3 className="font-bold mb-3 text-sm">تاریخچه</h3>
                                <div className="space-y-3">
                                    <TimelineItem
                                        icon={Calendar}
                                        title="ثبت رویداد"
                                        date={new Date(event.createdAt).toLocaleDateString('fa-IR')}
                                        color="blue"
                                    />
                                    {event.updatedAt && event.updatedAt !== event.createdAt && (
                                        <TimelineItem
                                            icon={Edit}
                                            title="آخرین ویرایش"
                                            date={new Date(event.updatedAt).toLocaleDateString('fa-IR')}
                                            color="purple"
                                        />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

function InfoItem({ icon: Icon, label, value }: any) {
    return (
        <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
                <Icon className="h-4 w-4 text-blue-600" />
            </div>
            <div>
                <p className="text-xs text-gray-600">{label}</p>
                <p className="font-medium text-gray-900 text-sm">{value}</p>
            </div>
        </div>
    )
}

function StatBox({ label, value, color }: any) {
    const colors = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        yellow: 'from-yellow-500 to-yellow-600',
    }

    return (
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color as keyof typeof colors]} text-white`}>
            <p className="text-xs opacity-90 mb-1">{label}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    )
}

function ProgressBar({ label, value, max, color }: any) {
    const percentage = Math.round((value / max) * 100)
    const colors = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
    }

    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="font-medium">{label}</span>
                <span className="text-gray-600">{value} / {max} ({percentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`${colors[color as keyof typeof colors]} h-2 rounded-full transition-all`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
        </div>
    )
}

function StatusBadge({ status }: any) {
    const statusConfig = {
        upcoming: { label: 'آینده', color: 'bg-blue-100 text-blue-800' },
        ongoing: { label: 'در حال برگزاری', color: 'bg-green-100 text-green-800' },
        completed: { label: 'پایان یافته', color: 'bg-gray-100 text-gray-800' },
        cancelled: { label: 'لغو شده', color: 'bg-red-100 text-red-800' },
    }

    const config = statusConfig[status as keyof typeof statusConfig]

    return (
        <div className={`px-3 py-2 rounded-lg ${config.color} text-center font-medium text-sm`}>
            {config.label}
        </div>
    )
}

function TypeBadge({ type }: any) {
    const typeConfig = {
        workshop: { label: 'کارگاه', color: 'bg-blue-100 text-blue-800' },
        seminar: { label: 'سمینار', color: 'bg-purple-100 text-purple-800' },
        competition: { label: 'مسابقه', color: 'bg-red-100 text-red-800' },
        social: { label: 'اجتماعی', color: 'bg-green-100 text-green-800' },
        training: { label: 'آموزشی', color: 'bg-yellow-100 text-yellow-800' },
    }

    const config = typeConfig[type as keyof typeof typeConfig]

    return (
        <div className={`px-3 py-2 rounded-lg ${config.color} text-center font-medium text-sm`}>
            {config.label}
        </div>
    )
}

function TimelineItem({ icon: Icon, title, date, color }: any) {
    const bgClass = color === 'blue' ? 'bg-blue-100' : 'bg-purple-100'
    const textClass = color === 'blue' ? 'text-blue-600' : 'text-purple-600'

    return (
        <div className="flex items-start gap-2">
            <div className={`w-7 h-7 rounded-full ${bgClass} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-3 w-3 ${textClass}`} />
            </div>
            <div>
                <p className="font-medium text-gray-900 text-sm">{title}</p>
                <p className="text-xs text-gray-500">{date}</p>
            </div>
        </div>
    )
}
