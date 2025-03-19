
import React from 'react';
import { Control } from 'react-hook-form';
import { ProfileFormValues } from '../ProfileFormSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DrinkingFieldProps {
  control: Control<ProfileFormValues>;
}

const DrinkingField: React.FC<DrinkingFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="drinking"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Drinking</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Drinking habits" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes_i_drink">Yes, I drink</SelectItem>
                <SelectItem value="i_drink_sometimes">I drink sometimes</SelectItem>
                <SelectItem value="i_rarely_drink">I rarely drink</SelectItem>
                <SelectItem value="no_i_dont_drink">No, I don't drink</SelectItem>
                <SelectItem value="im_sober">I'm sober</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DrinkingField;
