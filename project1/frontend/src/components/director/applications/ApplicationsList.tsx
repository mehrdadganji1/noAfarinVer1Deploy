import { motion } from 'framer-motion'
import { Application } from '@/pages/director/Applications'
import ApplicationCard from './ApplicationCard'
import { FileQuestion } from 'lucide-react'

interface ApplicationsListProps {
  applications: Application[]
  onSelectApplication: (application: Application) => void
}

export default function ApplicationsList({ applications, onSelectApplication }: ApplicationsListProps) {
  if (applications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300"
      >
        <div className="p-6 bg-gray-100 rounded-full mb-4">
          <FileQuestion className="h-16 w-16 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          درخواستی یافت نشد
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          در حال حاضر هیچ درخواست عضویتی با فیلترهای انتخابی شما وجود ندارد.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {applications.map((application, index) => (
        <ApplicationCard
          key={application._id}
          application={application}
          onSelect={onSelectApplication}
          index={index}
        />
      ))}
    </div>
  )
}
