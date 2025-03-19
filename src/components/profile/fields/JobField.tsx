
import React from 'react';
import { Control } from 'react-hook-form';
import { ProfileFormValues } from '../ProfileFormSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface JobFieldProps {
  control: Control<ProfileFormValues>;
}

const JobField: React.FC<JobFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="job"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Occupation</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter your current job" 
              {...field} 
              value={field.value || ''}
              className="w-full"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default JobField;
