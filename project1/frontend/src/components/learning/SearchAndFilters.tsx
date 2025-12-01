import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchAndFiltersProps {
  onFiltersChange: (filters: {
    category?: string;
    difficulty?: string;
    search?: string;
  }) => void;
  totalResults: number;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({ onFiltersChange, totalResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', label: 'همه دسته‌ها', color: 'bg-gray-500' },
    { id: 'foundation', label: 'مبانی', color: 'bg-purple-500' },
    { id: 'hacker', label: 'Hacker (CTO)', color: 'bg-green-500' },
    { id: 'hustler', label: 'Hustler (CEO)', color: 'bg-orange-500' },
    { id: 'hipster', label: 'Hipster (CPO)', color: 'bg-pink-500' }
  ];

  const difficulties = [
    { id: '', label: 'همه سطوح' },
    { id: 'beginner', label: 'مقدماتی' },
    { id: 'intermediate', label: 'متوسط' },
    { id: 'advanced', label: 'پیشرفته' }
  ];

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onFiltersChange({
      search: value,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      difficulty: selectedDifficulty || undefined
    });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onFiltersChange({
      search: searchQuery,
      category: category === 'all' ? undefined : category,
      difficulty: selectedDifficulty || undefined
    });
  };

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    onFiltersChange({
      search: searchQuery,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      difficulty: difficulty || undefined
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDifficulty('');
    onFiltersChange({});
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedDifficulty;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="جستجو در منابع آموزشی..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>فیلترها</span>
        </button>
        
        <div className="flex items-center gap-4">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
              <span>پاک کردن فیلترها</span>
            </button>
          )}
          <span className="text-sm text-gray-600">
            {totalResults} منبع یافت شد
          </span>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="space-y-6 pt-4 border-t border-gray-200">
          {/* Categories */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">دسته‌بندی</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? `${category.color} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">سطح دشواری</h4>
            <div className="flex flex-wrap gap-2">
              {difficulties.map(difficulty => (
                <button
                  key={difficulty.id}
                  onClick={() => handleDifficultyChange(difficulty.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedDifficulty === difficulty.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {difficulty.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;
