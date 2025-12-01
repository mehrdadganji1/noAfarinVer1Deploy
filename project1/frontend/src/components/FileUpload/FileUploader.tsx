import { useState } from 'react';
import { Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import FileUploadZone from './FileUploadZone';
import { fileApi } from '@/lib/api';

interface FileUploaderProps {
  onUploadComplete?: (files: any[]) => void;
  relatedType?: string;
  relatedId?: string;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  multiple?: boolean;
}

export default function FileUploader({
  onUploadComplete,
  relatedType,
  relatedId,
  accept = '*',
  maxFiles = 5,
  maxSize = 10,
  multiple = true,
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setErrors([]);
  };

  const uploadFile = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    
    if (relatedType) formData.append('relatedType', relatedType);
    if (relatedId) formData.append('relatedId', relatedId);

    try {
      // Simulate progress (در واقعیت باید از XMLHttpRequest استفاده کنیم)
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[file.name] || 0;
          if (current >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [file.name]: current + 10 };
        });
      }, 200);

      const response = await fileApi.post('/files/upload', formData, {
        // Don't set Content-Type - let axios set it with boundary
        transformRequest: [(data) => data], // Don't transform FormData
      });

      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));

      return response.data.data;
    } catch (error: any) {
      setUploadProgress(prev => ({ ...prev, [file.name]: -1 }));
      throw new Error(error.response?.data?.error || 'خطا در آپلود فایل');
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('لطفاً فایل‌های مورد نظر را انتخاب کنید');
      return;
    }

    setUploading(true);
    setErrors([]);
    setUploadedFiles([]);

    const uploaded: any[] = [];
    const uploadErrors: string[] = [];

    for (const file of files) {
      try {
        const uploadedFile = await uploadFile(file);
        uploaded.push(uploadedFile);
      } catch (error: any) {
        uploadErrors.push(`${file.name}: ${error.message}`);
      }
    }

    setUploadedFiles(uploaded);
    setErrors(uploadErrors);
    setUploading(false);

    if (uploaded.length > 0 && onUploadComplete) {
      onUploadComplete(uploaded);
    }

    // Clear files after successful upload
    if (uploadErrors.length === 0) {
      setTimeout(() => {
        setFiles([]);
        setUploadProgress({});
      }, 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <FileUploadZone
        onFilesSelected={handleFilesSelected}
        accept={accept}
        maxFiles={maxFiles}
        maxSize={maxSize}
        multiple={multiple}
      />

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">وضعیت آپلود</h3>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                {progress === 100 ? (
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : progress === -1 ? (
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                ) : (
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin flex-shrink-0" />
                )}
                <span className="text-sm text-gray-700 truncate flex-1">{fileName}</span>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {progress === -1 ? 'خطا' : `${progress}%`}
                </span>
              </div>
              {progress >= 0 && progress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800 mb-2">خطاها:</h3>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Success Message */}
      {uploadedFiles.length > 0 && errors.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-800">
              {uploadedFiles.length} فایل با موفقیت آپلود شد
            </p>
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={files.length === 0 || uploading}
        className={`
          w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
          font-medium transition-colors
          ${files.length === 0 || uploading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
          }
        `}
      >
        {uploading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            در حال آپلود...
          </>
        ) : (
          <>
            <Upload className="h-5 w-5" />
            آپلود {files.length > 0 && `(${files.length} فایل)`}
          </>
        )}
      </button>
    </div>
  );
}
