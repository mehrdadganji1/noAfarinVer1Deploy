import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, DollarSign, ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react'
import { PageSkeleton } from '@/components/ui/page-skeleton'
import api from '@/lib/api'

export default function Fundings() {
    const [page, setPage] = useState(1)

    const { data, isLoading } = useQuery({
        queryKey: ['fundings', page],
        queryFn: async () => {
            try {
                const response = await api.get(`/api/fundings?page=${page}&limit=12`)
                return response.data.data
            } catch (error) {
                return { fundings: [], total: 0, page: 1, totalPages: 0 }
            }
        },
        refetchOnWindowFocus: false,
    })

    const stats = {
        total: data?.total || 0,
        pending: data?.fundings?.filter((f: any) => f.status === 'pending').length || 0,
        approved: data?.fundings?.filter((f: any) => f.status === 'approved').length || 0,
        rejected: data?.fundings?.filter((f: any) => f.status === 'rejected').length || 0
    }

    // Show skeleton while loading
    if (isLoading && !data) {
        return <PageSkeleton showHeader showStats statsCount={4} showFilters={false} itemsCount={5} />
    }

    return (
        <div className="space-y-6 pb-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600 p-8 text-white shadow-2xl"
            >
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                                <DollarSign className="h-8 w-8" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold">تسهیلات مالی</h1>
                                <p className="text-white/90 text-lg mt-1">مشاهده و مدیریت درخواست‌های تسهیلات</p>
                            </div>
                        </div>
                        <Button
                            className="bg-white text-orange-600 hover:bg-white/90 shadow-lg"
                            size="lg"
                        >
                            <Plus className="ml-2 h-5 w-5" />
                            درخواست جدید
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'کل درخواست‌ها', value: stats.total, icon: DollarSign, gradient: 'from-blue-50 to-cyan-50', color: 'text-blue-600', delay: 0 },
                    { label: 'در انتظار بررسی', value: stats.pending, icon: Clock, gradient: 'from-yellow-50 to-amber-50', color: 'text-yellow-600', delay: 0.1 },
                    { label: 'تایید شده', value: stats.approved, icon: CheckCircle, gradient: 'from-green-50 to-emerald-50', color: 'text-green-600', delay: 0.2 },
                    { label: 'رد شده', value: stats.rejected, icon: XCircle, gradient: 'from-red-50 to-rose-50', color: 'text-red-600', delay: 0.3 }
                ].map((stat) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: stat.delay, duration: 0.3 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                    >
                        <Card className={`border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden bg-gradient-to-br ${stat.gradient}`}>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md">
                                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-700">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse h-32 bg-gray-200 rounded-xl"></div>
                    ))}
                </div>
            ) : data?.fundings?.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                        <DollarSign className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">هنوز درخواستی ثبت نشده</h3>
                    <p className="text-gray-600">درخواست‌های تسهیلات مالی اینجا نمایش داده می‌شوند</p>
                </motion.div>
            ) : (
                <>
                    <div className="space-y-4">
                        {data?.fundings?.map((funding: any, index: number) => (
                            <motion.div
                                key={funding._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-gray-900">{funding.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{funding.description}</p>
                                                <div className="flex items-center gap-4 mt-3">
                                                    <span className="text-sm text-gray-600">مبلغ: {funding.amount?.toLocaleString('fa-IR')} تومان</span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${funding.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                        funding.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {funding.status === 'approved' ? 'تایید شده' :
                                                            funding.status === 'rejected' ? 'رد شده' : 'در انتظار'}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button variant="outline">مشاهده جزئیات</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {data?.totalPages > 1 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-between mt-8 p-4 bg-white rounded-xl shadow-lg border-2"
                        >
                            <div className="text-sm font-medium text-gray-700">
                                صفحه {page} از {data.totalPages}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="border-2"
                                >
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                    قبلی
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page >= data.totalPages}
                                    className="border-2"
                                >
                                    بعدی
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </>
            )}
        </div>
    )
}
