/**
 * Skill Selector Component
 */

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { AVAILABLE_SKILLS } from '../constants/form.constants';

interface SkillSelectorProps {
  selectedSkills: string[];
  onToggle: (skill: string) => void;
}

export const SkillSelector: React.FC<SkillSelectorProps> = ({ selectedSkills, onToggle }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        مهارت‌های مورد نیاز یا موجود
      </label>
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_SKILLS.map((skill) => (
          <span
            key={skill}
            className={`
              inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer 
              hover:scale-105 transition-all duration-200 border-2
              ${selectedSkills.includes(skill) 
                ? 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm' 
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
              }
            `}
            onClick={() => onToggle(skill)}
          >
            {skill}
            {selectedSkills.includes(skill) && (
              <CheckCircle className="w-3 h-3 ml-1" />
            )}
          </span>
        ))}
      </div>
    </div>
  );
};
