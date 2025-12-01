/**
 * Pending Status Page
 * Application status page for pending applicants with smooth animations
 */

import { motion } from 'framer-motion';
import { Suspense, lazy } from 'react';
import { StatusSkeleton } from '@/components/pending/shared';

// Lazy load the status component for better performance
const ApplicationStatus = lazy(() => import('@/pages/ApplicationStatus'));

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

export default function PendingStatus() {
  return (
    <motion.div
      className="w-[90%] mx-auto"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <Suspense fallback={<StatusSkeleton />}>
        <ApplicationStatus />
      </Suspense>
    </motion.div>
  );
}
