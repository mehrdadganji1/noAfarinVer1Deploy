import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Trophy,
    Medal,
    Crown,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useXPLeaderboard, useMyRank } from '@/hooks/useXP';

const timeRanges = [
    { value: 'all', label: 'همه زمان‌ها' },
    { value: 'month', label: 'این ماه' },
    { value: 'week', label: 'این هفته' },
    { value: 'today', label: 'امروز' },
];

const categories = [
    { value: 'all', label: 'همه' },
    { value: 'project', label: 'پروژه' },
    { value: 'course', label: 'دوره' },
    { value: 'community', label: 'انجمن' },
];

export default function Leaderboard() {
    const [timeRange, setTimeRange] = useState('all');
    const [category, setCategory] = useState('all');
    const [limit] = useState(50);

    const { data, isLoading } = useXPLeaderboard(limit);
    const { data: myRank } = useMyRank();

    const leaderboard = data?.leaderboard || [];

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
        if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
        if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    };

    const getRankBadgeColor = (rank: number) => {
        if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
        if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500';
        if (rank === 3) return 'bg-gradient-to-r from-amber-400 to-amber-600';
        if (rank <= 10) return 'bg-gradient-to-r from-purple-400 to-pink-400';
        return 'bg-gradient-to-r from-blue-400 to-cyan-400';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 p-4 md:p-6" dir="rtl">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <Card className="overflow-hidden border-0 shadow-lg">
                    <div className="h-32 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 relative">
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Trophy className="h-20 w-20 text-white/90" />
                        </div>
                    </div>
                    <CardContent className="relative pt-0 pb-6">
                        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-12">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-2xl bg-white p-2 shadow-xl">
                                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
                                        <Trophy className="h-12 w-12 text-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 md:mr-4">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    جدول رتبه‌بندی
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    رقابت با بهترین‌ها و کسب رتبه برتر
                                </p>
                            </div>
                            {myRank && (
                                <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-3 rounded-xl border-2 border-purple-200">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">
                                            #{myRank.rank}
                                        </div>
                                        <div className="text-xs text-gray-600">رتبه شما</div>
                                    </div>
                                    <div className="h-12 w-px bg-purple-200" />
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-pink-600">
                                            {myRank.totalXP.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-gray-600">XP کل</div>
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
                            <TrendingUp className="h-5 w-5" />
                            فیلترها
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    بازه زمانی
                                </label>
                                <Select value={timeRange} onValueChange={setTimeRange}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeRanges.map((range) => (
                                            <SelectItem key={range.value} value={range.value}>
                                                {range.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    دسته‌بندی
                                </label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Top 3 Podium */}
                {leaderboard.length >= 3 && (
                    <Card className="border-0 shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-6">
                            <h2 className="text-2xl font-bold text-white text-center mb-6">
                                🏆 سه نفر برتر 🏆
                            </h2>
                            <div className="flex items-end justify-center gap-4">
                                {/* 2nd Place */}
                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex-1 max-w-xs"
                                >
                                    <Card className="bg-white/95 backdrop-blur">
                                        <CardContent className="pt-6 text-center">
                                            <div className="relative inline-block mb-3">
                                                <div className="h-20 w-20 border-4 border-gray-300 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold">
                                                    {leaderboard[1].name[0]}
                                                </div>
                                                <div className="absolute -top-2 -right-2 bg-gray-400 rounded-full p-2">
                                                    <Medal className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-lg">{leaderboard[1].name}</h3>
                                            <Badge className="bg-gray-400 mt-2">سطح {leaderboard[1].level}</Badge>
                                            <div className="mt-3 text-2xl font-bold text-gray-600">
                                                {leaderboard[1].totalXP.toLocaleString()} XP
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* 1st Place */}
                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex-1 max-w-xs -mt-8"
                                >
                                    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-4 border-yellow-400">
                                        <CardContent className="pt-6 text-center">
                                            <div className="relative inline-block mb-3">
                                                <div className="h-24 w-24 border-4 border-yellow-400 rounded-full bg-yellow-100 flex items-center justify-center text-3xl font-bold">
                                                    {leaderboard[0].name[0]}
                                                </div>
                                                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
                                                    <Crown className="h-6 w-6 text-white" />
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-xl">{leaderboard[0].name}</h3>
                                            <Badge className="bg-yellow-500 mt-2">سطح {leaderboard[0].level}</Badge>
                                            <div className="mt-3 text-3xl font-bold text-yellow-600">
                                                {leaderboard[0].totalXP.toLocaleString()} XP
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* 3rd Place */}
                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex-1 max-w-xs"
                                >
                                    <Card className="bg-white/95 backdrop-blur">
                                        <CardContent className="pt-6 text-center">
                                            <div className="relative inline-block mb-3">
                                                <div className="h-20 w-20 border-4 border-amber-600 rounded-full bg-amber-100 flex items-center justify-center text-2xl font-bold">
                                                    {leaderboard[2].name[0]}
                                                </div>
                                                <div className="absolute -top-2 -right-2 bg-amber-600 rounded-full p-2">
                                                    <Medal className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-lg">{leaderboard[2].name}</h3>
                                            <Badge className="bg-amber-600 mt-2">سطح {leaderboard[2].level}</Badge>
                                            <div className="mt-3 text-2xl font-bold text-amber-600">
                                                {leaderboard[2].totalXP.toLocaleString()} XP
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Full Leaderboard */}
                <Card className="border-l-4 border-l-blue-500 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-50/50 to-white">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                رتبه‌بندی کامل
                            </CardTitle>
                            {leaderboard && (
                                <Badge variant="secondary">
                                    {leaderboard.length} نفر
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {isLoading ? (
                            <div className="space-y-3">
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} className="animate-pulse flex items-center gap-4 p-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-1/3" />
                                            <div className="h-3 bg-gray-100 rounded w-1/4" />
                                        </div>
                                        <div className="w-20 h-6 bg-gray-200 rounded" />
                                    </div>
                                ))}
                            </div>
                        ) : leaderboard.length === 0 ? (
                            <div className="text-center py-12">
                                <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">هنوز کسی در این دسته رتبه‌بندی نشده</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {leaderboard.slice(3).map((user: any, index: number) => {
                                    const rank = index + 4;
                                    return (
                                        <motion.div
                                            key={user.userId}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50/50 to-white rounded-lg border hover:shadow-md transition-all"
                                        >
                                            {/* Rank */}
                                            <div className="w-12 flex items-center justify-center">
                                                {getRankIcon(rank)}
                                            </div>

                                            {/* Avatar */}
                                            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-lg font-bold text-purple-600">
                                                {user.name[0]}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 truncate">
                                                    {user.name}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-xs">
                                                        سطح {user.level}
                                                    </Badge>
                                                    <span className="text-xs text-gray-500">
                                                        {user.rank}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* XP */}
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-purple-600">
                                                    {user.totalXP.toLocaleString()}
                                                </div>
                                                <div className="text-xs text-gray-500">XP</div>
                                            </div>

                                            {/* Badge */}
                                            <div className={`w-2 h-12 rounded-full ${getRankBadgeColor(rank)}`} />
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
