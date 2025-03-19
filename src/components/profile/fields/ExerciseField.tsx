
import React from 'react';
import { Control } from 'react-hook-form';
import { ProfileFormValues } from '../ProfileFormSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExerciseFieldProps {
  control: Control<ProfileFormValues>;
}

const ExerciseField: React.FC<ExerciseFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="exercise"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Exercise</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="How often do you exercise?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="sometimes">Sometimes</SelectItem>
                <SelectItem value="almost_never">Almost Never</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ExerciseField;
