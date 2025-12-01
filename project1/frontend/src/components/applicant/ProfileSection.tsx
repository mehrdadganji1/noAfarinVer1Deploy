import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface ProfileSectionProps {
  title: string
  icon: LucideIcon
  children: ReactNode
  className?: string
}

export default function ProfileSection({ 
  title, 
  icon: Icon, 
  children, 
  className = '' 
}: ProfileSectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
