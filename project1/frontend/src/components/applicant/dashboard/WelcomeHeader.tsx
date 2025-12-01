import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sparkles, Sun, Moon, Cloud } from 'lucide-react';
import { toPersianDate } from '@/utils/dateUtils';

export function WelcomeHeader() {
  const user = useAuthStore((state) => state.user);
  const currentHour = new Date().getHours();
  
  const getGreeting = () => {
    if (currentHour < 12) return { text: 'صبح بخیر', icon: Sun, color: 'from-amber-400 to-orange-500' };
    if (currentHour < 18) return { text: 'عصر بخیر', icon: Cloud, color: 'from-blue-400 to-cyan-500' };
    return { text: 'شب بخیر', icon: Moon, color: 'from-indigo-400 to-purple-500' };
  };

  const getPersianDate = () => {
    return toPersianDate(new Date(), 'full');
  };

  const getInitials = () => {
    if (!user?.firstName) return 'U';
    return user.firstName.charAt(0).toUpperCase();
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <div className="flex items-center gap-3">
      {/* Avatar - Compact */}
      <div className="relative">
        <Avatar className="h-10 w-10 border-2 border-white shadow-md">
          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-sm font-bold">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
      </div>
      
      {/* Text Content - Compact */}
      <div>
        <div className="flex items-center gap-1.5">
          <div className={`p-1 rounded bg-gradient-to-br ${greeting.color}`}>
            <GreetingIcon className="w-3 h-3 text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-900">
            {greeting.text}, {user?.firstName}
          </h1>
          <Sparkles className="w-4 h-4 text-yellow-500" />
        </div>
        <p className="text-xs text-muted-foreground">{getPersianDate()}</p>
      </div>
    </div>
  );
}
