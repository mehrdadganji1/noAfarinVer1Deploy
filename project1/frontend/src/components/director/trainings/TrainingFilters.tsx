import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TrainingFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  levelFilter: string;
  onLevelFilterChange: (value: string) => void;
  onReset: () => void;
}

export const TrainingFilters: React.FC<TrainingFiltersProps> = ({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  levelFilter,
  onLevelFilterChange,
  onReset,
}) => {
  const hasFilters = search || typeFilter || statusFilter || levelFilter;

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-gray-500" />
        <h3 className="font-semibold">فیلترها</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="mr-auto text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4 ml-1" />
            پاک کردن
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="جستجو در دوره‌ها..."
          className="pr-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="">همه انواع</option>
          <option value="workshop">کارگاه</option>
          <option value="course">دوره</option>
          <option value="seminar">سمینار</option>
          <option value="bootcamp">بوت‌کمپ</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="">همه وضعیت‌ها</option>
          <option value="upcoming">آینده</option>
          <option value="active">در حال برگزاری</option>
          <option value="completed">تکمیل شده</option>
          <option value="cancelled">لغو شده</option>
        </select>

        <select
          value={levelFilter}
          onChange={(e) => onLevelFilterChange(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="">همه سطوح</option>
          <option value="beginner">مبتدی</option>
          <option value="intermediate">متوسط</option>
          <option value="advanced">پیشرفته</option>
        </select>
      </div>
    </div>
  );
};
