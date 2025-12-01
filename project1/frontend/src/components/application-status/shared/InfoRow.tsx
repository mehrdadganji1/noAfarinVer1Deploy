/**
 * Info Row Component
 * Displays a label-value pair with optional icon
 */

import { FC, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoRowProps {
  label: string;
  value: string | ReactNode;
  icon?: LucideIcon;
  iconColor?: string;
}

export const InfoRow: FC<InfoRowProps> = ({ 
  label, 
  value, 
  icon: Icon,
  iconColor = 'text-gray-500'
}) => {
  return (
    <div className="flex items-start gap-3 py-2 flex-row-reverse">
      {Icon && (
        <div className={`mt-0.5 ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      )}
      <div className="flex-1 min-w-0 text-right">
        <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
        <p className="text-sm text-gray-900 font-semibold break-words">
          {value}
        </p>
      </div>
    </div>
  );
};
