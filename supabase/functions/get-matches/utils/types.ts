
export interface MatchFilters {
  minAge?: number;
  maxAge?: number;
  location?: string;
  religion?: string;
  civilStatus?: string;
  priority?: 'interests' | 'age' | 'location' | 'religion';
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  civil_status: string;
  religion: string;
  location: string;
  bio: string;
  interests: string[];
  avatar_url: string;
  height: number;
  weight: number;
}

export interface MatchProfileResponse {
  profile: {
    id: string;
    name: string;
    age: number;
    occupation: string;
    location: string;
    imageUrl: string;
    bio: string;
    religion: string;
    civilStatus: string;
    interests: string[];
    height: number;
    weight: number;
  };
  matchDetails: {
    score: number;
    sharedInterests: string[];
    isNewMatch: boolean;
  };
}

export interface ScoreComponents {
  interestScore: number;
  locationScore: number;
  religionScore: number;
  ageScore: number;
  sharedInterests: string[];
  profileAge: number;
}
