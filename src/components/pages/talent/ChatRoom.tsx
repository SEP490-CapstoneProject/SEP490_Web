import { useState, useEffect } from "react";
import { MessageCircle, Search, Send } from "lucide-react";

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
  unreadCount: number;
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
  const [newMessage, setNewMessage] = useState("");

  const filteredConversations = conversations.filter((conv) =>
    conv.connectionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // Load messages from localStorage for selected conversation
    const loadedMessages = loadMessagesFromStorage(conversation.id);
    setMessages(loadedMessages);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const message: Message = {
        id: messages.length + 1,
        userId: 1, // Current user ID
        messageRoomId: selectedConversation.id,
        content: newMessage,
        createdAt: new Date().toLocaleTimeString(),
        status: 1,
      };
      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      // Save to localStorage
      saveMessagesToStorage(selectedConversation.id, updatedMessages);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white overflow-hidden">
      {/* Left Sidebar - Conversations List */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tin nhắn</h1>
          
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm border border-gray-200 focus:outline-none focus:border-blue-400"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-all ${
                  selectedConversation?.id === conversation.id
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={conversation.connectionAvatar}
                    alt={conversation.connectionName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {conversation.connectionName}
                      </h3>
                      {conversation.unreadCount > 0 && (
                        <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {conversation.lastMessageTime}
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
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
              <img
                src={selectedConversation.connectionAvatar}
                alt={selectedConversation.connectionName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h2 className="font-semibold text-gray-800">
                  {selectedConversation.connectionName}
                </h2>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.userId === 1 ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.userId === 1
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.userId === 1
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {message.createdAt}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 mt-8">
                  Chưa có tin nhắn trong cuộc trò chuyện này
                </p>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Default View */
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <MessageCircle size={64} className="text-blue-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Họp thư của bạn
            </h2>
            <p className="text-gray-600 text-center max-w-sm">
              Hãy chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu cuộc
              trò chuyện
            </p>
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
    unreadCount: 2,
  },
  {
    id: 2,
    connectionId: 2,
    connectionName: "Phạm Cường",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pham",
    lastMessage: "Chúng mình đang tìm kiếm Freelancer đó",
    lastMessageTime: "5 giờ trước",
    unreadCount: 0,
  },
  {
    id: 3,
    connectionId: 3,
    connectionName: "SkillSnap",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=skillsnap",
    lastMessage: "Cảm ơn bạn đã tham gia",
    lastMessageTime: "1 ngày trước",
    unreadCount: 0,
  },
  {
    id: 4,
    connectionId: 4,
    connectionName: "Nguyễn Văn A",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nguyenvana",
    lastMessage: "Có thể gặp mặt để thảo luận không?",
    lastMessageTime: "3 ngày trước",
    unreadCount: 0,
  },
];
