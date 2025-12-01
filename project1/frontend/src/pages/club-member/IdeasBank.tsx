import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Lightbulb,
  ThumbsUp,
  MessageCircle,
  Eye,
  Plus,
  TrendingUp,
  Sparkles,
  Rocket,
  Flame,
} from 'lucide-react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/common/SearchBar';
import FilterSection, { FilterOption } from '@/components/common/FilterSection';

// New Enhanced Components
import { SectionContainer } from '@/components/club-member/SectionHeader';

interface Idea {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
  views: number;
  status: 'draft' | 'published' | 'in-development' | 'launched';
  createdAt: string;
  isTrending?: boolean;
  isLiked?: boolean;
}

// Sample data
const sampleIdeas: Idea[] = [
  {
    _id: '1',
    title: 'پلتفرم یادگیری مبتنی بر هوش مصنوعی',
    description: 'سیستمی که با استفاده از AI، مسیر یادگیری شخصی‌سازی شده برای هر دانشجو ایجاد می‌کند و پیشرفت را track می‌کنه.',
    category: 'آموزش',
    tags: ['AI', 'EdTech', 'Machine Learning'],
    author: { name: 'علی محمدی' },
    likes: 45,
    comments: 12,
    views: 230,
    status: 'published',
    createdAt: '2025-01-05',
    isTrending: true,
  },
  {
    _id: '2',
    title: 'اپلیکیشن مدیریت سلامت روان',
    description: 'ابزاری برای tracking خلق و خو، مدیتیشن guided، و ارتباط با روانشناس آنلاین.',
    category: 'سلامت',
    tags: ['HealthTech', 'Mental Health', 'Mobile App'],
    author: { name: 'سارا احمدی' },
    likes: 38,
    comments: 8,
    views: 180,
    status: 'in-development',
    createdAt: '2025-01-08',
  },
  {
    _id: '3',
    title: 'سامانه پیش‌بینی ترافیک شهری',
    description: 'با استفاده از داده‌های real-time و ML، بهترین مسیر و زمان حرکت رو پیشنهاد میده.',
    category: 'حمل و نقل',
    tags: ['IoT', 'Smart City', 'Data Science'],
    author: { name: 'محمد رضایی' },
    likes: 52,
    comments: 15,
    views: 310,
    status: 'published',
    createdAt: '2025-01-03',
    isTrending: true,
  },
];

const categoryFilters: FilterOption[] = [
  { value: 'همه', label: 'همه', count: 87 },
  { value: 'آموزش', label: 'آموزش', count: 24 },
  { value: 'سلامت', label: 'سلامت', count: 18 },
  { value: 'حمل و نقل', label: 'حمل و نقل', count: 12 },
  { value: 'کشاورزی', label: 'کشاورزی', count: 15 },
  { value: 'مالی', label: 'مالی', count: 10 },
  { value: 'تجارت', label: 'تجارت', count: 8 },
];

const statusConfig = {
  draft: { label: 'پیش‌نویس', color: 'bg-gray-100 text-gray-700' },
  published: { label: 'منتشر شده', color: 'bg-blue-100 text-blue-700' },
  'in-development': { label: 'در حال توسعه', color: 'bg-purple-100 text-purple-700' },
  launched: { label: 'راه‌اندازی شده', color: 'bg-green-100 text-green-700' },
};

export default function IdeasBank() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('همه');

  const filteredIdeas = sampleIdeas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'همه' || idea.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50/30 via-orange-50/20 to-red-50/30 p-4 md:p-6" dir="rtl">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 border-2 border-white shadow-lg flex items-center justify-center">
              <Lightbulb className="h-9 w-9 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">بانک ایده‌ها</h1>
              <p className="text-sm text-gray-600">اشتراک ایده‌ها و همکاری در نوآوری</p>
            </div>
          </div>
          
          <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
            <Plus className="h-5 w-5 ml-2" />
            ایده جدید
          </Button>
        </div>

        {/* Statistics */}
        <SectionContainer
          header={{
            title: 'آمار ایده‌ها',
            subtitle: 'وضعیت بانک ایده‌ها',
            icon: TrendingUp,
            iconColor: 'amber',
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <span className="text-2xl font-bold">87</span>
                </div>
                <p className="text-sm font-medium">کل ایده‌ها</p>
                <p className="text-xs text-gray-600">ایده ثبت شده</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Flame className="w-5 h-5 text-red-600" />
                  <span className="text-2xl font-bold">12</span>
                </div>
                <p className="text-sm font-medium">ایده داغ</p>
                <p className="text-xs text-gray-600">پربیننده ترین</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Rocket className="w-5 h-5 text-green-600" />
                  <span className="text-2xl font-bold">5</span>
                </div>
                <p className="text-sm font-medium">در حال توسعه</p>
                <p className="text-xs text-gray-600">پروژه فعال</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="text-2xl font-bold">3</span>
                </div>
                <p className="text-sm font-medium">اجرا شده</p>
                <p className="text-xs text-gray-600">موفقیت‌آمیز</p>
              </CardContent>
            </Card>
          </div>
        </SectionContainer>

        {/* Search & Filter */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="جستجوی ایده..."
                />
              </div>
              <FilterSection
                title="دسته‌بندی"
                options={categoryFilters}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </div>
          </CardContent>
        </Card>

        {/* Ideas Grid */}
        <SectionContainer
          header={{
            title: `${filteredIdeas.length} ایده`,
            subtitle: 'لیست همه ایده‌ها',
            icon: Lightbulb,
            iconColor: 'amber',
            badge: filteredIdeas.length,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea, index) => (
              <motion.div
                key={idea._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-yellow-500 h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={statusConfig[idea.status].color}>
                        {statusConfig[idea.status].label}
                      </Badge>
                      {idea.isTrending && (
                        <Badge className="bg-red-100 text-red-700 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          داغ
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {idea.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {idea.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {idea.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-sm font-bold text-blue-600">
                        {idea.author.name[0]}
                      </div>
                      <span className="text-sm text-gray-700">{idea.author.name}</span>
                    </div>

                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{idea.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{idea.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{idea.likes}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Button
                      variant={idea.isLiked ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => console.log('Like idea:', idea._id)}
                    >
                      <ThumbsUp className="h-4 w-4 ml-2" />
                      {idea.isLiked ? 'پسندیده شده' : 'پسندیدن'}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <MessageCircle className="h-4 w-4 ml-2" />
                      نظر
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </SectionContainer>

      </div>
    </div>
  );
}
