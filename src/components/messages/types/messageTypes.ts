
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
