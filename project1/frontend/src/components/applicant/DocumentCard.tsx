import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Download, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock,
  AlertCircle,
  Eye,
  CreditCard,
  GraduationCap,
  ImageIcon,
  Briefcase,
  Award,
  FileCheck
} from 'lucide-react'
import { Document, formatFileSize, getDocumentRequirement } from '@/types/document'
import type { DocumentStatus } from '@/types/document'

interface DocumentCardProps {
  document: Document
  onDownload?: (document: Document) => void
  onPreview?: (document: Document) => void
  onDelete?: (document: Document) => void
  showActions?: boolean
  className?: string
}

export default function DocumentCard({ 
  document, 
  onDownload,
  onPreview, 
  onDelete,
  showActions = true,
  className = '' 
}: DocumentCardProps) {
  const requirement = getDocumentRequirement(document.type)
  
  const getDocumentIcon = () => {
    const type = requirement?.type || document.type
    
    if (type.includes('national_id')) {
      return { icon: CreditCard, color: 'text-blue-600', bg: 'bg-gradient-to-br from-blue-50 to-cyan-50', borderColor: 'border-blue-200' }
    } else if (type.includes('birth_certificate')) {
      return { icon: FileCheck, color: 'text-green-600', bg: 'bg-gradient-to-br from-green-50 to-emerald-50', borderColor: 'border-green-200' }
    } else if (type.includes('transcript') || type.includes('diploma')) {
      return { icon: GraduationCap, color: 'text-purple-600', bg: 'bg-gradient-to-br from-purple-50 to-pink-50', borderColor: 'border-purple-200' }
    } else if (type.includes('photo')) {
      return { icon: ImageIcon, color: 'text-orange-600', bg: 'bg-gradient-to-br from-orange-50 to-red-50', borderColor: 'border-orange-200' }
    } else if (type.includes('resume')) {
      return { icon: Briefcase, color: 'text-indigo-600', bg: 'bg-gradient-to-br from-indigo-50 to-purple-50', borderColor: 'border-indigo-200' }
    } else if (type.includes('certificate')) {
      return { icon: Award, color: 'text-amber-600', bg: 'bg-gradient-to-br from-amber-50 to-yellow-50', borderColor: 'border-amber-200' }
    }
    return { icon: FileText, color: 'text-[#7209B7]', bg: 'bg-gradient-to-br from-cyan-50 to-purple-50', borderColor: 'border-purple-200' }
  }

  const statusColors: Record<DocumentStatus, { bg: string; border: string; text: string; icon: any; label: string }> = {
    'verified': { bg: 'bg-green-50', border: 'border-l-green-500', text: 'text-green-600', icon: CheckCircle2, label: 'تایید شده' },
    'rejected': { bg: 'bg-red-50', border: 'border-l-red-500', text: 'text-red-600', icon: XCircle, label: 'رد شده' },
    'pending': { bg: 'bg-yellow-50', border: 'border-l-yellow-500', text: 'text-yellow-600', icon: Clock, label: 'در انتظار' }
  }
  const status = statusColors[document.status] || statusColors['pending']
  const StatusIcon = status.icon

  const iconData = getDocumentIcon()
  const DocIcon = iconData.icon

  return (
    <Card className={`${status.bg} border-l-4 ${status.border} hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Icon with Gradient Background */}
            <div className={`w-14 h-14 rounded-xl ${iconData.bg} border ${iconData.borderColor} flex items-center justify-center`}>
              <DocIcon className={`h-8 w-8 ${iconData.color}`} />
            </div>
            <div>
              <CardTitle className="text-base">{requirement?.title || document.type}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{document.fileName}</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 ${status.bg} rounded-lg border ${status.border.replace('border-l-', 'border-')}`}>
            <StatusIcon className={`h-4 w-4 ${status.text}`} />
            <span className={`text-sm font-medium ${status.text}`}>{status.label}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* File Info */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              {document.fileSize ? formatFileSize(document.fileSize) : 'N/A'}
            </span>
            <span>
              {new Date(document.uploadedAt).toLocaleDateString('fa-IR')}
            </span>
          </div>

          {/* Rejection Reason */}
          {document.status === 'rejected' && document.rejectionReason && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-900">دلیل رد:</p>
                  <p className="text-sm text-red-800 mt-1">{document.rejectionReason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {document.notes && (
            <div className="p-3 bg-blue-100 border border-blue-300 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">یادداشت:</span> {document.notes}
              </p>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 pt-2 border-t">
              {onPreview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview(document)}
                  className="flex-1"
                >
                  <Eye className="ml-2 h-4 w-4" />
                  پیش‌نمایش
                </Button>
              )}
              
              {onDownload && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(document)}
                  className="flex-1"
                >
                  <Download className="ml-2 h-4 w-4" />
                  دانلود
                </Button>
              )}
              
              {onDelete && document.status === 'pending' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(document)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="ml-2 h-4 w-4" />
                  حذف
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
