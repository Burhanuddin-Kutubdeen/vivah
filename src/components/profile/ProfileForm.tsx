
import React, { useState } from 'react';
import { Form } from "@/components/ui/form";
import { useAuth } from '@/contexts/AuthContext';
import { useProfileForm } from '@/hooks/use-profile-form';
import { BasicInfoSection, LocationAndBioSection } from './ProfileFormSections';
import ProfileFormSubmit from './ProfileFormSubmit';

interface ProfileFormProps {
  avatarUrl: string | null;
  translate: (key: string) => string;
  connectionError?: boolean;
  isEdit?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ 
  avatarUrl, 
  translate, 
  connectionError = false, 
  isEdit = false 
}) => {
  const { user } = useAuth();
  const { form, submitAttempted, setSubmitAttempted } = useProfileForm(user?.id, connectionError);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const onSubmit = async (values: any) => {
    // Validate avatar is uploaded
    if (!avatarUrl) {
      setSubmitAttempted(true);
      return;
    }
    
    setIsSubmitting(true);
    // The actual submission happens in ProfileFormSubmit
  };

  const handleFormSubmitComplete = () => {
    setIsSubmitting(false);
    setSaveSuccess(true);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info Section (personal details, habits, preferences) */}
        <BasicInfoSection control={form.control} />

        {/* Location, Bio and Interests Section */}
        <LocationAndBioSection control={form.control} translate={translate} />

        {/* Photo required warning */}
        {!avatarUrl && submitAttempted && (
          <p className="text-red-500 text-center font-medium">
            Please upload a profile photo before submitting
          </p>
        )}

        {/* Submit Button */}
        <ProfileFormSubmit 
          avatarUrl={avatarUrl} 
          values={form.getValues()} 
          isEdit={isEdit}
          onSubmit={handleFormSubmitComplete}
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  );
};

export default ProfileForm;
