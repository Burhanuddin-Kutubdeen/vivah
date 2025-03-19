
import React from 'react';
import { Control } from 'react-hook-form';
import { ProfileFormValues } from '../ProfileFormSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SmokingFieldProps {
  control: Control<ProfileFormValues>;
}

const SmokingField: React.FC<SmokingFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="smoking"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Smoking</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Smoking habits" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes_i_smoke">Yes, I smoke</SelectItem>
                <SelectItem value="i_smoke_sometimes">I smoke sometimes</SelectItem>
                <SelectItem value="no_i_dont_smoke">No, I don't smoke</SelectItem>
                <SelectItem value="im_trying_to_quit">I'm trying to quit</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SmokingField;
