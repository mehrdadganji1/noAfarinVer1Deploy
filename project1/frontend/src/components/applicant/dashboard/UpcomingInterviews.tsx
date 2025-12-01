import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Phone,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toPersianDate } from '@/utils/dateUtils';

interface Interview {
  _id: string;
  interviewDate: string;
  interviewTime: string;
  location: 'online' | 'office' | 'phone';
  interviewType: string;
  meetingLink?: string;
  officeAddress?: string;
  phoneNumber?: string;
}

interface UpcomingInterviewsProps {
  interviews: Interview[];
}

const locationConfig = {
  online: {
    icon: Video,
    label: 'آنلاین',
    gradient: 'from-blue-500 to-cyan-600',
    bg: 'from-blue-50 to-cyan-50',
    text: 'text-blue-600'
  },
  office: {
    icon: MapPin,
    label: 'حضوری',
    gradient: 'from-purple-500 to-fuchsia-600',
    bg: 'from-purple-50 to-fuchsia-50',
    text: 'text-purple-600'
  },
  phone: {
    icon: Phone,
    label: 'تلفنی',
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'from-emerald-50 to-teal-50',
    text: 'text-emerald-600'
  }
};

export function UpcomingInterviews({ interviews }: UpcomingInterviewsProps) {
  const navigate = useNavigate();

  if (!interviews || interviews.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200 rounded-xl">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 rounded-lg bg-slate-100">
              <Calendar className="w-4 h-4 text-slate-600" />
            </div>
            مصاحبه‌های پیش رو
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="text-center py-6">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">مصاحبه‌ای برنامه‌ریزی نشده</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-xl border border-purple-200 hover:border-purple-300 transition-all duration-200 hover:shadow-lg">
      <div className="h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 rounded-t-xl" />
      
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 rounded-lg bg-purple-100">
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            مصاحبه‌های پیش رو
          </CardTitle>
          <Badge className="bg-purple-500 text-white border-0 text-xs px-2 py-0.5">
            {interviews.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-3 space-y-2">
        {interviews.slice(0, 2).map((interview) => {
          const config = locationConfig[interview.location];
          const LocationIcon = config.icon;
          
          return (
            <div
              key={interview._id}
              className={cn(
                "p-3 rounded-lg border transition-all duration-200 hover:shadow-sm bg-gradient-to-br",
                config.bg,
                "border-gray-100"
              )}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className={cn("p-1.5 rounded-lg bg-gradient-to-br", config.gradient)}>
                  <LocationIcon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">مصاحبه {interview.interviewType}</h4>
                  <Badge className={cn("text-[10px] border-0 px-1.5 py-0", config.text, "bg-white/80")}>
                    {config.label}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {toPersianDate(interview.interviewDate, 'short')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {interview.interviewTime}
                </span>
              </div>

              <div className="flex gap-2">
                {interview.location === 'online' && interview.meetingLink && (
                  <Button
                    onClick={() => window.open(interview.meetingLink, '_blank')}
                    size="sm"
                    className="flex-1 h-7 text-xs bg-gradient-to-r from-blue-600 to-cyan-600"
                  >
                    <ExternalLink className="w-3 h-3 ml-1" />
                    ورود
                  </Button>
                )}
                <Button
                  onClick={() => navigate('/applicant/interviews')}
                  variant="outline"
                  size="sm"
                  className={cn('h-7 text-xs', interview.location === 'online' && interview.meetingLink ? 'flex-1' : 'w-full')}
                >
                  جزئیات
                </Button>
              </div>
            </div>
          );
        })}

        {interviews.length > 2 && (
          <Button
            onClick={() => navigate('/applicant/interviews')}
            variant="ghost"
            size="sm"
            className="w-full h-7 text-xs hover:bg-purple-50"
          >
            مشاهده همه ({interviews.length})
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
