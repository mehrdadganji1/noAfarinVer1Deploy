import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  Mail,
  Database,
  Globe,
  Save,
  RefreshCw,
} from 'lucide-react'
import { PageSkeleton } from '@/components/ui/page-skeleton'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function Settings() {
  const queryClient = useQueryClient()
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'پلتفرم نوآفرین',
    siteDescription: 'پلتفرم مدیریت باشگاه نوآفرینان',
    contactEmail: 'info@noavarin.ir',
    supportEmail: 'support@noavarin.ir',

    // Security Settings
    requireEmailVerification: true,
    enableTwoFactor: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,

    // Notification Settings
    enableEmailNotifications: true,
    enablePushNotifications: true,
    enableSMSNotifications: false,

    // Application Settings
    autoApproveApplications: false,
    requireDocumentVerification: true,
    maxApplicationsPerDay: 50,

    // System Settings
    maintenanceMode: false,
    debugMode: false,
    logLevel: 'info',
  })

  // Fetch settings
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/users/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data.data
    },
  })

  // Update settings when data is fetched
  useEffect(() => {
    if (settingsData) {
      setSettings(settingsData)
    }
  }, [settingsData])

  // Save settings mutation
  const saveMutation = useMutation({
    mutationFn: async (newSettings: typeof settings) => {
      const token = localStorage.getItem('token')
      const response = await axios.put(`${API_URL}/api/users/settings`, newSettings, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      alert('تنظیمات با موفقیت ذخیره شد')
    },
    onError: () => {
      alert('خطا در ذخیره تنظیمات')
    },
  })

  // Reset settings mutation
  const resetMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token')
      const response = await axios.post(`${API_URL}/api/users/settings/reset`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    },
    onSuccess: (data) => {
      setSettings(data.data)
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      alert('تنظیمات به حالت پیش‌فرض بازگردانده شد')
    },
    onError: () => {
      alert('خطا در بازگردانی تنظیمات')
    },
  })

  const handleSave = () => {
    saveMutation.mutate(settings)
  }

  const handleReset = () => {
    if (confirm('آیا مطمئن هستید که می‌خواهید تنظیمات را به حالت پیش‌فرض بازگردانید؟')) {
      resetMutation.mutate()
    }
  }

  if (isLoading) {
    return <PageSkeleton showHeader showStats={false} showFilters={false} itemsCount={8} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <SettingsIcon className="h-10 w-10" />
              تنظیمات سیستم
            </h1>
            <p className="text-purple-100">مدیریت تنظیمات و پیکربندی سیستم</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={handleReset}
              disabled={saveMutation.isPending || resetMutation.isPending}
            >
              <RefreshCw className="h-4 w-4 ml-2" />
              بازگردانی
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-purple-600 hover:bg-white/90"
              onClick={handleSave}
              disabled={saveMutation.isPending || resetMutation.isPending}
            >
              <Save className="h-4 w-4 ml-2" />
              ذخیره تغییرات
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">
            <Globe className="h-4 w-4 ml-2" />
            عمومی
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 ml-2" />
            امنیت
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 ml-2" />
            اعلانات
          </TabsTrigger>
          <TabsTrigger value="applications">
            <Mail className="h-4 w-4 ml-2" />
            درخواست‌ها
          </TabsTrigger>
          <TabsTrigger value="system">
            <Database className="h-4 w-4 ml-2" />
            سیستم
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات عمومی</CardTitle>
              <CardDescription>تنظیمات اصلی و اطلاعات پلتفرم</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">نام سایت</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">توضیحات سایت</Label>
                <Input
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">ایمیل تماس</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">ایمیل پشتیبانی</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات امنیتی</CardTitle>
              <CardDescription>مدیریت امنیت و احراز هویت</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تایید ایمیل الزامی</Label>
                  <p className="text-sm text-gray-500">کاربران باید ایمیل خود را تایید کنند</p>
                </div>
                <Switch
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, requireEmailVerification: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>احراز هویت دو مرحله‌ای</Label>
                  <p className="text-sm text-gray-500">فعال‌سازی 2FA برای کاربران</p>
                </div>
                <Switch
                  checked={settings.enableTwoFactor}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enableTwoFactor: checked })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">مدت زمان نشست (دقیقه)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">حداکثر تلاش ورود</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) =>
                      setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات اعلانات</CardTitle>
              <CardDescription>مدیریت کانال‌های اعلان‌رسانی</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>اعلانات ایمیل</Label>
                  <p className="text-sm text-gray-500">ارسال اعلانات از طریق ایمیل</p>
                </div>
                <Switch
                  checked={settings.enableEmailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enableEmailNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>اعلانات Push</Label>
                  <p className="text-sm text-gray-500">ارسال اعلانات Push در مرورگر</p>
                </div>
                <Switch
                  checked={settings.enablePushNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enablePushNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>اعلانات پیامکی</Label>
                  <p className="text-sm text-gray-500">ارسال اعلانات از طریق SMS</p>
                </div>
                <Switch
                  checked={settings.enableSMSNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enableSMSNotifications: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Application Settings */}
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات درخواست‌ها</CardTitle>
              <CardDescription>مدیریت فرآیند درخواست عضویت</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تایید خودکار درخواست‌ها</Label>
                  <p className="text-sm text-gray-500">درخواست‌ها به صورت خودکار تایید شوند</p>
                </div>
                <Switch
                  checked={settings.autoApproveApplications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoApproveApplications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تایید مدارک الزامی</Label>
                  <p className="text-sm text-gray-500">بررسی و تایید مدارک ضروری است</p>
                </div>
                <Switch
                  checked={settings.requireDocumentVerification}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, requireDocumentVerification: checked })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxApplicationsPerDay">حداکثر درخواست در روز</Label>
                <Input
                  id="maxApplicationsPerDay"
                  type="number"
                  value={settings.maxApplicationsPerDay}
                  onChange={(e) =>
                    setSettings({ ...settings, maxApplicationsPerDay: parseInt(e.target.value) })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات سیستم</CardTitle>
              <CardDescription>تنظیمات پیشرفته و نگهداری سیستم</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>حالت نگهداری</Label>
                  <p className="text-sm text-gray-500">سیستم در حالت نگهداری قرار گیرد</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, maintenanceMode: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>حالت دیباگ</Label>
                  <p className="text-sm text-gray-500">فعال‌سازی لاگ‌های دیباگ</p>
                </div>
                <Switch
                  checked={settings.debugMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, debugMode: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logLevel">سطح لاگ</Label>
                <select
                  id="logLevel"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.logLevel}
                  onChange={(e) => setSettings({ ...settings, logLevel: e.target.value })}
                >
                  <option value="error">Error</option>
                  <option value="warn">Warning</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
