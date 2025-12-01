import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, BookOpen, CheckCircle, Bookmark, TrendingUp } from 'lucide-react';

interface ResourceCardProps {
  resource: {
    _id: string;
    id: string;
    title: string;
    description: string;
    category: string;
    readTime: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    views: number;
    userProgress?: {
      status: 'not_started' | 'in_progress' | 'completed';
      progress: number;
      bookmarked: boolean;
    };
  };
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const {
    id,
    title,
    description,
    category,
    readTime,
    difficulty,
    views,
    userProgress
  } = resource;
  const navigate = useNavigate();

  // Debug log
  console.log('ResourceCard - id:', id, 'resource:', resource);

  const getCategoryColor = (cat: string) => {
    const colors = {
      foundation: 'from-purple-500 to-purple-600',
      hacker: 'from-green-500 to-green-600',
      hustler: 'from-orange-500 to-orange-600',
      hipster: 'from-pink-500 to-pink-600'
    };
    return colors[cat as keyof typeof colors] || 'from-blue-500 to-blue-600';
  };

  const getDifficultyBadge = (diff: string) => {
    const badges = {
      beginner: { label: 'مقدماتی', color: 'bg-green-100 text-green-800' },
      intermediate: { label: 'متوسط', color: 'bg-yellow-100 text-yellow-800' },
      advanced: { label: 'پیشرفته', color: 'bg-red-100 text-red-800' }
    };
    return badges[diff as keyof typeof badges] || badges.beginner;
  };

  const getStatusIcon = () => {
    if (!userProgress) return null;
    
    if (userProgress.status === 'completed') {
      return <CheckCircle className="w-5 h-5 text-green-500" fill="currentColor" />;
    }
    if (userProgress.status === 'in_progress') {
      return <TrendingUp className="w-5 h-5 text-blue-500" />;
    }
    return null;
  };

  const difficultyBadge = getDifficultyBadge(difficulty);

  return (
    <div
      onClick={() => navigate(`/club-member/resources/${id || resource._id}`)}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2"
    >
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${getCategoryColor(category)} p-6 text-white relative`}>
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-2">
            {userProgress?.bookmarked && (
              <Bookmark className="w-5 h-5" fill="currentColor" />
            )}
            {getStatusIcon()}
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{title}</h3>
      </div>

      {/* Body */}
      <div className="p-6">
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{description}</p>

        {/* Meta Info */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyBadge.color}`}>
            {difficultyBadge.label}
          </span>
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            {readTime}
          </span>
          <span className="text-sm text-gray-400">
            {views} بازدید
          </span>
        </div>

        {/* Progress Bar */}
        {userProgress && userProgress.progress > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">پیشرفت</span>
              <span className="font-medium text-blue-600">{userProgress.progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getCategoryColor(category)} transition-all duration-500`}
                style={{ width: `${userProgress.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button className={`w-full bg-gradient-to-r ${getCategoryColor(category)} text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all shadow-md hover:shadow-lg`}>
          {userProgress?.status === 'completed' ? 'مرور مجدد' : 
           userProgress?.status === 'in_progress' ? 'ادامه مطالعه' : 
           'شروع مطالعه'}
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;
