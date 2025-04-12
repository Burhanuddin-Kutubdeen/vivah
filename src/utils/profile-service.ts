
import { supabase } from '@/integrations/supabase/client';
import type { ProfileFormValues } from '@/components/profile/ProfileFormSchema';

/**
 * Create a new profile for the authenticated user
 * @param profileData The profile data to save
 * @returns Any error that occurred during the operation
 */
export async function createProfile(profileData: Partial<ProfileFormValues>) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    console.error('Error getting authenticated user:', userError);
    return userError;
  }
  
  const { error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userData.user.id,
        ...profileData
      }
    ]);
  
  if (error) {
    console.error('Error creating profile:', error);
  }
  
  return error;
}

/**
 * Update the profile of the authenticated user
 * @param profileData The profile data to update
 * @returns Any error that occurred during the operation
 */
export async function updateProfile(profileData: Partial<ProfileFormValues>) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    console.error('Error getting authenticated user:', userError);
    return userError;
  }
  
  const { error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userData.user.id);
  
  if (error) {
    console.error('Error updating profile:', error);
  }
  
  return error;
}

/**
 * Get the profile of the authenticated user
 * @returns The profile data and any error that occurred
 */
export async function getProfile() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    console.error('Error getting authenticated user:', userError);
    return { data: null, error: userError };
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userData.user.id)
    .maybeSingle();
  
  if (error) {
    console.error('Error getting profile:', error);
  }
  
  return { data, error };
}
