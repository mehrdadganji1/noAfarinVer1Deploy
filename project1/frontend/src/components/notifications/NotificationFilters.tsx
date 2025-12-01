import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Filter, 
  CheckCircle2, 
  Trash2, 
  Trophy, 
  FolderKanban, 
  Target, 
  Users, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  Settings 
} from 'lucide-react'

interface NotificationFiltersProps {
  typeFilter: string
  readFilter: string
  onTypeChange: (value: string) => void
  onReadFilterChange: (value: string) => void
  onMarkAllAsRead: () => void
  onDeleteAllRead: () => void
  hasUnread: boolean
}

export default function NotificationFilters({
  typeFilter,
  readFilter,
  onTypeChange,
  onReadFilterChange,
  onMarkAllAsRead,
  onDeleteAllRead,
  hasUnread,
}: NotificationFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-2 items-start lg:items-center justify-between">
      <div className="flex flex-wrap gap-1.5">
        {/* Type Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="h-3 w-3 text-gray-400" />
          <Select value={typeFilter} onValueChange={onTypeChange}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="نوع اعلان" />
            </SelectTrigger>
            <SelectContent align="end" className="text-right">
              <SelectItem value="all">
                <div className="flex items-center justify-between gap-2">
                  <span>همه انواع</span>
                </div>
              </SelectItem>
              <SelectItem value="achievement">
                <div className="flex items-center justify-between gap-2">
                  <span>دستاوردها</span>
                  <Trophy className="h-4 w-4 text-amber-600" />
                </div>
              </SelectItem>
              <SelectItem value="project">
                <div className="flex items-center justify-between gap-2">
                  <span>پروژه‌ها</span>
                  <FolderKanban className="h-4 w-4 text-blue-600" />
                </div>
              </SelectItem>
              <SelectItem value="milestone">
                <div className="flex items-center justify-between gap-2">
                  <span>مایلستون‌ها</span>
                  <Target className="h-4 w-4 text-green-600" />
                </div>
              </SelectItem>
              <SelectItem value="team">
                <div className="flex items-center justify-between gap-2">
                  <span>تیم</span>
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
              </SelectItem>
              <SelectItem value="event">
                <div className="flex items-center justify-between gap-2">
                  <span>رویدادها</span>
                  <Calendar className="h-4 w-4 text-cyan-600" />
                </div>
              </SelectItem>
              <SelectItem value="course">
                <div className="flex items-center justify-between gap-2">
                  <span>دوره‌ها</span>
                  <BookOpen className="h-4 w-4 text-indigo-600" />
                </div>
              </SelectItem>
              <SelectItem value="community">
                <div className="flex items-center justify-between gap-2">
                  <span>انجمن</span>
                  <MessageSquare className="h-4 w-4 text-pink-600" />
                </div>
              </SelectItem>
              <SelectItem value="system">
                <div className="flex items-center justify-between gap-2">
                  <span>سیستمی</span>
                  <Settings className="h-4 w-4 text-gray-600" />
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Read Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="h-3 w-3 text-gray-400" />
          <Select value={readFilter} onValueChange={onReadFilterChange}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="وضعیت" />
            </SelectTrigger>
            <SelectContent align="end" className="text-right">
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="unread">خوانده نشده</SelectItem>
              <SelectItem value="read">خوانده شده</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-1.5">
        {hasUnread && (
          <Button variant="outline" size="sm" onClick={onMarkAllAsRead} className="h-8 text-[10px] px-2">
            <CheckCircle2 className="h-3 w-3 ml-1" />
            علامت همه
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onDeleteAllRead} className="h-8 text-[10px] px-2">
          <Trash2 className="h-3 w-3 ml-1 text-red-600" />
          حذف خوانده شده
        </Button>
      </div>
    </div>
  )
}
