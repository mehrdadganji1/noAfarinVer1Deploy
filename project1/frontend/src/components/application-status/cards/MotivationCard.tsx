/**
 * Motivation Card
 * Displays motivation and goals
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Heart, Sparkles } from 'lucide-react';
import { ANIMATION_VARIANTS } from '../constants';
import type { AACOApplication } from '../types';

interface MotivationCardProps {
  application: AACOApplication;
}

export const MotivationCard: FC<MotivationCardProps> = ({ application }) => {
  return (
    <motion.div
      {...ANIMATION_VARIANTS.slideUp}
      transition={{ delay: 0.5 }}
    >
      <Card className="border-2 shadow-md hover:shadow-lg transition-all">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold flex-row-reverse">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-sm">
              <Heart className="h-4 w-4 text-white" />
            </div>
            انگیزه و اهداف
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-5 space-y-4">
          {/* Motivation */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-orange-500" />
              <p className="text-xs text-gray-500 font-medium">انگیزه شرکت</p>
            </div>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg leading-relaxed text-right">
              {application.motivation}
            </p>
          </div>

          {/* Goals */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-500" />
              <p className="text-xs text-gray-500 font-medium">اهداف</p>
            </div>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg leading-relaxed text-right">
              {application.goals}
            </p>
          </div>

          {/* Experience */}
          {application.experience && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <p className="text-xs text-gray-500 font-medium">تجربیات قبلی</p>
              </div>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg leading-relaxed text-right">
                {application.experience}
              </p>
            </div>
          )}

          {/* Expectations */}
          {application.expectations && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-green-500" />
                <p className="text-xs text-gray-500 font-medium">انتظارات</p>
              </div>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg leading-relaxed text-right">
                {application.expectations}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
