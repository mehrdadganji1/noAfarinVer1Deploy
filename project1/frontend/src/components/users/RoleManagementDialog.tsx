import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { UserRole } from '@/types/roles'
import { Crown, Shield, Users, FileText, Briefcase, X, Check, Loader2 } from 'lucide-react'

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole[]
}

interface RoleManagementDialogProps {
  open: boolean
  onClose: () => void
  user: User | null
  onSave: (userId: string, roles: UserRole[]) => void
  isLoading: boolean
}

export default function RoleManagementDialog({
  open,
  onClose,
  user,
  onSave,
  isLoading
}: RoleManagementDialogProps) {
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([])

  useEffect(() => {
    if (user) {
      setSelectedRoles(user.role)
    }
  }, [user])

  const roleOptions = [
    {
      value: 'director' as UserRole,
      label: 'مدیرکل',
      emoji: '👑',
      description: 'بالاترین سطح دسترسی - کنترل کامل سیستم',
      icon: Crown,
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-700'
    },
    {
      value: 'admin' as UserRole,
      label: 'مدیر سیستم',
      emoji: '🔧',
      description: 'مدیریت کامل سیستم و کاربران',
      icon: Shield,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-700'
    },
    {
      value: 'manager' as UserRole,
      label: 'مدیر',
      emoji: '📊',
      description: 'نظارت و مدیریت عملیات',
      icon: Briefcase,
      gradient: 'from-cyan-500 to-teal-500',
      bgColor: 'bg-gradient-to-br from-cyan-50 to-teal-50',
      borderColor: 'border-cyan-300',
      textColor: 'text-cyan-700'
    },
    {
      value: 'club_member' as UserRole,
      label: 'عضو باشگاه',
      emoji: '👥',
      description: 'دسترسی به امکانات اعضا',
      icon: Users,
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-700'
    },
    {
      value: 'applicant' as UserRole,
      label: 'متقاضی',
      emoji: '📝',
      description: 'درخواست عضویت و پیگیری',
      icon: FileText,
      gradient: 'from-orange-500 to-amber-500',
      bgColor: 'bg-gradient-to-br from-orange-50 to-amber-50',
      borderColor: 'border-orange-300',
      textColor: 'text-orange-700'
    }
  ]

  const handleToggleRole = (role: UserRole) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    )
  }

  const handleSave = () => {
    if (user && selectedRoles.length > 0) {
      onSave(user._id, selectedRoles)
    }
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 gap-0">
        {/* Header */}
        <div className="relative p-6 pb-4 bg-gradient-to-r from-purple-600 to-pink-600">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-2">مدیریت نقش‌های کاربر</h2>
            <p className="text-lg font-semibold opacity-90">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm opacity-75">{user.email}</p>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-2 gap-3 p-6">
          {roleOptions.map((option) => {
            const Icon = option.icon
            const isSelected = selectedRoles.includes(option.value)
            
            return (
              <button
                key={option.value}
                onClick={() => handleToggleRole(option.value)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? `${option.bgColor} ${option.borderColor} shadow-lg`
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-10">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}

                <div className="flex flex-col items-center text-center gap-2">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.gradient} flex items-center justify-center shadow-md`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Label */}
                  <h3 className={`font-bold text-sm ${isSelected ? option.textColor : 'text-gray-900'}`}>
                    {option.label}
                  </h3>

                  {/* Description */}
                  <p className={`text-xs leading-tight ${isSelected ? option.textColor : 'text-gray-600'}`}>
                    {option.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 pt-4 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-12 text-base border-2"
          >
            انصراف
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || selectedRoles.length === 0}
            className="flex-1 h-12 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin ml-2" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Check className="h-5 w-5 ml-2" />
                ذخیره {selectedRoles.length > 0 && `(${selectedRoles.length})`}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
