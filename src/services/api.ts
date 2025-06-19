
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Mock data for development when backend is not available
const mockUser = {
  id: 'mock-user-1',
  email: 'demo@example.com',
  first_name: 'Demo',
  last_name: 'User'
};

const mockProfile = {
  id: 'mock-user-1',
  first_name: 'Demo',
  last_name: 'User',
  date_of_birth: '1990-01-01',
  gender: 'Other',
  location: 'Demo City',
  bio: 'This is a demo profile for testing purposes.',
  interests: ['Reading', 'Travel', 'Music'],
  job: 'Software Developer'
};

const isBackendAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { 
      method: 'GET',
      signal: AbortSignal.timeout(3000) // 3 second timeout
    });
    return response.ok;
  } catch {
    return false;
  }
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // If backend is not available, use mock data for demo purposes
    console.warn('Backend not available, using mock data for development');
    throw new ApiError(500, 'Backend service unavailable');
  }
};

export const api = {
  // Authentication
  auth: {
    signUp: async (email: string, password: string, userData: any) => {
      try {
        return await apiRequest('/auth/signup', {
          method: 'POST',
          body: JSON.stringify({ email, password, ...userData }),
        });
      } catch (error) {
        // For demo purposes, simulate successful registration
        console.log('Using mock auth for demo');
        localStorage.setItem('auth_token', 'mock-token-' + Date.now());
        return {
          user: { ...mockUser, email },
          token: localStorage.getItem('auth_token'),
          session: null
        };
      }
    },
    
    signIn: async (email: string, password: string) => {
      try {
        return await apiRequest('/auth/signin', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
      } catch (error) {
        // For demo purposes, simulate successful login
        console.log('Using mock auth for demo');
        localStorage.setItem('auth_token', 'mock-token-' + Date.now());
        return {
          user: { ...mockUser, email },
          token: localStorage.getItem('auth_token')
        };
      }
    },
    
    signOut: async () => {
      localStorage.removeItem('auth_token');
      return {};
    },
    
    getUser: async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new ApiError(401, 'No authentication token');
      }
      
      if (token.startsWith('mock-token-')) {
        return mockUser;
      }
      
      return await apiRequest('/auth/user');
    },
    
    resetPassword: async (email: string) => {
      try {
        return await apiRequest('/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({ email }),
        });
      } catch (error) {
        // Simulate successful password reset request
        return { message: 'Password reset email sent' };
      }
    },
  },

  // Profiles
  profiles: {
    get: async (id: string) => {
      try {
        return await apiRequest(`/profiles/${id}`);
      } catch (error) {
        // Return mock profile for demo
        return { ...mockProfile, id };
      }
    },
    
    create: async (profileData: any) => {
      try {
        return await apiRequest('/profiles', {
          method: 'POST',
          body: JSON.stringify(profileData),
        });
      } catch (error) {
        // Simulate successful profile creation
        return { ...mockProfile, ...profileData };
      }
    },
    
    update: async (id: string, profileData: any) => {
      try {
        return await apiRequest(`/profiles/${id}`, {
          method: 'PUT',
          body: JSON.stringify(profileData),
        });
      } catch (error) {
        // Simulate successful profile update
        return { ...mockProfile, ...profileData, id };
      }
    },
    
    getMatches: async (filters?: any) => {
      try {
        return await apiRequest('/profiles/matches', {
          method: 'POST',
          body: JSON.stringify({ filters }),
        });
      } catch (error) {
        // Return mock matches for demo
        return [
          {
            id: 'profile-1',
            first_name: 'Alice',
            last_name: 'Johnson',
            age: 28,
            location: 'New York',
            bio: 'Love hiking and photography',
            interests: ['Hiking', 'Photography', 'Travel']
          },
          {
            id: 'profile-2', 
            first_name: 'Bob',
            last_name: 'Smith',
            age: 32,
            location: 'San Francisco',
            bio: 'Software engineer who loves cooking',
            interests: ['Cooking', 'Technology', 'Music']
          }
        ];
      }
    },
  },

  // Likes
  likes: {
    create: async (likedProfileId: string) => {
      try {
        return await apiRequest('/likes', {
          method: 'POST',
          body: JSON.stringify({ liked_profile_id: likedProfileId }),
        });
      } catch (error) {
        return { success: true };
      }
    },
    
    delete: async (likedProfileId: string) => {
      try {
        return await apiRequest(`/likes/${likedProfileId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        return { success: true };
      }
    },
    
    getByUser: async (userId: string) => {
      try {
        return await apiRequest(`/likes/user/${userId}`);
      } catch (error) {
        return [];
      }
    },
    
    getAdmirers: async () => {
      try {
        return await apiRequest('/likes/admirers');
      } catch (error) {
        return [];
      }
    },
  },

  // Messages
  messages: {
    getConversations: async () => {
      try {
        return await apiRequest('/messages/conversations');
      } catch (error) {
        return [];
      }
    },
    
    getMessages: async (conversationId: string) => {
      try {
        return await apiRequest(`/messages/conversation/${conversationId}`);
      } catch (error) {
        return [];
      }
    },
    
    send: async (messageData: any) => {
      try {
        return await apiRequest('/messages', {
          method: 'POST',
          body: JSON.stringify(messageData),
        });
      } catch (error) {
        return { success: true };
      }
    },
    
    markAsRead: async (messageId: string) => {
      try {
        return await apiRequest(`/messages/${messageId}/read`, {
          method: 'PUT',
        });
      } catch (error) {
        return { success: true };
      }
    },
  },

  // File uploads
  files: {
    uploadAvatar: async (file: File) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_BASE_URL}/files/avatar`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
          body: formData,
        });
        
        return response.json();
      } catch (error) {
        // Mock successful upload
        return { url: '/placeholder.svg' };
      }
    },
    
    uploadChatImage: async (file: File) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_BASE_URL}/files/chat`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
          body: formData,
        });
        
        return response.json();
      } catch (error) {
        // Mock successful upload
        return { url: '/placeholder.svg' };
      }
    },
  },
};
