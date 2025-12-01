import { ResponsiveBar } from '@nivo/bar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { WorkExperience, Education } from '@/hooks/useProfile';

interface ExperienceTimelineProps {
  workExperience: WorkExperience[];
  educationHistory: Education[];
}

export function ExperienceTimeline({ workExperience, educationHistory }: ExperienceTimelineProps) {
  // Calculate years of experience
  const calculateYears = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    return Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365)));
  };

  // Prepare data for bar chart
  const data = [
    {
      category: 'تحصیلات',
      years: educationHistory.reduce((sum, edu) => 
        sum + calculateYears(edu.startDate, edu.endDate), 0
      ),
      color: 'hsl(217, 91%, 60%)'
    },
    {
      category: 'تجربه کاری',
      years: workExperience.reduce((sum, exp) => 
        sum + calculateYears(exp.startDate, exp.endDate), 0
      ),
      color: 'hsl(271, 91%, 65%)'
    }
  ];

  if (data.every(d => d.years === 0)) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-white border-2 border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">خط زمانی تجربیات</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveBar
              data={data}
              keys={['years']}
              indexBy="category"
              margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
              padding={0.4}
              valueScale={{ type: 'linear' }}
              colors={({ data }) => data.color}
              borderRadius={8}
              borderWidth={2}
              borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendPosition: 'middle',
                legendOffset: 32
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'سال',
                legendPosition: 'middle',
                legendOffset: -45
              }}
              enableLabel={true}
              label={d => `${d.value} سال`}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor="white"
              animate={true}
              motionConfig="gentle"
              theme={{
                text: {
                  fontFamily: 'inherit',
                  fontSize: 12,
                },
                axis: {
                  ticks: {
                    text: {
                      fontSize: 12,
                    }
                  }
                },
                tooltip: {
                  container: {
                    background: 'white',
                    fontSize: 12,
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    padding: '8px 12px',
                  },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
