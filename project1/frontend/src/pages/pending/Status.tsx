/**
 * Pending Status Page
 * Application status page for pending applicants with smooth animations
 */

import { motion } from 'framer-motion';
import { useAACOApplication } from '@/hooks/useAACOApplication';
import { StatusSkeleton } from '@/components/pending/shared';
import { StatusPageHeader, StatusTimeline } from '@/components/application-status';
import type { ApplicationStatus } from '@/components/application-status/types';

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
  const { application, isLoadingApplication } = useAACOApplication();

  if (isLoadingApplication) {
    return <StatusSkeleton />;
  }

  const applicationStatus = (application?.status || 'submitted') as ApplicationStatus;

  return (
    <motion.div
      className="w-[90%] mx-auto space-y-6"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <StatusPageHeader 
        applicationStatus={applicationStatus}
        submittedDate={application?.submittedAt ? new Date(application.submittedAt).toLocaleDateString('fa-IR') : undefined}
      />
      <StatusTimeline status={applicationStatus} />
    </motion.div>
  );
}
