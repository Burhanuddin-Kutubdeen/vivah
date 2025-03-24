
import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from 'lucide-react';

interface LikedProfilesFiltersProps {
  initialAgeRange: [number, number];
  initialReligion: string;
  onFilterChange: (ageRange: [number, number], religion: string) => void;
}

const LikedProfilesFilters: React.FC<LikedProfilesFiltersProps> = ({
  initialAgeRange,
  initialReligion,
  onFilterChange
}) => {
  const [ageRange, setAgeRange] = useState<[number, number]>(initialAgeRange);
  const [religion, setReligion] = useState<string>(initialReligion);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApplyFilters = () => {
    onFilterChange(ageRange, religion);
  };

  const handleReset = () => {
    setAgeRange([18, 60]);
    setReligion('any');
    onFilterChange([18, 60], 'any');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filter Profiles
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm"
        >
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Age Range: {ageRange[0]} - {ageRange[1]}</label>
            <Slider
              value={ageRange}
              min={18}
              max={80}
              step={1}
              onValueChange={(values) => setAgeRange([values[0], values[1]])}
              className="pt-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Religion</label>
            <Select value={religion} onValueChange={setReligion}>
              <SelectTrigger>
                <SelectValue placeholder="Any Religion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Religion</SelectItem>
                <SelectItem value="hinduism">Hinduism</SelectItem>
                <SelectItem value="christianity">Christianity</SelectItem>
                <SelectItem value="islam">Islam</SelectItem>
                <SelectItem value="buddhism">Buddhism</SelectItem>
                <SelectItem value="sikhism">Sikhism</SelectItem>
                <SelectItem value="jainism">Jainism</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleApplyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LikedProfilesFilters;
