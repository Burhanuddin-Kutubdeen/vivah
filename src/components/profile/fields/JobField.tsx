
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from 'react-hook-form';

interface JobFieldProps {
  control: Control<any>;
}

const JobField: React.FC<JobFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="job"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Current Job</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter your current occupation"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default JobField;
