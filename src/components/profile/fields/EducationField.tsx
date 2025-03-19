
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from 'react-hook-form';

interface EducationFieldProps {
  control: Control<any>;
}

const EducationField: React.FC<EducationFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="education"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Education</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select your education level" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="high_school">High School</SelectItem>
              <SelectItem value="diploma">Diploma</SelectItem>
              <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
              <SelectItem value="masters">Master's Degree</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EducationField;
