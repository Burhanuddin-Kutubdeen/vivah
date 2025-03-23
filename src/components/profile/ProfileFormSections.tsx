
import React from 'react';
import { Control } from 'react-hook-form';
import { ProfileFormValues } from './ProfileFormSchema';

// Import field components
import NameFields from './fields/NameFields';
import DateOfBirthField from './fields/DateOfBirthField';
import GenderField from './fields/GenderField';
import CivilStatusField from './fields/CivilStatusField';
import ReligionField from './fields/ReligionField';
import HeightSelector from './HeightSelector';
import WeightField from './fields/WeightField';
import LocationSearchInput from './LocationSearchInput';
import BioField from './fields/BioField';
import InterestSelector from './InterestSelector';
import EducationField from './fields/EducationField';
import JobField from './fields/JobField';
import ExerciseField from './fields/ExerciseField';
import DrinkingField from './fields/DrinkingField';
import SmokingField from './fields/SmokingField';
import KidsWantField from './fields/KidsWantField';
import KidsHaveField from './fields/KidsHaveField';

interface BasicInfoSectionProps {
  control: Control<ProfileFormValues>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ control }) => (
  <div className="space-y-6">
    {/* Name Fields (First and Last Name) */}
    <NameFields control={control} />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Date of Birth */}
      <DateOfBirthField control={control} />

      {/* Gender */}
      <GenderField control={control} />

      {/* Civil Status */}
      <CivilStatusField control={control} />

      {/* Religion (Optional) */}
      <ReligionField control={control} />

      {/* Education */}
      <EducationField control={control} />
      
      {/* Job */}
      <JobField control={control} />

      {/* Height */}
      <HeightSelector control={control} />

      {/* Weight */}
      <WeightField control={control} />
      
      {/* Exercise */}
      <ExerciseField control={control} />
      
      {/* Drinking */}
      <DrinkingField control={control} />
      
      {/* Smoking */}
      <SmokingField control={control} />
      
      {/* Want Kids */}
      <KidsWantField control={control} />
      
      {/* Have Kids */}
      <KidsHaveField control={control} />
    </div>
  </div>
);

interface LocationAndBioSectionProps {
  control: Control<ProfileFormValues>;
  translate: (key: string) => string;
}

export const LocationAndBioSection: React.FC<LocationAndBioSectionProps> = ({ control, translate }) => (
  <>
    {/* Location */}
    <LocationSearchInput control={control} />

    {/* Bio */}
    <BioField control={control} />

    {/* Interests */}
    <InterestSelector control={control} translate={translate} />
  </>
);
