
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }
  
  return response.json();
};

export const api = {
  // Authentication
  auth: {
    signUp: (email: string, password: string, userData: any) =>
      apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, ...userData }),
      }),
    
    signIn: (email: string, password: string) =>
      apiRequest('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    
    signOut: () =>
      apiRequest('/auth/signout', { method: 'POST' }),
    
    getUser: () =>
      apiRequest('/auth/user'),
    
    resetPassword: (email: string) =>
      apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
  },

  // Profiles
  profiles: {
    get: (id: string) =>
      apiRequest(`/profiles/${id}`),
    
    create: (profileData: any) =>
      apiRequest('/profiles', {
        method: 'POST',
        body: JSON.stringify(profileData),
      }),
    
    update: (id: string, profileData: any) =>
      apiRequest(`/profiles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }),
    
    getMatches: (filters?: any) =>
      apiRequest('/profiles/matches', {
        method: 'POST',
        body: JSON.stringify({ filters }),
      }),
  },

  // Likes
  likes: {
    create: (likedProfileId: string) =>
      apiRequest('/likes', {
        method: 'POST',
        body: JSON.stringify({ liked_profile_id: likedProfileId }),
      }),
    
    delete: (likedProfileId: string) =>
      apiRequest(`/likes/${likedProfileId}`, {
        method: 'DELETE',
      }),
    
    getByUser: (userId: string) =>
      apiRequest(`/likes/user/${userId}`),
    
    getAdmirers: () =>
      apiRequest('/likes/admirers'),
  },

  // Messages
  messages: {
    getConversations: () =>
      apiRequest('/messages/conversations'),
    
    getMessages: (conversationId: string) =>
      apiRequest(`/messages/conversation/${conversationId}`),
    
    send: (messageData: any) =>
      apiRequest('/messages', {
        method: 'POST',
        body: JSON.stringify(messageData),
      }),
    
    markAsRead: (messageId: string) =>
      apiRequest(`/messages/${messageId}/read`, {
        method: 'PUT',
      }),
  },

  // File uploads
  files: {
    uploadAvatar: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      return fetch(`${API_BASE_URL}/files/avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: formData,
      }).then(res => res.json());
    },
    
    uploadChatImage: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      return fetch(`${API_BASE_URL}/files/chat`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: formData,
      }).then(res => res.json());
    },
  },
};
