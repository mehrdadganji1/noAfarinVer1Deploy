/**
 * Document Types and Requirements
 * Used for document upload and management in applicant dashboard
 */

export type DocumentType =
  | 'national_id'
  | 'birth_certificate'
  | 'education_certificate'
  | 'transcript'
  | 'resume'
  | 'motivation_letter'
  | 'recommendation_letter'
  | 'portfolio'
  | 'other';

export type DocumentStatus = 'pending' | 'verified' | 'rejected';

// Re-export as const for runtime usage
export const DocumentStatusEnum = {
  PENDING: 'pending' as const,
  VERIFIED: 'verified' as const,
  REJECTED: 'rejected' as const,
};

export interface Document {
  _id: string;
  applicationId: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  fileId: string;
  fileSize: number;
  mimeType: string;
  status: DocumentStatus;
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface DocumentRequirement {
  type: DocumentType;
  title: string;
  description: string;
  required: boolean;
  maxSize: number; // in MB
  acceptedFormats: string[];
  icon?: string;
}

export const DOCUMENT_REQUIREMENTS: DocumentRequirement[] = [
  {
    type: 'national_id',
    title: 'کارت ملی',
    description: 'تصویر واضح از کارت ملی (روی و پشت)',
    required: true,
    maxSize: 5,
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
  },
  {
    type: 'birth_certificate',
    title: 'شناسنامه',
    description: 'تصویر صفحه اول شناسنامه',
    required: true,
    maxSize: 5,
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
  },
  {
    type: 'education_certificate',
    title: 'مدرک تحصیلی',
    description: 'تصویر آخرین مدرک تحصیلی',
    required: true,
    maxSize: 10,
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
  },
  {
    type: 'transcript',
    title: 'ریز نمرات',
    description: 'ریز نمرات دوره تحصیلی',
    required: true,
    maxSize: 10,
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
  },
  {
    type: 'resume',
    title: 'رزومه',
    description: 'رزومه کامل و به‌روز',
    required: true,
    maxSize: 5,
    acceptedFormats: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  {
    type: 'motivation_letter',
    title: 'انگیزه‌نامه',
    description: 'انگیزه‌نامه برای شرکت در برنامه',
    required: false,
    maxSize: 5,
    acceptedFormats: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  {
    type: 'recommendation_letter',
    title: 'توصیه‌نامه',
    description: 'توصیه‌نامه از اساتید یا کارفرمایان',
    required: false,
    maxSize: 5,
    acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png'],
  },
  {
    type: 'portfolio',
    title: 'نمونه کار',
    description: 'نمونه کارها و پروژه‌های انجام شده',
    required: false,
    maxSize: 20,
    acceptedFormats: ['application/pdf', 'application/zip'],
  },
  {
    type: 'other',
    title: 'سایر مدارک',
    description: 'مدارک دیگری که فکر می‌کنید مفید است',
    required: false,
    maxSize: 10,
    acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
  },
];

/**
 * Get document requirement by type
 */
export const getDocumentRequirement = (type: DocumentType): DocumentRequirement | undefined => {
  return DOCUMENT_REQUIREMENTS.find(req => req.type === type);
};

/**
 * Check if document type is required
 */
export const isDocumentRequired = (type: DocumentType): boolean => {
  const requirement = getDocumentRequirement(type);
  return requirement?.required || false;
};

/**
 * Get human-readable file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate file size
 */
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Validate file type
 */
export const validateFileType = (file: File, acceptedFormats: string[]): boolean => {
  return acceptedFormats.includes(file.type);
};

/**
 * Validate file against requirement (size and type)
 */
export const validateFile = (file: File, requirement: DocumentRequirement): { valid: boolean; error?: string } => {
  // Check file size
  if (!validateFileSize(file, requirement.maxSize)) {
    return {
      valid: false,
      error: `حجم فایل نباید بیشتر از ${requirement.maxSize} مگابایت باشد`
    };
  }

  // Check file type
  if (!validateFileType(file, requirement.acceptedFormats)) {
    const allowedFormats = requirement.acceptedFormats
      .map(format => {
        const ext = format.split('/')[1];
        return ext === 'vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'DOCX' :
               ext === 'msword' ? 'DOC' : ext.toUpperCase();
      })
      .join(', ');
    return {
      valid: false,
      error: `فرمت فایل مجاز نیست. فرمت‌های مجاز: ${allowedFormats}`
    };
  }

  return { valid: true };
};

/**
 * Get status badge color
 */
export const getStatusColor = (status: DocumentStatus): string => {
  switch (status) {
    case 'verified':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'rejected':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'pending':
    default:
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  }
};

/**
 * Get status label
 */
export const getStatusLabel = (status: DocumentStatus): string => {
  switch (status) {
    case 'verified':
      return 'تایید شده';
    case 'rejected':
      return 'رد شده';
    case 'pending':
    default:
      return 'در انتظار بررسی';
  }
};
