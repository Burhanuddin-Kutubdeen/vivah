
import React, { useState } from 'react';
import { useLikedProfiles } from './hooks/useLikedProfiles';
import LikedProfilesList from './LikedProfilesList';
import LikedProfilesFilters from './LikedProfilesFilters';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LikedProfilesContainerProps {
  onProfileSelect: (profileId: string) => void;
}

const LikedProfilesContainer: React.FC<LikedProfilesContainerProps> = ({ onProfileSelect }) => {
  const [ageFilter, setAgeFilter] = useState<[number, number]>([18, 60]);
  const [religionFilter, setReligionFilter] = useState<string>('any');
  
  const { profiles, isLoading, error } = useLikedProfiles({
    ageRange: ageFilter,
    religion: religionFilter
  });

  const handleFilterChange = (ageRange: [number, number], religion: string) => {
    setAgeFilter(ageRange);
    setReligionFilter(religion);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profiles Who Liked You</h1>
        <p className="text-matrimony-600 dark:text-matrimony-300">
          Discover people who have shown interest in your profile
        </p>
      </div>

      <LikedProfilesFilters 
        initialAgeRange={ageFilter}
        initialReligion={religionFilter}
        onFilterChange={handleFilterChange}
      />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}. Please try again later or contact support if the issue persists.
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-matrimony-500" />
        </div>
      ) : (
        <LikedProfilesList profiles={profiles} onProfileSelect={onProfileSelect} />
      )}
    </div>
  );
};

export default LikedProfilesContainer;
