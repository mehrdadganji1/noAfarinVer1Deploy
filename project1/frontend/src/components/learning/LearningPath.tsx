import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Lock } from 'lucide-react';

interface LearningPathProps {
  resources: Array<{
    _id: string;
    id: string;
    title: string;
    readTime: string;
    order: number;
    userProgress?: {
      status: 'not_started' | 'in_progress' | 'completed';
      progress: number;
    };
  }>;
}

const LearningPath: React.FC<LearningPathProps> = ({ resources }) => {
  const navigate = useNavigate();

  const sortedResources = resources.sort((a, b) => a.order - b.order);

  const getStepStatus = (resource: any, index: number) => {
    if (resource.userProgress?.status === 'completed') {
      return 'completed';
    }
    if (resource.userProgress?.status === 'in_progress') {
      return 'current';
    }
    
    // Check if previous steps are completed
    const previousCompleted = index === 0 || 
      sortedResources.slice(0, index).every(r => r.userProgress?.status === 'completed');
    
    return previousCompleted ? 'available' : 'locked';
  };

  const getStepIcon = (status: string, progress?: number) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" fill="currentColor" />;
      case 'current':
        return (
          <div className="w-6 h-6 rounded-full border-2 border-blue-500 bg-blue-50 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        );
      case 'available':
        return (
          <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        );
      case 'locked':
        return <Lock className="w-6 h-6 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStepColors = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-green-50 hover:bg-green-100',
          border: 'border-green-200',
          text: 'text-green-900'
        };
      case 'current':
        return {
          bg: 'bg-blue-50 hover:bg-blue-100',
          border: 'border-blue-200',
          text: 'text-blue-900'
        };
      case 'available':
        return {
          bg: 'bg-white hover:bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-900'
        };
      case 'locked':
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-500'
        };
      default:
        return {
          bg: 'bg-white',
          border: 'border-gray-200',
          text: 'text-gray-900'
        };
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">🎯 مسیر یادگیری پیشنهادی</h2>
          <p className="text-purple-100 mt-1">
            برای بهترین نتیجه، منابع را به ترتیب زیر مطالعه کنید
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {sortedResources.map((resource, index) => {
          const status = getStepStatus(resource, index);
          const colors = getStepColors(status);
          const isClickable = status === 'available' || status === 'current' || status === 'completed';
          
          return (
            <div
              key={resource._id}
              onClick={() => isClickable && navigate(`/club-member/resources/${resource.id}`)}
              className={`
                ${colors.bg} ${colors.border} ${colors.text}
                border rounded-xl p-4 transition-all duration-300
                ${isClickable ? 'cursor-pointer transform hover:scale-[1.02] shadow-lg' : 'cursor-not-allowed opacity-60'}
              `}
            >
              <div className="flex items-center gap-4">
                {/* Step Number & Icon */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center font-bold text-white">
                    {index + 1}
                  </div>
                  {getStepIcon(status, resource.userProgress?.progress)}
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{resource.title}</h3>
                  <div className="flex items-center gap-4 text-sm opacity-80">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {resource.readTime}
                    </span>
                    {resource.userProgress?.progress && resource.userProgress.progress > 0 && (
                      <span>پیشرفت: {resource.userProgress.progress}%</span>
                    )}
                  </div>
                  
                  {/* Progress Bar for current/in-progress */}
                  {status === 'current' && resource.userProgress?.progress && (
                    <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${resource.userProgress.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                
                {/* Action */}
                {isClickable && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {status === 'completed' ? 'مرور' : 
                       status === 'current' ? 'ادامه' : 'شروع'}
                    </span>
                    <ArrowLeft className="w-5 h-5" />
                  </div>
                )}
                
                {status === 'locked' && (
                  <div className="text-sm text-gray-400">
                    ابتدا مراحل قبلی را تکمیل کنید
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary */}
      <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span>مجموع زمان مطالعه:</span>
          <span className="font-semibold">
            {sortedResources.reduce((total, resource) => {
              const minutes = parseInt(resource.readTime.replace(' دقیقه', ''));
              return total + (isNaN(minutes) ? 0 : minutes);
            }, 0)} دقیقه
          </span>
        </div>
      </div>
    </div>
  );
};

export default LearningPath;
