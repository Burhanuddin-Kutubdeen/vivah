
import { Profile, ScoreComponents, MatchFilters } from './types.ts';
import { calculateAge } from './age-calculator.ts';

// Calculate various score components for a match
export function calculateScoreComponents(
  profile: Profile, 
  currentUserProfile: any, 
  today: Date
): ScoreComponents {
  const profileInterests = profile.interests || [];
  const currentUserInterests = currentUserProfile.interests || [];
  
  // Calculate shared interests
  const sharedInterests = currentUserInterests.filter(interest => 
    profileInterests.includes(interest)
  );
  
  // Calculate interest score - percentage of shared interests
  const interestScore = currentUserInterests.length > 0 
    ? (sharedInterests.length / Math.max(currentUserInterests.length, profileInterests.length)) * 100
    : 0;
  
  // Calculate location score - 100 if same location, less otherwise
  const locationScore = profile.location && currentUserProfile.location && 
    profile.location.toLowerCase().includes(currentUserProfile.location.toLowerCase()) ? 100 : 50;
  
  // Calculate religion score - 100 if same religion, less otherwise
  const religionScore = profile.religion === currentUserProfile.religion ? 100 : 50;
  
  // Calculate age score (closer to user's age = higher score)
  const userAge = currentUserProfile.date_of_birth ? calculateAge(currentUserProfile.date_of_birth, today) : 30;
  const profileAge = calculateAge(profile.date_of_birth, today);
  const ageDifference = Math.abs(userAge - profileAge);
  const ageScore = Math.max(0, 100 - (ageDifference * 5)); // Reduce 5 points per year difference
  
  return {
    interestScore,
    locationScore,
    religionScore,
    ageScore,
    sharedInterests,
    profileAge
  };
}

// Calculate final score based on priority
export function calculateFinalScore(
  scoreComponents: ScoreComponents, 
  priority: MatchFilters['priority'] = 'interests'
): number {
  const { interestScore, locationScore, religionScore, ageScore } = scoreComponents;
  
  switch (priority) {
    case 'age':
      return ageScore * 0.4 + interestScore * 0.3 + locationScore * 0.15 + religionScore * 0.15;
    case 'location':
      return locationScore * 0.4 + interestScore * 0.3 + ageScore * 0.15 + religionScore * 0.15;
    case 'religion':
      return religionScore * 0.4 + interestScore * 0.3 + ageScore * 0.15 + locationScore * 0.15;
    case 'interests':
    default:
      return interestScore * 0.4 + ageScore * 0.3 + locationScore * 0.15 + religionScore * 0.15;
  }
}
