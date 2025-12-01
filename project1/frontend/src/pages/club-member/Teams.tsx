import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Plus,
  UserPlus,
  Trophy,
  Target,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/common/SearchBar';
import FilterSection, { FilterOption } from '@/components/common/FilterSection';
import { useTeams } from '@/hooks/useTeams';

const statusFilters: FilterOption[] = [
  { value: 'all', label: 'همه', count: 0 },
  { value: 'active', label: 'فعال', count: 0 },
  { value: 'inactive', label: 'غیرفعال', count: 0 },
  { value: 'completed', label: 'تکمیل شده', count: 0 },
];

const phaseFilters: FilterOption[] = [
  { value: 'all', label: 'همه مراحل', count: 0 },
  { value: 'forming', label: 'در حال تشکیل', count: 0 },
  { value: 'norming', label: 'عادی‌سازی', count: 0 },
  { value: 'performing', label: 'عملکرد', count: 0 },
  { value: 'adjourning', label: 'پایان', count: 0 },
];

const statusConfig = {
  active: { label: 'فعال', color: 'bg-green-100 text-green-700' },
  inactive: { label: 'غیرفعال', color: 'bg-gray-100 text-gray-700' },
  completed: { label: 'تکمیل شده', color: 'bg-blue-100 text-blue-700' },
};

const phaseConfig = {
  forming: { label: 'در حال تشکیل', color: 'bg-yellow-100 text-yellow-700' },
  norming: { label: 'عادی‌سازی', color: 'bg-blue-100 text-blue-700' },
  performing: { label: 'عملکرد', color: 'bg-green-100 text-green-700' },
  adjourning: { label: 'پایان', color: 'bg-gray-100 text-gray-700' },
};

export default function Teams() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [page] = useState(1);

  const { data: teamsData, isLoading, error } = useTeams({
    status: selectedStatus !== 'all' ? (selectedStatus as any) : undefined,
    phase: selectedPhase !== 'all' ? (selectedPhase as any) : undefined,
    page,
    limit: 12,
  });

  const teams = teamsData?.data?.teams || [];
  const total = teamsData?.data?.total || 0;

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 max-w-[1600px] mx-auto">
      {/* Modern Header with Gradient Border */}
      <div className="relative group">
        {/* Gradient Border */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF] via-[#7209B7] to-[#FF006E] rounded-lg p-[2px]">
          <div className="w-full h-full bg-white rounded-lg" />
        </div>
        
        <div className="relative bg-gradient-to-br from-white to-neutral-50/50 rounded-lg shadow-[0_0_15px_rgba(0,217,255,0.08)] p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Icon with gradient background */}
              <div className="w-12 h-12 bg-gradient-to-br from-[#7209B7]/15 to-[#AB47BC]/15 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-[#7209B7]" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  تیم‌ها
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">پیوستن به تیم‌ها یا ساخت تیم جدید</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-[#7209B7] to-[#AB47BC] hover:from-[#7209B7]/90 hover:to-[#AB47BC]/90 text-white">
              <Plus className="h-4 w-4 ml-2" />
              <span className="hidden sm:inline">تیم جدید</span>
            </Button>
          </div>
        </div>
      </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          {/* Total Teams */}
          <div className="relative group/stat">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF] to-[#00B8D9] rounded-xl p-[2px]">
              <div className="w-full h-full bg-white rounded-xl" />
            </div>
            <Card className="relative border-transparent hover:shadow-md transition-all">
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-[10px] font-bold text-gray-600 uppercase truncate">کل تیم‌ها</CardTitle>
                  <div className="w-7 h-7 bg-gradient-to-br from-[#00D9FF]/15 to-[#00B8D9]/15 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-3.5 w-3.5 text-[#00D9FF]" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#00D9FF] mb-1">
                  {total}
                </div>
                <p className="text-[9px] text-gray-500 truncate">تیم ثبت شده</p>
              </CardContent>
            </Card>
          </div>

          {/* Active Teams */}
          <div className="relative group/stat">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-[2px]">
              <div className="w-full h-full bg-white rounded-xl" />
            </div>
            <Card className="relative border-transparent hover:shadow-md transition-all">
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-[10px] font-bold text-gray-600 uppercase truncate">تیم‌های فعال</CardTitle>
                  <div className="w-7 h-7 bg-gradient-to-br from-green-500/15 to-green-600/15 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UserPlus className="h-3.5 w-3.5 text-green-600" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">
                  {teams.filter(t => t.status === 'active').length}
                </div>
                <p className="text-[9px] text-gray-500 truncate">در حال فعالیت</p>
              </CardContent>
            </Card>
          </div>

          {/* My Teams */}
          <div className="relative group/stat">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7209B7] to-[#AB47BC] rounded-xl p-[2px]">
              <div className="w-full h-full bg-white rounded-xl" />
            </div>
            <Card className="relative border-transparent hover:shadow-md transition-all">
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-[10px] font-bold text-gray-600 uppercase truncate">تیم‌های من</CardTitle>
                  <div className="w-7 h-7 bg-gradient-to-br from-[#7209B7]/15 to-[#AB47BC]/15 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Trophy className="h-3.5 w-3.5 text-[#7209B7]" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#7209B7] mb-1">
                  {teams.filter(t => t.members.some(m => m.userId === 'current-user-id')).length}
                </div>
                <p className="text-[9px] text-gray-500 truncate">عضویت فعال</p>
              </CardContent>
            </Card>
          </div>

          {/* Total Members */}
          <div className="relative group/stat">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-[2px]">
              <div className="w-full h-full bg-white rounded-xl" />
            </div>
            <Card className="relative border-transparent hover:shadow-md transition-all">
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-[10px] font-bold text-gray-600 uppercase truncate">اعضای کل</CardTitle>
                  <div className="w-7 h-7 bg-gradient-to-br from-amber-500/15 to-amber-600/15 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-amber-600 mb-1">
                  {teams.reduce((sum, t) => sum + t.members.length, 0)}
                </div>
                <p className="text-[9px] text-gray-500 truncate">عضو فعال</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7209B7] to-[#AB47BC] rounded-xl p-[2px]">
            <div className="w-full h-full bg-white rounded-xl" />
          </div>
          <Card className="relative border-transparent shadow-[0_0_12px_rgba(114,9,183,0.08)]">
            <CardHeader className="pb-3 bg-gradient-to-r from-neutral-50/50 to-white">
              <CardTitle className="text-base sm:text-lg font-bold text-neutral-900">جستجو و فیلتر</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="جستجوی تیم..."
                  />
                </div>
                <FilterSection
                  title="وضعیت"
                  options={statusFilters}
                  selected={selectedStatus}
                  onSelect={setSelectedStatus}
                />
                <FilterSection
                  title="مرحله"
                  options={phaseFilters}
                  selected={selectedPhase}
                  onSelect={setSelectedPhase}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teams Grid */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF] to-[#00B8D9] rounded-xl p-[2px]">
            <div className="w-full h-full bg-white rounded-xl" />
          </div>
          <Card className="relative border-transparent shadow-[0_0_12px_rgba(0,217,255,0.08)]">
            <CardHeader className="pb-3 bg-gradient-to-r from-neutral-50/50 to-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg font-bold text-neutral-900">لیست تیم‌ها</CardTitle>
                <div className="text-xs sm:text-sm text-gray-600 px-2 py-1 bg-[#00D9FF]/10 rounded-md">
                  {filteredTeams.length} تیم
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-600">
              <AlertCircle className="h-12 w-12 mb-3" />
              <p>خطا در بارگذاری تیم‌ها</p>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>هیچ تیمی یافت نشد</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map((team, index) => {
                const isFounder = team.members.some(m => m.role === 'founder');
                const membersCount = team.members.length;
                const mentorsCount = team.mentors.length;

                return (
                  <motion.div
                    key={team._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="h-full"
                  >
                    <div className="relative group/team h-full">
                      {/* Gradient accent bar */}
                      <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#7209B7] to-[#AB47BC] rounded-r-lg opacity-100 group-hover/team:w-1 transition-all" />
                      
                      <Card className="hover:shadow-xl transition-all duration-300 border-r-0 h-full flex flex-col">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-3 gap-2 flex-wrap">
                            <Badge className={statusConfig[team.status].color}>
                              {statusConfig[team.status].label}
                            </Badge>
                            <Badge className={phaseConfig[team.phase].color}>
                              {phaseConfig[team.phase].label}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg mb-2">{team.name}</CardTitle>
                          <p className="text-sm text-gray-600 line-clamp-2">{team.description}</p>
                        </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <Users className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">اعضا</p>
                            <p className="text-lg font-bold">{membersCount}</p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <Trophy className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">منتورها</p>
                            <p className="text-lg font-bold">{mentorsCount}</p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <Target className="h-4 w-4 text-amber-600 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">پروژه</p>
                            <p className="text-lg font-bold">{team.projectId ? 1 : 0}</p>
                          </div>
                        </div>
                        {team.tags && team.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {team.tags.map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                        <CardFooter className="mt-auto">
                          <Button className="w-full bg-gradient-to-r from-[#7209B7] to-[#AB47BC] hover:from-[#7209B7]/90 hover:to-[#AB47BC]/90 text-white" variant={isFounder ? 'outline' : 'default'}>
                            {isFounder ? 'مدیریت تیم' : 'مشاهده جزئیات'}
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
