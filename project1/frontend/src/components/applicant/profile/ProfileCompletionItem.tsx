import { FC } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileCompletionItemProps {
  label: string;
  completed: boolean;
  onClick?: () => void;
  index: number;
}

export const ProfileCompletionItem: FC<ProfileCompletionItemProps> = ({
  label,
  completed,
  onClick,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-4 rounded-xl border transition-all duration-200 group",
        completed
          ? "bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50"
          : "bg-white border-gray-100 hover:bg-gray-50 hover:border-purple-200 cursor-pointer hover:shadow-sm"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex items-center justify-center w-6 h-6 rounded-full transition-colors",
          completed ? "text-emerald-500" : "text-gray-300 group-hover:text-purple-400"
        )}>
          {completed ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </div>
        <span className={cn(
          "text-sm font-medium transition-colors",
          completed ? "text-emerald-700 line-through opacity-70" : "text-gray-700 group-hover:text-gray-900"
        )}>
          {label}
        </span>
      </div>
      
      {!completed && (
        <ArrowLeft className="w-4 h-4 text-gray-300 group-hover:text-purple-400 transition-colors group-hover:-translate-x-1 duration-200" />
      )}
    </motion.div>
  );
};
