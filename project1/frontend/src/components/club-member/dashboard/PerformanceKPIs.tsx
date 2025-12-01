import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import GlowingCard from './GlowingCard';

interface KPI {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  change: string;
}

interface PerformanceKPIsProps {
  kpis?: KPI[];
}

const defaultKPIs: KPI[] = [
  { label: 'نرخ حضور در رویدادها', value: '85%', trend: 'up', change: '+12%' },
  { label: 'میانگین امتیاز پروژه‌ها', value: '4.2/5', trend: 'up', change: '+0.3' },
  { label: 'تکمیل دوره‌ها', value: '78%', trend: 'up', change: '+8%' },
  { label: 'فعالیت هفتگی', value: '6 روز', trend: 'neutral', change: '0' },
];

export default function PerformanceKPIs({ kpis = defaultKPIs }: PerformanceKPIsProps) {
  return (
    <GlowingCard glowColor="purple">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg shadow-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-black text-gray-900">
            شاخص‌های عملکرد شما
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {kpis.map((kpi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 group"
            >
              <p className="text-sm text-gray-600 mb-2">{kpi.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <div className="flex items-center gap-1">
                  {kpi.trend === 'up' && (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  )}
                  {kpi.trend === 'down' && (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      kpi.trend === 'up'
                        ? 'text-green-600'
                        : kpi.trend === 'down'
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {kpi.change}
                  </span>
                </div>
              </div>
              <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full ${
                    kpi.trend === 'up'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : kpi.trend === 'down'
                      ? 'bg-gradient-to-r from-red-500 to-rose-500'
                      : 'bg-gradient-to-r from-gray-400 to-gray-500'
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </GlowingCard>
  );
}
