import { useState, useRef, DragEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, X, AlertCircle, FileText, Loader2, CreditCard, FileCheck, GraduationCap, ImageIcon, Briefcase, Award } from 'lucide-react'
import { DocumentRequirement, validateFile, formatFileSize } from '@/types/document'

interface DocumentUploadProps {
  requirement: DocumentRequirement
  onUpload: (file: File, type: string) => Promise<void>
  disabled?: boolean
  className?: string
}

export default function DocumentUpload({ 
  requirement, 
  onUpload,
  disabled = false,
  className = '' 
}: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled && !isUploading) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (disabled || isUploading) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    setError('')
    
    // Validate file
    const validation = validateFile(file, requirement)
    if (!validation.valid) {
      setError(validation.error || 'فایل نامعتبر است')
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      setIsUploading(true)
      setError('')
      await onUpload(selectedFile, requirement.type)
      
      // Clear selection after successful upload
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err: any) {
      setError(err.message || 'خطا در آپلود فایل')
    } finally {
      setIsUploading(false)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Get icon based on document type
  const getDocumentIcon = () => {
    if (requirement.type.includes('national_id')) {
      return { icon: CreditCard, color: 'text-blue-600', bg: 'bg-gradient-to-br from-blue-50 to-cyan-50', borderColor: 'border-blue-200' }
    } else if (requirement.type.includes('birth_certificate')) {
      return { icon: FileCheck, color: 'text-green-600', bg: 'bg-gradient-to-br from-green-50 to-emerald-50', borderColor: 'border-green-200' }
    } else if (requirement.type.includes('transcript') || requirement.type.includes('diploma')) {
      return { icon: GraduationCap, color: 'text-purple-600', bg: 'bg-gradient-to-br from-purple-50 to-pink-50', borderColor: 'border-purple-200' }
    } else if (requirement.type.includes('photo')) {
      return { icon: ImageIcon, color: 'text-orange-600', bg: 'bg-gradient-to-br from-orange-50 to-red-50', borderColor: 'border-orange-200' }
    } else if (requirement.type.includes('resume')) {
      return { icon: Briefcase, color: 'text-indigo-600', bg: 'bg-gradient-to-br from-indigo-50 to-purple-50', borderColor: 'border-indigo-200' }
    } else if (requirement.type.includes('certificate')) {
      return { icon: Award, color: 'text-amber-600', bg: 'bg-gradient-to-br from-amber-50 to-yellow-50', borderColor: 'border-amber-200' }
    }
    return { icon: Upload, color: 'text-[#7209B7]', bg: 'bg-gradient-to-br from-cyan-50 to-purple-50', borderColor: 'border-purple-200' }
  }

  const iconData = getDocumentIcon()
  const DocIcon = iconData.icon

  return (
    <Card className={`border-l-4 border-l-blue-500 bg-blue-50/30 hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Icon with Gradient Background */}
            <div className={`w-16 h-16 rounded-xl ${iconData.bg} border ${iconData.borderColor} flex items-center justify-center`}>
              <DocIcon className={`h-9 w-9 ${iconData.color}`} />
            </div>
            <div>
              <CardTitle className="text-base">{requirement.label}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{requirement.description}</p>
            </div>
          </div>
          {requirement.required && (
            <span className="px-2 py-1 text-xs font-bold text-red-600 bg-red-100 rounded">الزامی</span>
          )}
        </div>
        <div className="flex gap-4 text-sm text-gray-600 mt-3">
          <span className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            حداکثر {requirement.maxSize}MB
          </span>
          <span>• {requirement.acceptedFormats.map(format => {
            const ext = format.split('/')[1]
            return ext === 'vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'DOCX' : 
                   ext === 'msword' ? 'DOC' : ext.toUpperCase()
          }).join(', ')}</span>
        </div>
      </CardHeader>
      <CardContent>

        {/* Drag & Drop Area */}
        {!selectedFile && (
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-all
              ${isDragging 
                ? 'border-blue-500 bg-blue-50 scale-105' 
                : disabled || isUploading
                ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer'
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          >
            <Upload className={`
              h-12 w-12 mx-auto mb-4
              ${isDragging ? 'text-blue-500' : 'text-gray-400'}
            `} />
            
            <p className="text-base font-semibold text-gray-900 mb-2">
              {isDragging ? 'فایل را اینجا رها کنید' : 'فایل را بکشید یا کلیک کنید'}
            </p>
            
            <p className="text-sm text-gray-600">
              {requirement.acceptedFormats.length} فرمت مجاز، حداکثر {requirement.maxSize}MB
            </p>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={requirement.acceptedFormats.join(',')}
              onChange={handleFileInputChange}
              disabled={disabled || isUploading}
            />
          </div>
        )}

        {/* Selected File Preview */}
        {selectedFile && (
          <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                {/* Icon for Selected File */}
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              
              {!isUploading && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Button 
              className="w-full"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  در حال آپلود...
                </>
              ) : (
                <>
                  <Upload className="ml-2 h-5 w-5" />
                  آپلود فایل
                </>
              )}
            </Button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
