import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Phone, Hash, Calendar, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

interface PersonalInfoFormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  nationalId: string
  dateOfBirth: string
}

interface PersonalInfoFormProps {
  initialData?: Partial<PersonalInfoFormData>
  onSubmit: (data: PersonalInfoFormData) => Promise<void>
}

export default function PersonalInfoForm({ 
  initialData, 
  onSubmit 
}: PersonalInfoFormProps) {
  const user = useAuthStore((state) => state.user)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<PersonalInfoFormData>({
    defaultValues: {
      firstName: initialData?.firstName || user?.firstName || '',
      lastName: initialData?.lastName || user?.lastName || '',
      email: initialData?.email || user?.email || '',
      phoneNumber: initialData?.phoneNumber || user?.phoneNumber || '',
      nationalId: initialData?.nationalId || '',
      dateOfBirth: initialData?.dateOfBirth || '',
    },
  })

  const onFormSubmit = async (data: PersonalInfoFormData) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* First Name */}
      <div className="space-y-2">
        <Label htmlFor="firstName" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          نام *
        </Label>
        <Input
          id="firstName"
          {...register('firstName', {
            required: 'نام الزامی است',
            minLength: { value: 2, message: 'نام باید حداقل 2 کاراکتر باشد' },
          })}
          placeholder="نام خود را وارد کنید"
          className={errors.firstName ? 'border-red-500' : ''}
        />
        {errors.firstName && (
          <p className="text-sm text-red-600">{errors.firstName.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div className="space-y-2">
        <Label htmlFor="lastName" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          نام خانوادگی *
        </Label>
        <Input
          id="lastName"
          {...register('lastName', {
            required: 'نام خانوادگی الزامی است',
            minLength: { value: 2, message: 'نام خانوادگی باید حداقل 2 کاراکتر باشد' },
          })}
          placeholder="نام خانوادگی خود را وارد کنید"
          className={errors.lastName ? 'border-red-500' : ''}
        />
        {errors.lastName && (
          <p className="text-sm text-red-600">{errors.lastName.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          ایمیل *
        </Label>
        <Input
          id="email"
          type="email"
          {...register('email', {
            required: 'ایمیل الزامی است',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'ایمیل نامعتبر است',
            },
          })}
          placeholder="example@email.com"
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          شماره تماس *
        </Label>
        <Input
          id="phoneNumber"
          {...register('phoneNumber', {
            required: 'شماره تماس الزامی است',
            pattern: {
              value: /^09[0-9]{9}$/,
              message: 'شماره تماس نامعتبر است (مثال: 09123456789)',
            },
          })}
          placeholder="09123456789"
          className={errors.phoneNumber ? 'border-red-500' : ''}
        />
        {errors.phoneNumber && (
          <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
        )}
      </div>

      {/* National ID */}
      <div className="space-y-2">
        <Label htmlFor="nationalId" className="flex items-center gap-2">
          <Hash className="h-4 w-4" />
          کد ملی *
        </Label>
        <Input
          id="nationalId"
          {...register('nationalId', {
            required: 'کد ملی الزامی است',
            pattern: {
              value: /^[0-9]{10}$/,
              message: 'کد ملی باید 10 رقم باشد',
            },
          })}
          placeholder="1234567890"
          maxLength={10}
          className={errors.nationalId ? 'border-red-500' : ''}
        />
        {errors.nationalId && (
          <p className="text-sm text-red-600">{errors.nationalId.message}</p>
        )}
      </div>

      {/* Date of Birth */}
      <div className="space-y-2">
        <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          تاریخ تولد *
        </Label>
        <Input
          id="dateOfBirth"
          type="date"
          {...register('dateOfBirth', {
            required: 'تاریخ تولد الزامی است',
          })}
          className={errors.dateOfBirth ? 'border-red-500' : ''}
        />
        {errors.dateOfBirth && (
          <p className="text-sm text-red-600">{errors.dateOfBirth.message}</p>
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
