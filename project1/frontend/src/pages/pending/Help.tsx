/**
 * Pending Help Page
 * Help and support page for pending applicants with smooth animations
 */

import { motion } from 'framer-motion';
import { Suspense, lazy } from 'react';
import { HelpSkeleton } from '@/components/pending/shared';

// Lazy load the help component for better performance
const ApplicantHelp = lazy(() => import('@/pages/applicant/Help'));

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

export default function PendingHelp() {
  return (
    <motion.div
      className="w-[90%] mx-auto"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <Suspense fallback={<HelpSkeleton />}>
        <ApplicantHelp />
      </Suspense>
    </motion.div>
  );
}
