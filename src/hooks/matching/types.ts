
// Match-related types
export interface MatchProfile {
  id: string;
  name: string;
  age: number;
  occupation: string;
  location: string;
  imageUrl: string;
  bio: string;
  religion?: string;
  civilStatus?: string;
  interests: string[];
  height?: number;
  weight?: number;
}

export interface MatchDetails {
  score: number;
  sharedInterests: string[];
  isNewMatch: boolean;
}

export interface Match {
  profile: MatchProfile;
  matchDetails: MatchDetails;
}

export interface MatchFilters {
  minAge?: number;
  maxAge?: number;
  location?: string;
  religion?: string;
  civilStatus?: string;
  priority?: 'interests' | 'age' | 'location' | 'religion';
}
