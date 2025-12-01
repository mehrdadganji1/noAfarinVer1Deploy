import React from 'react';
import { motion } from 'framer-motion';
import { TabItem } from './types';

interface VerticalTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'dark' | 'light';
}

export const VerticalTabs: React.FC<VerticalTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'dark',
}) => {
  const isLight = variant === 'light';

  return (
    <div className="flex flex-row lg:flex-col gap-2 sm:gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide">
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative group flex-shrink-0 lg:flex-shrink lg:w-full text-right p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300
              ${isLight
                ? isActive
                  ? 'bg-gradient-to-l from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-500/25'
                  : 'bg-white/60 backdrop-blur-sm border border-slate-200/50 text-slate-700 hover:bg-white hover:shadow-lg hover:border-purple-200'
                : isActive
                  ? 'bg-white/20 backdrop-blur-md border-2 border-white/40 shadow-xl'
                  : 'bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20'
              }
            `}
          >
            {/* Active indicator */}
            {isActive && !isLight && (
              <motion.div
                layoutId="activeTab"
                className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full hidden lg:block"
              />
            )}

            <div className="flex items-center gap-2 sm:gap-4">
              <div
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all flex-shrink-0
                  ${isLight
                    ? isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 group-hover:from-purple-200 group-hover:to-pink-200'
                    : isActive
                      ? 'bg-white text-purple-600'
                      : 'bg-white/10 text-white group-hover:bg-white/20'
                  }
                `}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-bold text-sm sm:text-base lg:text-lg whitespace-nowrap lg:whitespace-normal ${
                    isLight
                      ? isActive ? 'text-white' : 'text-slate-800'
                      : isActive ? 'text-white' : 'text-white/90'
                  }`}
                >
                  {tab.title}
                </h3>
                <p className={`text-xs sm:text-sm hidden lg:block ${
                  isLight
                    ? isActive ? 'text-white/80' : 'text-slate-500'
                    : isActive ? 'text-white/80' : 'text-white/60'
                }`}>
                  {tab.description}
                </p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};
