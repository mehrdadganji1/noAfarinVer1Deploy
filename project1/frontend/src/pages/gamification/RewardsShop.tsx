import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Gift,
  Sparkles,
  Crown,
  Zap,
  Star,
  ShoppingCart,
  Check,
  Lock,
} from 'lucide-react';
import { useMyXP } from '@/hooks/useXP';

interface RewardItem {
  id: string;
  title: string;
  description: string;
  type: 'badge' | 'theme' | 'avatar_frame' | 'title' | 'boost';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  cost: number;
  icon: string;
  owned: boolean;
  equipped: boolean;
  requirements?: {
    minLevel?: number;
  };
}

const mockRewards: RewardItem[] = [
  // Badges
  {
    id: '1',
    title: 'نشان برنزی',
    description: 'نشان برنزی برای شروع',
    type: 'badge',
    rarity: 'common',
    cost: 100,
    icon: '🥉',
    owned: false,
    equipped: false,
  },
  {
    id: '2',
    title: 'نشان نقره‌ای',
    description: 'نشان نقره‌ای برای پیشرفت',
    type: 'badge',
    rarity: 'rare',
    cost: 500,
    icon: '🥈',
    owned: false,
    equipped: false,
    requirements: { minLevel: 5 },
  },
  {
    id: '3',
    title: 'نشان طلایی',
    description: 'نشان طلایی برای قهرمانان',
    type: 'badge',
    rarity: 'epic',
    cost: 1000,
    icon: '🥇',
    owned: false,
    equipped: false,
    requirements: { minLevel: 10 },
  },
  
  // Themes
  {
    id: '4',
    title: 'تم تاریک',
    description: 'تم تاریک برای پروفایل',
    type: 'theme',
    rarity: 'common',
    cost: 200,
    icon: '🌙',
    owned: false,
    equipped: false,
  },
  {
    id: '5',
    title: 'تم رنگین‌کمان',
    description: 'تم رنگارنگ و جذاب',
    type: 'theme',
    rarity: 'rare',
    cost: 750,
    icon: '🌈',
    owned: false,
    equipped: false,
    requirements: { minLevel: 7 },
  },
  
  // Avatar Frames
  {
    id: '6',
    title: 'قاب طلایی',
    description: 'قاب طلایی برای آواتار',
    type: 'avatar_frame',
    rarity: 'epic',
    cost: 1500,
    icon: '👑',
    owned: false,
    equipped: false,
    requirements: { minLevel: 15 },
  },
  {
    id: '7',
    title: 'قاب الماس',
    description: 'قاب الماس افسانه‌ای',
    type: 'avatar_frame',
    rarity: 'legendary',
    cost: 5000,
    icon: '💎',
    owned: false,
    equipped: false,
    requirements: { minLevel: 30 },
  },
  
  // Titles
  {
    id: '8',
    title: 'نوآور',
    description: 'عنوان نوآور',
    type: 'title',
    rarity: 'common',
    cost: 300,
    icon: '💡',
    owned: false,
    equipped: false,
  },
  {
    id: '9',
    title: 'استاد',
    description: 'عنوان استاد',
    type: 'title',
    rarity: 'rare',
    cost: 800,
    icon: '🎓',
    owned: false,
    equipped: false,
    requirements: { minLevel: 10 },
  },
  {
    id: '10',
    title: 'افسانه',
    description: 'عنوان افسانه‌ای',
    type: 'title',
    rarity: 'legendary',
    cost: 10000,
    icon: '⚡',
    owned: false,
    equipped: false,
    requirements: { minLevel: 50 },
  },
  
  // Boosts
  {
    id: '11',
    title: 'تقویت XP 2x',
    description: '2 برابر XP برای 24 ساعت',
    type: 'boost',
    rarity: 'rare',
    cost: 500,
    icon: '🚀',
    owned: false,
    equipped: false,
  },
  {
    id: '12',
    title: 'تقویت XP 3x',
    description: '3 برابر XP برای 12 ساعت',
    type: 'boost',
    rarity: 'epic',
    cost: 1200,
    icon: '⚡',
    owned: false,
    equipped: false,
    requirements: { minLevel: 20 },
  },
];

const typeLabels = {
  badge: 'نشان',
  theme: 'تم',
  avatar_frame: 'قاب آواتار',
  title: 'عنوان',
  boost: 'تقویت',
};

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-600',
};

const rarityLabels = {
  common: 'معمولی',
  rare: 'نادر',
  epic: 'حماسی',
  legendary: 'افسانه‌ای',
};

export default function RewardsShop() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const { data: xpData } = useMyXP();

  const filteredRewards = mockRewards.filter((reward) => {
    if (selectedType !== 'all' && reward.type !== selectedType) return false;
    if (selectedRarity !== 'all' && reward.rarity !== selectedRarity) return false;
    return true;
  });

  const canPurchase = (reward: RewardItem) => {
    if (reward.owned) return false;
    if (!xpData || xpData.totalXP < reward.cost) return false;
    if (reward.requirements?.minLevel && xpData.level < reward.requirements.minLevel) return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 p-4 md:p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 relative">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Gift className="h-20 w-20 text-white/90" />
            </div>
          </div>
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-12">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-white p-2 shadow-xl">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <ShoppingCart className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex-1 md:mr-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  فروشگاه پاداش‌ها
                </h1>
                <p className="text-gray-600 mt-1">
                  با XP خود آیتم‌های ویژه بخرید
                </p>
              </div>
              {xpData && (
                <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-3 rounded-xl border-2 border-purple-200">
                  <Zap className="h-6 w-6 text-purple-600" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {xpData.totalXP.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">XP موجود</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="border-l-4 border-l-purple-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50/50 to-white">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              فیلترها
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  نوع آیتم
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه</SelectItem>
                    <SelectItem value="badge">نشان‌ها</SelectItem>
                    <SelectItem value="theme">تم‌ها</SelectItem>
                    <SelectItem value="avatar_frame">قاب آواتار</SelectItem>
                    <SelectItem value="title">عنوان‌ها</SelectItem>
                    <SelectItem value="boost">تقویت‌ها</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  کمیابی
                </label>
                <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه</SelectItem>
                    <SelectItem value="common">معمولی</SelectItem>
                    <SelectItem value="rare">نادر</SelectItem>
                    <SelectItem value="epic">حماسی</SelectItem>
                    <SelectItem value="legendary">افسانه‌ای</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`overflow-hidden border-2 ${
                reward.owned ? 'border-green-500' : 'border-gray-200'
              } hover:shadow-xl transition-all`}>
                {/* Rarity Banner */}
                <div className={`h-2 bg-gradient-to-r ${rarityColors[reward.rarity]}`} />
                
                <CardContent className="p-6">
                  {/* Icon & Badges */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{reward.icon}</div>
                    <div className="flex flex-col gap-2">
                      <Badge className={`bg-gradient-to-r ${rarityColors[reward.rarity]}`}>
                        {rarityLabels[reward.rarity]}
                      </Badge>
                      <Badge variant="outline">
                        {typeLabels[reward.type]}
                      </Badge>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {reward.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {reward.description}
                  </p>

                  {/* Requirements */}
                  {reward.requirements?.minLevel && (
                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                      <Crown className="h-4 w-4" />
                      <span>نیاز به سطح {reward.requirements.minLevel}</span>
                    </div>
                  )}

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="text-xl font-bold text-gray-900">
                        {reward.cost.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-600">XP</span>
                    </div>
                    
                    {reward.owned ? (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={reward.equipped}
                      >
                        {reward.equipped ? (
                          <>
                            <Check className="h-4 w-4 ml-1" />
                            فعال
                          </>
                        ) : (
                          'استفاده'
                        )}
                      </Button>
                    ) : canPurchase(reward) ? (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <ShoppingCart className="h-4 w-4 ml-1" />
                        خرید
                      </Button>
                    ) : (
                      <Button size="sm" disabled>
                        <Lock className="h-4 w-4 ml-1" />
                        قفل
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredRewards.length === 0 && (
          <Card className="p-12 text-center">
            <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">هیچ آیتمی با این فیلترها یافت نشد</p>
          </Card>
        )}
      </div>
    </div>
  );
}
