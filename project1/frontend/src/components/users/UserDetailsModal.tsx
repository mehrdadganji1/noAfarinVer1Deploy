import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Mail, Phone, Calendar, GraduationCap, Award, User } from 'lucide-react'
import { UserRole } from '@/types/roles'

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole[]
  university?: string
  major?: string
  degree?: string
  studentId?: string
  phoneNumber?: string
  dateOfBirth?: string
  expertise?: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface UserDetailsModalProps {
  open: boolean
  onClose: () => void
  user: User | null
  isLoading: boolean
}

export default function UserDetailsModal({ open, onClose, user, isLoading }: UserDetailsModalProps) {
  if (!user) return null

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'مدیر'
      case 'club_member': return 'عضو باشگاه'
      case 'applicant': return 'متقاضی'
      default: return role
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">جزئیات کاربر</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-20 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  {user.role.map((role) => (
                    <span key={role} className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-semibold">
                      {getRoleLabel(role)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm font-medium">ایمیل</span>
                </div>
                <p className="text-gray-900 font-semibold">{user.email}</p>
              </div>

              {user.phoneNumber && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm font-medium">تلفن</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{user.phoneNumber}</p>
                </div>
              )}

              {user.dateOfBirth && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">تاریخ تولد</span>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {new Date(user.dateOfBirth).toLocaleDateString('fa-IR')}
                  </p>
                </div>
              )}

              {user.studentId && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">شماره دانشجویی</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{user.studentId}</p>
                </div>
              )}
            </div>

            {/* Academic Info */}
            {(user.university || user.major || user.degree) && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <div className="flex items-center gap-2 text-blue-700 mb-3">
                  <GraduationCap className="h-5 w-5" />
                  <span className="font-semibold">اطلاعات تحصیلی</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {user.university && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1">دانشگاه</p>
                      <p className="text-sm font-semibold text-gray-900">{user.university}</p>
                    </div>
                  )}
                  {user.major && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1">رشته</p>
                      <p className="text-sm font-semibold text-gray-900">{user.major}</p>
                    </div>
                  )}
                  {user.degree && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1">مقطع</p>
                      <p className="text-sm font-semibold text-gray-900">{user.degree}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Expertise */}
            {user.expertise && user.expertise.length > 0 && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div className="flex items-center gap-2 text-green-700 mb-3">
                  <Award className="h-5 w-5" />
                  <span className="font-semibold">تخصص‌ها</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.expertise.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-gray-600 mb-1">تاریخ ثبت‌نام</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">آخرین بروزرسانی</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(user.updatedAt).toLocaleDateString('fa-IR')}
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
