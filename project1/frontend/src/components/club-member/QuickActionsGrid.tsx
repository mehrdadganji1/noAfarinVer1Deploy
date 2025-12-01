import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  FolderKanban,
  GraduationCap,
  Users,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: typeof Calendar;
  path: string;
  color: string;
  gradient: string;
  bgGradient: string;
  badge?: string | number;
  featured?: boolean;
}

const quickActions: QuickAction[] = [
  {
    id: 'profile',
    title: 'پروفایل من',
    description: 'مشاهده و ویرایش اطلاعات شخصی',
    icon: User,
    path: '/club-member/profile',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50',
    featured: true,
  },
  {
    id: 'events',
    title: 'رویدادها',
    description: 'مشاهده و ثبت‌نام در رویدادهای آینده',
    icon: Calendar,
    path: '/club-member/events',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    badge: 'جدید',
  },
  {
    id: 'projects',
    title: 'پروژه‌ها',
    description: 'شرکت در پروژه‌های مشترک',
    icon: FolderKanban,
    path: '/club-member/projects',
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50',
  },
  {
    id: 'courses',
    title: 'دوره‌ها',
    description: 'دسترسی به آموزش‌های آنلاین',
    icon: GraduationCap,
    path: '/club-member/courses',
    color: 'orange',
    gradient: 'from-orange-500 to-amber-500',
    bgGradient: 'from-orange-50 to-amber-50',
  },
  {
    id: 'community',
    title: 'شبکه اعضا',
    description: 'ارتباط با سایر اعضای باشگاه',
    icon: Users,
    path: '/club-member/community',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50',
    badge: 'به زودی',
  },
  {
    id: 'achievements',
    title: 'دستاوردها',
    description: 'نشان‌ها و امتیازات شما',
    icon: Award,
    path: '/club-member/achievements',
    color: 'amber',
    gradient: 'from-amber-500 to-yellow-500',
    bgGradient: 'from-amber-50 to-yellow-50',
    badge: 'به زودی',
  },
  {
    id: 'resources',
    title: 'منابع آموزشی',
    description: 'کتابخانه منابع و مستندات',
    icon: BookOpen,
    path: '/club-member/resources',
    color: 'indigo',
    gradient: 'from-indigo-500 to-blue-500',
    bgGradient: 'from-indigo-50 to-blue-50',
  },
];

export default function QuickActionsGrid() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-purple-600" />
          </div>
          دسترسی سریع
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => navigate(action.path)}
                  className="w-full text-right group"
                >
                  <Card className="h-full border-2 border-transparent hover:border-gray-200 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    {/* Featured badge */}
                    {action.featured && (
                      <div className="absolute top-2 left-2 z-10">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5">
                          ✨ ویژه
                        </Badge>
                      </div>
                    )}
                    
                    {/* Background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    
                    <CardContent className="p-5 relative">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.bgGradient} border-2 border-${action.color}-200 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`h-7 w-7 text-${action.color}-600`} />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-gray-900 text-lg">
                              {action.title}
                            </h3>
                            {action.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {action.badge}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {action.description}
                          </p>
                          
                          {/* Arrow indicator */}
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-400 group-hover:text-gray-700 transition-colors">
                            <span>ورود</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </button>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
