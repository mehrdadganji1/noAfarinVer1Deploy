import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterSectionProps {
  title: string;
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
  className?: string;
}

export default function FilterSection({
  title,
  options,
  selected,
  onSelect,
  className = '',
}: FilterSectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Filter className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <Button
              key={option.value}
              variant={selected === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSelect(option.value)}
              className="text-xs"
            >
              {option.label}
              {option.count !== undefined && (
                <Badge variant="secondary" className="mr-2 text-xs">
                  {option.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
