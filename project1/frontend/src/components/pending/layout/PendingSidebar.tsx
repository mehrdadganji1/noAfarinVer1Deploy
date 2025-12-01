import { FC, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  FileText,
  User,
  HelpCircle,
  LogOut,
  Clock,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Edit,
  ChevronRight,
  Settings
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useApplicationStatus } from '@/hooks/useApplicationStatus';
import { cn } from '@/lib/utils';

interface PendingSidebarProps {
  onClose?: () => void;
}

interface NavItem {
  icon: any;
  label: string;
  path: string;
  badge?: string;
  description?: string;
}

const navItems: NavItem[] = [
  {
    icon: Home,
    label: 'داشبورد',
    path: '/pending',
    description: 'نمای کلی وضعیت'
  },
  {
    icon: Edit,
    label: 'فرم درخواست',
    path: '/pending/application-form',
    description: 'تکمیل فرم'
  },
  {
    icon: FileText,
    label: 'وضعیت درخواست',
    path: '/pending/status',
    description: 'پیگیری درخواست'
  },
  {
    icon: User,
    label: 'پروفایل',
    path: '/pending/profile',
    description: 'اطلاعات شخصی'
  },
  {
    icon: Settings,
    label: 'تنظیمات',
    path: '/pending/settings',
    description: 'تنظیمات حساب'
  },
  {
    icon: HelpCircle,
    label: 'راهنما و پشتیبانی',
    path: '/pending/help',
    description: 'دریافت کمک'
  }
];

// Status configuration
const statusConfig: Record<string, {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: any;
  pulse?: boolean;
}> = {
  submitted: {
    label: 'ارسال شده',
    description: 'درخواست شما دریافت شد',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: CheckCircle2,
    pulse: true
  },
  under_review: {
    label: 'در حال بررسی',
    description: 'تیم ما در حال بررسی است',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: Clock,
    pulse: true
  },
  interview_scheduled: {
    label: 'مصاحبه تعیین شده',
    description: 'آماده مصاحبه باشید',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: Sparkles,
    pulse: true
  },
  rejected: {
    label: 'رد شده',
    description: 'متاسفانه پذیرفته نشدید',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: AlertCircle
  },
  withdrawn: {
    label: 'لغو شده',
    description: 'درخواست لغو شده است',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    icon: AlertCircle
  }
};

export const PendingSidebar: FC<PendingSidebarProps> = ({ onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { data: applicationData } = useApplicationStatus();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavClick = () => {
    // Close mobile menu when navigation item is clicked
    if (onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    if (onClose) {
      onClose();
    }
    logout();
    window.location.href = '/';
  };

  // Get current status configuration
  const currentStatus = applicationData?.status || 'submitted';
  const statusInfo = statusConfig[currentStatus] || statusConfig.submitted;
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div 
      className="h-full bg-gradient-to-b from-white to-gray-50 border-l border-gray-200 flex flex-col relative"
      animate={{ width: isCollapsed ? '80px' : '256px' }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-3 top-6 z-50 w-6 h-6 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:border-purple-300 transition-all group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-purple-600" />
        </motion.div>
      </motion.button>
      {/* Header */}
      <div className={cn("p-6 border-b border-gray-200", isCollapsed && "p-4")}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("flex items-center gap-3 mb-4", isCollapsed && "justify-center mb-3")}
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            {statusInfo.pulse && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </span>
            )}
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="font-bold text-gray-800 whitespace-nowrap">پنل متقاضی</h2>
                <p className="text-xs text-gray-500 whitespace-nowrap">در انتظار تایید</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* User Info */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, height: 0 }}
              animate={{ opacity: 1, scale: 1, height: 'auto' }}
              exit={{ opacity: 0, scale: 0.95, height: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-3 border border-purple-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center shadow-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.email?.split('@')[0] || 'کاربر'}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 p-4 space-y-1.5 overflow-y-auto", isCollapsed && "p-2")}>
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.label : undefined}
              onClick={handleNavClick}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer',
                  isActive
                    ? 'bg-gradient-to-l from-purple-100 to-blue-100 text-purple-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800',
                  isCollapsed && 'justify-center px-2'
                )}
              >
                {/* Active indicator */}
                {isActive && !isCollapsed && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-l-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <div className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  isActive 
                    ? 'bg-white shadow-sm' 
                    : 'group-hover:bg-white/50'
                )}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                </div>
                
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div 
                      className="flex-1 min-w-0"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="font-medium text-sm block whitespace-nowrap">{item.label}</span>
                      {item.description && !isActive && (
                        <span className="text-xs text-gray-500 block truncate">
                          {item.description}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {item.badge && !isCollapsed && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Status Banner */}
      <div className={cn("p-4 border-t border-gray-200 space-y-3", isCollapsed && "p-2")}>
        {/* Dynamic Status Card */}
        {!isCollapsed ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'border rounded-xl p-3 relative overflow-hidden',
              statusInfo.bgColor,
              statusInfo.borderColor
            )}
          >
            {/* Animated background for active statuses */}
            {statusInfo.pulse && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            )}
            
            <div className="relative flex items-start gap-2">
              <div className={cn(
                'p-1.5 rounded-lg bg-white/50 backdrop-blur-sm',
                statusInfo.pulse && 'animate-pulse'
              )}>
                <StatusIcon className={cn('w-4 h-4', statusInfo.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-xs font-bold mb-0.5', statusInfo.color)}>
                  {statusInfo.label}
                </p>
                <p className={cn('text-xs', statusInfo.color, 'opacity-80')}>
                  {statusInfo.description}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className={cn(
              'border rounded-xl p-2 flex justify-center',
              statusInfo.bgColor,
              statusInfo.borderColor
            )}
            title={statusInfo.label}
          >
            <StatusIcon className={cn('w-5 h-5', statusInfo.color)} />
          </motion.div>
        )}

        {/* Contact Info */}
        {!isCollapsed && (
          <motion.div 
            className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p className="text-xs font-semibold text-gray-700 mb-2">تماس با پشتیبانی</p>
            <a
              href="mailto:noafarinevent@gmail.com"
              className="flex items-center gap-2 text-xs text-gray-600 hover:text-purple-600 transition-colors group"
            >
              <div className="p-1 rounded bg-white group-hover:bg-purple-50 transition-colors">
                <Mail className="w-3 h-3" />
              </div>
              <span>noafarinevent@gmail.com</span>
            </a>
            <a
              href="tel:+989982328585"
              className="flex items-center gap-2 text-xs text-gray-600 hover:text-purple-600 transition-colors group"
            >
              <div className="p-1 rounded bg-white group-hover:bg-purple-50 transition-colors">
                <Phone className="w-3 h-3" />
              </div>
              <span>09982328585</span>
            </a>
          </motion.div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-700 rounded-xl transition-all text-sm font-medium shadow-sm hover:shadow group",
            isCollapsed && "justify-center px-2"
          )}
          title={isCollapsed ? "خروج از حساب" : undefined}
        >
          <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap"
              >
                خروج از حساب
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
};
