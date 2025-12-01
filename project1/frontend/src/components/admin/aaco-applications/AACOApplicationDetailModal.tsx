import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap,
  Lightbulb,
  Target,
  Users,
  Calendar,
  FileText,
  Star,
  Briefcase
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  AACOApplication, 
  getStatusLabel,
  getStatusColor 
} from '@/hooks/useAACOAdminApplications'

interface AACOApplicationDetailModalProps {
  application: AACOApplication | null
  open: boolean
  onClose: () => void
}

export function AACOApplicationDetailModal({
  application,
  open,
  onClose,
}: AACOApplicationDetailModalProps) {
  if (!application) return null

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getDegreeLabel = (degree: string) => {
    const labels: Record<string, string> = {
      diploma: 'دیپلم',
      associate: 'کاردانی',
      bachelor: 'کارشناسی',
      master: 'کارشناسی ارشد',
      phd: 'دکتری',
    }
    return labels[degree] || degree
  }

  const getTeamSizeLabel = (size?: string) => {
    const labels: Record<string, string> = {
      '1': 'انفرادی',
      '2-3': '۲ تا ۳ نفر',
      '4-5': '۴ تا ۵ نفر',
      '6+': 'بیش از ۶ نفر',
    }
    return size ? labels[size] || size : '-'
  }

  const Section = ({ 
    title, 
    icon: Icon, 
    children 
  }: { 
    title: string
    icon: React.ComponentType<{ className?: string }>
    children: React.ReactNode 
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-blue-500" />
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="pr-7">{children}</div>
    </div>
  )

  const InfoRow = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
    <div className="flex items-start gap-2 py-1">
      <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[100px]">{label}:</span>
      <span className="text-sm text-gray-900 dark:text-white">{value}</span>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">جزئیات درخواست</DialogTitle>
            <Badge className={getStatusColor(application.status)}>
              {getStatusLabel(application.status)}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Personal Info */}
            <Section title="اطلاعات شخصی" icon={User}>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="نام" value={application.firstName} />
                <InfoRow label="نام خانوادگی" value={application.lastName} />
                <InfoRow 
                  label="ایمیل" 
                  value={
                    <a href={`mailto:${application.email}`} className="text-blue-500 hover:underline">
                      {application.email}
                    </a>
                  } 
                />
                <InfoRow 
                  label="تلفن" 
                  value={
                    <a href={`tel:${application.phone}`} className="text-blue-500 hover:underline">
                      {application.phone}
                    </a>
                  } 
                />
                <InfoRow label="شهر" value={application.city} />
              </div>
            </Section>

            <Separator />

            {/* Educational Info */}
            <Section title="اطلاعات تحصیلی" icon={GraduationCap}>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="دانشگاه" value={application.university} />
                <InfoRow label="رشته" value={application.major} />
                <InfoRow label="مقطع" value={getDegreeLabel(application.degree)} />
                <InfoRow label="سال فارغ‌التحصیلی" value={application.graduationYear || '-'} />
              </div>
            </Section>

            <Separator />

            {/* Startup Idea */}
            <Section title="ایده استارتاپ" icon={Lightbulb}>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    شرح ایده:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    {application.startupIdea}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    مدل کسب‌وکار:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    {application.businessModel}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    بازار هدف:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    {application.targetMarket}
                  </p>
                </div>
              </div>
            </Section>

            <Separator />

            {/* Team Info */}
            <Section title="اطلاعات تیم" icon={Users}>
              <div className="space-y-3">
                <InfoRow label="اندازه تیم" value={getTeamSizeLabel(application.teamSize)} />
                {application.teamMembers && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      اعضای تیم:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      {application.teamMembers}
                    </p>
                  </div>
                )}
              </div>
            </Section>

            <Separator />

            {/* Skills */}
            <Section title="مهارت‌ها" icon={Star}>
              <div className="flex flex-wrap gap-2">
                {application.skills && application.skills.length > 0 ? (
                  application.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">مهارتی ثبت نشده</span>
                )}
              </div>
            </Section>

            <Separator />

            {/* Motivation */}
            <Section title="انگیزه و اهداف" icon={Target}>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    انگیزه:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    {application.motivation}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    اهداف:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    {application.goals}
                  </p>
                </div>
                {application.experience && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      تجربیات:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      {application.experience}
                    </p>
                  </div>
                )}
                {application.expectations && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      انتظارات:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      {application.expectations}
                    </p>
                  </div>
                )}
              </div>
            </Section>

            <Separator />

            {/* Metadata */}
            <Section title="اطلاعات سیستمی" icon={FileText}>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="تاریخ ارسال" value={formatDate(application.submittedAt)} />
                <InfoRow label="تاریخ ایجاد" value={formatDate(application.createdAt)} />
                <InfoRow label="آخرین به‌روزرسانی" value={formatDate(application.updatedAt)} />
                {application.reviewedAt && (
                  <InfoRow label="تاریخ بررسی" value={formatDate(application.reviewedAt)} />
                )}
              </div>
              {application.reviewNotes && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    یادداشت بررسی:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    {application.reviewNotes}
                  </p>
                </div>
              )}
            </Section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
