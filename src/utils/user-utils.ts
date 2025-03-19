
import { User } from "@supabase/supabase-js";

/**
 * Extracts user gender from user object
 */
export function getUserGender(user: User | null): string {
  if (!user) return 'male'; // Default if not available
  
  // Try to get gender from user metadata
  const metadata = user.user_metadata;
  if (metadata) {
    // Check if gender is directly in metadata
    if (metadata.gender) {
      return metadata.gender;
    }
    // Check if gender is nested in profile metadata
    else if (metadata.profile && metadata.profile.gender) {
      return metadata.profile.gender;
    }
  }
  
  // If not in metadata, try to get it from app_metadata
  if (user.app_metadata && user.app_metadata.gender) {
    return user.app_metadata.gender;
  }
  
  return 'male'; // Default fallback
}

/**
 * Extracts user interests from user object
 */
export function getUserInterests(user: User | null): string[] {
  if (!user) return [];
  
  const metadata = user.user_metadata;
  if (metadata) {
    // Check if interests are directly in metadata
    if (metadata.interests && Array.isArray(metadata.interests)) {
      return metadata.interests;
    }
    // Check if interests are nested in profile metadata
    else if (metadata.profile && 
             metadata.profile.interests && 
             Array.isArray(metadata.profile.interests)) {
      return metadata.profile.interests;
    }
  }
  
  return [];
}
