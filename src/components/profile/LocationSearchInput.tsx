
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';

interface LocationSearchInputProps {
  control: Control<any>;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({ control }) => {
  const [locationSearchResults, setLocationSearchResults] = useState<string[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  // Mock location search function (would connect to a real API in production)
  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setLocationSearchResults([]);
      return;
    }
    
    setIsSearchingLocation(true);
    
    // Simulated API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock locations (in a real app, this would be an API call)
    const mockResults = [
      `${query}, Sri Lanka`,
      `${query} City, Sri Lanka`,
      `${query} Town, India`,
      `${query} Central, United Kingdom`,
      `${query} East, United States`
    ];
    
    setLocationSearchResults(mockResults);
    setIsSearchingLocation(false);
  };

  return (
    <FormField
      control={control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Location</FormLabel>
          <div className="relative">
            <FormControl>
              <Input
                placeholder="Start typing your city or town"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  searchLocations(e.target.value);
                }}
              />
            </FormControl>
            
            {locationSearchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                {isSearchingLocation ? (
                  <div className="p-2 text-center text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    Searching...
                  </div>
                ) : (
                  locationSearchResults.map((location, index) => (
                    <div 
                      key={index}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        field.onChange(location);
                        setLocationSearchResults([]);
                      }}
                    >
                      {location}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LocationSearchInput;
