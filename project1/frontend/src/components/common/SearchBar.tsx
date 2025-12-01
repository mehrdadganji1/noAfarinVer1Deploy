import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'جستجو...',
  className = '',
}: SearchBarProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pr-12 h-12"
          />
        </div>
      </CardContent>
    </Card>
  );
}
