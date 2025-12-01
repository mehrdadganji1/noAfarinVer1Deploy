import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Mail, Phone, Camera } from 'lucide-react';

interface ProfileHeaderProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  university?: string;
  major?: string;
  bio?: string;
  avatar?: string;
  onEditPhoto?: () => void;
  onEditProfile?: () => void;
}

export function ProfileHeader({
  firstName,
  lastName,
  email,
  phoneNumber,
  university,
  major,
  bio,
  avatar,
  onEditPhoto,
  onEditProfile
}: ProfileHeaderProps) {
  const getInitials = () => {
    if (!firstName) return 'U';
    return firstName.charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col gap-3 md:gap-6 relative z-10">
      {/* Mobile: Ultra Minimal Design */}
      <div className="flex md:hidden flex-col items-center text-center gap-2 py-3">
        {/* Avatar */}
        <div className="relative">
          <Avatar className="h-20 w-20 border-2 border-white shadow-lg">
            {avatar && <AvatarImage src={avatar} alt={`${firstName} ${lastName}`} className="object-cover" />}
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-xl font-bold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          
          {/* Edit Photo Button */}
          {onEditPhoto && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onEditPhoto}
              className="absolute -bottom-0.5 -right-0.5 w-6 h-6 p-0 bg-white hover:bg-gray-50 rounded-full shadow-md border border-gray-200"
            >
              <Camera className="w-3 h-3 text-purple-600" />
            </Button>
          )}
        </div>

        {/* Name */}
        <h1 className="text-base font-bold text-gray-900 mt-1">
          {firstName} {lastName}
        </h1>
        
        {/* Status Badge */}
        <Badge 
          variant="secondary" 
          className="gap-1 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700"
        >
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          <span className="font-medium text-[10px]">فعال</span>
        </Badge>

        {/* University/Major */}
        {(major || university) && (
          <p className="text-[10px] text-gray-500 mt-0.5">
            {major && university ? `${major} • ${university}` : major || university}
          </p>
        )}

        {/* Contact Info - Inline */}
        {(email || phoneNumber) && (
          <div className="flex flex-col gap-1 mt-1 w-full px-4">
            {email && (
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-600">
                <Mail className="w-3 h-3" />
                <span className="truncate" dir="ltr">{email}</span>
              </div>
            )}
            {phoneNumber && (
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-600">
                <Phone className="w-3 h-3" />
                <span dir="ltr">{phoneNumber}</span>
              </div>
            )}
          </div>
        )}

        {/* Edit Button */}
        {onEditProfile && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onEditProfile}
            className="mt-2 h-7 px-3 border-purple-200 hover:bg-purple-50 hover:text-purple-700 transition-all gap-1.5"
          >
            <span className="text-sm">✏️</span>
            <span className="text-[10px]">ویرایش</span>
          </Button>
        )}
      </div>

      {/* Desktop: Original Layout */}
      <div className="hidden md:flex items-start justify-between flex-wrap gap-6">
        <div className="flex items-center gap-5">
          {/* Avatar with Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className="relative group shrink-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-lg opacity-50 animate-pulse" />
            <Avatar className="relative h-24 w-24 border-4 border-white shadow-xl ring-2 ring-purple-200">
              {avatar && <AvatarImage src={avatar} alt={`${firstName} ${lastName}`} className="object-cover" />}
              <AvatarFallback className="bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 text-white text-2xl font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            {/* Edit Photo Button */}
            {onEditPhoto && (
              <Button
                size="icon"
                variant="ghost"
                onClick={onEditPhoto}
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 hover:bg-black/50 rounded-full w-full h-full flex items-center justify-center"
              >
                <Camera className="w-6 h-6 text-white" />
              </Button>
            )}
            
            {/* Online Status */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="absolute bottom-1 right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full border-4 border-white shadow-lg"
            >
              <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
            </motion.div>
          </motion.div>
          
          {/* Text Content */}
          <div className="space-y-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-2 flex-wrap"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
                {firstName} {lastName}
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
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </motion.div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-base text-muted-foreground font-medium flex items-center gap-2"
            >
              <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full" />
              {major && university ? `${major} • ${university}` : major || university || 'متقاضی'}
            </motion.p>
          </div>
        </div>
        
        {/* Right Side Actions (Badge + Edit Button) */}
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <Badge 
              variant="secondary" 
              className="gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-700 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-sm">فعال</span>
            </Badge>
          </motion.div>

          {onEditProfile && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onEditProfile}
              className="border-purple-200 hover:bg-purple-50 hover:text-purple-700 transition-all"
            >
              <span className="ml-2">✏️</span>
              ویرایش پروفایل
            </Button>
          )}
        </div>
      </div>

      {/* Bio and Contact Info - Desktop */}
      {(bio || email || phoneNumber) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="hidden md:flex flex-col gap-3 pt-3 border-t border-gray-100/50"
        >
          {bio && (
            <div className="w-full p-3 bg-gray-50/80 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-600 leading-relaxed">{bio}</p>
            </div>
          )}
          <div className="flex flex-col gap-2 w-full">
            {email && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50/50 rounded-xl border border-blue-100/50">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-sm text-blue-700 truncate" dir="ltr">{email}</span>
              </div>
            )}
            {phoneNumber && (
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-sm text-emerald-700" dir="ltr">{phoneNumber}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
