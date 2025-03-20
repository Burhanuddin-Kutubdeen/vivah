
// Helper function to validate UUID or numeric string ID
export const isValidUUID = (id: string): boolean => {
  // Check for UUID format
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  // Check for numeric ID (used in sample data)
  const numericIdPattern = /^\d+$/;
  
  return uuidPattern.test(id) || numericIdPattern.test(id);
};
