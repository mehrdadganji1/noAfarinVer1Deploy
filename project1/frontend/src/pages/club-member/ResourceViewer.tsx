import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  BookOpen, 
  CheckCircle, 
  Clock,
  Share2,
  Bookmark,
  ThumbsUp,
  Eye,
  Award,
  TrendingUp
} from 'lucide-react';
import { useResourceDetail } from '../../hooks/useLearningResources';

const ResourceViewer: React.FC = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const { resource, loading, updateProgress, toggleBookmark, toggleLike } = useResourceDetail(resourceId || '');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Save progress periodically
  useEffect(() => {
    if (scrollProgress > 0 && timeSpent > 0) {
      const saveInterval = setInterval(() => {
        updateProgress(scrollProgress, timeSpent);
      }, 30000); // Save every 30 seconds

      return () => clearInterval(saveInterval);
    }
  }, [scrollProgress, timeSpent, updateProgress]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleComplete = async () => {
    await updateProgress(100, timeSpent, 'completed');
    
    if (resource?.nextResourceId) {
      navigate(`/club-member/resources/${resource.nextResourceId}`);
    } else {
      navigate('/club-member/resources');
    }
  };

  const handleBookmark = async () => {
    await toggleBookmark();
  };

  const handleLike = async () => {
    await toggleLike();
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      foundation: 'from-purple-600 to-purple-700',
      hacker: 'from-green-600 to-green-700',
      hustler: 'from-orange-600 to-orange-700',
      hipster: 'from-pink-600 to-pink-700'
    };
    return colors[category] || 'from-blue-600 to-blue-700';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      foundation: 'مبانی',
      hacker: 'Hacker (CTO)',
      hustler: 'Hustler (CEO)',
      hipster: 'Hipster (CPO)'
    };
    return labels[category] || category;
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, string> = {
      beginner: 'مقدماتی',
      intermediate: 'متوسط',
      advanced: 'پیشرفته'
    };
    return labels[difficulty] || difficulty;
  };

  if (loading || !resource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <BookOpen className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 font-medium">در حال بارگذاری محتوا...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Animated Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gray-200 z-50 shadow-lg">
        <div 
          className={`h-full bg-gradient-to-r ${getCategoryColor(resource.category)} transition-all duration-300 shadow-lg`}
          style={{ width: `${scrollProgress}%` }}
        >
          <div className="h-full w-full bg-white opacity-30 animate-pulse"></div>
        </div>
      </div>

      {/* Sticky Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm z-40">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/club-member/resources')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all hover:gap-3 group"
            >
              <ArrowRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">بازگشت به لیست</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBookmark}
                className={`p-2.5 rounded-xl transition-all transform hover:scale-110 ${
                  resource.userProgress?.bookmarked 
                    ? 'bg-yellow-100 text-yellow-600 shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="نشانک"
              >
                <Bookmark className="w-5 h-5" fill={resource.userProgress?.bookmarked ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleLike}
                className={`p-2.5 rounded-xl transition-all transform hover:scale-110 ${
                  resource.userProgress?.liked 
                    ? 'bg-red-100 text-red-600 shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="لایک"
              >
                <ThumbsUp className="w-5 h-5" fill={resource.userProgress?.liked ? 'currentColor' : 'none'} />
              </button>
              <button 
                className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all transform hover:scale-110"
                title="اشتراک‌گذاری"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className={`bg-gradient-to-br ${getCategoryColor(resource.category)} rounded-3xl p-10 text-white mb-8 shadow-2xl relative overflow-hidden`}>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            {/* Category Badge */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <BookOpen className="w-7 h-7" />
              </div>
              <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold backdrop-blur-sm">
                {getCategoryLabel(resource.category)}
              </span>
              <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                {getDifficultyLabel(resource.difficulty)}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl font-black mb-6 leading-tight">{resource.title}</h1>
            
            {/* Meta Info */}
            <div className="flex items-center gap-6 text-sm flex-wrap">
              <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{resource.readTime}</span>
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Eye className="w-5 h-5" />
                <span className="font-medium">{resource.views} بازدید</span>
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <ThumbsUp className="w-5 h-5" />
                <span className="font-medium">{resource.likes} لایک</span>
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Bookmark className="w-5 h-5" />
                <span className="font-medium">{resource.bookmarks} نشانک</span>
              </span>
            </div>

            {/* Progress Indicator */}
            {resource.userProgress && resource.userProgress.progress > 0 && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    پیشرفت شما
                  </span>
                  <span className="text-2xl font-black">{resource.userProgress.progress}%</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500 shadow-lg"
                    style={{ width: `${resource.userProgress.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-8 border border-gray-100">
          <article 
            className="prose prose-lg max-w-none
              prose-headings:text-gray-900 prose-headings:font-black
              prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8 prose-h1:pb-4 prose-h1:border-b-4 prose-h1:border-blue-500
              prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-blue-900
              prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-blue-800
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-4
              prose-strong:text-gray-900 prose-strong:font-bold
              prose-ul:my-6 prose-ul:space-y-2
              prose-li:text-gray-700 prose-li:leading-relaxed
              prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm
              prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-6 prose-pre:shadow-lg
              prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:italic
              prose-a:text-blue-600 prose-a:no-underline prose-a:font-medium hover:prose-a:text-blue-700 hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-lg
              prose-hr:border-gray-300 prose-hr:my-8"
            dangerouslySetInnerHTML={{ __html: resource.htmlContent }} 
          />
        </div>

        {/* Achievement Badge */}
        {resource.userProgress?.status === 'completed' && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 text-white mb-8 shadow-2xl text-center">
            <Award className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-black mb-2">🎉 تبریک! این منبع را تکمیل کردید</h3>
            <p className="text-green-100">شما این مطلب را با موفقیت مطالعه کردید</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <button
            onClick={() => navigate('/club-member/resources')}
            className="flex items-center gap-3 px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-bold transform hover:scale-105 hover:shadow-lg"
          >
            <ArrowRight className="w-5 h-5" />
            <span>بازگشت به لیست</span>
          </button>

          {resource.nextResourceId ? (
            <button
              onClick={handleComplete}
              className={`flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${getCategoryColor(resource.category)} text-white rounded-xl hover:shadow-2xl transition-all font-bold transform hover:scale-105`}
            >
              <CheckCircle className="w-6 h-6" />
              <span>تکمیل و ادامه</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-2xl transition-all font-bold transform hover:scale-105"
            >
              <CheckCircle className="w-6 h-6" />
              <span>تکمیل دوره</span>
              <Award className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceViewer;
