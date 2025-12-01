import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Power, Trash2, Mail, Phone, Calendar } from 'lucide-react'
import { UserRole } from '@/types/roles'

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole[]
  phoneNumber?: string
  isActive: boolean
  createdAt: string
}

interface UserTableProps {
  users: User[]
  isLoading: boolean
  onViewDetails: (userId: string) => void
  onEditRoles: (userId: string) => void
  onToggleStatus: (userId: string) => void
  onDelete: (userId: string) => void
}

export default function UserTable({
  users,
  isLoading,
  onViewDetails,
  onEditRoles,
  onToggleStatus,
  onDelete
}: UserTableProps) {
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700'
      case 'club_member': return 'bg-green-100 text-green-700'
      case 'applicant': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'مدیر'
      case 'club_member': return 'عضو'
      case 'applicant': return 'متقاضی'
      default: return role
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse p-4 bg-gray-100 rounded-xl h-24"></div>
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Eye className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-600">کاربری یافت نشد</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {users.map((user, index) => (
        <motion.div
          key={user._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onViewDetails(user._id)}
          className="p-5 bg-gradient-to-r from-white to-gray-50 rounded-xl border-2 border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all group cursor-pointer"
        >
          <div className="flex items-start justify-between gap-4">
            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                    {user.firstName} {user.lastName}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </span>
                    {user.phoneNumber && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {user.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Roles & Status */}
              <div className="flex items-center gap-2 flex-wrap">
                {(Array.isArray(user.role) ? user.role : [user.role]).map((role) => (
                  <span
                    key={role}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(role)}`}
                  >
                    {getRoleLabel(role)}
                  </span>
                ))}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {user.isActive ? 'فعال' : 'غیرفعال'}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onEditRoles(user._id)
                }}
                className="border-2 hover:border-purple-300 hover:bg-purple-50"
                title="ویرایش نقش‌ها"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleStatus(user._id)
                }}
                className={`border-2 ${
                  user.isActive 
                    ? 'hover:border-red-300 hover:bg-red-50' 
                    : 'hover:border-green-300 hover:bg-green-50'
                }`}
                title={user.isActive ? 'غیرفعال کردن' : 'فعال کردن'}
              >
                <Power className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(user._id)
                }}
                className="border-2 hover:border-red-300 hover:bg-red-50 text-red-600"
                title="حذف کاربر"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
