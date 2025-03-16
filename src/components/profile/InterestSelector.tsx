
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { Control } from 'react-hook-form';

// Common interests for selection
const commonInterests = [
  "Travel", "Cooking", "Reading", "Movies", "Music", "Dancing", 
  "Photography", "Art", "Gaming", "Sports", "Fitness", "Yoga", 
  "Hiking", "Biking", "Swimming", "Fishing", "Gardening", "Meditation",
  "Writing", "Painting", "Fashion", "Technology", "Science", "History", 
  "Politics", "Nature", "Animals", "Food"
];

interface InterestSelectorProps {
  control: Control<any>;
  translate: (key: string) => string;
}

const InterestSelector: React.FC<InterestSelectorProps> = ({ control, translate }) => {
  return (
    <FormField
      control={control}
      name="interests"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Interests</FormLabel>
          <FormDescription className="mb-2">
            Select your interests (select at least one)
          </FormDescription>
          <FormControl>
            <ToggleGroup 
              type="multiple" 
              variant="outline"
              className="flex flex-wrap gap-2"
              value={field.value}
              onValueChange={field.onChange}
            >
              {commonInterests.map(interest => (
                <ToggleGroupItem 
                  key={interest} 
                  value={interest}
                  className="rounded-full border border-gray-200 px-3 py-1 text-sm"
                >
                  {interest}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InterestSelector;
