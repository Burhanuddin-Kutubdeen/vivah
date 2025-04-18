import { User } from "../types/user";
import { Message } from "../types/messageTypes";
import { Profile } from "../components/profile/ProfileFormSchema";

const BASE_URL = "http://127.0.0.1:3000";

const setAuthToken = (token: string) => {
  localStorage.setItem("authToken", token);
};

const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

const removeAuthToken = () => {
  localStorage.removeItem("authToken");
};

const registerUser = async (email: string, password: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

const loginUser = async (email: string, password: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

const createProfile = async (profile: Profile): Promise<any> => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating profile:", error);
    throw error;
  }
};

const getProfile = async (user_id: string): Promise<any> => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}/profile/${user_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting profile:", error);
    throw error;
  }
};

const updateProfile = async (user_id: string, profile: Profile): Promise<any> => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}/profile/${user_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

const createMatch = async (matchData: any): Promise<any> => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}/match`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(matchData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating match:", error);
    throw error;
  }
};

const getMatch = async (user_id: string, match_id: string): Promise<any> => {
  try {
    const token = getAuthToken();
    const response = await fetch(
      `${BASE_URL}/match/${user_id}/${match_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting match:", error);
    throw error;
  }
};

const createLike = async (likeData: any): Promise<any> => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(likeData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating like:", error);
    throw error;
  }
};

const getLike = async (user_id: string, liked_user_id: string): Promise<any> => {
  try {
    const token = getAuthToken();
    const response = await fetch(
      `${BASE_URL}/like/${user_id}/${liked_user_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting like:", error);
    throw error;
  }
};

const createMessage = async (messageData: any): Promise<any> => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(messageData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
};

const getMessage = async (user_id: string, message_id: string): Promise<any> => {
  try {
    const token = getAuthToken();
    const response = await fetch(
      `${BASE_URL}/message/${user_id}/${message_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting message:", error);
    throw error;
  }
};

const getMessagesByChatId = async (chat_id: string): Promise<any> => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}/messages/${chat_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting messages by chat id:", error);
    throw error;
  }
};

export {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  registerUser,
  loginUser,
  createProfile,
  getProfile,
  updateProfile,
  createMatch,
  getMatch,
  createLike,
  getLike,
  createMessage,
  getMessage,
  getMessagesByChatId,
};