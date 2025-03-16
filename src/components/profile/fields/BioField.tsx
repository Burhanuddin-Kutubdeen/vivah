
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from 'react-hook-form';

interface BioFieldProps {
  control: Control<any>;
}

const BioField: React.FC<BioFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="bio"
      render={({ field }) => (
        <FormItem>
          <FormLabel>About Yourself</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Tell potential matches about yourself, your interests, and what you're looking for..."
              className="min-h-[120px]"
              {...field}
            />
          </FormControl>
          <FormDescription>
            Minimum 10 characters, maximum 500 characters
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BioField;
