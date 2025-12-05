import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserRole, RoleLabels, RoleDescriptions } from '@/types/roles'
import { Check, X } from 'lucide-react'
import api from '@/lib/api'

interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole[]
}

interface RoleAssignmentModalProps {
  user: User
  onClose: () => void
  onSuccess: () => void
}

export default function RoleAssignmentModal({ user, onClose, onSuccess }: RoleAssignmentModalProps) {
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(user.role)
  const [loading, setLoading] = useState(false)

  const allRoles = Object.values(UserRole)

  const toggleRole = (role: UserRole) => {
    setSelectedRoles((prev) => {
      if (prev.includes(role)) {
        // نگذار کاربر بدون نقش بمونه
        if (prev.length === 1) {
          alert('کاربر باید حداقل یک نقش داشته باشد')
          return prev
        }
        return prev.filter((r) => r !== role)
      } else {
        return [...prev, role]
      }
    })
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      await api.post('/roles/assign', {
        userId: user._id,
        roles: selectedRoles,
      })
      alert('نقش‌ها با موفقیت تغییر یافت')
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('خطا در تغییر نقش‌ها:', error)
      alert(error.response?.data?.error || 'خطا در تغییر نقش‌ها')
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'border-red-500 bg-red-50',
      [UserRole.DIRECTOR]: 'border-rose-600 bg-rose-50',
      [UserRole.MANAGER]: 'border-purple-500 bg-purple-50',
      [UserRole.COORDINATOR]: 'border-blue-500 bg-blue-50',
      [UserRole.JUDGE]: 'border-yellow-500 bg-yellow-50',
      [UserRole.MENTOR]: 'border-green-500 bg-green-50',
      [UserRole.TEAM_LEADER]: 'border-indigo-500 bg-indigo-50',
      [UserRole.CLUB_MEMBER]: 'border-purple-600 bg-purple-100',
      [UserRole.APPLICANT]: 'border-teal-500 bg-teal-50',
    }
    return colors[role] || 'border-gray-300 bg-gray-50'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <Card className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()} dir="rtl">
        <CardHeader>
          <CardTitle>مدیریت نقش‌ها</CardTitle>
          <CardDescription>
            <div className="mt-2">
              <p className="font-medium">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-3">نقش‌های فعلی:</h3>
              <div className="flex flex-wrap gap-2">
                {user.role.map((role) => (
                  <Badge key={role} className="bg-primary text-white">
                    {RoleLabels[role]}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-3">انتخاب نقش‌های جدید:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allRoles.map((role) => {
                  const isSelected = selectedRoles.includes(role)
                  return (
                    <button
                      key={role}
                      onClick={() => toggleRole(role)}
                      className={`p-4 border-2 rounded-lg text-right transition-all ${
                        isSelected
                          ? `${getRoleColor(role)} border-opacity-100`
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 ${isSelected ? 'text-primary' : 'text-gray-400'}`}>
                          {isSelected ? (
                            <Check className="h-5 w-5 text-green-600" />
                          ) : (
                            <div className="h-5 w-5 border-2 border-gray-300 rounded"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{RoleLabels[role]}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {RoleDescriptions[role].split(' - ')[1]}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <p className="font-medium mb-1">📌 نکات مهم:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>کاربر می‌تواند چند نقش داشته باشد</li>
                  <li>دسترسی‌ها بر اساس مجموع نقش‌ها محاسبه می‌شود</li>
                  <li>حداقل یک نقش برای کاربر الزامی است</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                <X className="h-4 w-4 ml-2" />
                انصراف
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    در حال ذخیره...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 ml-2" />
                    ذخیره تغییرات
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
