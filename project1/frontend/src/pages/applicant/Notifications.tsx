import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, Clock, AlertCircle, Info, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
// Mock notifications
const mockNotifications = [
  {
    id: '1',
    title: 'درخواست شما تایید شد',
    message: 'درخواست عضویت شما با موفقیت تایید شد.',
    time: '2 ساعت پیش',
    read: false,
    icon: CheckCircle2,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600'
  },
  {
    id: '2',
    title: 'مصاحبه جدید',
    message: 'یک مصاحبه برای روز پنجشنبه تعیین شده است.',
    time: '5 ساعت پیش',
    read: false,
    icon: Info,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  {
    id: '3',
    title: 'به‌روزرسانی پروفایل',
    message: 'لطفاً اطلاعات پروفایل خود را تکمیل کنید.',
    time: '1 روز پیش',
    read: true,
    icon: AlertCircle,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600'
  }
];

const colorConfig = {
  purple: {
    bg: 'from-purple-500 to-purple-600',
    text: 'text-purple-600',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700'
  },
  blue: {
    bg: 'from-blue-500 to-cyan-600',
    text: 'text-blue-600',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700'
  },
  green: {
    bg: 'from-emerald-500 to-teal-600',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700'
  }
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header - Same as Dashboard */}
      <div className="flex items-center justify-between flex-wrap gap-6">
        <div className="flex items-center gap-5">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-lg opacity-50 animate-pulse" />
            <Avatar className="relative h-16 w-16 border-4 border-white shadow-xl ring-2 ring-purple-200">
              <AvatarFallback className="bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 text-white text-xl font-bold">
                <Bell className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-rose-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
              >
                <span className="text-white text-xs font-bold">{unreadCount}</span>
              </motion.div>
            )}
          </motion.div>
          
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-2 mb-1"
            >
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
                اعلان‌ها
              </h1>
              <motion.div
                animate={{ 
                  rotate: [0, 15, -15, 15, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </motion.div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-sm text-muted-foreground font-medium flex items-center gap-2"
            >
              <span className="inline-block w-1 h-1 bg-purple-500 rounded-full" />
              {unreadCount} اعلان خوانده نشده
            </motion.p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <Button
              onClick={markAllAsRead}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Check className="w-4 h-4 mr-2" />
              خواندن همه
            </Button>
          </motion.div>
        )}
      </div>

      {/* Stats Overview - Same as Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'همه اعلان‌ها', count: notifications.length, color: 'purple' as const },
          { label: 'خوانده نشده', count: unreadCount, color: 'blue' as const },
          { label: 'خوانده شده', count: notifications.length - unreadCount, color: 'green' as const }
        ].map((stat, index) => {
          const colors = colorConfig[stat.color];
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <Card className={cn(
                "relative overflow-hidden border-2 rounded-2xl transition-all duration-300 hover:shadow-2xl group",
                colors.border
              )}>
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity",
                  colors.bg
                )} />
                
                <div className={cn(
                  "absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br opacity-10 blur-2xl",
                  colors.bg
                )} />

                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "p-3 rounded-xl bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform duration-300",
                      colors.bg
                    )}>
                      <Bell className="w-6 h-6 text-white" />
                    </div>
                    
                    {stat.count > 0 && (
                      <Badge className={cn(
                        "gap-1 border-0 shadow-sm",
                        colors.badge
                      )}>
                        <TrendingUp className="w-3 h-3" />
                        {stat.count}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </h3>
                    <p className={cn(
                      "text-3xl font-bold tracking-tight",
                      colors.text
                    )}>
                      {stat.count}
                    </p>
                  </div>

                  <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      className={cn("h-full bg-gradient-to-r", colors.bg)}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="bg-white border-2 border-gray-200 rounded-xl">
            <CardContent className="p-12 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">اعلانی وجود ندارد</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification, index) => {
            const Icon = notification.icon;

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn(
                  "bg-white border-2 rounded-xl transition-colors hover:shadow-lg",
                  notification.read ? "border-gray-200" : "border-purple-200"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn("p-2 rounded-lg", notification.iconBg)}>
                        <Icon className={cn("w-5 h-5", notification.iconColor)} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <Badge className="bg-purple-100 text-purple-700 border-0">
                              جدید
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {notification.time}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button
                            onClick={() => markAsRead(notification.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteNotification(notification.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
