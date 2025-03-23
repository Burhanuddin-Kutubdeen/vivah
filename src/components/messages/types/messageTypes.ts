
export interface Sender {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

export interface MessageRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  sender: Sender;
}

export interface MessageRequestsProps {
  onAccept: (userId: string, name: string) => void;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  image_url: string | null;
  created_at: string;
  read: boolean;
}

// Type-safe way to handle Suapabase typing issues
export const isSuapabaseMessage = (obj: any): obj is Message => {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.conversation_id === 'string' &&
    typeof obj.sender_id === 'string' &&
    typeof obj.receiver_id === 'string' &&
    typeof obj.text === 'string' &&
    typeof obj.created_at === 'string' &&
    typeof obj.read === 'boolean'
  );
};
