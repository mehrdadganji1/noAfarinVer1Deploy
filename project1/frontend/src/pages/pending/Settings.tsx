/**
 * Pending Settings Page
 * Account settings page for pending applicants
 */

import { motion } from 'framer-motion';
import { AccountSettings } from '@/components/pending/profile';

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

export default function PendingSettings() {
  return (
    <motion.div
      className="w-[90%] mx-auto py-6"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <AccountSettings />
    </motion.div>
  );
}
