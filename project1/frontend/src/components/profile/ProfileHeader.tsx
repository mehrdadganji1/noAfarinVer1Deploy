import { MapPin, Briefcase, Edit2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getMembershipLevelLabel, getMembershipLevelColor } from '@/types/clubMember';
import { getAvailabilityStatusLabel, getAvailabilityStatusColor } from '@/types/profile';
import type { Availability } from '@/types/profile';

interface ProfileHeaderProps {
  user: any;
  membershipInfo?: any;
  availability?: Availability;
  bio?: string;
  headline?: string;
  location?: string;
  isOwnProfile: boolean;
  onEditClick: () => void;
  onSettingsClick: () => void;
}

export default function ProfileHeader({
  user,
  membershipInfo,
  availability,
  bio,
  headline,
  location,
  isOwnProfile,
  onEditClick,
  onSettingsClick
}: ProfileHeaderProps) {
  const level = membershipInfo?.level || membershipInfo?.membershipLevel;
  const levelColor = level ? getMembershipLevelColor(level) : 'gray';
  const availabilityColor = availability?.status ? getAvailabilityStatusColor(availability.status) : 'gray';

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 relative">
        {isOwnProfile && (
          <div className="absolute top-4 left-4 flex gap-2">
            <Button
              onClick={onSettingsClick}
              size="sm"
              variant="outline"
              className="bg-white/20 backdrop-blur-lg border-white/30 hover:bg-white/30 text-white"
            >
              <Settings className="w-4 h-4 ml-2" />
              تنظیمات
            </Button>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 relative z-10">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            {availability?.status && (
              <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white bg-${availabilityColor}-500`} />
            )}
          </div>

          {/* Name & Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  {level && (
                    <Badge className={`bg-${levelColor}-100 text-${levelColor}-700 border-${levelColor}-200`}>
                      {getMembershipLevelLabel(level)}
                    </Badge>
                  )}
                  {availability?.status && (
                    <Badge variant="outline" className={`border-${availabilityColor}-300 text-${availabilityColor}-700`}>
                      <div className={`w-2 h-2 rounded-full bg-${availabilityColor}-500 ml-2`} />
                      {getAvailabilityStatusLabel(availability.status)}
                    </Badge>
                  )}
                </div>

                {headline && (
                  <p className="text-gray-600 flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4" />
                    {headline}
                  </p>
                )}

                {location && (
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {location}
                  </p>
                )}
              </div>

              {isOwnProfile && (
                <Button onClick={onEditClick} className="gap-2">
                  <Edit2 className="w-4 h-4" />
                  ویرایش پروفایل
                </Button>
              )}
            </div>

            {bio && (
              <p className="mt-4 text-gray-700 leading-relaxed">
                {bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
