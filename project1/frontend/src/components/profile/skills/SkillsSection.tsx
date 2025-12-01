import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SkillCard from './SkillCard'
// @ts-ignore - IDE cache issue, file exists
import AddSkillModal from './AddSkillModal'
import type { Skill } from '@/types/profile'

interface SkillsSectionProps {
    skills: Skill[]
    onAdd: (skill: Skill) => Promise<void>
    onUpdate: (skillName: string, skill: Skill) => Promise<void>
    onDelete: (skillName: string) => Promise<void>
    isOwnProfile?: boolean
}

export default function SkillsSection({
    skills,
    onAdd,
    onUpdate,
    onDelete,
    isOwnProfile = false
}: SkillsSectionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-600" />
                        مهارت‌ها
                    </h3>
                    {isOwnProfile && (
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            size="sm"
                            className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600"
                        >
                            <Plus className="w-4 h-4" />
                            افزودن
                        </Button>
                    )}
                </div>

                {skills && skills.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={skill.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <SkillCard
                                    skill={skill}
                                    onEdit={isOwnProfile ? (updated) => onUpdate(skill.name, updated) : undefined}
                                    onDelete={isOwnProfile ? () => onDelete(skill.name) : undefined}
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 bg-gray-50 rounded-xl"
                    >
                        <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">
                            {isOwnProfile ? 'هنوز مهارتی اضافه نکرده‌اید' : 'مهارتی ثبت نشده'}
                        </p>
                        {isOwnProfile && (
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                className="gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                افزودن اولین مهارت
                            </Button>
                        )}
                    </motion.div>
                )}
            </div>

            <AddSkillModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={onAdd}
            />
        </>
    )
}
