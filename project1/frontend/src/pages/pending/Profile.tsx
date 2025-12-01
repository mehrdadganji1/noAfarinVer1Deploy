/**
 * Pending Profile Page
 * Profile page for pending applicants
 */

import { motion } from 'framer-motion';
import { Suspense, lazy } from 'react';
import { ProfileSkeleton } from '@/components/pending/shared';

// Lazy load the profile component for better performance
const ApplicantProfile = lazy(() => import('@/pages/applicant/Profile'));

// Page animation variants
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function PendingProfile() {
  return (
    <motion.div
      className="w-[90%] mx-auto py-6"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Profile Section */}
      <Suspense fallback={<ProfileSkeleton />}>
        <ApplicantProfile />
      </Suspense>
    </motion.div>
  );
}
