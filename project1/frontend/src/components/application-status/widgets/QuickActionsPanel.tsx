/**
 * Quick Actions Panel
 * Provides quick navigation buttons
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight,
  ArrowLeft,
  FileEdit, 
  HelpCircle, 
  Home,
  Zap
} from 'lucide-react';

export const QuickActionsPanel: FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'dashboard',
      label: 'داشبورد',
      icon: Home,
      color: 'from-blue-500 to-cyan-500',
      path: '/pending'
    },
    {
      id: 'edit',
      label: 'ویرایش درخواست',
      icon: FileEdit,
      color: 'from-purple-500 to-pink-500',
      path: '/pending/application-form'
    },
    {
      id: 'help',
      label: 'راهنما',
      icon: HelpCircle,
      color: 'from-green-500 to-emerald-500',
      path: '/pending/help'
    }
  ];

  return (
    <Card className="border-2 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3 bg-gradient-to-r from-yellow-50 to-amber-50 border-b">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <Zap className="w-5 h-5 text-yellow-600" />
          دسترسی سریع
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                onClick={() => navigate(action.path)}
                variant="outline"
                className="w-full justify-start gap-2 h-auto py-3 hover:shadow-md transition-all group"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="flex-1 text-right font-semibold text-sm">
                  {action.label}
                </span>
                <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:-translate-x-1 transition-all" />
              </Button>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
};
