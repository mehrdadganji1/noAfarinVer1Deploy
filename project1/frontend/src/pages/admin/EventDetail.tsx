import { Calendar } from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function EventDetail() {
  const { id } = useParams();
  
  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
      <div className="text-center space-y-4">
        <Calendar className="w-16 h-16 mx-auto text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-700">جزئیات رویداد {id}</h2>
        <p className="text-gray-500">این بخش در حال توسعه است</p>
      </div>
    </div>
  );
}
