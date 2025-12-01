import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Play, 
  Download, 
  Eye, 
  Clock,
  FileText,
  ExternalLink,
  Star
} from 'lucide-react'
import {
  Resource,
  ResourceType,
  RESOURCE_TYPE_CONFIG,
  formatDuration,
  formatViews,
  formatFileSize
} from '@/types/resource'

interface ResourceCardProps {
  resource: Resource
  onView?: (resource: Resource) => void
  onDownload?: (resource: Resource) => void
  compact?: boolean
  className?: string
}

export default function ResourceCard({
  resource,
  onView,
  onDownload,
  compact = false,
  className = ''
}: ResourceCardProps) {
  const typeConfig = RESOURCE_TYPE_CONFIG[resource.type]
  const isVideo = resource.type === ResourceType.VIDEO
  const isDownloadable = resource.downloadUrl || resource.fileUrl

  return (
    <Card className={`hover:shadow-lg transition-all ${className}`}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Thumbnail or Icon */}
          {resource.thumbnailUrl ? (
            <div className="relative rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={resource.thumbnailUrl} 
                alt={resource.title}
                className="w-full h-48 object-cover"
              />
              {isVideo && resource.duration && (
                <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(resource.duration)}
                </div>
              )}
              {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-blue-600 hover:bg-blue-700 rounded-full p-4 cursor-pointer transition-colors"
                       onClick={() => onView?.(resource)}>
                    <Play className="h-8 w-8 text-white" fill="white" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={`h-48 rounded-lg flex items-center justify-center ${typeConfig.bgColor}`}>
              {(() => {
                const IconComponent = typeConfig.icon
                return <IconComponent className="h-24 w-24 text-gray-400" />
              })()}
            </div>
          )}

          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                {resource.title}
              </h3>
              <Badge className={`${typeConfig.bgColor} ${typeConfig.color} border-0 shrink-0 flex items-center gap-1`}>
                {(() => {
                  const IconComponent = typeConfig.icon
                  return <IconComponent className="h-3 w-3" />
                })()}
                {typeConfig.label}
              </Badge>
            </div>

            {resource.featured && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 flex items-center gap-1">
                <Star className="h-3 w-3" fill="currentColor" />
                ویژه
              </Badge>
            )}
          </div>

          {/* Description */}
          {!compact && (
            <p className="text-sm text-gray-600 line-clamp-3">
              {resource.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {/* Views */}
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{formatViews(resource.views)} بازدید</span>
            </div>

            {/* Duration or File Size */}
            {isVideo && resource.duration ? (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDuration(resource.duration)}</span>
              </div>
            ) : resource.fileSize ? (
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>{formatFileSize(resource.fileSize)}</span>
              </div>
            ) : null}

            {/* Downloads */}
            {resource.downloads > 0 && (
              <div className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                <span>{formatViews(resource.downloads)} دانلود</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {resource.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
              {resource.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                  +{resource.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Author */}
          {resource.author && (
            <p className="text-xs text-gray-500">
              نویسنده: {resource.author}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            {/* View/Play Button */}
            {onView && (
              <Button
                onClick={() => onView(resource)}
                className="flex-1"
              >
                {isVideo ? (
                  <>
                    <Play className="ml-2 h-4 w-4" />
                    پخش ویدیو
                  </>
                ) : (
                  <>
                    <Eye className="ml-2 h-4 w-4" />
                    مشاهده
                  </>
                )}
              </Button>
            )}

            {/* Download Button */}
            {isDownloadable && onDownload && (
              <Button
                variant="outline"
                onClick={() => onDownload(resource)}
                className={onView ? '' : 'flex-1'}
              >
                <Download className="ml-2 h-4 w-4" />
                دانلود
              </Button>
            )}

            {/* External Link */}
            {resource.fileUrl && !onView && (
              <Button
                variant="outline"
                onClick={() => window.open(resource.fileUrl, '_blank')}
                className="flex-1"
              >
                <ExternalLink className="ml-2 h-4 w-4" />
                مشاهده
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
