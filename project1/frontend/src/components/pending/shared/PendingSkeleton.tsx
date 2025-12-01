/**
 * PendingSkeleton - Beautiful loading skeletons for pending pages
 * Smooth shimmer animations with gradient effects
 */

import { motion } from 'framer-motion';

// Base skeleton with shimmer effect
const SkeletonBase = ({ className = '' }: { className?: string }) => (
  <div className={`relative overflow-hidden bg-gray-200 rounded-lg ${className}`}>
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
      animate={{ x: ['-100%', '100%'] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

// Dashboard skeleton
export const DashboardSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto space-y-4 p-2">
    {/* Hero skeleton */}
    <SkeletonBase className="h-32 w-full" />
    
    {/* Banner skeleton */}
    <SkeletonBase className="h-20 w-full" />
    
    {/* Grid skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <SkeletonBase className="h-48" />
      </div>
      <SkeletonBase className="h-48" />
    </div>
    
    {/* Quick actions skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SkeletonBase className="h-24" />
      <SkeletonBase className="h-24" />
      <SkeletonBase className="h-24" />
    </div>
    
    {/* Info cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SkeletonBase className="h-32" />
      <SkeletonBase className="h-32" />
    </div>
  </div>
);

// Profile skeleton
export const ProfileSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto space-y-4 p-2">
    {/* Header skeleton */}
    <div className="flex items-center gap-4">
      <SkeletonBase className="w-20 h-20 rounded-full" />
      <div className="flex-1 space-y-2">
        <SkeletonBase className="h-6 w-48" />
        <SkeletonBase className="h-4 w-32" />
      </div>
    </div>
    
    {/* Form sections skeleton */}
    <SkeletonBase className="h-64" />
    <SkeletonBase className="h-48" />
  </div>
);

// Status skeleton
export const StatusSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto space-y-4 p-2">
    {/* Header */}
    <SkeletonBase className="h-40" />
    
    {/* Timeline */}
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <SkeletonBase className="w-10 h-10 rounded-full" />
          <SkeletonBase className="h-16 flex-1" />
        </div>
      ))}
    </div>
  </div>
);

// Help skeleton
export const HelpSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto space-y-4 p-2">
    {/* Header */}
    <SkeletonBase className="h-24" />
    
    {/* FAQ items */}
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonBase key={i} className="h-16" />
      ))}
    </div>
    
    {/* Contact section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SkeletonBase className="h-32" />
      <SkeletonBase className="h-32" />
    </div>
  </div>
);

// Form skeleton
export const FormSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto space-y-4 p-2">
    {/* Progress bar */}
    <SkeletonBase className="h-2 w-full" />
    
    {/* Form header */}
    <SkeletonBase className="h-20" />
    
    {/* Form fields */}
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonBase className="h-12" />
        <SkeletonBase className="h-12" />
      </div>
      <SkeletonBase className="h-12" />
      <SkeletonBase className="h-24" />
      <SkeletonBase className="h-12" />
    </div>
    
    {/* Buttons */}
    <div className="flex gap-3 justify-end">
      <SkeletonBase className="h-10 w-24" />
      <SkeletonBase className="h-10 w-32" />
    </div>
  </div>
);

// Generic card skeleton
export const CardSkeleton = ({ className = '' }: { className?: string }) => (
  <SkeletonBase className={`h-32 ${className}`} />
);

// Export all
export { SkeletonBase };
