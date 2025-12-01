import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings, Bell, Mail, Smartphone, Volume2,
  Trophy, FolderKanban, Users, Calendar,
  BookOpen, MessageSquare, Moon, Save
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface NotificationPreferencesProps {
  onSave: (preferences: any) => void
  initialPreferences?: any
}

export default function NotificationPreferences({
  onSave,
  initialPreferences
}: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState({
    // Channels
    inApp: initialPreferences?.inApp ?? true,
    email: initialPreferences?.email ?? true,
    push: initialPreferences?.push ?? false,
    sound: initialPreferences?.sound ?? true,

    // Types
    achievement: initialPreferences?.achievement ?? true,
    project: initialPreferences?.project ?? true,
    milestone: initialPreferences?.milestone ?? true,
    team: initialPreferences?.team ?? true,
    event: initialPreferences?.event ?? true,
    course: initialPreferences?.course ?? true,
    community: initialPreferences?.community ?? true,
    system: initialPreferences?.system ?? true,

    // Do Not Disturb
    doNotDisturb: initialPreferences?.doNotDisturb ?? false,
    dndStart: initialPreferences?.dndStart ?? '22:00',
    dndEnd: initialPreferences?.dndEnd ?? '08:00',
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = (key: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(preferences)
    } finally {
      setIsSaving(false)
    }
  }

  const notificationTypes = [
    { key: 'achievement', label: 'دستاوردها', icon: Trophy, color: 'text-amber-600' },
    { key: 'project', label: 'پروژه‌ها', icon: FolderKanban, color: 'text-blue-600' },
    { key: 'team', label: 'تیم', icon: Users, color: 'text-purple-600' },
    { key: 'event', label: 'رویدادها', icon: Calendar, color: 'text-cyan-600' },
    { key: 'course', label: 'دوره‌ها', icon: BookOpen, color: 'text-indigo-600' },
    { key: 'community', label: 'انجمن', icon: MessageSquare, color: 'text-pink-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-xl flex items-center justify-center">
          <Settings className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">تنظیمات اعلانات</h2>
          <p className="text-sm text-gray-600">مدیریت نحوه دریافت اعلانات</p>
        </div>
      </div>

      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">کانال‌های اطلاع‌رسانی</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-600" />
              <div>
                <Label htmlFor="inApp" className="font-medium">اعلانات درون‌برنامه</Label>
                <p className="text-xs text-gray-500">نمایش اعلانات در سایت</p>
              </div>
            </div>
            <Switch
              id="inApp"
              checked={preferences.inApp}
              onCheckedChange={() => handleToggle('inApp')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-green-600" />
              <div>
                <Label htmlFor="email" className="font-medium">ایمیل</Label>
                <p className="text-xs text-gray-500">ارسال اعلانات به ایمیل</p>
              </div>
            </div>
            <Switch
              id="email"
              checked={preferences.email}
              onCheckedChange={() => handleToggle('email')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-purple-600" />
              <div>
                <Label htmlFor="push" className="font-medium">اعلانات Push</Label>
                <p className="text-xs text-gray-500">اعلانات مرورگر</p>
              </div>
            </div>
            <Switch
              id="push"
              checked={preferences.push}
              onCheckedChange={() => handleToggle('push')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-orange-600" />
              <div>
                <Label htmlFor="sound" className="font-medium">صدا</Label>
                <p className="text-xs text-gray-500">پخش صدا برای اعلانات</p>
              </div>
            </div>
            <Switch
              id="sound"
              checked={preferences.sound}
              onCheckedChange={() => handleToggle('sound')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">انواع اعلانات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notificationTypes.map((type) => {
              const Icon = type.icon
              return (
                <div key={type.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${type.color}`} />
                    <Label htmlFor={type.key} className="font-medium">{type.label}</Label>
                  </div>
                  <Switch
                    id={type.key}
                    checked={preferences[type.key as keyof typeof preferences] as boolean}
                    onCheckedChange={() => handleToggle(type.key)}
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Do Not Disturb */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-600" />
            حالت مزاحمت نشوید
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="doNotDisturb" className="font-medium">فعال‌سازی</Label>
              <p className="text-xs text-gray-500">غیرفعال کردن اعلانات در بازه زمانی مشخص</p>
            </div>
            <Switch
              id="doNotDisturb"
              checked={preferences.doNotDisturb}
              onCheckedChange={() => handleToggle('doNotDisturb')}
            />
          </div>

          {preferences.doNotDisturb && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-2 gap-4 pt-4 border-t"
            >
              <div>
                <Label htmlFor="dndStart">از ساعت</Label>
                <input
                  type="time"
                  id="dndStart"
                  value={preferences.dndStart}
                  onChange={(e) => setPreferences(prev => ({ ...prev, dndStart: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="dndEnd">تا ساعت</Label>
                <input
                  type="time"
                  id="dndEnd"
                  value={preferences.dndEnd}
                  onChange={(e) => setPreferences(prev => ({ ...prev, dndEnd: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600"
        >
          {isSaving ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              در حال ذخیره...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              ذخیره تنظیمات
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
