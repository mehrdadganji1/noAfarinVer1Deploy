import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { StatsOverview } from '@/components/applicant/dashboard/StatsOverview'
import { 
  Search,
  BookOpen,
  Video,
  FileText,
  Star,
  Filter,
  X,
  TrendingUp,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import {
  useResources,
  useFeaturedResources,
  useTrackView,
  useTrackDownload
} from '@/hooks/useResources'
import ResourceCard from '@/components/applicant/ResourceCard'
import { 
  Resource, 
  ResourceType, 
  ResourceCategory,
  RESOURCE_TYPE_CONFIG,
  RESOURCE_CATEGORY_CONFIG
} from '@/types/resource'

export default function Resources() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<ResourceType | undefined>()
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | undefined>()
  const [showFilters, setShowFilters] = useState(false)

  const { data: allResources, isLoading } = useResources()
  const { resources: featuredResources } = useFeaturedResources()
  const trackViewMutation = useTrackView()
  const trackDownloadMutation = useTrackDownload()

  // Filter resources
  const filteredResources = allResources?.filter(resource => {
    const matchesSearch = !searchQuery || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = !selectedType || resource.type === selectedType
    const matchesCategory = !selectedCategory || resource.category === selectedCategory

    return matchesSearch && matchesType && matchesCategory
  })

  const handleView = async (resource: Resource) => {
    try {
      await trackViewMutation.mutateAsync(resource._id)
      
      if (resource.type === ResourceType.VIDEO && resource.videoUrl) {
        window.open(resource.videoUrl, '_blank')
      } else if (resource.fileUrl) {
        window.open(resource.fileUrl, '_blank')
      }
    } catch (error) {
      console.error('Track view error:', error)
    }
  }

  const handleDownload = async (resource: Resource) => {
    try {
      await trackDownloadMutation.mutateAsync(resource._id)
      
      const downloadUrl = resource.downloadUrl || resource.fileUrl
      if (downloadUrl) {
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = resource.title
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('Track download error:', error)
    }
  }

  const clearFilters = () => {
    setSelectedType(undefined)
    setSelectedCategory(undefined)
    setSearchQuery('')
  }

  const activeFiltersCount = (selectedType ? 1 : 0) + (selectedCategory ? 1 : 0)

  // Stats for StatsOverview
  const stats = [
    {
      title: 'همه منابع',
      value: allResources?.length || 0,
      icon: BookOpen,
      color: 'blue' as const,
      description: 'منابع آموزشی'
    },
    {
      title: 'ویدیوها',
      value: allResources?.filter(r => r.type === ResourceType.VIDEO).length || 0,
      icon: Video,
      color: 'red' as const,
      description: 'ویدیوهای آموزشی'
    },
    {
      title: 'اسناد',
      value: allResources?.filter(r => r.type === ResourceType.DOCUMENT).length || 0,
      icon: FileText,
      color: 'green' as const,
      description: 'فایل‌های PDF'
    },
    {
      title: 'منابع ویژه',
      value: featuredResources?.length || 0,
      icon: Star,
      color: 'orange' as const,
      description: 'پیشنهاد ویژه'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
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
            در حال بارگذاری منابع...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 font-primary">
      {/* Custom Header for Resources */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-blue-100 to-pink-100 rounded-3xl blur-xl opacity-70" />
        <div className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-3xl p-6 sm:p-8 border-2 border-purple-100 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-3 border-white shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 flex items-center justify-center">
                  <BookOpen className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
              </Avatar>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
                  منابع آموزشی
                  <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">راهنماها، ویدیوها و مطالب آموزشی</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/applicant/dashboard')}
              className="h-11 border-2 hover:border-purple-400 hover:bg-purple-50 rounded-xl"
            >
              <ArrowRight className="ml-2 h-5 w-5" />
              بازگشت به داشبورد
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-2 border-purple-100 shadow-lg shadow-purple-100/50 hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-300">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="جستجو در منابع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-11 h-11 text-sm border-2 border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
                />
              </div>

              {/* Filter Button */}
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowFilters(!showFilters)}
                className="h-11 relative border-2 hover:border-purple-400 hover:bg-purple-50 transition-all rounded-xl"
              >
                <Filter className="ml-2 h-5 w-5" />
                فیلترها
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-2 -left-2 h-6 w-6 p-0 flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {/* Clear Filters */}
              {(searchQuery || activeFiltersCount > 0) && (
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={clearFilters}
                  className="h-11 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                >
                  <X className="ml-2 h-5 w-5" />
                  پاک کردن
                </Button>
              )}
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 mt-6 border-t-2 border-gray-100 space-y-5">
                    {/* Type Filters */}
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                        نوع منبع
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant={!selectedType ? 'default' : 'outline'}
                          onClick={() => setSelectedType(undefined)}
                          className="h-9 rounded-xl border-2"
                        >
                          همه
                        </Button>
                        {Object.entries(RESOURCE_TYPE_CONFIG).map(([key, config]) => {
                          const IconComponent = config.icon
                          return (
                            <Button
                              key={key}
                              size="sm"
                              variant={selectedType === key ? 'default' : 'outline'}
                              onClick={() => setSelectedType(key as ResourceType)}
                              className="h-9 rounded-xl border-2"
                            >
                              <IconComponent className="h-4 w-4 ml-1.5" />
                              {config.label}
                            </Button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Category Filters */}
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-purple-600" />
                        دسته‌بندی
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant={!selectedCategory ? 'default' : 'outline'}
                          onClick={() => setSelectedCategory(undefined)}
                          className="h-9 rounded-xl border-2"
                        >
                          همه
                        </Button>
                        {Object.entries(RESOURCE_CATEGORY_CONFIG).map(([key, config]) => {
                          const IconComponent = config.icon
                          return (
                            <Button
                              key={key}
                              size="sm"
                              variant={selectedCategory === key ? 'default' : 'outline'}
                              onClick={() => setSelectedCategory(key as ResourceCategory)}
                              className="h-9 rounded-xl border-2"
                            >
                              <IconComponent className="h-4 w-4 ml-1.5" />
                              {config.label}
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Featured Resources */}
      {!searchQuery && !selectedType && !selectedCategory && featuredResources && featuredResources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-200 flex items-center justify-center shadow-lg shadow-amber-200/50">
              <Star className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">منابع ویژه</h2>
              <p className="text-sm text-gray-600">پیشنهادهای برتر برای شما</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredResources.map((resource, index) => (
              <motion.div
                key={resource._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + index * 0.05 }}
              >
                <ResourceCard
                  resource={resource}
                  onView={handleView}
                  onDownload={handleDownload}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* All Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-200 flex items-center justify-center shadow-lg shadow-blue-200/50">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {searchQuery || selectedType || selectedCategory ? 'نتایج جستجو' : 'همه منابع'}
              </h2>
              <p className="text-sm text-gray-600">{filteredResources?.length || 0} منبع موجود</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm px-4 py-2 rounded-xl font-bold">
            {filteredResources?.length || 0} مورد
          </Badge>
        </div>

        {filteredResources && filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + index * 0.03 }}
              >
                <ResourceCard
                  resource={resource}
                  onView={handleView}
                  onDownload={handleDownload}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white shadow-lg">
              <CardContent className="pt-16 pb-16 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <BookOpen className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  منبعی یافت نشد
                </h3>
                <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                  متاسفانه منبعی با این مشخصات پیدا نشد. لطفاً فیلترها را تغییر دهید یا عبارت جستجوی دیگری امتحان کنید.
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={clearFilters}
                  className="h-11 border-2 hover:border-purple-400 hover:bg-purple-50 rounded-xl"
                >
                  <X className="ml-2 h-5 w-5" />
                  پاک کردن فیلترها
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
