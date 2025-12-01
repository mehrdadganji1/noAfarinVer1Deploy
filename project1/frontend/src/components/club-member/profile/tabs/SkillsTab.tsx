import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddSkillModal from '../modals/AddSkillModal';

export default function SkillsTab() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async (data: any) => {
    console.log('Skill data:', data);
  };
  const skills = [
    { name: 'React', level: 90, category: 'Frontend' },
    { name: 'TypeScript', level: 85, category: 'Programming' },
    { name: 'Node.js', level: 80, category: 'Backend' },
    { name: 'Python', level: 75, category: 'Programming' },
    { name: 'UI/UX Design', level: 70, category: 'Design' },
    { name: 'MongoDB', level: 65, category: 'Database' },
  ];

  const getColorByLevel = (level: number) => {
    if (level >= 80) return 'from-green-500 to-emerald-500';
    if (level >= 60) return 'from-blue-500 to-cyan-500';
    return 'from-orange-500 to-amber-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">مهارت‌ها</h2>
          <p className="text-gray-600">تخصص‌ها و توانمندی‌های شما</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-gradient-to-r from-[#a855f7] to-[#E91E8C]">
          <Plus className="w-4 h-4" />
          افزودن مهارت
        </Button>
      </div>

      <AddSkillModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.03 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-5 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#a855f7]" />
                <h3 className="text-lg font-black text-gray-900">{skill.name}</h3>
              </div>
              <span className="text-xs font-bold text-gray-600 bg-white px-2 py-1 rounded-full">
                {skill.category}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">سطح مهارت</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(skill.level / 20)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full bg-gradient-to-r ${getColorByLevel(skill.level)} shadow-lg`}
                />
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-gray-700">{skill.level}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
