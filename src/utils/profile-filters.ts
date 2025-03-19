import { DiscoveryProfile, DiscoveryProfilePreferences } from "@/types/discovery";

/**
 * Filters profiles based on user's gender for heterosexual matching
 */
export function filterByGender(profiles: DiscoveryProfile[], userGender: string): DiscoveryProfile[] {
  // Ensure we only show opposite gender profiles for heterosexual matching
  return profiles.filter(profile => {
    if (userGender === 'male') return profile.gender === 'female';
    if (userGender === 'female') return profile.gender === 'male';
    return false; // If gender is not specified, don't show any profiles
  });
}

/**
 * Filters profiles based on age preference
 */
export function filterByAge(profiles: DiscoveryProfile[], ageRange?: [number, number]): DiscoveryProfile[] {
  if (!ageRange) return profiles;
  
  const [minAge, maxAge] = ageRange;
  return profiles.filter(
    profile => profile.age >= minAge && profile.age <= maxAge
  );
}

/**
 * Filters profiles based on religion preference
 */
export function filterByReligion(profiles: DiscoveryProfile[], religion?: string): DiscoveryProfile[] {
  if (!religion || religion === '') return profiles;
  
  return profiles.filter(
    profile => profile.religion === religion
  );
}

/**
 * Filters profiles based on civil status preference
 */
export function filterByCivilStatus(profiles: DiscoveryProfile[], civilStatus?: string): DiscoveryProfile[] {
  if (!civilStatus || civilStatus === '') return profiles;
  
  return profiles.filter(
    profile => profile.civilStatus === civilStatus
  );
}

/**
 * Applies all filters to profiles based on user preferences
 */
export function applyAllFilters(
  profiles: DiscoveryProfile[], 
  userGender: string,
  preferences?: DiscoveryProfilePreferences
): DiscoveryProfile[] {
  // Apply gender filter (heterosexual matching) FIRST
  let filteredProfiles = filterByGender(profiles, userGender);
  
  if (preferences) {
    // Then apply other filters
    filteredProfiles = filterByAge(filteredProfiles, preferences.ageRange);
    filteredProfiles = filterByReligion(filteredProfiles, preferences.religion);
    filteredProfiles = filterByCivilStatus(filteredProfiles, preferences.civilStatus);
  }
  
  return filteredProfiles;
}
