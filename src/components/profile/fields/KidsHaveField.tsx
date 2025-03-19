
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from 'react-hook-form';

interface KidsHaveFieldProps {
  control: Control<any>;
}

const KidsHaveField: React.FC<KidsHaveFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="has_kids"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Have Kids? (Optional)</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Do you have kids?" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="have_kids">Have kids</SelectItem>
              <SelectItem value="dont_have_kids">Don't have kids</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default KidsHaveField;
