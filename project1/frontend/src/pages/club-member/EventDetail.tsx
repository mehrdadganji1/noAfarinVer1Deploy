import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  MapPin,
  Users,
  Video,
  ArrowRight,
  CheckCircle2,
  User,
  FileText,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useEvent, useRegisterEvent, useCancelRegistration } from '@/hooks/useEvents';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { getEventTypeLabel, getEventTypeColor, getEventStatusLabel, getEventStatusColor, formatEventDate } from '@/types/event';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: event, isLoading, error } = useEvent(id!);
  const { mutate: register, isPending: isRegistering } = useRegisterEvent();
  const { mutate: unregister, isPending: isUnregistering } = useCancelRegistration();

  // Get current user
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
  const isUserRegistered = currentUserId && event?.registeredParticipants?.includes(currentUserId);
  const isFull = event ? event.registered >= event.capacity : false;
  const spotsLeft = event ? event.capacity - event.registered : 0;

  const handleRegister = () => {
    if (!id) return;
    
    if (isUserRegistered) {
      unregister(id);
    } else {
      register(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-cyan-50/20 to-purple-50/30 p-4 md:p-6" dir="rtl">
        <div className="max-w-[1200px] mx-auto">
          <LoadingSkeleton type="card" count={1} />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-cyan-50/20 to-purple-50/30 p-4 md:p-6" dir="rtl">
        <div className="max-w-[1200px] mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <p className="text-red-600 text-lg mb-4">رویداد مورد نظر یافت نشد</p>
              <Button onClick={() => navigate('/club-member/events')}>
                <ArrowRight className="ml-2 h-4 w-4" />
                بازگشت به لیست رویدادها
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const typeColor = getEventTypeColor(event.type as any);
  const statusColor = getEventStatusColor(event.status as any);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-cyan-50/20 to-purple-50/30 p-4 md:p-6" dir="rtl">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/club-member/events')}
          className="mb-4"
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          بازگشت به لیست رویدادها
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden">
            {/* Hero Image */}
            <div className="relative h-80 bg-gradient-to-br from-blue-100 to-indigo-100">
              {event.thumbnail ? (
                <img src={event.thumbnail} alt={event.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Calendar className="h-32 w-32 text-blue-300" />
                </div>
              )}
              
              {/* Overlay Badges */}
              <div className="absolute top-6 right-6 flex gap-2">
                <Badge className={`${statusColor === 'blue' ? 'bg-blue-500' : statusColor === 'green' ? 'bg-green-500' : statusColor === 'gray' ? 'bg-gray-500' : 'bg-red-500'} text-white border-0 text-base px-4 py-2`}>
                  {getEventStatusLabel(event.status as any)}
                </Badge>
                <Badge className={`${typeColor === 'blue' ? 'bg-blue-100 text-blue-700 border-blue-300' : typeColor === 'purple' ? 'bg-purple-100 text-purple-700 border-purple-300' : typeColor === 'green' ? 'bg-green-100 text-green-700 border-green-300' : typeColor === 'cyan' ? 'bg-cyan-100 text-cyan-700 border-cyan-300' : typeColor === 'orange' ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-pink-100 text-pink-700 border-pink-300'} border text-base px-4 py-2`}>
                  {getEventTypeLabel(event.type as any)}
                </Badge>
              </div>

              {isUserRegistered && (
                <div className="absolute bottom-6 right-6">
                  <Badge className="bg-green-500 text-white border-0 text-base px-4 py-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    شما در این رویداد ثبت‌نام کرده‌اید
                  </Badge>
                </div>
              )}
            </div>

            <CardHeader className="border-b">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <p className="text-gray-600 text-lg">{event.description}</p>
            </CardHeader>

            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Right Column - Details */}
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    جزئیات رویداد
                  </h2>

                  {/* Date & Time */}
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">تاریخ و زمان</p>
                      <p className="text-gray-700">{formatEventDate(event.date)}</p>
                      <p className="text-gray-700">{event.time}</p>
                      <p className="text-sm text-gray-600">مدت: {event.duration} ساعت</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    {event.location ? (
                      <>
                        <MapPin className="h-6 w-6 text-green-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">محل برگزاری</p>
                          <p className="text-gray-700">{event.location}</p>
                        </div>
                      </>
                    ) : event.onlineLink ? (
                      <>
                        <Video className="h-6 w-6 text-purple-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">رویداد آنلاین</p>
                          <a 
                            href={event.onlineLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            لینک ورود
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-6 w-6 text-gray-400 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">محل برگزاری</p>
                          <p className="text-gray-500">مشخص نشده</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Capacity */}
                  <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                    <Users className="h-6 w-6 text-orange-600 mt-1" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-2">ظرفیت</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">ثبت‌نام شده: {event.registered} نفر</span>
                          <span className="text-gray-700">ظرفیت: {event.capacity} نفر</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full transition-all"
                            style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                          />
                        </div>
                        {!isFull && spotsLeft <= 5 && spotsLeft > 0 && (
                          <p className="text-sm text-orange-600 font-semibold">
                            فقط {spotsLeft} جا باقی مانده!
                          </p>
                        )}
                        {isFull && (
                          <p className="text-sm text-red-600 font-semibold">
                            ظرفیت تکمیل شده
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Organizer */}
                  {event.organizer && (
                    <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                      <User className="h-6 w-6 text-purple-600 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">برگزارکننده</p>
                        <p className="text-gray-700">{event.organizer}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Left Column - Additional Info */}
                <div className="space-y-6">
                  
                  {/* Agenda */}
                  {event.agenda && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
                        دستور کار
                      </h2>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 whitespace-pre-line">{event.agenda}</p>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                        <Tag className="h-5 w-5 text-blue-600" />
                        برچسب‌ها
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Materials */}
                  {event.materials && event.materials.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
                        منابع و مواد آموزشی
                      </h2>
                      <ul className="space-y-2">
                        {event.materials.map((material: string, index: number) => (
                          <li key={index}>
                            <a 
                              href={material} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              منبع {index + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Registration Info */}
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-gray-900 mb-3">اطلاعات ثبت‌نام</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ثبت‌نام رایگان
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          دریافت گواهی شرکت
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          امکان لغو ثبت‌نام
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>

            {/* Footer - Action Buttons */}
            <CardFooter className="border-t p-6 bg-gray-50">
              <div className="w-full flex gap-4">
                {event.status === 'upcoming' ? (
                  <>
                    {isUserRegistered ? (
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1"
                        onClick={handleRegister}
                        disabled={isUnregistering}
                      >
                        {isUnregistering ? 'در حال لغو...' : 'لغو ثبت‌نام'}
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        className="flex-1"
                        onClick={handleRegister}
                        disabled={isRegistering || isFull}
                      >
                        {isRegistering ? 'در حال ثبت‌نام...' : isFull ? 'ظرفیت تکمیل شده' : 'ثبت‌نام در رویداد'}
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    disabled
                  >
                    {event.status === 'ongoing' ? 'در حال برگزاری' : event.status === 'completed' ? 'برگزار شده' : 'لغو شده'}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/club-member/events')}
                >
                  بازگشت
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
