import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddEducationModal from '../modals/AddEducationModal';

export default function EducationTab() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async (data: any) => {
    console.log('Education data:', data);
  };
  const educations = [
    {
      degree: 'کارشناسی ارشد',
      field: 'مهندسی کامپیوتر',
      institution: 'دانشگاه تهران',
      startDate: '1398',
      endDate: '1400',
      gpa: '18.5',
    },
    {
      degree: 'کارشناسی',
      field: 'مهندسی نرم‌افزار',
      institution: 'دانشگاه صنعتی شریف',
      startDate: '1394',
      endDate: '1398',
      gpa: '17.8',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">سوابق تحصیلی</h2>
          <p className="text-gray-600">تحصیلات و مدارک علمی شما</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-gradient-to-r from-[#E91E8C] to-[#a855f7]">
          <Plus className="w-4 h-4" />
          افزودن تحصیلات
        </Button>
      </div>

      <AddEducationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />

      <div className="space-y-4">
        {educations.map((edu, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 5 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-gray-900 mb-1">
                  {edu.degree} - {edu.field}
                </h3>
                <p className="text-gray-700 font-bold mb-3">{edu.institution}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="px-3 py-1 bg-white rounded-full font-bold text-blue-600">
                    معدل: {edu.gpa}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
