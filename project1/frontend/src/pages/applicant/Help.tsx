import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowRight,
  Search,
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Send,
  Loader2,
  AlertCircle,
  Sparkles,
  BookOpen,
  FileQuestion
} from 'lucide-react'
import FAQItem from '@/components/applicant/FAQItem'
import { FAQ, FAQCategory, FAQ_CATEGORY_CONFIG } from '@/types/faq'
import { toast } from '@/lib/toast'
import { PENDING_HELP_FAQS } from '@/data/pendingHelpFAQs'

interface ContactFormData {
  subject: string
  message: string
}

export default function Help() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | undefined>()
  const [showContactForm, setShowContactForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>()

  // Filter FAQs
  const filteredFAQs = PENDING_HELP_FAQS.filter(faq => {
    const matchesSearch = !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = !selectedCategory || faq.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Group by category
  const groupedFAQs = filteredFAQs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = []
    }
    acc[faq.category].push(faq)
    return acc
  }, {} as Record<FAQCategory, FAQ[]>)

  const handleFeedback = (faqId: string, helpful: boolean) => {
    console.log('FAQ feedback:', faqId, helpful)
    // TODO: Send to API
  }

  const onContactSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true)
      console.log('Contact form:', data)
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('پیام شما با موفقیت ارسال شد')
      reset()
      setShowContactForm(false)
    } catch (error) {
      toast.error('خطا در ارسال پیام')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-full flex flex-col font-primary">
      {/* Compact Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 mb-4"
      >
        <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-2xl p-4 border border-purple-100 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <HelpCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  راهنما و پشتیبانی
                  <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                </h1>
                <p className="text-xs text-gray-600">سوالات متداول و ارتباط با پشتیبانی</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/applicant/dashboard')}
              className="h-9 border-2 hover:border-purple-400 hover:bg-purple-50 rounded-xl"
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              بازگشت
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
        {/* Right Sidebar - Minimal & Professional */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-3 overflow-y-auto"
        >
          {/* Stats Grid - Minimal */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3 border border-blue-200/50 hover:shadow-md transition-shadow">
              <FileQuestion className="h-5 w-5 text-blue-600 mb-2" />
              <p className="text-2xl font-black text-gray-900">{PENDING_HELP_FAQS.length}</p>
              <p className="text-[10px] text-gray-600 font-medium">سوال متداول</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-3 border border-purple-200/50 hover:shadow-md transition-shadow">
              <BookOpen className="h-5 w-5 text-purple-600 mb-2" />
              <p className="text-2xl font-black text-gray-900">{Object.keys(FAQ_CATEGORY_CONFIG).length}</p>
              <p className="text-[10px] text-gray-600 font-medium">دسته‌بندی</p>
            </div>
          </div>

          {/* Support Badge */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-xl p-4 text-white shadow-lg">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-xs font-bold">آنلاین</span>
              </div>
              <p className="text-2xl font-black mb-1">24/7</p>
              <p className="text-xs opacity-90">پشتیبانی همیشگی</p>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="space-y-2">
            <Button
              onClick={() => setShowContactForm(!showContactForm)}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all"
            >
              <MessageSquare className="ml-2 h-4 w-4" />
              {showContactForm ? 'بستن فرم تماس' : 'ارسال پیام'}
            </Button>

            {/* Quick Contact Links */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:02112345678"
                className="flex items-center justify-center gap-2 p-3 bg-white border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 rounded-xl transition-all group"
              >
                <Phone className="h-4 w-4 text-purple-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-gray-700">تماس</span>
              </a>
              <a
                href="mailto:support@noafarin.com"
                className="flex items-center justify-center gap-2 p-3 bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl transition-all group"
              >
                <Mail className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-gray-700">ایمیل</span>
              </a>
            </div>
          </div>

          {/* Contact Info - Minimal */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-3 border border-gray-200/50">
            <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wider">اطلاعات تماس</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-purple-500 rounded-full" />
                <span className="text-xs text-gray-700 font-medium">09982328585</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-500 rounded-full" />
                <span className="text-xs text-gray-700 font-medium">support@noafarin.com</span>
              </div>
            </div>
          </div>

          {/* Contact Form - Compact */}
          <AnimatePresence>
            {showContactForm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white rounded-xl border-2 border-blue-200 shadow-lg p-4">
                  <form onSubmit={handleSubmit(onContactSubmit)} className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="subject" className="text-xs font-bold text-gray-700">موضوع</Label>
                      <Input
                        id="subject"
                        {...register('subject', {
                          required: 'موضوع الزامی است',
                          minLength: { value: 5, message: 'حداقل 5 کاراکتر' }
                        })}
                        placeholder="موضوع پیام"
                        className={`h-9 text-sm rounded-lg border-2 ${errors.subject ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-400'}`}
                      />
                      {errors.subject && (
                        <p className="text-[10px] text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-2.5 w-2.5" />
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-xs font-bold text-gray-700">پیام</Label>
                      <Textarea
                        id="message"
                        {...register('message', {
                          required: 'متن پیام الزامی است',
                          minLength: { value: 20, message: 'حداقل 20 کاراکتر' }
                        })}
                        placeholder="پیام خود را بنویسید..."
                        rows={4}
                        className={`text-sm rounded-lg border-2 resize-none ${errors.message ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-400'}`}
                      />
                      {errors.message && (
                        <p className="text-[10px] text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-2.5 w-2.5" />
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-9 text-sm rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          در حال ارسال...
                        </>
                      ) : (
                        <>
                          <Send className="ml-2 h-4 w-4" />
                          ارسال
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Main Content - FAQs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 flex flex-col overflow-hidden"
        >
          {/* Search & Filters */}
          <div className="flex-shrink-0 space-y-3 mb-4">
            <Card className="border-2 border-purple-100 shadow-md">
              <CardContent className="p-3">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="جستجو در سوالات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 h-9 text-sm border-2 border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={!selectedCategory ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(undefined)}
                className="h-8 text-xs rounded-xl border-2"
              >
                همه ({PENDING_HELP_FAQS.length})
              </Button>
              {Object.entries(FAQ_CATEGORY_CONFIG).map(([key, config]) => {
                const count = PENDING_HELP_FAQS.filter(f => f.category === key).length
                const IconComponent = config.icon
                return (
                  <Button
                    key={key}
                    size="sm"
                    variant={selectedCategory === key ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(key as FAQCategory)}
                    className="h-8 text-xs rounded-xl border-2"
                  >
                    <IconComponent className="h-3.5 w-3.5 ml-1.5" />
                    {config.label} ({count})
                  </Button>
                )
              })}
            </div>
          </div>

          {/* FAQs List - Scrollable */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {Object.entries(groupedFAQs).map(([category, faqs]) => {
              const config = FAQ_CATEGORY_CONFIG[category as FAQCategory]
              const IconComponent = config.icon
              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3 sticky top-0 bg-white/95 backdrop-blur-sm py-2 z-10">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center shadow-sm">
                      <IconComponent className="h-4 w-4 text-blue-600" />
                    </div>
                    <h2 className="text-base font-bold text-gray-900">{config.label}</h2>
                  </div>
                  <div className="space-y-2">
                    {faqs.map((faq) => (
                      <FAQItem
                        key={faq._id}
                        faq={faq}
                        onHelpful={handleFeedback}
                      />
                    ))}
                  </div>
                </div>
              )
            })}

            {/* No Results */}
            {filteredFAQs.length === 0 && (
              <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white shadow-md">
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4 shadow-md">
                    <HelpCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    سوالی یافت نشد
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
                    متاسفانه سوالی با این مشخصات پیدا نشد. می‌توانید با پشتیبانی تماس بگیرید.
                  </p>
                  <Button onClick={() => setShowContactForm(true)} size="sm" className="h-9 rounded-xl">
                    <MessageSquare className="ml-2 h-4 w-4" />
                    تماس با پشتیبانی
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
