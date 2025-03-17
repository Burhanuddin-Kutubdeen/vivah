
import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchFilters as MatchFiltersType } from '@/hooks/use-matches';
import { Filter, RefreshCw } from 'lucide-react';

interface MatchFiltersProps {
  filters: MatchFiltersType;
  onApplyFilters: (filters: MatchFiltersType) => void;
  isLoading: boolean;
}

const MatchFilters: React.FC<MatchFiltersProps> = ({ filters, onApplyFilters, isLoading }) => {
  const [localFilters, setLocalFilters] = useState<MatchFiltersType>(filters || {});
  const [ageRange, setAgeRange] = useState<[number, number]>([
    localFilters.minAge || 18, 
    localFilters.maxAge || 60
  ]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleAgeRangeChange = (values: number[]) => {
    setAgeRange([values[0], values[1]]);
    setLocalFilters(prev => ({
      ...prev,
      minAge: values[0],
      maxAge: values[1]
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters(prev => ({
      ...prev,
      location: e.target.value
    }));
  };

  const handleReligionChange = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      religion: value
    }));
  };

  const handlePriorityChange = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      priority: value as MatchFiltersType['priority']
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      priority: 'interests' as const
    };
    setLocalFilters(defaultFilters);
    setAgeRange([18, 60]);
    onApplyFilters(defaultFilters);
  };

  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleFilterPanel}
          className="flex items-center"
        >
          <Filter className="h-4 w-4 mr-2" />
          {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </Button>
        
        {!isFilterOpen && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onApplyFilters(filters)}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>

      {isFilterOpen && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Match Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Age Range: {ageRange[0]} - {ageRange[1]}</label>
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input 
                value={localFilters.location || ''} 
                onChange={handleLocationChange} 
                placeholder="Enter location"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Religion</label>
              <Select 
                value={localFilters.religion || ''} 
                onValueChange={handleReligionChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select religion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Match Priority</label>
              <Select 
                value={localFilters.priority || 'interests'} 
                onValueChange={handlePriorityChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interests">Shared Interests</SelectItem>
                  <SelectItem value="age">Age Compatibility</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="religion">Religion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2 pt-2">
              <Button 
                onClick={handleApplyFilters} 
                className="flex-1"
                disabled={isLoading}
              >
                Apply Filters
                {isLoading && <RefreshCw className="h-4 w-4 ml-2 animate-spin" />}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                disabled={isLoading}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MatchFilters;
