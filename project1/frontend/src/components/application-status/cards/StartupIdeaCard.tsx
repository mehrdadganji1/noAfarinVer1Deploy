/**
 * Startup Idea Card
 * Displays startup idea and business details
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, TrendingUp, Target, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ANIMATION_VARIANTS } from '../constants';
import type { AACOApplication } from '../types';

interface StartupIdeaCardProps {
  application: AACOApplication;
}

export const StartupIdeaCard: FC<StartupIdeaCardProps> = ({ application }) => {
  return (
    <motion.div
      {...ANIMATION_VARIANTS.slideUp}
      transition={{ delay: 0.4 }}
    >
      <Card className="border-2 shadow-md hover:shadow-lg transition-all">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold flex-row-reverse">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-sm">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            ایده استارتاپی
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-5 space-y-4">
          {/* Startup Idea */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-green-500" />
              <p className="text-xs text-gray-500 font-medium">توضیحات ایده</p>
            </div>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg leading-relaxed text-right">
              {application.startupIdea}
            </p>
          </div>

          {/* Business Model */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <p className="text-xs text-gray-500 font-medium">مدل کسب‌وکار</p>
            </div>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg leading-relaxed text-right">
              {application.businessModel}
            </p>
          </div>

          {/* Target Market */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-500" />
              <p className="text-xs text-gray-500 font-medium">بازار هدف</p>
            </div>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg leading-relaxed text-right">
              {application.targetMarket}
            </p>
          </div>

          {/* Team Info */}
          {application.teamSize && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-blue-600 font-medium">اندازه تیم</p>
                <p className="text-sm font-semibold text-gray-900">
                  {application.teamSize} نفر
                </p>
              </div>
            </div>
          )}

          {/* Skills */}
          {application.skills && application.skills.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 font-medium mb-2">مهارت‌ها</p>
              <div className="flex flex-wrap gap-2">
                {application.skills?.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
