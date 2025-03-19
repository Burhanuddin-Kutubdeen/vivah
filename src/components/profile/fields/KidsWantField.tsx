
import React from 'react';
import { Control } from 'react-hook-form';
import { ProfileFormValues } from '../ProfileFormSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface KidsWantFieldProps {
  control: Control<ProfileFormValues>;
}

const KidsWantField: React.FC<KidsWantFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="wants_kids"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Want Children</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Do you want children?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dont_want_kids">Don't want kids</SelectItem>
                <SelectItem value="open_to_kids">Open to kids</SelectItem>
                <SelectItem value="want_kids">Want kids</SelectItem>
                <SelectItem value="not_sure">Not sure</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default KidsWantField;
