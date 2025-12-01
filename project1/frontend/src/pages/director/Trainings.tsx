import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Grid3x3, List, Download,
  BookOpen, TrendingUp, Clock, Award,
  Search, Users, MapPin
} from 'lucide-react';
import api from '@/lib/api';

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

const Trainings: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  // State
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    upcoming: 0,
    completed: 0
  });

  // Fetch trainings
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ page: '1', limit: '50' });
        if (search) params.append('search', search);
        if (typeFilter) params.append('type', typeFilter);
        if (statusFilter) params.append('status', statusFilter);
        if (levelFilter) params.append('level', levelFilter);

        console.log('🔍 Fetching trainings from:', `/trainings?${params}`);
        const response = await api.get(`/trainings?${params}`);
        console.log('✅ Trainings response:', response.data);
        setTrainings(response.data.trainings || []);
      } catch (error) {
        console.error('Error fetching trainings:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchTrainings, 300);
    return () => clearTimeout(timer);
  }, [search, typeFilter, statusFilter, levelFilter]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('🔍 Fetching analytics from:', '/trainings/analytics');
        const response = await api.get('/trainings/analytics');
        console.log('✅ Analytics response:', response.data);
        if (response.data.overview) {
          setStats(response.data.overview);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-50 text-green-700';
      case 'intermediate': return 'bg-yellow-50 text-yellow-700';
      case 'advanced': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'technical': return '💻';
      case 'soft-skills': return '🎯';
      case 'management': return '📊';
      case 'design': return '🎨';
      default: return '📚';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-indigo-600" />
              دوره‌های آموزشی
            </h1>
            <p className="text-sm text-slate-600 mt-1">مشاهده و مدیریت دوره‌های آموزشی</p>
          </div>

          <button
            onClick={() => navigate('/director/trainings/create')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            ایجاد دوره جدید
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-indigo-600 font-medium">کل دوره‌ها</p>
                <p className="text-2xl font-bold text-indigo-900 mt-1">{stats.total}</p>
              </div>
              <BookOpen className="w-8 h-8 text-indigo-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 font-medium">در حال برگزاری</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{stats.active}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 font-medium">آینده</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.upcoming}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-600 font-medium">تکمیل شده</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.completed}</p>
              </div>
              <Award className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="جستجو در دوره‌ها..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">همه انواع</option>
            <option value="technical">فنی</option>
            <option value="soft-skills">مهارت‌های نرم</option>
            <option value="management">مدیریتی</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="active">در حال برگزاری</option>
            <option value="upcoming">آینده</option>
            <option value="completed">تکمیل شده</option>
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">همه سطوح</option>
            <option value="beginner">مبتدی</option>
            <option value="intermediate">متوسط</option>
            <option value="advanced">پیشرفته</option>
          </select>

          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" />
            خروجی
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : trainings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">هنوز دوره‌ای ایجاد نشده</h3>
          <p className="text-slate-600 mb-6">برای شروع، اولین دوره آموزشی خود را ایجاد کنید</p>
          <button
            onClick={() => navigate('/director/trainings/create')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            ایجاد دوره جدید
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {trainings.map((training) => (
            <div
              key={training._id}
              onClick={() => navigate(`/director/trainings/${training._id}`)}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getTypeIcon(training.type)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(training.status)}`}>
                    {training.status === 'active' ? 'در حال برگزاری' :
                      training.status === 'upcoming' ? 'آینده' : 'تکمیل شده'}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getLevelColor(training.level)}`}>
                  {training.level === 'beginner' ? 'مبتدی' :
                    training.level === 'intermediate' ? 'متوسط' : 'پیشرفته'}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {training.title}
              </h3>
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{training.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Users className="w-4 h-4" />
                  <span>{training.participants.length} / {training.capacity} شرکت‌کننده</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>{training.duration} ساعت</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{training.isOnline ? 'آنلاین' : training.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm font-medium text-slate-900">{training.rating}</span>
                  <span className="text-xs text-slate-500">({training.reviews})</span>
                </div>
                <div className="text-sm font-bold text-indigo-600">
                  {training.price.toLocaleString()} تومان
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trainings;
