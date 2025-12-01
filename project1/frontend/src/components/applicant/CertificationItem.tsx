import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Award, Calendar, ExternalLink, Hash } from 'lucide-react';
import { Certification } from '@/hooks/useProfile';
import { toPersianDate } from '@/utils/dateUtils';

interface CertificationItemProps {
  certification: Certification;
  onDelete: (id: string) => void;
}

export default function CertificationItem({ certification, onDelete }: CertificationItemProps) {
  // Format date
  const formatDate = (date: string) => {
    return toPersianDate(date, 'short');
  };

  const issueDate = formatDate(certification.date);
  const expiryDate = certification.expiryDate ? formatDate(certification.expiryDate) : null;

  // Check if expired
  const isExpired = certification.expiryDate && new Date(certification.expiryDate) < new Date();

  return (
    <div className="relative group/item">
      {/* Gradient left accent */}
      <div className={`absolute right-0 top-0 bottom-0 w-1 rounded-r-lg opacity-100 group-hover/item:w-1.5 transition-all ${
        isExpired 
          ? 'bg-gradient-to-b from-red-500 to-red-600' 
          : 'bg-gradient-to-b from-[#FF006E] to-[#FF4DA7]'
      }`} />
      
      <Card className={`hover:shadow-md transition-all duration-200 border-r-0 ${
        isExpired 
          ? 'hover:border-red-300' 
          : 'hover:border-[#FF006E]/30'
      }`}>
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform ${
              isExpired
                ? 'bg-gradient-to-br from-red-500/15 to-red-500/5'
                : 'bg-gradient-to-br from-[#FF006E]/15 to-[#FF006E]/5'
            }`}>
              <Award className={`h-5 w-5 ${isExpired ? 'text-red-600' : 'text-[#FF006E]'}`} />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header with badges */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm text-gray-900">
                      {certification.name}
                    </h3>
                    {isExpired && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-700 border border-red-200">
                        منقضی شده
                      </span>
                    )}
                    {!isExpired && expiryDate && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-gradient-to-r from-green-500/10 to-green-600/10 text-green-700 border border-green-200">
                        معتبر
                      </span>
                    )}
                  </div>
                  <p className={`text-xs font-medium ${isExpired ? 'text-red-600' : 'text-[#FF006E]'}`}>{certification.issuer}</p>
                </div>
                
                {/* Action */}
                <div className="flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => certification._id && onDelete(certification._id)}
                    className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-col gap-1 mt-2">
                {/* Issue Date */}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>صادر شده: {issueDate}</span>
                </div>
                
                {/* Expiry Date */}
                {expiryDate && (
                  <div className={`flex items-center gap-1 text-xs ${isExpired ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                    <Calendar className="h-3 w-3" />
                    <span>{isExpired ? '⚠️ منقضی شده' : 'اعتبار'}: {expiryDate}</span>
                  </div>
                )}
                
                {/* Credential ID */}
                {certification.credentialId && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Hash className="h-3 w-3" />
                    <span className="font-mono text-[10px]">{certification.credentialId}</span>
                  </div>
                )}
              </div>

              {/* URL */}
              {certification.url && (
                <div className="mt-2">
                  <a
                    href={certification.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 text-xs font-medium hover:underline ${
                      isExpired ? 'text-red-600' : 'text-[#FF006E]'
                    }`}
                  >
                    <ExternalLink className="h-3 w-3" />
                    مشاهده گواهینامه
                  </a>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
