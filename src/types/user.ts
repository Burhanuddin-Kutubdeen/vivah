import { User as SupabaseUser } from "@supabase/supabase-js";

// Extended user type that includes profile data
export interface ExtendedUser extends SupabaseUser {
  interests?: string[];
  // Other profile fields we might need to access
  profile?: {
    location?: string;
    bio?: string;
    avatar_url?: string;
    date_of_birth?: string;
    gender?: string;
    civil_status?: string;
    religion?: string;
    education?: string;
    job?: string;
    exercise?: string;
    drinking?: string;
    smoking?: string;
    wants_kids?: string;
    has_kids?: string;
  };
}
