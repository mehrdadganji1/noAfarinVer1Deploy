import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Linkedin, Github, Globe, Twitter, Link as LinkIcon } from 'lucide-react';
import { SocialLinks } from '@/hooks/useProfile';

interface SocialLinksFormProps {
  initialData?: SocialLinks;
  onSave: (socialLinks: SocialLinks) => void;
  isLoading?: boolean;
}

export default function SocialLinksForm({ initialData, onSave, isLoading }: SocialLinksFormProps) {
  const [formData, setFormData] = useState<SocialLinks>({
    linkedin: '',
    github: '',
    portfolio: '',
    twitter: '',
    other: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SocialLinks, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field: keyof SocialLinks, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateURL = (url: string): boolean => {
    if (!url) return true; // Empty is valid
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof SocialLinks, string>> = {};

    // Validate each URL
    if (formData.linkedin && !validateURL(formData.linkedin)) {
      newErrors.linkedin = 'آدرس LinkedIn معتبر نیست';
    }
    if (formData.github && !validateURL(formData.github)) {
      newErrors.github = 'آدرس GitHub معتبر نیست';
    }
    if (formData.portfolio && !validateURL(formData.portfolio)) {
      newErrors.portfolio = 'آدرس Portfolio معتبر نیست';
    }
    if (formData.twitter && !validateURL(formData.twitter)) {
      newErrors.twitter = 'آدرس Twitter معتبر نیست';
    }
    if (formData.other && !validateURL(formData.other)) {
      newErrors.other = 'آدرس URL معتبر نیست';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <LinkIcon className="h-5 w-5 text-indigo-600" />
            </div>
            <CardTitle>لینک‌های اجتماعی</CardTitle>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* LinkedIn */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Linkedin className="h-4 w-4 text-blue-600" />
            LinkedIn
          </label>
          <Input
            type="url"
            value={formData.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/username"
            className={errors.linkedin ? 'border-red-500' : ''}
          />
          {errors.linkedin && (
            <p className="text-sm text-red-500">{errors.linkedin}</p>
          )}
        </div>

        {/* GitHub */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Github className="h-4 w-4 text-gray-900" />
            GitHub
          </label>
          <Input
            type="url"
            value={formData.github}
            onChange={(e) => handleChange('github', e.target.value)}
            placeholder="https://github.com/username"
            className={errors.github ? 'border-red-500' : ''}
          />
          {errors.github && (
            <p className="text-sm text-red-500">{errors.github}</p>
          )}
        </div>

        {/* Portfolio */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Globe className="h-4 w-4 text-green-600" />
            Portfolio / وبسایت شخصی
          </label>
          <Input
            type="url"
            value={formData.portfolio}
            onChange={(e) => handleChange('portfolio', e.target.value)}
            placeholder="https://yourwebsite.com"
            className={errors.portfolio ? 'border-red-500' : ''}
          />
          {errors.portfolio && (
            <p className="text-sm text-red-500">{errors.portfolio}</p>
          )}
        </div>

        {/* Twitter */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Twitter className="h-4 w-4 text-sky-500" />
            Twitter / X
          </label>
          <Input
            type="url"
            value={formData.twitter}
            onChange={(e) => handleChange('twitter', e.target.value)}
            placeholder="https://twitter.com/username"
            className={errors.twitter ? 'border-red-500' : ''}
          />
          {errors.twitter && (
            <p className="text-sm text-red-500">{errors.twitter}</p>
          )}
        </div>

        {/* Other */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-purple-600" />
            لینک دیگر
          </label>
          <Input
            type="url"
            value={formData.other}
            onChange={(e) => handleChange('other', e.target.value)}
            placeholder="https://..."
            className={errors.other ? 'border-red-500' : ''}
          />
          {errors.other && (
            <p className="text-sm text-red-500">{errors.other}</p>
          )}
          <p className="text-xs text-gray-500">
            مثلاً Medium، Stack Overflow، یا هر شبکه اجتماعی دیگر
          </p>
        </div>

        {/* Info */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700">
            💡 <strong>نکته:</strong> لینک‌های اجتماعی به ارزیابی‌کنندگان کمک می‌کند تا با کار و فعالیت‌های شما بیشتر آشنا شوند.
            همه فیلدها اختیاری هستند.
          </p>
        </div>

        {/* Preview */}
        {(formData.linkedin || formData.github || formData.portfolio || formData.twitter || formData.other) && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium mb-3">پیش‌نمایش:</h4>
            <div className="flex flex-wrap gap-2">
              {formData.linkedin && (
                <a
                  href={formData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
              {formData.github && (
                <a
                  href={formData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              )}
              {formData.portfolio && (
                <a
                  href={formData.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                >
                  <Globe className="h-4 w-4" />
                  Portfolio
                </a>
              )}
              {formData.twitter && (
                <a
                  href={formData.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100 transition-colors text-sm"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </a>
              )}
              {formData.other && (
                <a
                  href={formData.other}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm"
                >
                  <LinkIcon className="h-4 w-4" />
                  Other
                </a>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
