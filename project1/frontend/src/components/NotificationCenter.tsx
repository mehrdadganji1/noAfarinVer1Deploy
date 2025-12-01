import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, Trash2, ExternalLink, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { 
  useNotifications, 
  useUnreadCount, 
  useMarkAsRead, 
  useMarkAllAsRead,
  useDeleteNotification,
  Notification 
} from '@/hooks/useNotifications';
import { useSocket } from '@/hooks/useSocket';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { data: notificationsData, isLoading } = useNotifications(1, 10);
  const { data: unreadCount = 0 } = useUnreadCount();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteMutation = useDeleteNotification();
  const { isConnected } = useSocket();

  const notifications = Array.isArray(notificationsData?.data) ? notificationsData.data : [];

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDelete = (notificationId: string) => {
    deleteMutation.mutate(notificationId);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          {/* Connection indicator */}
          {isConnected && (
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border-2 border-white" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96">
        <div dir="rtl">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">اعلان‌ها</h3>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={markAllAsReadMutation.isPending}
                >
                  <CheckCheck className="h-4 w-4 ml-2" />
                  خواندن همه
                </Button>
              )}
            </div>
          </div>

          <ScrollArea className="h-[400px]">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4">در حال بارگذاری...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>اعلانی وجود ندارد</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </ScrollArea>

          {notifications.length > 0 && (
            <div className="p-3 border-t flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/notifications');
                }}
              >
                مشاهده همه اعلان‌ها
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/notifications/settings');
                }}
                title="تنظیمات اعلان‌ها"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-50 border-r-4 border-red-500';
      case 'HIGH':
        return 'bg-orange-50 border-r-4 border-orange-500';
      case 'MEDIUM':
        return 'bg-blue-50 border-r-4 border-blue-500';
      default:
        return 'bg-white';
    }
  };

  return (
    <div 
      className={`p-4 hover:bg-gray-50 transition-colors ${
        !notification.isRead ? 'bg-blue-50' : ''
      } ${getPriorityColor(notification.priority)}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold mb-1 ${!notification.isRead ? 'text-blue-900' : 'text-gray-900'}`}>
            {notification.title}
          </h4>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>
              {formatDistanceToNow(new Date(notification.createdAt), { 
                addSuffix: true
              })}
            </span>
            {notification.link && (
              <>
                <span>•</span>
                <a 
                  href={notification.link} 
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3 w-3" />
                  مشاهده
                </a>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-1">
          {!notification.isRead && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification._id);
              }}
              title="علامت به عنوان خوانده شده"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-800"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('آیا از حذف این اعلان اطمینان دارید؟')) {
                onDelete(notification._id);
              }
            }}
            title="حذف"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
