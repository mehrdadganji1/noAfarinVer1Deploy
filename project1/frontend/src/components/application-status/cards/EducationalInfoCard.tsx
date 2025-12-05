/**
 * Educational Info Card
 * Displays educational information
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookOpen, Award, Calendar } from 'lucide-react';
import { InfoRow } from '../shared/InfoRow';
import { ANIMATION_VARIANTS, DEGREE_LABELS } from '../constants';
import type { AACOApplication } from '../types';

interface EducationalInfoCardProps {
  application: AACOApplication;
}

export const EducationalInfoCard: FC<EducationalInfoCardProps> = ({ application }) => {
  return (
    <motion.div
      {...ANIMATION_VARIANTS.slideUp}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-2 shadow-md hover:shadow-lg transition-all h-full">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold flex-row-reverse">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            اطلاعات تحصیلی
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-1">
          <InfoRow
            label="دانشگاه"
            value={application.university}
            icon={BookOpen}
            iconColor="text-purple-500"
          />
          <InfoRow
            label="رشته تحصیلی"
            value={application.major}
            icon={Award}
            iconColor="text-pink-500"
          />
          <InfoRow
            label="مقطع"
            value={application.degree ? (DEGREE_LABELS[application.degree] || application.degree) : '-'}
            icon={GraduationCap}
            iconColor="text-indigo-500"
          />
          {application.graduationYear && (
            <InfoRow
              label="سال فارغ‌التحصیلی"
              value={application.graduationYear}
              icon={Calendar}
              iconColor="text-blue-500"
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
