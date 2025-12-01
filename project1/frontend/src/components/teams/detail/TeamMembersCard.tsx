import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, UserPlus, X, Crown, Star } from 'lucide-react'

interface TeamMembersCardProps {
  members: any[]
  canEdit: boolean
  onAddMember: () => void
  onRemoveMember: (userId: string, role: string) => void
  isRemoving: boolean
}

export default function TeamMembersCard({ 
  members, 
  canEdit, 
  onAddMember, 
  onRemoveMember,
  isRemoving 
}: TeamMembersCardProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'founder': return <Crown className="h-4 w-4 text-yellow-600" />
      case 'co-founder': return <Star className="h-4 w-4 text-purple-600" />
      default: return <Users className="h-4 w-4 text-blue-600" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'founder': return 'بنیان‌گذار'
      case 'co-founder': return 'هم‌بنیان‌گذار'
      default: return 'عضو'
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'founder': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'co-founder': return 'bg-purple-100 text-purple-800 border-purple-300'
      default: return 'bg-blue-100 text-blue-800 border-blue-300'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              اعضای تیم ({members?.length || 0})
            </CardTitle>
            {canEdit && (
              <Button
                size="sm"
                onClick={onAddMember}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <UserPlus className="h-4 w-4 ml-1" />
                افزودن عضو
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members && members.length > 0 ? (
              members.map((member: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl group transition-colors border border-gray-100"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">عضو {idx + 1}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getRoleIcon(member.role)}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getRoleBadgeColor(member.role)}`}>
                        {getRoleLabel(member.role)}
                      </span>
                    </div>
                  </div>
                  {canEdit && member.role !== 'founder' && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onRemoveMember(member.userId, member.role)}
                      disabled={isRemoving}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">هنوز عضوی به تیم اضافه نشده است</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
