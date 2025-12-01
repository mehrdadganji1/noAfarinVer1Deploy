import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Code } from 'lucide-react'

interface TeamTechStackProps {
  technologies: string[]
}

export default function TeamTechStack({ technologies }: TeamTechStackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="border-0 shadow">
        <CardHeader className="pb-3 bg-blue-50">
          <CardTitle className="text-sm flex items-center gap-2">
            <Code className="h-4 w-4" />
            فناوری‌های استفاده شده
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          {technologies && technologies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-2 text-sm">فناوری‌ای ثبت نشده است</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
