
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from 'react-hook-form';

interface DrinkingFieldProps {
  control: Control<any>;
}

const DrinkingField: React.FC<DrinkingFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="drinking"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Drinking (Optional)</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select your drinking habits" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="yes_drink">Yes, I drink</SelectItem>
              <SelectItem value="sometimes_drink">I drink sometimes</SelectItem>
              <SelectItem value="rarely_drink">I rarely drink</SelectItem>
              <SelectItem value="dont_drink">No, I don't drink</SelectItem>
              <SelectItem value="sober">I'm sober</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DrinkingField;
