
import React from 'react';
import { Control } from 'react-hook-form';
import { ProfileFormValues } from '../ProfileFormSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface KidsHaveFieldProps {
  control: Control<ProfileFormValues>;
}

const KidsHaveField: React.FC<KidsHaveFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="has_kids"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Children</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Do you have children?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="have_kids">Have kids</SelectItem>
                <SelectItem value="dont_have_kids">Don't have kids</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default KidsHaveField;
