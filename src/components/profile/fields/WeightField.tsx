
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from 'react-hook-form';

interface WeightFieldProps {
  control: Control<any>;
}

const WeightField: React.FC<WeightFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="weight"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Weight (kg) (Optional)</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter your weight in kg"
              type="number"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default WeightField;
