
import { api } from '@/services/api';
import type { ProfileFormValues } from '@/components/profile/ProfileFormSchema';

/**
 * Create a new profile for the authenticated user
 * @param profileData The profile data to save
 * @returns Any error that occurred during the operation
 */
export async function createProfile(profileData: Partial<ProfileFormValues>) {
  try {
    // Convert form data to database format
    const dbProfileData = convertFormDataToDbFormat(profileData);
    
    await api.profiles.create(dbProfileData);
    return null;
  } catch (error: any) {
    console.error('Error creating profile:', error);
    return error;
  }
}

/**
 * Update the profile of the authenticated user
 * @param profileData The profile data to update
 * @returns Any error that occurred during the operation
 */
export async function updateProfile(profileData: Partial<ProfileFormValues>) {
  try {
    // Convert form data to database format
    const dbProfileData = convertFormDataToDbFormat(profileData);
    
    // Get current user to get their ID
    const user = await api.auth.getUser();
    await api.profiles.update(user.id, dbProfileData);
    return null;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return error;
  }
}

/**
 * Get the profile of the authenticated user
 * @returns The profile data and any error that occurred
 */
export async function getProfile() {
  try {
    const user = await api.auth.getUser();
    const data = await api.profiles.get(user.id);
    return { data, error: null };
  } catch (error: any) {
    console.error('Error getting profile:', error);
    return { data: null, error };
  }
}

/**
 * Convert form data format to database format
 */
function convertFormDataToDbFormat(formData: Partial<ProfileFormValues>): Record<string, any> {
  const result: Record<string, any> = {
    ...formData
  };

  // Convert dateOfBirth field to date_of_birth
  if (formData.dateOfBirth) {
    result.date_of_birth = formData.dateOfBirth.toISOString().split('T')[0];
    delete result.dateOfBirth;
  }

  // Convert string height to number
  if (formData.height !== undefined) {
    result.height = formData.height ? parseFloat(formData.height) : null;
  }

  // Convert string weight to number
  if (formData.weight !== undefined) {
    result.weight = formData.weight ? parseFloat(formData.weight) : null;
  }

  return result;
}
