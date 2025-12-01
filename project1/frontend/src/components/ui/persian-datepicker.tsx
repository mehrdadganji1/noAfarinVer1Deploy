import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import TimePicker from 'react-multi-date-picker/plugins/time_picker'

interface PersianDatePickerProps {
  selected: Date | null
  onChange: (date: Date | null) => void
  showTimeSelect?: boolean
  placeholder?: string
  required?: boolean
  minDate?: Date
}

export function PersianDatePicker({
  selected,
  onChange,
  showTimeSelect = true,
  placeholder,
  required,
  minDate,
}: PersianDatePickerProps) {
  const handleChange = (value: any) => {
    if (value) {
      onChange(value.toDate())
    } else {
      onChange(null)
    }
  }

  return (
    <DatePicker
      value={selected}
      onChange={handleChange}
      calendar={persian}
      locale={persian_fa}
      format={showTimeSelect ? 'YYYY/MM/DD HH:mm' : 'YYYY/MM/DD'}
      plugins={showTimeSelect ? [<TimePicker key="time" position="bottom" />] : []}
      placeholder={placeholder || 'تاریخ را انتخاب کنید'}
      minDate={minDate}
      inputClass="w-full px-3 py-2 border rounded-md cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      containerStyle={{ width: '100%' }}
      style={{ width: '100%' }}
      required={required}
    />
  )
}
