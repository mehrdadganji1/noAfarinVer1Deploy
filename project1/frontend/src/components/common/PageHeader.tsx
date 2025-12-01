import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface PageHeaderProps {
  icon: LucideIcon;
  iconGradient?: string;
  iconBorder?: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function PageHeader({
  icon: Icon,
  iconGradient = 'from-blue-50 to-indigo-50',
  iconBorder = 'border-blue-200',
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${iconGradient} border-2 ${iconBorder} flex items-center justify-center`}
        >
          <Icon className={`h-9 w-9 ${iconBorder.replace('border-', 'text-').replace('-200', '-600')}`} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
