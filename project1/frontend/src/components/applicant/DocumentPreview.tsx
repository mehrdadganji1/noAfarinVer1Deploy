import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut, Maximize, X, FileText } from 'lucide-react';
import { toast } from '@/lib/toast';
import api from '@/lib/api';

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  documentName: string;
  documentType: string;
  downloadable?: boolean;
}

export default function DocumentPreview({
  isOpen,
  onClose,
  documentUrl,
  documentName,
  documentType,
  downloadable = true,
}: DocumentPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isPDF = documentType.includes('pdf') || documentUrl.endsWith('.pdf');
  const isImage = documentType.includes('image') || 
                  /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(documentUrl);

  const handleDownload = async () => {
    try {
      const response = await api.get(documentUrl, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', documentName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('فایل با موفقیت دانلود شد');
    } catch (error) {
      toast.error('خطا در دانلود فایل');
      console.error('Download error:', error);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`
          ${isFullscreen ? 'max-w-[95vw] h-[95vh]' : 'max-w-4xl'}
          p-0 overflow-hidden
        `}
      >
        {/* Header */}
        <DialogHeader className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              {documentName}
            </DialogTitle>
            
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              {isImage && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoom <= 50}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600 min-w-[4rem] text-center">
                    {zoom}%
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={zoom >= 200}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </>
              )}
              
              {/* Fullscreen */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
              >
                <Maximize className="h-4 w-4" />
              </Button>
              
              {/* Download */}
              {downloadable && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 ml-2" />
                  دانلود
                </Button>
              )}
              
              {/* Close */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className={`
          overflow-auto bg-gray-100
          ${isFullscreen ? 'h-[calc(95vh-4rem)]' : 'h-[600px]'}
        `}>
          {isPDF && (
            <PDFViewer 
              url={documentUrl} 
              zoom={zoom}
            />
          )}
          
          {isImage && (
            <ImageViewer 
              url={documentUrl} 
              zoom={zoom}
              alt={documentName}
            />
          )}
          
          {!isPDF && !isImage && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  پیش‌نمایش این نوع فایل پشتیبانی نمی‌شود
                </p>
                {downloadable && (
                  <Button
                    onClick={handleDownload}
                    className="mt-4"
                  >
                    <Download className="ml-2 h-4 w-4" />
                    دانلود فایل
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// PDF Viewer Component (Simplified - will need react-pdf)
function PDFViewer({ url, zoom }: { url: string; zoom: number }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div 
        className="bg-white shadow-lg"
        style={{ transform: `scale(${zoom / 100})` }}
      >
        <iframe
          src={`${url}#toolbar=0`}
          className="w-[800px] h-[1000px]"
          title="PDF Preview"
        />
      </div>
    </div>
  );
}

// Image Viewer Component
function ImageViewer({ url, zoom, alt }: { url: string; zoom: number; alt: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <img
        src={url}
        alt={alt}
        style={{ 
          transform: `scale(${zoom / 100})`,
          maxWidth: '100%',
          height: 'auto',
        }}
        className="transition-transform duration-200"
      />
    </div>
  );
}
