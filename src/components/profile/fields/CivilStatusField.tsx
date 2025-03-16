
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from 'react-hook-form';

interface CivilStatusFieldProps {
  control: Control<any>;
}

const CivilStatusField: React.FC<CivilStatusFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="civil_status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Civil Status</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select your status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CivilStatusField;
