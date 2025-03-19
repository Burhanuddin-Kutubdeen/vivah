
// Sample conversation data
export const sampleConversations = [
  {
    id: '1',
    person: {
      name: 'Anushka Perera',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
      isOnline: true,
    },
    lastMessage: 'I enjoyed our conversation yesterday. Would love to continue it!',
    lastMessageTime: '10:32 AM',
    unread: true,
  },
  {
    id: '2',
    person: {
      name: 'Raj Patel',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      isOnline: false,
    },
    lastMessage: 'That sounds interesting! What kind of photography do you enjoy?',
    lastMessageTime: 'Yesterday',
    unread: false,
  },
  {
    id: '3',
    person: {
      name: 'Priya Silva',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      isOnline: true,
    },
    lastMessage: 'I love dancing too! Maybe we could go to a dance class together sometime.',
    lastMessageTime: 'Yesterday',
    unread: false,
  },
];

// Sample messages for selected conversation
export const sampleMessages = [
  {
    id: '1',
    senderId: 'other',
    text: 'Hi there! I noticed we have a lot of common interests.',
    timestamp: 'Yesterday, 7:32 PM',
  },
  {
    id: '2',
    senderId: 'user',
    text: 'Hello! Yes, I noticed that too. I see you enjoy traveling. What\'s your favorite place you\'ve visited so far?',
    timestamp: 'Yesterday, 7:45 PM',
  },
  {
    id: '3',
    senderId: 'other',
    text: 'I loved visiting Japan! The culture, food, and scenic beauty were amazing. Have you been there?',
    timestamp: 'Yesterday, 8:03 PM',
  },
  {
    id: '4',
    senderId: 'user',
    text: 'Not yet, but it\'s definitely on my bucket list! I\'ve been to Singapore and Thailand though.',
    timestamp: 'Yesterday, 8:10 PM',
  },
  {
    id: '5',
    senderId: 'other',
    text: 'Those are amazing places too! What did you enjoy most about Thailand?',
    timestamp: 'Yesterday, 8:15 PM',
  },
  {
    id: '6',
    senderId: 'user',
    text: 'The food was incredible, and I loved the beaches in Phuket. Also, the temples in Bangkok were breathtaking.',
    timestamp: 'Yesterday, 8:22 PM',
  },
  {
    id: '7',
    senderId: 'other',
    text: 'I enjoyed our conversation yesterday. Would love to continue it!',
    timestamp: 'Today, 10:32 AM',
  },
];
