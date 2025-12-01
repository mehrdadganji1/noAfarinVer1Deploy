export enum DocumentType {
  NATIONAL_ID = 'national_id',
  EDUCATION_CERTIFICATE = 'education_certificate',
  CV = 'cv',
  PHOTO = 'photo',
  MOTIVATION_LETTER = 'motivation_letter',
  SPORTS_CERTIFICATE = 'sports_certificate',
  RECOMMENDATION_LETTER = 'recommendation_letter',
  OTHER = 'other'
}

export enum DocumentStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

export interface Document {
  _id: string
  type: DocumentType
  fileName: string
  fileId: string
  fileUrl?: string
  fileSize?: number
  mimeType?: string
  status: DocumentStatus
  uploadedAt: string
  verifiedAt?: string
  verifiedBy?: string
  rejectionReason?: string
  notes?: string
}

export interface DocumentRequirement {
  type: DocumentType
  label: string
  description: string
  required: boolean
  maxSize: number // in MB
  acceptedFormats: string[]
  icon: string
}

export const DOCUMENT_REQUIREMENTS: DocumentRequirement[] = [
  {
    type: DocumentType.NATIONAL_ID,
    label: 'کارت ملی',
    description: 'تصویر واضح از کارت ملی',
    required: true,
    maxSize: 5,
    acceptedFormats: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
    icon: '🪪'
  },
  {
    type: DocumentType.EDUCATION_CERTIFICATE,
    label: 'مدرک تحصیلی',
    description: 'آخرین مدرک تحصیلی یا گواهی اشتغال به تحصیل',
    required: true,
    maxSize: 5,
    acceptedFormats: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
    icon: '🎓'
  },
  {
    type: DocumentType.CV,
    label: 'رزومه',
    description: 'رزومه یا سوابق کاری',
    required: true,
    maxSize: 5,
    acceptedFormats: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    icon: '📄'
  },
  {
    type: DocumentType.PHOTO,
    label: 'عکس پرسنلی',
    description: 'عکس پرسنلی با کیفیت مناسب',
    required: true,
    maxSize: 2,
    acceptedFormats: ['image/jpeg', 'image/png', 'image/jpg'],
    icon: '📸'
  },
  {
    type: DocumentType.MOTIVATION_LETTER,
    label: 'انگیزه‌نامه',
    description: 'انگیزه شما برای شرکت در برنامه',
    required: true,
    maxSize: 5,
    acceptedFormats: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    icon: '✍️'
  },
  {
    type: DocumentType.SPORTS_CERTIFICATE,
    label: 'گواهی ورزشی',
    description: 'گواهینامه‌ها یا مدارک ورزشی (اختیاری)',
    required: false,
    maxSize: 5,
    acceptedFormats: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
    icon: '🏆'
  }
]

export function getDocumentRequirement(type: DocumentType): DocumentRequirement | undefined {
  return DOCUMENT_REQUIREMENTS.find(req => req.type === type)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export function isFileTypeAllowed(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

export function isFileSizeAllowed(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

export function validateFile(file: File, requirement: DocumentRequirement): {
  valid: boolean
  error?: string
} {
  if (!isFileTypeAllowed(file, requirement.acceptedFormats)) {
    return {
      valid: false,
      error: `فرمت فایل مجاز نیست. فرمت‌های مجاز: ${requirement.acceptedFormats.join(', ')}`
    }
  }

  if (!isFileSizeAllowed(file, requirement.maxSize)) {
    return {
      valid: false,
      error: `حجم فایل بیش از حد مجاز است. حداکثر: ${requirement.maxSize}MB`
    }
  }

  return { valid: true }
}
