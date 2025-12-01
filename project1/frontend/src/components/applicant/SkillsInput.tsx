import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus, Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SkillsInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  onSave?: () => void;
  isLoading?: boolean;
}

export default function SkillsInput({ skills, onChange, onSave, isLoading }: SkillsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddSkill = () => {
    const trimmedSkill = inputValue.trim();
    
    if (!trimmedSkill) return;
    
    // Check if skill already exists
    if (skills.includes(trimmedSkill)) {
      alert('این مهارت قبلاً اضافه شده است');
      return;
    }
    
    onChange([...skills, trimmedSkill]);
    setInputValue('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Suggested skills
  const suggestedSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
    'Java', 'C++', 'SQL', 'MongoDB', 'Git',
    'Docker', 'AWS', 'UI/UX Design', 'Project Management',
    'Data Analysis', 'Machine Learning', 'Communication',
  ];

  const filteredSuggestions = suggestedSkills.filter(
    skill => !skills.includes(skill) && 
             skill.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Code className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle>مهارت‌ها</CardTitle>
          </div>
          {onSave && (
            <Button
              onClick={onSave}
              disabled={isLoading}
              size="sm"
            >
              {isLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="مهارت خود را وارد کنید..."
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddSkill}
            disabled={!inputValue.trim()}
          >
            <Plus className="h-4 w-4 ml-2" />
            افزودن
          </Button>
        </div>

        {/* Suggested Skills */}
        {inputValue && filteredSuggestions.length > 0 && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-2">پیشنهادات:</p>
            <div className="flex flex-wrap gap-2">
              {filteredSuggestions.slice(0, 8).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => {
                    onChange([...skills, skill]);
                    setInputValue('');
                  }}
                  className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Skills Tags */}
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-full text-sm font-medium text-green-800 hover:from-green-100 hover:to-teal-100 transition-colors"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-red-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Code className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">هنوز مهارتی اضافه نشده است</p>
            <p className="text-xs mt-1">مهارت‌های خود را وارد کرده و اضافه کنید</p>
          </div>
        )}

        {/* Skills Count */}
        {skills.length > 0 && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              {skills.length} مهارت اضافه شده
            </p>
          </div>
        )}

        {/* Info */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700">
            💡 <strong>نکته:</strong> مهارت‌های فنی، نرم‌افزاری، و مهارت‌های نرم خود را اضافه کنید.
            برای افزودن سریع، Enter را فشار دهید.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
