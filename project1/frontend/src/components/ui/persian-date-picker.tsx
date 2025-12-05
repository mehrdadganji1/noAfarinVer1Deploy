/**
 * Persian (Jalali/Shamsi) Date Picker Component
 * کامپوننت انتخاب تاریخ شمسی
 */

import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PersianDatePickerProps {
  value?: string; // ISO date string or YYYY-MM format
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onlyMonthPicker?: boolean;
  error?: boolean;
  minDate?: Date | string;
  maxDate?: Date | string;
}

export function PersianDatePicker({
  value,
  onChange,
  placeholder = 'انتخاب تاریخ',
  className,
  disabled = false,
  onlyMonthPicker = false,
  error = false,
  minDate,
  maxDate,
}: PersianDatePickerProps) {
  // Convert ISO string to DateObject for the picker
  const getDateValue = (): DateObject | null => {
    if (!value) return null;
    try {
      // Handle YYYY-MM format
      if (value.length === 7) {
        return new DateObject({
          date: new Date(value + '-01'),
          calendar: persian,
          locale: persian_fa,
        });
      }
      return new DateObject({
        date: new Date(value),
        calendar: persian,
        locale: persian_fa,
      });
    } catch {
      return null;
    }
  };

  const handleChange = (date: DateObject | null) => {
    if (!date) {
      onChange('');
      return;
    }
    
    // Convert Persian date to Gregorian for storage
    const gregorianDate = date.toDate();
    if (onlyMonthPicker) {
      // Return YYYY-MM format
      const year = gregorianDate.getFullYear();
      const month = String(gregorianDate.getMonth() + 1).padStart(2, '0');
      onChange(`${year}-${month}`);
    } else {
      // Return ISO date string
      onChange(gregorianDate.toISOString().split('T')[0]);
    }
  };

  return (
    <div className="relative">
      <DatePicker
        value={getDateValue()}
        onChange={handleChange}
        calendar={persian}
        locale={persian_fa}
        onlyMonthPicker={onlyMonthPicker}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        format={onlyMonthPicker ? 'MMMM YYYY' : 'DD MMMM YYYY'}
        containerClassName="w-full"
        inputClass={cn(
          'w-full h-11 px-3 pr-10 border rounded-lg bg-white text-sm transition-colors cursor-pointer text-right',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          disabled && 'bg-gray-100 cursor-not-allowed opacity-60',
          error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
          className
        )}
        placeholder={placeholder}
        calendarPosition="bottom-right"
        fixMainPosition
        arrow={false}
        style={{ width: '100%' }}
      />
      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

export default PersianDatePicker;
