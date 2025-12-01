import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { GraduationCap, Building2, BookOpen, Hash, Calendar, Loader2 } from 'lucide-react'

interface EducationFormData {
  university: string
  major: string
  degree: string
  studentId?: string
  graduationYear: number
}

interface EducationFormProps {
  initialData?: Partial<EducationFormData>
  onSubmit: (data: EducationFormData) => Promise<void>
}

const DEGREES = [
  { value: 'diploma', label: 'دیپلم' },
  { value: 'associate', label: 'کاردانی' },
  { value: 'bachelor', label: 'کارشناسی' },
  { value: 'master', label: 'کارشناسی ارشد' },
  { value: 'phd', label: 'دکتری' },
]

export default function EducationForm({ 
  initialData, 
  onSubmit 
}: EducationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDegree, setSelectedDegree] = useState(initialData?.degree || '')

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
  } = useForm<EducationFormData>({
    defaultValues: {
      university: initialData?.university || '',
      major: initialData?.major || '',
      degree: initialData?.degree || '',
      studentId: initialData?.studentId || '',
      graduationYear: initialData?.graduationYear || new Date().getFullYear(),
    },
  })

  const onFormSubmit = async (data: EducationFormData) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* University */}
      <div className="space-y-2">
        <Label htmlFor="university" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          دانشگاه *
        </Label>
        <Input
          id="university"
          {...register('university', {
            required: 'نام دانشگاه الزامی است',
            minLength: { value: 3, message: 'نام دانشگاه باید حداقل 3 کاراکتر باشد' },
          })}
          placeholder="مثال: دانشگاه تهران"
          className={errors.university ? 'border-red-500' : ''}
        />
        {errors.university && (
          <p className="text-sm text-red-600">{errors.university.message}</p>
        )}
      </div>

      {/* Major */}
      <div className="space-y-2">
        <Label htmlFor="major" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          رشته تحصیلی *
        </Label>
        <Input
          id="major"
          {...register('major', {
            required: 'رشته تحصیلی الزامی است',
            minLength: { value: 3, message: 'رشته تحصیلی باید حداقل 3 کاراکتر باشد' },
          })}
          placeholder="مثال: مهندسی کامپیوتر"
          className={errors.major ? 'border-red-500' : ''}
        />
        {errors.major && (
          <p className="text-sm text-red-600">{errors.major.message}</p>
        )}
      </div>

      {/* Degree */}
      <div className="space-y-2">
        <Label htmlFor="degree" className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          مقطع تحصیلی *
        </Label>
        <Select
          value={selectedDegree}
          onValueChange={(value) => {
            setSelectedDegree(value)
            setValue('degree', value, { shouldDirty: true })
          }}
        >
          <SelectTrigger className={errors.degree ? 'border-red-500' : ''}>
            <SelectValue placeholder="مقطع تحصیلی را انتخاب کنید" />
          </SelectTrigger>
          <SelectContent>
            {DEGREES.map((degree) => (
              <SelectItem key={degree.value} value={degree.value}>
                {degree.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" {...register('degree', { required: 'مقطع تحصیلی الزامی است' })} />
        {errors.degree && (
          <p className="text-sm text-red-600">{errors.degree.message}</p>
        )}
      </div>

      {/* Student ID */}
      <div className="space-y-2">
        <Label htmlFor="studentId" className="flex items-center gap-2">
          <Hash className="h-4 w-4" />
          شماره دانشجویی (اختیاری)
        </Label>
        <Input
          id="studentId"
          {...register('studentId')}
          placeholder="مثال: 9812345678"
        />
      </div>

      {/* Graduation Year */}
      <div className="space-y-2">
        <Label htmlFor="graduationYear" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          سال فارغ‌التحصیلی *
        </Label>
        <Select
          defaultValue={initialData?.graduationYear?.toString()}
          onValueChange={(value) => {
            setValue('graduationYear', parseInt(value), { shouldDirty: true })
          }}
        >
          <SelectTrigger className={errors.graduationYear ? 'border-red-500' : ''}>
            <SelectValue placeholder="سال فارغ‌التحصیلی را انتخاب کنید" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input 
          type="hidden" 
          {...register('graduationYear', { 
            required: 'سال فارغ‌التحصیلی الزامی است',
            valueAsNumber: true 
          })} 
        />
        {errors.graduationYear && (
          <p className="text-sm text-red-600">{errors.graduationYear.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              در حال ذخیره...
            </>
          ) : (
            'ذخیره تغییرات'
          )}
        </Button>
        
        {!isDirty && (
          <p className="text-sm text-gray-500">تغییری ایجاد نشده</p>
        )}
      </div>
    </form>
  )
}
