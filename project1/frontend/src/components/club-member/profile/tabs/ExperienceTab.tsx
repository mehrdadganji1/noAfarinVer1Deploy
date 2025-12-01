import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Plus, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddExperienceModal from '../modals/AddExperienceModal';

export default function ExperienceTab() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async (data: any) => {
    console.log('Experience data:', data);
  };
  const experiences = [
    {
      title: 'توسعه‌دهنده ارشد فرانت‌اند',
      company: 'شرکت فناوری نوآفرین',
      location: 'تهران',
      startDate: '1401',
      endDate: 'اکنون',
      description: 'توسعه و نگهداری اپلیکیشن‌های وب با React و TypeScript',
    },
    {
      title: 'توسعه‌دهنده فول‌استک',
      company: 'استارتاپ تکنولوژی',
      location: 'تهران',
      startDate: '1399',
      endDate: '1401',
      description: 'طراحی و پیاده‌سازی سیستم‌های وب با Node.js و React',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">سوابق شغلی</h2>
          <p className="text-gray-600">تجربیات کاری و حرفه‌ای شما</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-gradient-to-r from-[#00D9FF] to-[#0891b2]">
          <Plus className="w-4 h-4" />
          افزودن تجربه
        </Button>
      </div>

      <AddExperienceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />

      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 5 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-gray-900 mb-1">{exp.title}</h3>
                <p className="text-gray-700 font-bold mb-2">{exp.company}</p>
                <p className="text-gray-600 mb-3 leading-relaxed">{exp.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
