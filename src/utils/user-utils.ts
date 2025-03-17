
import { User } from "@supabase/supabase-js";

/**
 * Extracts user gender from user object
 */
export function getUserGender(user: User | null): string {
  if (!user) return 'male'; // Default if not available
  
  // Try to get gender from user metadata
  const metadata = user.user_metadata;
  if (metadata && metadata.gender) {
    return metadata.gender;
  }
  // If not in metadata, try to get it from app_metadata
  else if (user.app_metadata && user.app_metadata.gender) {
    return user.app_metadata.gender;
  }
  
  return 'male'; // Default fallback
}
