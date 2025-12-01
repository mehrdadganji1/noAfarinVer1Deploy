import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import {
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    User
} from 'lucide-react'
import { Application } from '@/pages/director/Applications'
import { format } from 'date-fns'
import { faIR } from 'date-fns/locale'

interface ApplicationsTimelineProps {
    applications: Application[]
    onSelectApplication: (application: Application) => void
}

export default function ApplicationsTimeline({ applications, onSelectApplication }: ApplicationsTimelineProps) {
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'تاریخ نامشخص'
        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return 'تاریخ نامعتبر'
            return format(date, 'dd MMM yyyy - HH:mm', { locale: faIR })
        } catch {
            return 'تاریخ نامعتبر'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="h-6 w-6 text-green-500" />
            case 'rejected':
                return <XCircle className="h-6 w-6 text-red-500" />
            default:
                return <Clock className="h-6 w-6 text-yellow-500" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'border-green-500 bg-green-50'
            case 'rejected':
                return 'border-red-500 bg-red-50'
            default:
                return 'border-yellow-500 bg-yellow-50'
        }
    }

    // Group by date
    const groupedApplications = applications.reduce((acc, app) => {
        const date = app.submittedAt ? format(new Date(app.submittedAt), 'yyyy-MM-dd') : 'unknown'
        if (!acc[date]) acc[date] = []
        acc[date].push(app)
        return acc
    }, {} as Record<string, Application[]>)

    return (
        <div className="space-y-6">
            {Object.entries(groupedApplications).map(([date, apps]) => (
                <div key={date} className="relative">
                    {/* Date Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="font-bold text-sm">
                                {date !== 'unknown' ? format(new Date(date), 'dd MMMM yyyy', { locale: faIR }) : 'تاریخ نامشخص'}
                            </span>
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent" />
                    </div>

                    {/* Timeline Items */}
                    <div className="space-y-4 pr-8 border-r-2 border-gray-200">
                        {apps.map((app, index) => (
                            <motion.div
                                key={app._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="relative"
                            >
                                {/* Timeline Dot */}
                                <div className="absolute -right-[21px] top-4">
                                    <div className={`w-10 h-10 rounded-full border-4 ${getStatusColor(app.status)} flex items-center justify-center`}>
                                        {getStatusIcon(app.status)}
                                    </div>
                                </div>

                                {/* Content Card */}
                                <Card
                                    className="mr-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                                    onClick={() => onSelectApplication(app)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                    {(app.firstName || app.userId?.firstName || 'N')[0]}
                                                    {(app.lastName || app.userId?.lastName || 'A')[0]}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">
                                                        {app.firstName || app.userId?.firstName} {app.lastName || app.userId?.lastName}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">{app.university} - {app.major}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Clock className="h-3 w-3 text-gray-400" />
                                                        <span className="text-xs text-gray-500">{formatDate(app.submittedAt)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {app.status === 'approved' ? 'تایید شده' :
                                                        app.status === 'rejected' ? 'رد شده' : 'در انتظار'}
                                                </span>
                                                <span className="text-xs text-gray-500">{app.degree}</span>
                                            </div>
                                        </div>

                                        {app.reviewNotes && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <p className="text-sm text-gray-600 line-clamp-2">{app.reviewNotes}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
