/**
 * Personal Info Card
 * Displays personal information
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { InfoRow } from '../shared/InfoRow';
import { ANIMATION_VARIANTS } from '../constants';
import type { AACOApplication } from '../types';

interface PersonalInfoCardProps {
  application: AACOApplication;
}

export const PersonalInfoCard: FC<PersonalInfoCardProps> = ({ application }) => {
  return (
    <motion.div
      {...ANIMATION_VARIANTS.slideUp}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-2 shadow-md hover:shadow-lg transition-all h-full">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold flex-row-reverse">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm">
              <User className="h-4 w-4 text-white" />
            </div>
            اطلاعات شخصی
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-1">
          <InfoRow
            label="نام و نام خانوادگی"
            value={`${application.firstName} ${application.lastName}`}
            icon={User}
            iconColor="text-blue-500"
          />
          <InfoRow
            label="ایمیل"
            value={application.email}
            icon={Mail}
            iconColor="text-purple-500"
          />
          <InfoRow
            label="شماره تماس"
            value={application.phone}
            icon={Phone}
            iconColor="text-green-500"
          />
          <InfoRow
            label="شهر"
            value={application.city}
            icon={MapPin}
            iconColor="text-orange-500"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};
