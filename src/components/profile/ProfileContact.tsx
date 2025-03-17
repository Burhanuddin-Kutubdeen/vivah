
import React from 'react';
import { Mail, Phone } from 'lucide-react';

interface ProfileContactProps {
  email: string | null | undefined;
}

const ProfileContact: React.FC<ProfileContactProps> = ({ email }) => {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium mb-3">Contact Information</h2>
      <div className="space-y-3">
        <div className="flex items-center">
          <Mail className="h-5 w-5 text-matrimony-500 mr-3" />
          <span>{email || 'Email not available'}</span>
        </div>
        <div className="flex items-center">
          <Phone className="h-5 w-5 text-matrimony-500 mr-3" />
          <span>Phone number not set</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileContact;
