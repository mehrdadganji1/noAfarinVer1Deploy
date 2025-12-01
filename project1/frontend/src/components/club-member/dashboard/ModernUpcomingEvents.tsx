import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import GlowingCard from './GlowingCard';

interface Event {
  id: string;
  title: string;
  date: Date;
  time?: string;
  location?: string;
  isOnline?: boolean;
  registeredCount?: number;
  capacity?: number;
  type: 'workshop' | 'webinar' | 'competition' | 'meetup';
}

interface ModernUpcomingEventsProps {
  events: Event[];
  loading?: boolean;
  onViewAll?: () => void;
}

const eventTypeColors: Record<string, string> = {
  workshop: 'from-[#00D9FF] to-[#0891b2]',
  webinar: 'from-[#a855f7] to-[#7e22ce]',
  competition: 'from-[#E91E8C] to-[#be185d]',
  meetup: 'from-[#10b981] to-[#059669]',
};

const eventTypeLabels: Record<string, string> = {
  workshop: 'کارگاه',
  webinar: 'وبینار',
  competition: 'مسابقه',
  meetup: 'گردهمایی',
};

function ModernUpcomingEvents({ events, loading, onViewAll }: ModernUpcomingEventsProps) {
  return (
    <GlowingCard glowColor="cyan">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#00D9FF]" />
            رویدادهای پیش رو
          </h2>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-sm text-[#00D9FF] hover:text-[#0891b2] font-bold flex items-center gap-1 transition-colors"
            >
              همه
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="space-y-3">
            {events.slice(0, 3).map((event, index) => {
              const gradient = eventTypeColors[event.type] || eventTypeColors.workshop;
              const typeLabel = eventTypeLabels[event.type] || 'رویداد';

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="group relative overflow-hidden rounded-xl bg-white border-2 border-gray-100 hover:border-[#00D9FF]/30 transition-all duration-300 p-4"
                >
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r ${gradient} text-white text-xs font-bold`}>
                    {typeLabel}
                  </div>

                  <div className="pr-2">
                    <h3 className="font-bold text-gray-900 mb-3 pr-16 group-hover:text-[#00D9FF] transition-colors">
                      {event.title}
                    </h3>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-[#00D9FF]" />
                        <span>{format(new Date(event.date), 'dd MMMM yyyy', { locale: faIR })}</span>
                      </div>

                      {event.time && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-[#a855f7]" />
                          <span>{event.time}</span>
                        </div>
                      )}

                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-[#E91E8C]" />
                          <span>{event.isOnline ? 'آنلاین' : event.location}</span>
                        </div>
                      )}

                      {event.capacity && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4 text-[#10b981]" />
                          <span>
                            {event.registeredCount || 0} / {event.capacity} نفر
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00D9FF] to-[#a855f7] opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">رویداد پیش‌رویی وجود ندارد</p>
          </motion.div>
        )}
      </div>
    </GlowingCard>
  );
}

export default ModernUpcomingEvents;

