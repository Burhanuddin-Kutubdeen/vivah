
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from 'react-hook-form';

interface KidsWantFieldProps {
  control: Control<any>;
}

const KidsWantField: React.FC<KidsWantFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="wants_kids"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Want Kids? (Optional)</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select your preference about kids" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="want_kids">Want kids</SelectItem>
              <SelectItem value="open_to_kids">Open to kids</SelectItem>
              <SelectItem value="dont_want_kids">Don't want kids</SelectItem>
              <SelectItem value="not_sure">Not sure</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default KidsWantField;
