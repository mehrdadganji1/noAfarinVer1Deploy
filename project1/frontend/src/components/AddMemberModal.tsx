import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Users } from 'lucide-react'
import api from '@/lib/api'

interface AddMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teamId: string
}

export function AddMemberModal({ open, onOpenChange, teamId }: AddMemberModalProps) {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [role, setRole] = useState('member')

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const response = await api.get(`/users?limit=50`)
        return response.data.data?.users || response.data.data || []
      } catch (error) {
        console.error('Error fetching users:', error)
        return []
      }
    },
  })

  const filteredUsers = users?.filter((user: any) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
    const email = user.email?.toLowerCase() || ''
    return fullName.includes(query) || email.includes(query)
  }) || []

  const addMemberMutation = useMutation({
    mutationFn: async () => {
      if (!selectedUser) return
      const response = await api.post(`/teams/${teamId}/members`, {
        userId: selectedUser._id,
        role,
      })
      return response.data
    },
    onSuccess: () => {
      alert('عضو با موفقیت اضافه شد')
      queryClient.invalidateQueries({ queryKey: ['team', teamId] })
      onOpenChange(false)
      setSearchQuery('')
      setSelectedUser(null)
      setRole('member')
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'خطا در افزودن عضو')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) {
      alert('لطفاً یک کاربر انتخاب کنید')
      return
    }
    addMemberMutation.mutate()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>افزودن عضو جدید</DialogTitle>
          <DialogDescription>
            کاربر مورد نظر را جستجو و به تیم اضافه کنید
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
          {/* Search User */}
          <div>
            <label className="block text-sm font-medium mb-1">جستجوی کاربر</label>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="نام یا ایمیل کاربر را وارد کنید"
            />
          </div>

          {/* Users List */}
          {isLoading && (
            <div className="text-center py-4 text-gray-500">در حال جستجو...</div>
          )}

          {filteredUsers && filteredUsers.length > 0 && (
            <div className="border rounded-lg max-h-60 overflow-y-auto">
              {filteredUsers.map((user: any) => (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => setSelectedUser(user)}
                  className={`w-full p-3 text-right hover:bg-gray-50 transition-colors ${
                    selectedUser?._id === user._id ? 'bg-primary/10 border-r-4 border-primary' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {searchQuery && filteredUsers && filteredUsers.length === 0 && !isLoading && (
            <div className="text-center py-4 text-gray-500">
              کاربری یافت نشد
            </div>
          )}

          {/* Selected User */}
          {selectedUser && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-2">کاربر انتخاب شده:</p>
              <p className="font-medium">
                {selectedUser.firstName} {selectedUser.lastName}
              </p>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>
          )}

          {/* Role Selection */}
          {selectedUser && (
            <div>
              <label className="block text-sm font-medium mb-1">نقش در تیم</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="member">عضو</option>
                <option value="co-founder">هم‌بنیان‌گذار</option>
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={addMemberMutation.isPending}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={addMemberMutation.isPending || !selectedUser}
            >
              {addMemberMutation.isPending ? 'در حال افزودن...' : 'افزودن عضو'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}