import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Edit, Power, Trash2, Mail, Phone, Calendar, GraduationCap, BookOpen, Crown, Shield, Briefcase, Users, FileText } from 'lucide-react'
import { UserRole } from '@/types/roles'

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole[]
  phoneNumber?: string
  university?: string
  major?: string
  isActive: boolean
  createdAt: string
}

interface UserGridProps {
  users: User[]
  isLoading: boolean
  onViewDetails: (userId: string) => void
  onEditRoles: (userId: string) => void
  onToggleStatus: (userId: string) => void
  onDelete: (userId: string) => void
}

export default function UserGrid({
  users,
  isLoading,
  onViewDetails,
  onEditRoles,
  onToggleStatus,
  onDelete
}: UserGridProps) {
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'director': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'admin': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'manager': return 'bg-cyan-100 text-cyan-700 border-cyan-200'
      case 'club_member': return 'bg-green-100 text-green-700 border-green-200'
      case 'applicant': return 'bg-orange-100 text-orange-700 border-orange-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'director': return 'مدیرکل'
      case 'admin': return 'مدیر سیستم'
      case 'manager': return 'مدیر'
      case 'club_member': return 'عضو باشگاه'
      case 'applicant': return 'متقاضی'
      default: return role
    }
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'director': return Crown
      case 'admin': return Shield
      case 'manager': return Briefcase
      case 'club_member': return Users
      case 'applicant': return FileText
      default: return Users
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-64"></div>
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-4">
          <Mail className="h-10 w-10 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">کاربری یافت نشد</h3>
        <p className="text-gray-600">فیلترها را تغییر دهید یا کاربر جدیدی اضافه کنید</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {users.map((user, index) => (
        <motion.div
          key={user._id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.03 }}
          onClick={() => onViewDetails(user._id)}
          className="group relative bg-white rounded-2xl border-2 border-gray-100 hover:border-purple-300 hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Content */}
          <div className="relative p-6 flex flex-col flex-1">
            {/* Avatar & Name */}
            <div className="flex items-start gap-4 mb-5">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-700 transition-colors mb-1 truncate">
                  {user.firstName} {user.lastName}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  user.isActive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  {user.isActive ? 'فعال' : 'غیرفعال'}
                </div>
              </div>
            </div>

            {/* Roles */}
            <div className="flex flex-wrap gap-2 mb-5">
              {(Array.isArray(user.role) ? user.role : [user.role]).map((role) => {
                const RoleIcon = getRoleIcon(role)
                return (
                  <div
                    key={role}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border-2 ${getRoleBadgeColor(role)} transition-transform group-hover:scale-105`}
                  >
                    <RoleIcon className="h-4 w-4" />
                    {getRoleLabel(role)}
                  </div>
                )
              })}
            </div>

            {/* Info */}
            <div className="space-y-3 mb-5 text-sm text-gray-700 flex-1">
              {user.phoneNumber && (
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                  <Phone className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="truncate font-medium">{user.phoneNumber}</span>
                </div>
              )}
              {user.university && (
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                  <GraduationCap className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                  <span className="truncate">{user.university}</span>
                </div>
              )}
              {user.major && (
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                  <BookOpen className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <span className="truncate">{user.major}</span>
                </div>
              )}
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 pb-4 border-b border-gray-100 mt-auto">
              <Calendar className="h-4 w-4" />
              <span>عضویت: {new Date(user.createdAt).toLocaleDateString('fa-IR')}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onEditRoles(user._id)
                }}
                className="flex-1 h-10 text-sm border-2 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700 transition-all"
              >
                <Edit className="h-4 w-4 ml-2" />
                ویرایش نقش
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleStatus(user._id)
                }}
                className={`h-10 px-3 border-2 transition-all ${
                  user.isActive 
                    ? 'hover:border-red-400 hover:bg-red-50 hover:text-red-700' 
                    : 'hover:border-green-400 hover:bg-green-50 hover:text-green-700'
                }`}
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
                className="h-10 px-3 border-2 hover:border-red-400 hover:bg-red-50 text-red-600 hover:text-red-700 transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Hover Effect Border */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-400 rounded-2xl pointer-events-none transition-colors duration-300" />
        </motion.div>
      ))}
    </div>
  )
}
