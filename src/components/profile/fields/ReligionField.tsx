
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from 'react-hook-form';

interface ReligionFieldProps {
  control: Control<any>;
}

const ReligionField: React.FC<ReligionFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="religion"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Religion (Optional)</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value || "none"}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select religion (optional)" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="hindu">Hindu</SelectItem>
              <SelectItem value="christian">Christian</SelectItem>
              <SelectItem value="muslim">Muslim</SelectItem>
              <SelectItem value="buddhist">Buddhist</SelectItem>
              <SelectItem value="sikh">Sikh</SelectItem>
              <SelectItem value="jain">Jain</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ReligionField;
