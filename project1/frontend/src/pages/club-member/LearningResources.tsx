import React, { useState } from 'react';
import { Book } from 'lucide-react';
import { useLearningResources, useUserStats } from '../../hooks/useLearningResources';
import ResourceCard from '../../components/learning/ResourceCard';
import StatsOverview from '../../components/learning/StatsOverview';
import SearchAndFilters from '../../components/learning/SearchAndFilters';
import LearningPath from '../../components/learning/LearningPath';

const LearningResources: React.FC = () => {
  const [filters, setFilters] = useState<{
    category?: string;
    difficulty?: string;
    search?: string;
  }>({});

  const { resources, loading: resourcesLoading, error } = useLearningResources(filters);
  const { stats, loading: statsLoading } = useUserStats();

  // Debug log
  console.log('LearningResources - resources:', resources);

  // Get recommended learning path resources
  const pathResources = resources.filter(r => r.order && r.order > 0).slice(0, 5);

  if (resourcesLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری منابع...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">خطا در بارگذاری</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-500 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Book className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">منابع آموزشی تیم‌سازی</h1>
              <p className="text-gray-600 mt-1">یاد بگیرید چگونه تیم قوی بسازید و استارتاپ موفق داشته باشید</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={stats} loading={statsLoading} />

        {/* Learning Path */}
        {pathResources.length > 0 && (
          <LearningPath resources={pathResources as any} />
        )}

        {/* Search and Filters */}
        <SearchAndFilters 
          onFiltersChange={setFilters}
          totalResults={resources.length}
        />

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource: any) => (
            <ResourceCard key={resource._id || resource.id} resource={resource as any} />
          ))}
        </div>

        {resources.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block p-6 bg-white rounded-full shadow-lg mb-4">
              <Book className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">منبعی یافت نشد</h3>
            <p className="text-gray-500">لطفاً فیلتر یا جستجوی دیگری امتحان کنید</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningResources;
