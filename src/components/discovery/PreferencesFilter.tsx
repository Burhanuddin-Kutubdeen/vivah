
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar, Heart, Church } from 'lucide-react';

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
    religion?: string;
    civilStatus?: string;
  };
  onApply: (preferences: { 
    interests: string[]; 
    ageRange: [number, number];
    religion?: string;
    civilStatus?: string;
  }) => void;
  onCancel: () => void;
}

const PreferencesFilter: React.FC<PreferencesFilterProps> = ({ 
  initialPreferences, 
  onApply, 
  onCancel 
}) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(initialPreferences.interests);
  const [ageRange, setAgeRange] = useState<[number, number]>(initialPreferences.ageRange);
  const [religion, setReligion] = useState<string | undefined>(initialPreferences.religion);
  const [civilStatus, setCivilStatus] = useState<string | undefined>(initialPreferences.civilStatus);

  const handleAgeRangeChange = (value: number[]) => {
    setAgeRange([value[0], value[1]]);
  };

  const handleApply = () => {
    onApply({ 
      interests: selectedInterests,
      ageRange: ageRange,
      religion: religion,
      civilStatus: civilStatus
    });
  };

  return (
    <Card className="mb-6 border border-gray-100 dark:border-gray-800 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">Match Preferences</CardTitle>
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

        <div className="bg-[#F6F6F7] p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            Age Range: {ageRange[0]} - {ageRange[1]}
          </h3>
          <div className="px-2">
            <Slider 
              defaultValue={ageRange} 
              min={18} 
              max={80} 
              step={1} 
              value={ageRange}
              onValueChange={handleAgeRangeChange}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>18</span>
              <span>40</span>
              <span>60</span>
              <span>80</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Church className="w-4 h-4 mr-2 text-gray-500" />
            Religion
          </h3>
          <Select 
            value={religion} 
            onValueChange={setReligion}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any religion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any religion</SelectItem>
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
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Heart className="w-4 h-4 mr-2 text-gray-500" />
            Matrimony Status
          </h3>
          <Select 
            value={civilStatus} 
            onValueChange={setCivilStatus}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any status</SelectItem>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-2">
        <Button variant="outline" onClick={onCancel} className="text-sm">
          Cancel
        </Button>
        <Button onClick={handleApply} className="text-sm bg-matrimony-500 hover:bg-matrimony-600">
          Apply Preferences
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PreferencesFilter;
