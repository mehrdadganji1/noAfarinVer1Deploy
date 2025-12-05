import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link as LinkIcon, Save, Loader2, ExternalLink, Check } from 'lucide-react';
import { SocialLinks } from '@/hooks/useProfile';
import { ModernSectionHeader } from '../cards/ModernSectionHeader';

interface ModernSocialLinksSectionProps {
  socialLinks?: SocialLinks;
  onSave: (links: SocialLinks) => void;
  isLoading?: boolean;
}

// Social platform icons
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const socialPlatforms = [
  { key: 'linkedin' as keyof SocialLinks, label: 'لینکدین', icon: LinkedInIcon, placeholder: 'https://linkedin.com/in/username', color: '#0A66C2' },
  { key: 'github' as keyof SocialLinks, label: 'گیت‌هاب', icon: GitHubIcon, placeholder: 'https://github.com/username', color: '#181717' },
  { key: 'twitter' as keyof SocialLinks, label: 'توییتر / ایکس', icon: TwitterIcon, placeholder: 'https://x.com/username', color: '#000000' },
  { key: 'portfolio' as keyof SocialLinks, label: 'اینستاگرام', icon: InstagramIcon, placeholder: 'https://instagram.com/username', color: '#E4405F' },
  { key: 'other' as keyof SocialLinks, label: 'تلگرام', icon: TelegramIcon, placeholder: 'https://t.me/username', color: '#0088cc' },
];

export function ModernSocialLinksSection({
  socialLinks,
  onSave,
  isLoading = false,
}: ModernSocialLinksSectionProps) {
  const [formData, setFormData] = useState<SocialLinks>(socialLinks || {});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (socialLinks) setFormData(socialLinks);
  }, [socialLinks]);

  const handleChange = (field: keyof SocialLinks, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setHasChanges(false);
  };

  const filledCount = Object.values(formData).filter(v => v && v.trim()).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <ModernSectionHeader
        icon={LinkIcon}
        title="شبکه‌های اجتماعی"
        subtitle="لینک پروفایل‌های خود را اضافه کنید"
        count={filledCount}
        gradient="from-pink-500 to-rose-500"
      />

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {socialPlatforms.map((platform, index) => {
            const Icon = platform.icon;
            const value = formData[platform.key] || '';
            const hasValue = value.trim().length > 0;

            return (
              <motion.div
                key={platform.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative rounded-xl border transition-all duration-200 overflow-hidden ${
                  hasValue ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 p-3">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-md"
                    style={{ backgroundColor: platform.color }}
                  >
                    <Icon />
                  </div>

                  {/* Input */}
                  <div className="flex-1 min-w-0">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">{platform.label}</label>
                    <Input
                      type="url"
                      value={value}
                      onChange={(e) => handleChange(platform.key, e.target.value)}
                      placeholder={platform.placeholder}
                      className="h-8 text-xs border-0 bg-slate-50 focus:bg-white focus-visible:ring-1 focus-visible:ring-violet-400 placeholder:text-slate-400 rounded-lg"
                      dir="ltr"
                    />
                  </div>

                  {/* Status */}
                  {hasValue && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            {filledCount > 0 ? (
              <span className="font-semibold text-emerald-600">{filledCount} شبکه متصل</span>
            ) : (
              'هنوز شبکه‌ای متصل نشده'
            )}
          </p>

          <Button
            type="submit"
            size="sm"
            disabled={isLoading || !hasChanges}
            className="bg-gradient-to-l from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 shadow-md"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin ml-1.5" /> : <Save className="w-4 h-4 ml-1.5" />}
            ذخیره
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
