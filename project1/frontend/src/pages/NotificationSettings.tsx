import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NotificationPreferences from '@/components/notifications/NotificationPreferences'
import api from '@/lib/api'
import { toast } from '@/components/ui/toast'

export default function NotificationSettings() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Fetch current preferences
  const { data: preferences, isLoading } = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: async () => {
      try {
        const response = await api.get('/notifications/preferences')
        return response.data.data
      } catch (error) {
        console.warn('Failed to fetch preferences, using defaults')
        return null
      }
    },
  })

  // Save preferences mutation
  const savePreferencesMutation = useMutation({
    mutationFn: async (prefs: any) => {
      const response = await api.put('/notifications/preferences', prefs)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] })
      toast.success('تنظیمات با موفقیت ذخیره شد')
    },
    onError: () => {
      toast.error('خطا در ذخیره تنظیمات')
    },
  })

  const handleSave = async (prefs: any) => {
    await savePreferencesMutation.mutateAsync(prefs)
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#7209B7] via-[#AB47BC] to-[#FF006E] rounded-lg p-[2px]">
          <div className="w-full h-full bg-white rounded-lg" />
        </div>
        
        <div className="relative bg-gradient-to-br from-white to-neutral-50/50 rounded-lg shadow-[0_0_15px_rgba(114,9,183,0.08)] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#7209B7]/15 to-[#AB47BC]/15 rounded-xl flex items-center justify-center">
                <Settings className="h-6 w-6 text-[#7209B7]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  تنظیمات اعلانات
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  مدیریت نحوه دریافت و نمایش اعلانات
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/notifications')}
              className="gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              بازگشت
            </Button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <NotificationPreferences
        initialPreferences={preferences}
        onSave={handleSave}
      />
    </div>
  )
}
