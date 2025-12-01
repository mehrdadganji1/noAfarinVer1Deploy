import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Edit, Trash2, Users, Clock, MapPin, Award,
  BookOpen, Star, Calendar, DollarSign, CheckCircle, Download
} from 'lucide-react';
import axios from 'axios';

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
  materials: string[];
  prerequisites: string[];
  rating: number;
  reviews: number;
  price: number;
  certificate: boolean;
}

const TrainingDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'participants' | 'stats'>('details');

  useEffect(() => {
    fetchTraining();
  }, [id]);

  const fetchTraining = async () => {
    try {
      const response = await axios.get(`http://localhost:3003/api/trainings/${id}`);
      setTraining(response.data);
    } catch (error) {
      console.error('Error fetching training:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('آیا از حذف این دوره اطمینان دارید؟')) return;
    
    try {
      await axios.delete(`http://localhost:3003/api/trainings/${id}`);
      navigate('/director/trainings');
    } catch (error) {
      console.error('Error deleting training:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">دوره یافت نشد</p>
          <button
            onClick={() => navigate('/director/trainings')}
            className="mt-4 text-indigo-600 hover:text-indigo-700"
          >
            بازگشت به لیست
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const participationRate = (training.participants.length / training.capacity) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Compact Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <button
              onClick={() => navigate('/director/trainings')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900">{training.title}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(training.status)}`}>
                  {training.status === 'active' ? 'در حال برگزاری' : 
                   training.status === 'upcoming' ? 'آینده' : 'تکمیل شده'}
                </span>
              </div>
              <p className="text-sm text-slate-600">{training.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/director/trainings/${id}/edit`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm"
            >
              <Edit className="w-4 h-4" />
              ویرایش
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              حذف
            </button>
          </div>
        </div>

        {/* Inline Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 font-medium">شرکت‌کنندگان</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {training.participants.length}/{training.capacity}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-600 font-medium">مدت دوره</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{training.duration}h</p>
              </div>
              <Clock className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-yellow-600 font-medium">امتیاز</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">{training.rating}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 font-medium">درصد پر شدن</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{participationRate.toFixed(0)}%</p>
              </div>
              <Award className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'details'
                    ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                جزئیات دوره
              </button>
              <button
                onClick={() => setActiveTab('participants')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'participants'
                    ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                شرکت‌کنندگان
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'stats'
                    ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                آمار و گزارش
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">اطلاعات کلی</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <BookOpen className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">نوع دوره</p>
                          <p className="text-sm font-medium text-slate-900">{training.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Award className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">سطح</p>
                          <p className="text-sm font-medium text-slate-900">{training.level}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Users className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">مدرس</p>
                          <p className="text-sm font-medium text-slate-900">{training.instructor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">محل برگزاری</p>
                          <p className="text-sm font-medium text-slate-900">
                            {training.isOnline ? 'آنلاین' : training.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">منابع آموزشی</h3>
                    <div className="space-y-2">
                      {training.materials.map((material, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-slate-700">{material}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">پیش‌نیازها</h3>
                    <div className="space-y-2">
                      {training.prerequisites.length > 0 ? (
                        training.prerequisites.map((prereq, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                            <span className="text-sm text-amber-700">{prereq}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">بدون پیش‌نیاز</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'participants' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">
                      لیست شرکت‌کنندگان ({training.participants.length})
                    </h3>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      خروجی Excel
                    </button>
                  </div>
                  
                  {training.participants.length > 0 ? (
                    <div className="space-y-2">
                      {training.participants.map((participant, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 font-medium">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">شرکت‌کننده {index + 1}</p>
                              <p className="text-xs text-slate-500">{participant}</p>
                            </div>
                          </div>
                          <button className="text-indigo-600 hover:text-indigo-700 text-sm">
                            مشاهده پروفایل
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">هنوز شرکت‌کننده‌ای ثبت‌نام نکرده</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">آمار ثبت‌نام</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-600">میزان پر شدن ظرفیت</span>
                          <span className="text-sm font-medium text-slate-900">{participationRate.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all"
                            style={{ width: `${participationRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">امتیازات و نظرات</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <span className="text-sm text-yellow-700">میانگین امتیاز</span>
                        </div>
                        <p className="text-3xl font-bold text-yellow-900">{training.rating}</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-blue-500" />
                          <span className="text-sm text-blue-700">تعداد نظرات</span>
                        </div>
                        <p className="text-3xl font-bold text-blue-900">{training.reviews}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">اقدامات سریع</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium">
                ارسال اعلان به شرکت‌کنندگان
              </button>
              <button className="w-full px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                دانلود لیست حضور و غیاب
              </button>
              <button className="w-full px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
                صدور گواهینامه
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">زمان‌بندی</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">شروع دوره</p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(training.startDate).toLocaleDateString('fa-IR')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">پایان دوره</p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(training.endDate).toLocaleDateString('fa-IR')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">هزینه ثبت‌نام</p>
                  <p className="text-sm font-medium text-slate-900">
                    {training.price.toLocaleString()} تومان
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingDetail;
