import { useState } from "react";
import { MessageCircle, Search } from "lucide-react";
import ChatDetails from "./ChatDetails";

interface Message {
  id: number;
  userId: number;
  messageRoomId: number;
  content: string;
  createdAt: string;
  status: number;
}

interface Conversation {
  id: number;
  connectionId: number;
  connectionName: string;
  connectionAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  description: string;
}

interface ChatRoomProps {
  conversations?: Conversation[];
}

// Local Storage helpers
const STORAGE_KEY_PREFIX = "chat_messages_";

const loadMessagesFromStorage = (conversationId: number): Message[] => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${conversationId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading messages from storage:", error);
    return [];
  }
};

const saveMessagesToStorage = (conversationId: number, messages: Message[]): void => {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${conversationId}`, JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving messages to storage:", error);
  }
};

export default function ChatRoom({ conversations = mockConversations }: ChatRoomProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  const filteredConversations = conversations.filter((conv) =>
    conv.connectionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowDetails(true);
    // Load messages from localStorage for selected conversation
    const loadedMessages = loadMessagesFromStorage(conversation.id);
    setMessages(loadedMessages);
  };

  const handleSendMessage = (content: string) => {
    if (content.trim() && selectedConversation) {
      const message: Message = {
        id: messages.length + 1,
        userId: 1, // Current user ID
        messageRoomId: selectedConversation.id,
        content: content,
        createdAt: new Date().toLocaleTimeString(),
        status: 1,
      };
      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      // Save to localStorage
      saveMessagesToStorage(selectedConversation.id, updatedMessages);
    }
  };

  const handleBack = () => {
    setShowDetails(false);
    setSelectedConversation(null);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white -mx-4">
      {/* Left Sidebar - Conversations List */}
      <div className="w-[345px] border-r border-gray-200 flex flex-col bg-white">
        {/* Header */}
        <div className="px-4 py-6 border-b border-gray-200">
         
          {/* Search Box */}
          <div className="relative max-w-[198px]">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <Search className="absolute right-2.5 top-1.5 text-gray-400" size={14} />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation)}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  selectedConversation?.id === conversation.id
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={conversation.connectionAvatar}
                    alt={conversation.connectionName}
                    className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm truncate">
                      {conversation.connectionName}
                    </h3>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {conversation.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              Không có cuộc hội thoại nào
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {showDetails && selectedConversation ? (
          <ChatDetails
            conversation={selectedConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            onBack={handleBack}
          />
        ) : (
          /* Default View */
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center max-w-md text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle size={40} className="text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Hộp thư của bạn
              </h2>
              <p className="text-gray-500 text-sm">
                Hãy chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu cuộc trò chuyện
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Mock data for conversations
const mockConversations: Conversation[] = [
  {
    id: 1,
    connectionId: 1,
    connectionName: "Google Inc.",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=google",
    lastMessage: "Xin chào bạn",
    lastMessageTime: "2 giờ trước",
    description: "You can connect with companies posting jobs...",
  },
  {
    id: 2,
    connectionId: 2,
    connectionName: "Phạm Cường",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pham",
    lastMessage: "Chúng mình đang tìm kiếm Freelancer đó",
    lastMessageTime: "5 giờ trước",
    description: "Chúng mình đang tìm kiếm Freelancer để...",
  },
  {
    id: 3,
    connectionId: 3,
    connectionName: "SkillSnap",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=skillsnap",
    lastMessage: "Cảm ơn bạn đã tham gia",
    lastMessageTime: "1 ngày trước",
    description: "Bạn có kết nối với nhà tuyên dụng...",
  },
  {
    id: 4,
    connectionId: 4,
    connectionName: "Nguyễn Văn A",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nguyenvana",
    lastMessage: "Có thể gặp mặt để thảo luận không?",
    lastMessageTime: "3 ngày trước",
    description: "Có thể gặp mặt để thảo luận không?",
  },
];
