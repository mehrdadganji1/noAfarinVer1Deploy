import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '@/types/event';

interface EventCardProps {
  event: Event;
  onRegister?: (eventId: string) => void;
  onUnregister?: (eventId: string) => void;
  onViewDetails?: (eventId: string) => void;
  isLoading?: boolean;
}

const eventTypeConfig: Record<string, { label: string; color: string }> = {
  workshop: { label: 'کارگاه', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  networking: { label: 'شبکه‌سازی', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  seminar: { label: 'سمینار', color: 'bg-green-100 text-green-700 border-green-300' },
  webinar: { label: 'وبینار', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  industrial_visit: { label: 'بازدید صنعتی', color: 'bg-teal-100 text-teal-700 border-teal-300' },
  pitch_session: { label: 'جلسه پیچ', color: 'bg-pink-100 text-pink-700 border-pink-300' },
};

const eventStatusConfig: Record<string, { label: string; color: string }> = {
  upcoming: { label: 'آینده', color: 'bg-blue-500' },
  ongoing: { label: 'در حال برگزاری', color: 'bg-green-500' },
  completed: { label: 'برگزار شده', color: 'bg-gray-500' },
  cancelled: { label: 'لغو شده', color: 'bg-red-500' },
};

export default function EventCard({ event, onRegister, onUnregister, onViewDetails, isLoading }: EventCardProps) {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const typeConfig = eventTypeConfig[event.type] || { label: event.type, color: 'bg-gray-100 text-gray-700 border-gray-300' };
  const statusConfig = eventStatusConfig[event.status] || { label: event.status, color: 'bg-gray-500' };
  
  // Get current user from localStorage
  const getCurrentUserId = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user._id || user.id;
      }
    } catch (e) {
      console.error('Error getting user ID:', e);
    }
    return null;
  };
  
  const currentUserId = getCurrentUserId();
  
  // Check if CURRENT user is registered
  const isUserRegistered = currentUserId && event.registeredParticipants?.includes(currentUserId);
  const isFull = event.registered >= event.capacity;
  const spotsLeft = event.capacity - event.registered;

  const handleRegister = async () => {
    if (isUserRegistered && onUnregister) {
      setIsRegistering(true);
      await onUnregister(event._id);
      setIsRegistering(false);
    } else if (onRegister) {
      setIsRegistering(true);
      await onRegister(event._id);
      setIsRegistering(false);
    }
  };

  const formatDate = (dateStr: string | Date) => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return date.toLocaleDateString('fa-IR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    navigate(`/club-member/events/${event._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card 
        className="h-full overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col cursor-pointer" 
        onClick={handleCardClick}
      >
        {/* Image/Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden flex-shrink-0">
          {event.thumbnail ? (
            <img src={event.thumbnail} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="h-20 w-20 text-blue-300" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge className={`${statusConfig.color} text-white border-0`}>
              {statusConfig.label}
            </Badge>
          </div>
          
          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={`${typeConfig.color} border`}>
              {typeConfig.label}
            </Badge>
          </div>

          {/* Registered Badge */}
          {isUserRegistered && (
            <div className="absolute bottom-3 right-3">
              <Badge className="bg-green-500 text-white border-0 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                ثبت‌نام شده
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-5 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[3.5rem]">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            {/* Date & Time */}
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span>{formatDate(event.date)}</span>
              <Clock className="h-4 w-4 text-blue-600 mr-2" />
              <span>{event.time}</span>
            </div>

            {/* Location or Online */}
            <div className="flex items-center gap-2 text-sm text-gray-700 min-h-[1.5rem]">
              {event.location ? (
                <>
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="line-clamp-1">{event.location}</span>
                </>
              ) : event.onlineLink ? (
                <>
                  <Video className="h-4 w-4 text-purple-600" />
                  <span>آنلاین</span>
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">مکان مشخص نشده</span>
                </>
              )}</div>

            {/* Capacity */}
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-orange-600" />
              <span className="text-gray-700">
                {event.registered} / {event.capacity} نفر
              </span>
              {!isFull && spotsLeft <= 5 && spotsLeft > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {spotsLeft} جا باقی مانده
                </Badge>
              )}
              {isFull && (
                <Badge variant="destructive" className="text-xs">
                  تکمیل ظرفیت
                </Badge>
              )}
            </div>
          </div>

          {/* Organizer */}
          <div className="min-h-[1.25rem]">
            {event.organizer && (
              <p className="text-xs text-gray-500">
                برگزارکننده: {event.organizer}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 flex gap-2 mt-auto">
          {/* Register/Unregister Button */}
          {event.status === 'upcoming' ? (
            <>
              {isUserRegistered ? (
                <Button
                  variant="outline"
                  className="flex-1 h-10"
                  onClick={handleRegister}
                  disabled={isRegistering || isLoading}
                >
                  {isRegistering || isLoading ? 'در حال لغو...' : 'لغو ثبت‌نام'}
                </Button>
              ) : (
                <Button
                  variant="default"
                  className="flex-1 h-10"
                  onClick={handleRegister}
                  disabled={isRegistering || isFull || isLoading}
                >
                  {isRegistering || isLoading ? 'در حال ثبت‌نام...' : isFull ? 'تکمیل ظرفیت' : 'ثبت‌نام'}
                </Button>
              )}
            </>
          ) : (
            <Button
              variant="outline"
              className="flex-1 h-10"
              disabled
            >
              {event.status === 'ongoing' ? 'در حال برگزاری' : event.status === 'completed' ? 'برگزار شده' : 'لغو شده'}
            </Button>
          )}

          {/* View Details Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/club-member/events/${event._id}`);
            }}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
