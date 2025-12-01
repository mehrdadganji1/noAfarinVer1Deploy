import React, { useState, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { PendingSidebar } from './PendingSidebar';
import { DashboardSkeleton } from '../shared/PendingSkeleton';

/**
 * Layout for pending applicants (not yet approved)
 * Includes sidebar for navigation
 * Uses Outlet for nested routes
 * Mobile responsive with hamburger menu
 */
export const PendingLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden" dir="rtl">
      {/* Mobile Menu Button - در RTL از سمت راست */}
      <motion.button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-50 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center border-2 border-gray-200 hover:border-purple-300 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </motion.button>

      {/* Sidebar - Desktop: Always visible, Mobile: Overlay */}
      <div className="hidden md:block">
        <PendingSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />
            
            {/* Sidebar - از سمت راست در RTL */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                type: "spring", 
                damping: 30, 
                stiffness: 300,
                mass: 0.8
              }}
              className="md:hidden fixed right-0 top-0 bottom-0 z-50 w-64 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <PendingSidebar onClose={() => setIsMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Page Content with smooth transitions */}
        <main className="flex-1 p-3 md:p-4 overflow-auto">
          <Suspense fallback={<DashboardSkeleton />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </main>
      </div>
    </div>
  );
};
