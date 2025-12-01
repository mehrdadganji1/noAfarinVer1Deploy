/**
 * Edit Mode Badge Component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export const EditModeBadge: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-4 flex justify-center"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg">
        <AlertCircle className="h-5 w-5" />
        <span className="font-semibold">حالت ویرایش</span>
      </div>
    </motion.div>
  );
};
