import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar } from '@/components/ui/avatar'
import { 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApplicationStatus } from '@/hooks/useApplicationStatus'
import { useDocuments, useUploadDocument, useDeleteDocument, useDownloadDocument } from '@/hooks/useDocuments'
import { DOCUMENT_REQUIREMENTS, DocumentType, Document } from '@/types/document'
import DocumentCard from '@/components/applicant/DocumentCard'
import DocumentUpload from '@/components/applicant/DocumentUpload'
import DocumentPreview from '@/components/applicant/DocumentPreview'

export default function Documents() {
  const navigate = useNavigate()
  const [uploadingType, setUploadingType] = useState<DocumentType | null>(null)
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)

  // Fetch application and documents
  const { data: applicationData, isLoading: isLoadingApp } = useApplicationStatus()
  const applicationId = applicationData?.application?._id
  
  const { data: documents, isLoading: isLoadingDocs } = useDocuments(applicationId)
  const uploadMutation = useUploadDocument(applicationId)
  const deleteMutation = useDeleteDocument(applicationId)
  const downloadMutation = useDownloadDocument()

  const isLoading = isLoadingApp || isLoadingDocs

  // Calculate completion
  const requiredDocs = DOCUMENT_REQUIREMENTS.filter(req => req.required)
  const uploadedRequiredDocs = requiredDocs.filter(req => 
    documents?.some(doc => doc.type === req.type)
  )
  const completionPercentage = requiredDocs.length > 0 
    ? Math.round((uploadedRequiredDocs.length / requiredDocs.length) * 100)
    : 0

  // Handle upload
  const handleUpload = async (file: File, type: string) => {
    try {
      await uploadMutation.mutateAsync({ file, type: type as DocumentType })
      setUploadingType(null)
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  // Handle download
  const handleDownload = async (document: any) => {
    try {
      await downloadMutation.mutateAsync(document)
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  // Handle delete
  const handleDelete = async (document: any) => {
    if (!confirm('آیا از حذف این مدرک اطمینان دارید؟')) return
    
    try {
      await deleteMutation.mutateAsync(document._id)
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  // Handle preview
  const handlePreview = (document: Document) => {
    setPreviewDocument(document)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-3"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00D9FF]/20 border-t-[#00D9FF] mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-[#00D9FF]/5 blur-xl"></div>
          </div>
          <p className="text-sm font-semibold bg-gradient-to-r from-[#00D9FF] to-[#7209B7] bg-clip-text text-transparent">
            در حال بارگذاری...
          </p>
        </motion.div>
      </div>
    )
  }

  // If no application yet
  if (!applicationData?.hasApplication) {
    return (
      <div className="space-y-3 max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF] via-[#7209B7] to-[#FF006E] rounded-lg p-[2px]">
            <div className="w-full h-full bg-white rounded-lg" />
          </div>
          <div className="relative bg-gradient-to-br from-white to-neutral-50/50 rounded-lg shadow-[0_0_12px_rgba(0,217,255,0.08)] p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10 border-2 border-[#00D9FF]/20">
                <div className="w-full h-full bg-gradient-to-br from-[#00D9FF] to-[#7209B7] flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
              </Avatar>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">مدارک</h1>
                <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">آپلود مدارک</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Alert className="border-0 bg-gradient-to-r from-orange-50 to-amber-50 shadow-[0_0_12px_rgba(251,146,60,0.08)]">
            <AlertCircle className="h-3.5 w-3.5 text-orange-600" />
            <AlertDescription className="text-xs">
              ابتدا باید فرم درخواست را تکمیل کنید.
            </AlertDescription>
          </Alert>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button 
            onClick={() => navigate('/application-form')} 
            size="sm" 
            className="h-8 text-xs bg-gradient-to-r from-[#00D9FF] to-[#00B8D9] hover:from-[#00B8D9] hover:to-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.3)]"
          >
            <FileText className="ml-1 h-3.5 w-3.5" />
            تکمیل فرم درخواست
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4 font-primary max-w-[1600px] mx-auto">
      {/* Modern Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF] via-[#7209B7] to-[#FF006E] rounded-lg p-[2px]">
          <div className="w-full h-full bg-white rounded-lg" />
        </div>
        <div className="relative bg-gradient-to-br from-white to-neutral-50/50 rounded-lg shadow-[0_0_12px_rgba(0,217,255,0.08)] p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-[#00D9FF]/20 shadow-[0_0_12px_rgba(0,217,255,0.15)]">
                <div className="w-full h-full bg-gradient-to-br from-[#00D9FF] to-[#7209B7] flex items-center justify-center">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </Avatar>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-1.5">
                  مدیریت مدارک
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#FF006E]" />
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">آپلود و پیگیری وضعیت مدارک</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/applicant/dashboard')}
              className="h-8 text-xs"
            >
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
              داشبورد
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Modern Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="relative overflow-hidden border-0 shadow-[0_0_12px_rgba(0,217,255,0.08)] hover:shadow-[0_0_20px_rgba(0,217,255,0.15)] transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00D9FF]/10 to-transparent rounded-full blur-2xl" />
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00D9FF]/15 to-[#00B8D9]/15 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF] to-[#00B8D9] rounded-xl opacity-0 group-hover:opacity-10 transition-opacity" />
                    <Upload className="h-6 w-6 text-[#00D9FF] relative z-10" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg">پیشرفت آپلود</CardTitle>
                    <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">{uploadedRequiredDocs.length} از {requiredDocs.length} مدرک آپلود شده</p>
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#00D9FF] to-[#00B8D9] bg-clip-text text-transparent">
                  {completionPercentage}%
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-3">
                <div className="relative h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute inset-y-0 right-0 bg-gradient-to-r from-[#00D9FF] to-[#00B8D9] rounded-full shadow-[0_0_8px_rgba(0,217,255,0.4)]"
                  />
                </div>
                {completionPercentage === 100 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2.5 text-xs sm:text-sm text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 p-2.5 sm:p-3 rounded-lg border border-green-200"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium">تمام مدارک الزامی آپلود شده است</span>
                  </motion.div>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    لطفاً {requiredDocs.length - uploadedRequiredDocs.length} مدرک باقیمانده را آپلود کنید
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats Card */}
        {documents && documents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-[0_0_12px_rgba(114,9,183,0.08)] hover:shadow-[0_0_20px_rgba(114,9,183,0.15)] transition-all duration-300 h-full">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#7209B7]/10 to-transparent rounded-full blur-2xl" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2.5 text-base sm:text-lg">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7209B7]/15 to-[#FF006E]/15 flex items-center justify-center">
                    <TrendingUp className="h-4.5 w-4.5 text-[#7209B7]" />
                  </div>
                  خلاصه وضعیت
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-lg border border-gray-200/50">
                    <span className="text-xs text-gray-600">آپلود شده</span>
                    <span className="text-xl font-bold text-gray-900">{documents.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-green-50 to-emerald-50/50 rounded-lg border border-green-200/50">
                    <span className="text-xs text-gray-600">تایید شده</span>
                    <span className="text-xl font-bold text-green-600">{documents.filter(d => d.status === 'verified').length}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-yellow-50 to-amber-50/50 rounded-lg border border-yellow-200/50">
                    <span className="text-xs text-gray-600">در انتظار</span>
                    <span className="text-xl font-bold text-yellow-600">{documents.filter(d => d.status === 'pending').length}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-red-50 to-rose-50/50 rounded-lg border border-red-200/50">
                    <span className="text-xs text-gray-600">رد شده</span>
                    <span className="text-xl font-bold text-red-600">{documents.filter(d => d.status === 'rejected').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Document Requirements Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <div className="w-1 h-6 bg-gradient-to-b from-[#00D9FF] to-[#7209B7] rounded-full" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">مدارک مورد نیاز</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        
          {DOCUMENT_REQUIREMENTS.map((requirement) => {
            const existingDoc = documents?.find(doc => doc.type === requirement.type)
            const isUploading = uploadingType === requirement.type

            return (
              <div key={requirement.type}>
              {existingDoc ? (
                <div className="space-y-3">
                  {/* Show uploaded document */}
                  <DocumentCard
                    document={existingDoc}
                    onPreview={handlePreview}
                    onDownload={handleDownload}
                    onDelete={existingDoc.status === 'pending' ? handleDelete : undefined}
                    showActions={true}
                  />
                  
                  {/* Show rejection reason if rejected */}
                  {existingDoc.status === 'rejected' && existingDoc.rejectionReason && (
                    <Alert variant="destructive" className="border-red-200">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <AlertDescription className="text-xs">
                        <div className="space-y-1">
                          <p className="font-semibold">دلیل رد:</p>
                          <p>{existingDoc.rejectionReason}</p>
                          {existingDoc.notes && (
                            <>
                              <p className="font-semibold mt-1.5">یادداشت:</p>
                              <p className="text-[10px]">{existingDoc.notes}</p>
                            </>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Allow re-upload if rejected */}
                  {existingDoc.status === 'rejected' && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 mb-1.5">
                        می‌توانید مدرک جدید آپلود کنید:
                      </p>
                      <DocumentUpload
                        requirement={requirement}
                        onUpload={(file) => handleUpload(file, requirement.type)}
                        disabled={isUploading}
                      />
                    </div>
                  )}
                </div>
              ) : (
                // Show upload interface
                <DocumentUpload
                  requirement={requirement}
                  onUpload={(file) => handleUpload(file, requirement.type)}
                  disabled={isUploading}
                />
              )}
            </div>
            )
          })}
        </div>
      </motion.div>


      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="relative overflow-hidden border-0 shadow-[0_0_12px_rgba(59,130,246,0.08)] bg-gradient-to-br from-blue-50/50 to-cyan-50/30">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2.5 text-base sm:text-lg">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <AlertCircle className="h-4.5 w-4.5 text-blue-600" />
              </div>
              راهنمای آپلود مدارک
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                </div>
                <span>تمام مدارک باید واضح، خوانا و اسکن شده با کیفیت بالا باشند</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3 w-3 text-blue-600" />
                </div>
                <span>حجم هر فایل نباید از حد مجاز مشخص شده تجاوز کند</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3 w-3 text-purple-600" />
                </div>
                <span>فقط فرمت‌های PDF، JPG، PNG و DOCX پذیرفته می‌شوند</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3 w-3 text-orange-600" />
                </div>
                <span>مدارک آپلود شده توسط کارشناسان ما بررسی و تایید خواهند شد</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3 w-3 text-indigo-600" />
                </div>
                <span>در صورت رد مدرک، می‌توانید نسخه اصلاح شده را مجدداً آپلود کنید</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Document Preview Modal */}
      {previewDocument && (
        <DocumentPreview
          isOpen={!!previewDocument}
          onClose={() => setPreviewDocument(null)}
          documentUrl={previewDocument.fileUrl || ''}
          documentName={previewDocument.fileName || 'مدرک'}
          documentType={previewDocument.mimeType || 'application/octet-stream'}
          downloadable={true}
        />
      )}
    </div>
  )
}
