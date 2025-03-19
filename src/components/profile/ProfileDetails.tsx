
import React from 'react';
import { Briefcase, Ruler, Activity, Wine, Cigarette, Baby } from 'lucide-react';

interface ProfileData {
  education?: string | null;
  job?: string | null;
  height?: number | null;
  weight?: number | null;
  exercise?: string | null;
  drinking?: string | null;
  smoking?: string | null;
  wants_kids?: string | null;
  has_kids?: string | null;
}

interface ProfileDetailsProps {
  profileData: ProfileData | null;
}

const formatValue = (value: string | null): string => {
  if (!value) return "Not specified";
  
  // Format values for better readability
  return value
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ profileData }) => {
  if (!profileData) return null;
  
  const details = [
    {
      icon: <Briefcase size={18} />,
      label: "Education & Work",
      value: `${formatValue(profileData.education)} • ${profileData.job || 'Not specified'}`
    },
    {
      icon: <Ruler size={18} />,
      label: "Height & Weight",
      value: `${profileData.height ? `${profileData.height} cm` : 'Not specified'} • ${profileData.weight ? `${profileData.weight} kg` : 'Not specified'}`
    },
    {
      icon: <Activity size={18} />,
      label: "Exercise",
      value: formatValue(profileData.exercise)
    },
    {
      icon: <Wine size={18} />,
      label: "Drinking",
      value: formatValue(profileData.drinking)
    },
    {
      icon: <Cigarette size={18} />,
      label: "Smoking",
      value: formatValue(profileData.smoking)
    },
    {
      icon: <Baby size={18} />,
      label: "Children",
      value: `${formatValue(profileData.has_kids)} • ${formatValue(profileData.wants_kids)}`
    }
  ];

  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium mb-3">Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {details.map((detail, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="bg-matrimony-50 dark:bg-matrimony-900/30 p-2 rounded-full">
              {detail.icon}
            </div>
            <div>
              <h3 className="text-sm font-medium text-matrimony-800 dark:text-matrimony-200">{detail.label}</h3>
              <p className="text-matrimony-600 dark:text-matrimony-300">{detail.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileDetails;
