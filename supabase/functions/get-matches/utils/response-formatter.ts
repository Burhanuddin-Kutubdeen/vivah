
import { Profile, MatchProfileResponse, ScoreComponents } from './types.ts';

// Format profile data for the response
export function formatProfileResponse(
  profile: Profile, 
  scoreComponents: ScoreComponents, 
  finalScore: number
): MatchProfileResponse {
  return {
    profile: {
      id: profile.id,
      name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
      age: scoreComponents.profileAge,
      occupation: "Not specified", // This could be added to profiles table later
      location: profile.location,
      imageUrl: profile.avatar_url,
      bio: profile.bio,
      religion: profile.religion,
      civilStatus: profile.civil_status,
      interests: profile.interests,
      height: profile.height,
      weight: profile.weight,
    },
    matchDetails: {
      score: Math.round(finalScore),
      sharedInterests: scoreComponents.sharedInterests,
      isNewMatch: false, // This would be determined by actual usage data
    }
  };
}
