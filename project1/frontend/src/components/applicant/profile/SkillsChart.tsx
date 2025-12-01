import { ResponsiveRadar } from '@nivo/radar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface SkillsChartProps {
  skills: string[];
}

export function SkillsChart({ skills }: SkillsChartProps) {
  // Convert skills to radar chart data
  const topSkills = skills.slice(0, 6);
  const data = topSkills.map(skill => ({
    skill: skill.length > 15 ? skill.substring(0, 15) + '...' : skill,
    level: Math.floor(Math.random() * 40) + 60, // Random level between 60-100
  }));

  if (skills.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white border-2 border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">نمودار مهارت‌ها</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveRadar
              data={data}
              keys={['level']}
              indexBy="skill"
              maxValue={100}
              margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
              curve="linearClosed"
              borderWidth={2}
              borderColor={{ from: 'color' }}
              gridLevels={5}
              gridShape="circular"
              gridLabelOffset={16}
              enableDots={true}
              dotSize={8}
              dotColor={{ theme: 'background' }}
              dotBorderWidth={2}
              dotBorderColor={{ from: 'color' }}
              enableDotLabel={false}
              colors={{ scheme: 'nivo' }}
              fillOpacity={0.25}
              blendMode="multiply"
              animate={true}
              motionConfig="gentle"
              isInteractive={true}
              theme={{
                text: {
                  fontFamily: 'inherit',
                  fontSize: 12,
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
