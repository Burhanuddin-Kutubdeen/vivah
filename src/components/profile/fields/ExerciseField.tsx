
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from 'react-hook-form';

interface ExerciseFieldProps {
  control: Control<any>;
}

const ExerciseField: React.FC<ExerciseFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="exercise"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Exercise (Optional)</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select your exercise habits" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="sometimes">Sometimes</SelectItem>
              <SelectItem value="almost_never">Almost Never</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ExerciseField;
