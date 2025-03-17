
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

// Common interests for selection (imported from InterestSelector.tsx)
const commonInterests = [
  "Travel", "Cooking", "Reading", "Movies", "Music", "Dancing", 
  "Photography", "Art", "Gaming", "Sports", "Fitness", "Yoga", 
  "Hiking", "Biking", "Swimming", "Fishing", "Gardening", "Meditation",
  "Writing", "Painting", "Fashion", "Technology", "Science", "History", 
  "Politics", "Nature", "Animals", "Food"
];

interface PreferencesFilterProps {
  initialPreferences: {
    interests: string[];
    ageRange: [number, number];
  };
  onApply: (preferences: { interests: string[]; ageRange: [number, number] }) => void;
  onCancel: () => void;
}

const PreferencesFilter: React.FC<PreferencesFilterProps> = ({ 
  initialPreferences, 
  onApply, 
  onCancel 
}) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(initialPreferences.interests);
  const [ageRange, setAgeRange] = useState<[number, number]>(initialPreferences.ageRange);

  const handleAgeRangeChange = (value: number[]) => {
    setAgeRange([value[0], value[1]]);
  };

  const handleApply = () => {
    onApply({ 
      interests: selectedInterests,
      ageRange: ageRange
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Match Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Interests</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Select interests you'd like to match with
          </p>
          <ToggleGroup 
            type="multiple" 
            variant="outline"
            className="flex flex-wrap gap-2"
            value={selectedInterests}
            onValueChange={setSelectedInterests}
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
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">
            Age Range: {ageRange[0]} - {ageRange[1]}
          </h3>
          <Slider 
            defaultValue={ageRange} 
            min={18} 
            max={80} 
            step={1} 
            value={ageRange}
            onValueChange={handleAgeRangeChange}
            className="my-4"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleApply}>
          Apply Preferences
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PreferencesFilter;
