import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Camera, Upload, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File | string) => Promise<void>;
  currentPhoto?: string;
  isLoading?: boolean;
}

export default function ProfilePhotoModal({
  isOpen,
  onClose,
  onUpload,
  currentPhoto,
  isLoading = false,
}: ProfilePhotoModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('لطفاً یک فایل تصویری انتخاب کنید');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('حجم فایل نباید بیشتر از 5 مگابایت باشد');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!preview) return;
    
    try {
      // Send base64 string instead of File object
      await onUpload(preview as any);
      handleClose();
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const handleClose = () => {
    setPreview(null);
    setSelectedFile(null);
    onClose();
  };

  const handleRemovePreview = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999]">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <div className="relative h-full flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-gray-800 dark:to-gray-900">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      تغییر عکس پروفایل
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      عکس جدید خود را آپلود کنید
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Current Photo */}
                {currentPhoto && !preview && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      عکس فعلی
                    </label>
                    <div className="flex justify-center">
                      <img
                        src={currentPhoto}
                        alt="Current profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  </div>
                )}

                {/* Preview */}
                {preview && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      پیش‌نمایش
                    </label>
                    <div className="relative flex justify-center">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-pink-200 dark:border-pink-700"
                      />
                      <button
                        onClick={handleRemovePreview}
                        className="absolute top-0 right-1/2 translate-x-16 -translate-y-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload Area */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
                    dragActive
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-pink-400 dark:hover:border-pink-500'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />

                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        فایل را اینجا بکشید یا کلیک کنید
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF تا 5MB
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="mx-auto"
                    >
                      <ImageIcon className="w-4 h-4 ml-2" />
                      انتخاب فایل
                    </Button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg">
                  <div className="flex gap-3">
                    <Camera className="w-5 h-5 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-pink-800 dark:text-pink-200">
                      <p className="font-semibold mb-1">نکات مهم:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• از عکس با کیفیت و واضح استفاده کنید</li>
                        <li>• عکس باید حالت رسمی و حرفه‌ای داشته باشد</li>
                        <li>• پس‌زمینه ساده و بدون حواس‌پرتی</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="px-6"
                >
                  انصراف
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedFile || isLoading}
                  className="px-6 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      در حال آپلود...
                    </>
                  ) : (
                    <>
                      آپلود عکس
                      <Camera className="w-4 h-4 mr-2" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
