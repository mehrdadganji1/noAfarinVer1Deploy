import { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface BaseFieldProps {
  label: string
  name: string
  required?: boolean
  className?: string
  hint?: string
}

interface InputFieldProps extends BaseFieldProps {
  type?: 'text' | 'number' | 'email' | 'url' | 'datetime-local'
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  min?: number
  max?: number
}

interface TextareaFieldProps extends BaseFieldProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  rows?: number
  maxLength?: number
  showCount?: boolean
}

interface SelectFieldProps extends BaseFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  options: { value: string; label: string }[]
}

export function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  hint,
  min,
  max,
}: InputFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={name} className="text-sm font-semibold text-gray-700 mb-2 block">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className="h-11 text-sm border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-lg"
      />
      {hint && <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
        <span className="text-blue-500">ℹ️</span> {hint}
      </p>}
    </div>
  )
}

export function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  hint,
  rows = 3,
  maxLength,
  showCount = false,
}: TextareaFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={name} className="text-sm font-semibold text-gray-700 mb-2 block">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className="text-sm border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none rounded-lg"
      />
      {(hint || showCount) && (
        <div className="flex justify-between items-center mt-2">
          {hint && <p className="text-xs text-gray-500 flex items-center gap-1">
            <span className="text-blue-500">ℹ️</span> {hint}
          </p>}
          {showCount && maxLength && (
            <p className={`text-xs font-medium ${value.length > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-500'}`}>
              {value.length}/{maxLength}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export function FormSelect({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  hint,
  options,
}: SelectFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={name} className="text-sm font-semibold text-gray-700 mb-2 block">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 text-sm border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-lg">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-sm">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hint && <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
        <span className="text-blue-500">ℹ️</span> {hint}
      </p>}
    </div>
  )
}

export function FormFieldGroup({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`grid grid-cols-2 gap-4 ${className}`}>{children}</div>
}

interface FormSwitchProps {
  label: string
  name: string
  checked: boolean
  onChange: (checked: boolean) => void
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export function FormSwitch({
  label,
  name,
  checked,
  onChange,
  icon: Icon,
  className = '',
}: FormSwitchProps) {
  return (
    <div className={`flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
        )}
        <Label htmlFor={name} className="cursor-pointer text-sm font-semibold text-gray-700">
          {label}
        </Label>
      </div>
      <Switch
        id={name}
        checked={checked}
        onCheckedChange={onChange}
      />
    </div>
  )
}
