
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control } from 'react-hook-form';

// Heights in feet and inches
const heightOptions = Array.from({ length: 37 }, (_, i) => {
  const feet = Math.floor((i + 48) / 12);
  const inches = (i + 48) % 12;
  const cm = Math.round((i + 48) * 2.54);
  return {
    value: cm.toString(),
    label: `${feet}'${inches}" (${cm} cm)`
  };
});

interface HeightSelectorProps {
  control: Control<any>;
}

const HeightSelector: React.FC<HeightSelectorProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="height"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Height</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select your height" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {heightOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default HeightSelector;
