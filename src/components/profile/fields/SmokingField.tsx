
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from 'react-hook-form';

interface SmokingFieldProps {
  control: Control<any>;
}

const SmokingField: React.FC<SmokingFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="smoking"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Smoking (Optional)</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select your smoking habits" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="yes_smoke">Yes, I smoke</SelectItem>
              <SelectItem value="sometimes_smoke">I smoke sometimes</SelectItem>
              <SelectItem value="trying_quit">I'm trying to quit</SelectItem>
              <SelectItem value="dont_smoke">No, I don't smoke</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SmokingField;
