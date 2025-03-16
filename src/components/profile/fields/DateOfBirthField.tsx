
import React from 'react';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useProfile } from '@/hooks/use-profile';
import { cn } from "@/lib/utils";

import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Control } from 'react-hook-form';

interface DateOfBirthFieldProps {
  control: Control<any>;
}

const DateOfBirthField: React.FC<DateOfBirthFieldProps> = ({ control }) => {
  const { isAtLeast18 } = useProfile();

  return (
    <FormField
      control={control}
      name="dateOfBirth"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Date of Birth (18+ only)</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => {
                  // Disable future dates
                  if (date > new Date()) return true;
                  
                  // Disable dates for under 18
                  if (!isAtLeast18(date)) return true;
                  
                  // Disable very old dates (100+ years)
                  const hundredYearsAgo = new Date();
                  hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);
                  return date < hundredYearsAgo;
                }}
                fromYear={new Date().getFullYear() - 100}
                toYear={new Date().getFullYear() - 18}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <FormDescription>
            You must be at least 18 years old
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateOfBirthField;
