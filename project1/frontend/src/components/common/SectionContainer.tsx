import { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface SectionContainerProps {
  header?: {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    iconColor?: string;
    badge?: number;
    action?: ReactNode;
  };
  children: ReactNode;
  className?: string;
}

const iconColorClasses = {
  green: 'bg-green-100 text-green-600',
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
  red: 'bg-red-100 text-red-600',
  gray: 'bg-gray-100 text-gray-600',
};

function SectionContainer({
  header,
  children,
  className = '',
}: SectionContainerProps) {
  if (!header) {
    return <div className={className}>{children}</div>;
  }

  const Icon = header.icon;
  const iconColorClass =
    iconColorClasses[header.iconColor as keyof typeof iconColorClasses] ||
    iconColorClasses.gray;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`w-10 h-10 rounded-xl ${iconColorClass} flex items-center justify-center`}>
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">{header.title}</h2>
                {header.badge !== undefined && (
                  <Badge variant="secondary">{header.badge}</Badge>
                )}
              </div>
              {header.subtitle && (
                <p className="text-sm text-gray-600 mt-1">{header.subtitle}</p>
              )}
            </div>
          </div>
          {header.action && <div>{header.action}</div>}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default SectionContainer;
