import { Calendar, Users, Clock, MapPin, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Training {
  _id: string;
  title: string;
  description: string;
  type: string;
  level: string;
  instructor: string;
  startDate: string;
  endDate: string;
  duration: number;
  status: string;
  capacity: number;
  participants: string[];
  location: string;
  isOnline: boolean;
  rating: number;
  reviews: number;
  price: number;
  certificate: boolean;
}

interface TrainingCardProps {
  training: Training;
  onView: (id: string) => void;
}

const statusColors: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

const typeLabels: Record<string, string> = {
  workshop: 'کارگاه',
  course: 'دوره',
  seminar: 'سمینار',
  bootcamp: 'بوت‌کمپ',
};

const levelLabels: Record<string, string> = {
  beginner: 'مبتدی',
  intermediate: 'متوسط',
  advanced: 'پیشرفته',
};

export const TrainingCard: React.FC<TrainingCardProps> = ({ training, onView }) => {
  const progress = (training.participants.length / training.capacity) * 100;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{training.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{training.description}</p>
        </div>
        <Badge className={statusColors[training.status] || 'bg-gray-100'}>
          {training.status}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 ml-2" />
          {new Date(training.startDate).toLocaleDateString('fa-IR')}
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 ml-2" />
          {training.duration} ساعت
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 ml-2" />
          {training.isOnline ? 'آنلاین' : training.location}
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 ml-2" />
          {training.participants.length} / {training.capacity} نفر
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">ظرفیت</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex gap-2">
          <Badge variant="outline">{typeLabels[training.type]}</Badge>
          <Badge variant="outline">{levelLabels[training.level]}</Badge>
          {training.certificate && (
            <Badge variant="outline" className="text-yellow-600">
              <Award className="w-3 h-3 ml-1" />
              گواهی
            </Badge>
          )}
        </div>

        <Button onClick={() => onView(training._id)} size="sm">
          مشاهده
        </Button>
      </div>

      {training.rating > 0 && (
        <div className="flex items-center gap-1 mt-3 pt-3 border-t">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-medium">{training.rating.toFixed(1)}</span>
          <span className="text-sm text-gray-500">({training.reviews} نظر)</span>
        </div>
      )}
    </div>
  );
};
