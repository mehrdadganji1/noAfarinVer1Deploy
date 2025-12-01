import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Linkedin, Github, Twitter, Link as LinkIcon, Plus, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface SocialLink {
  platform: string
  url: string
  icon: any
}

interface SocialLinksSectionProps {
  socialLinks?: {
    linkedin?: string
    github?: string
    twitter?: string
    portfolio?: string
    other?: string
  }
  isOwnProfile: boolean
  onUpdate?: (links: any) => void
}

export default function SocialLinksSection({ socialLinks, isOwnProfile, onUpdate }: SocialLinksSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    linkedin: socialLinks?.linkedin || '',
    github: socialLinks?.github || '',
    twitter: socialLinks?.twitter || '',
    portfolio: socialLinks?.portfolio || '',
    other: socialLinks?.other || '',
  })

  const platforms = [
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'blue', placeholder: 'https://linkedin.com/in/username' },
    { key: 'github', label: 'GitHub', icon: Github, color: 'gray', placeholder: 'https://github.com/username' },
    { key: 'twitter', label: 'Twitter', icon: Twitter, color: 'sky', placeholder: 'https://twitter.com/username' },
    { key: 'portfolio', label: 'Portfolio', icon: Globe, color: 'purple', placeholder: 'https://yourwebsite.com' },
    { key: 'other', label: 'Other', icon: LinkIcon, color: 'green', placeholder: 'https://...' },
  ]

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value })
  }

  const handleSave = () => {
    onUpdate?.(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      linkedin: socialLinks?.linkedin || '',
      github: socialLinks?.github || '',
      twitter: socialLinks?.twitter || '',
      portfolio: socialLinks?.portfolio || '',
      other: socialLinks?.other || '',
    })
    setIsEditing(false)
  }

  const hasAnyLink = Object.values(socialLinks || {}).some(link => link)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-600" />
          لینک‌های اجتماعی
        </h3>
        {isOwnProfile && !isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Edit2 className="w-3 h-3" />
            ویرایش
          </Button>
        )}
      </div>

      {isEditing ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {platforms.map((platform) => {
            const Icon = platform.icon
            return (
              <div key={platform.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Icon className={`w-4 h-4 text-${platform.color}-600`} />
                  {platform.label}
                </label>
                <Input
                  value={formData[platform.key as keyof typeof formData]}
                  onChange={(e) => handleChange(platform.key, e.target.value)}
                  placeholder={platform.placeholder}
                  className="h-9"
                />
              </div>
            )
          })}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSave}
              size="sm"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
            >
              ذخیره
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
            >
              انصراف
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {hasAnyLink ? (
            platforms.map((platform) => {
              const Icon = platform.icon
              const url = socialLinks?.[platform.key as keyof typeof socialLinks]
              if (!url) return null
              
              return (
                <motion.a
                  key={platform.key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, x: -4 }}
                  className={`flex items-center gap-3 p-3 bg-${platform.color}-50 rounded-lg hover:bg-${platform.color}-100 transition-colors`}
                >
                  <Icon className={`w-5 h-5 text-${platform.color}-600`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{platform.label}</p>
                    <p className="text-xs text-gray-600 truncate">{url}</p>
                  </div>
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                </motion.a>
              )
            })
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Globe className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                {isOwnProfile ? 'لینک‌های اجتماعی خود را اضافه کنید' : 'لینکی ثبت نشده است'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
