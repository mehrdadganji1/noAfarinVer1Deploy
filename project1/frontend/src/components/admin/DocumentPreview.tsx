import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Maximize2,
  X,
  FileText,
  AlertCircle
} from 'lucide-react'
import { FILE_SERVICE_URL } from '@/config/api'

interface DocumentPreviewProps {
  fileId: string
  fileName: string
  mimeType?: string
  onClose?: () => void
  showActions?: boolean
}

export default function DocumentPreview({
  fileId,
  fileName,
  mimeType,
  onClose,
  showActions = true
}: DocumentPreviewProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fileUrl = `${FILE_SERVICE_URL}/api/files/view/${fileId}`
  const isImage = mimeType?.startsWith('image/')
  const isPDF = mimeType === 'application/pdf'

  useEffect(() => {
    // Reset states when file changes
    setZoom(100)
    setRotation(0)
    setLoading(true)
    setError(null)
  }, [fileId])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50))
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)
  const handleFullscreen = () => setIsFullscreen(!isFullscreen)

  const handleLoad = () => setLoading(false)
  const handleError = () => {
    setLoading(false)
    setError('خطا در بارگذاری فایل')
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  const previewContent = (
    <div className="relative bg-gray-100 rounded-lg overflow-hidden min-h-[500px] flex items-center justify-center">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
          </div>
        </div>
      )}

      {isImage ? (
        <img
          src={fileUrl}
          alt={fileName}
          crossOrigin="anonymous"
          onLoad={handleLoad}
          onError={handleError}
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transition: 'transform 0.3s ease',
            maxWidth: '100%',
            maxHeight: '100%',
          }}
          className="object-contain"
        />
      ) : isPDF ? (
        <iframe
          src={`${fileUrl}#zoom=${zoom}`}
          onLoad={handleLoad}
          onError={handleError}
          className="w-full h-full min-h-[600px] border-0"
          title={fileName}
        />
      ) : (
        <div className="text-center p-8">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">پیش‌نمایش برای این نوع فایل در دسترس نیست</p>
          <Button onClick={handleDownload} variant="outline">
            <Download className="ml-2 h-4 w-4" />
            دانلود فایل
          </Button>
        </div>
      )}
    </div>
  )

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
        {/* Fullscreen Header */}
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold truncate max-w-md">{fileName}</h3>
          <div className="flex items-center gap-2">
            {showActions && (isImage || isPDF) && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                  className="text-white hover:bg-gray-800"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm px-2">{zoom}%</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                  className="text-white hover:bg-gray-800"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                {isImage && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleRotate}
                    className="text-white hover:bg-gray-800"
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDownload}
              className="text-white hover:bg-gray-800"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleFullscreen}
              className="text-white hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Fullscreen Content */}
        <div className="flex-1 overflow-auto p-4">
          {previewContent}
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            پیش‌نمایش: {fileName}
          </CardTitle>
          {onClose && (
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Actions Bar */}
        {showActions && (isImage || isPDF) && (
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-2 min-w-[60px] text-center">
                {zoom}%
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              {isImage && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRotate}
                  className="mr-2"
                >
                  <RotateCw className="h-4 w-4 ml-1" />
                  چرخش
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleFullscreen}>
                <Maximize2 className="h-4 w-4 ml-1" />
                تمام صفحه
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 ml-1" />
                دانلود
              </Button>
            </div>
          </div>
        )}

        {/* Preview */}
        {previewContent}
      </CardContent>
    </Card>
  )
}
