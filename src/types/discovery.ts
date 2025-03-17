
// Discovery profile types
export interface DiscoveryProfilePreferences {
  ageRange: [number, number];
  religion?: string;
  civilStatus?: string;
}

export interface UseDiscoveryProfilesOptions {
  isPremium: boolean;
  preferences?: DiscoveryProfilePreferences;
}

export interface DiscoveryProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  location: string;
  interests: string[];
  bio: string;
  imageUrl: string;
  isOnline: boolean;
  lastActive: string;
  religion?: string;
  civilStatus?: string;
}
