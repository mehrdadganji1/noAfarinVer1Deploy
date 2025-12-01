import { motion } from 'framer-motion';
import { Phone, MapPin, Calendar, User } from 'lucide-react';
import GlowingCard from '../dashboard/GlowingCard';

interface PersonalInfoCardProps {
  phone?: string;
  address?: string;
  memberSince?: string;
}

export default function PersonalInfoCard({ phone, address, memberSince }: PersonalInfoCardProps) {
  const infoItems = [
    {
      icon: Phone,
      label: 'شماره تماس',
      value: phone || 'ثبت نشده',
    },
    {
      icon: MapPin,
      label: 'آدرس',
      value: address || 'ثبت نشده',
    },
    {
      icon: Calendar,
      label: 'تاریخ عضویت',
      value: memberSince ? new Date(memberSince).toLocaleDateString('fa-IR') : '-',
    },
  ];

  return (
    <GlowingCard glowColor="purple">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-black text-gray-900">اطلاعات شخصی</h3>
        </div>

        <div className="space-y-3">
          {infoItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 flex items-center justify-center transition-all duration-300">
                  <Icon className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="text-sm text-gray-900 font-bold">{item.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </GlowingCard>
  );
}
