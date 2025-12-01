import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Video, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Interview {
  id: string;
  title?: string;
  interviewDate: string;
  type?: string;
  location?: string;
  status?: string;
}

interface InterviewCardProps {
  interview: Interview;
  index: number;
}

function InterviewCard({ interview, index }: InterviewCardProps) {
  const date = new Date(interview.interviewDate);
  const isOnline = interview.type === 'online' || interview.location?.includes('zoom') || interview.location?.includes('meet');
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group relative"
    >
      <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200/50 hover:border-purple-300 transition-all duration-300 hover:shadow-lg overflow-hidden">
        {/* Gradient Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600" />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1">
                {interview.title || 'مصاحبه تخصصی'}
              </h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{date.toLocaleDateString('fa-IR')}</span>
              </div>
            </div>
            
            <Badge 
              variant={isOnline ? "default" : "secondary"}
              className={cn(
                "shadow-sm",
                isOnline && "bg-gradient-to-r from-purple-600 to-pink-600"
              )}
            >
              {isOnline ? (
                <>
                  <Video className="w-3 h-3 ml-1" />
                  آنلاین
                </>
              ) : (
                <>
                  <MapPin className="w-3 h-3 ml-1" />
                  حضوری
                </>
              )}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            
            {interview.location && !isOnline && (
              <div className="flex items-center gap-1.5 text-gray-600 flex-1 min-w-0">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{interview.location}</span>
              </div>
            )}
          </div>
          
          <Button 
            size="sm" 
            className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md"
          >
            مشاهده جزئیات
            <ChevronRight className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

interface InterviewsWidgetProps {
  interviews: Interview[];
}

export function InterviewsWidget({ interviews }: InterviewsWidgetProps) {
  if (!interviews || interviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200/80">
        <h3 className="font-bold text-gray-900 mb-4">مصاحبه‌های پیش رو</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 text-sm">هیچ مصاحبه‌ای برنامه‌ریزی نشده</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200/80 hover:border-gray-300 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-gray-900">مصاحبه‌های پیش رو</h3>
        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          {interviews.length} مصاحبه
        </Badge>
      </div>
      
      <div className="space-y-3">
        {interviews.slice(0, 3).map((interview, index) => (
          <InterviewCard
            key={interview.id}
            interview={interview}
            index={index}
          />
        ))}
      </div>
      
      {interviews.length > 3 && (
        <Button variant="ghost" className="w-full mt-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50">
          مشاهده همه ({interviews.length})
        </Button>
      )}
    </div>
  );
}
