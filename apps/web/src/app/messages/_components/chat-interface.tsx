"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Phone,
  Video,
  MoreHorizontal,
  Paperclip,
  Smile,
  Search,
  MapPin,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageSquare } from "lucide-react"; // Import MessageSquare

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  type: "text" | "image" | "property" | "system";
  propertyData?: {
    id: string;
    title: string;
    price: number;
    image: string;
    address: string;
  };
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  participantRole: "owner" | "renter";
  propertyTitle?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
}

interface ChatInterfaceProps {
  currentUserId: string;
  currentUserName: string;
  conversations?: Conversation[];
  selectedConversationId?: string;
  onConversationSelect?: (conversationId: string) => void;
}

export function ChatInterface({
  currentUserId,
  currentUserName,
  conversations = [],
  selectedConversationId,
  onConversationSelect,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock conversations data
  const mockConversations: Conversation[] =
    conversations.length > 0
      ? conversations
      : [
          {
            id: "1",
            participantId: "owner1",
            participantName: "Sarah Johnson",
            participantAvatar: "/placeholder.svg",
            participantRole: "owner",
            propertyTitle: "Modern Downtown Loft",
            lastMessage: "The apartment is available for viewing this weekend.",
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            unreadCount: 2,
            isOnline: true,
          },
          {
            id: "2",
            participantId: "owner2",
            participantName: "Mike Chen",
            participantAvatar: "/placeholder.svg",
            participantRole: "owner",
            propertyTitle: "Cozy Garden Apartment",
            lastMessage:
              "Thank you for your interest! When would you like to schedule a viewing?",
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            unreadCount: 0,
            isOnline: false,
          },
          {
            id: "3",
            participantId: "renter1",
            participantName: "Alice Brown",
            participantAvatar: "/placeholder.svg",
            participantRole: "renter",
            propertyTitle: "Luxury Penthouse Suite",
            lastMessage:
              "I'm very interested in this property. Is it still available?",
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
            unreadCount: 1,
            isOnline: true,
          },
        ];

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(
      selectedConversationId
        ? mockConversations.find((c) => c.id === selectedConversationId) ||
            mockConversations[0]
        : mockConversations[0]
    );

  // Mock messages for selected conversation
  const mockMessages: Message[] = [
    {
      id: "1",
      senderId: selectedConversation?.participantId || "owner1",
      senderName: selectedConversation?.participantName || "Sarah Johnson",
      senderAvatar: "/placeholder.svg",
      content:
        "Hi! I saw your inquiry about the downtown loft. I'd be happy to answer any questions you have.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      type: "text",
    },
    {
      id: "2",
      senderId: currentUserId,
      senderName: currentUserName,
      content:
        "Thank you for reaching out! I'm very interested in the property. Could you tell me more about the neighborhood and nearby amenities?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
      type: "text",
    },
    {
      id: "3",
      senderId: selectedConversation?.participantId || "owner1",
      senderName: selectedConversation?.participantName || "Sarah Johnson",
      senderAvatar: "/placeholder.svg",
      content:
        "The location is fantastic! You're within walking distance of downtown, great restaurants, and public transportation. Here's the property details:",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22), // 22 hours ago
      type: "text",
    },
    {
      id: "4",
      senderId: selectedConversation?.participantId || "owner1",
      senderName: selectedConversation?.participantName || "Sarah Johnson",
      senderAvatar: "/placeholder.svg",
      content: "",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22), // 22 hours ago
      type: "property",
      propertyData: {
        id: "1",
        title: "Modern Downtown Loft",
        price: 2400,
        image: "/images/modern-loft-1.jpg",
        address: "123 Main St, Downtown",
      },
    },
    {
      id: "5",
      senderId: currentUserId,
      senderName: currentUserName,
      content:
        "This looks perfect! Would it be possible to schedule a viewing this weekend?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21), // 21 hours ago
      type: "text",
    },
    {
      id: "6",
      senderId: selectedConversation?.participantId || "owner1",
      senderName: selectedConversation?.participantName || "Sarah Johnson",
      senderAvatar: "/placeholder.svg",
      content:
        "I have availability on Saturday at 2 PM or Sunday at 10 AM. Which works better for you?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      type: "text",
    },
  ];

  useEffect(() => {
    setMessages(mockMessages);
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: currentUserName,
      content: newMessage,
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    onConversationSelect?.(conversation.id);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredConversations = mockConversations.filter(
    (conv) =>
      conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.propertyTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[600px] border rounded-lg overflow-auto">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r bg-gray-50">
        <div className="p-4 border-b bg-white">
          <h2 className="font-semibold mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                  selectedConversation?.id === conversation.id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-white"
                }`}
                onClick={() => handleConversationSelect(conversation)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          conversation.participantAvatar || "/placeholder.svg"
                        }
                      />
                      <AvatarFallback>
                        {conversation.participantName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm truncate">
                        {conversation.participantName}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    {conversation.propertyTitle && (
                      <p className="text-xs text-gray-600 mb-1 truncate">
                        Re: {conversation.propertyTitle}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate flex-1">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge className="ml-2 bg-primary text-xs px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage
                        src={
                          selectedConversation.participantAvatar ||
                          "/placeholder.svg"
                        }
                      />
                      <AvatarFallback>
                        {selectedConversation.participantName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {selectedConversation.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {selectedConversation.participantName}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Badge variant="outline" className="text-xs">
                        {selectedConversation.participantRole}
                      </Badge>
                      {selectedConversation.propertyTitle && (
                        <>
                          <span>•</span>
                          <span>{selectedConversation.propertyTitle}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Schedule Viewing</DropdownMenuItem>
                      <DropdownMenuItem>Block User</DropdownMenuItem>
                      <DropdownMenuItem>Report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 border-2">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id}>
                    {message.type === "system" ? (
                      <div className="text-center">
                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {message.content}
                        </span>
                      </div>
                    ) : (
                      <div
                        className={`flex gap-3 ${message.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                      >
                        {message.senderId !== currentUserId && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={message.senderAvatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {message.senderName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-xs lg:max-w-md ${
                            message.senderId === currentUserId
                              ? "bg-primary text-white"
                              : "bg-gray-100"
                          } rounded-lg px-4 py-2`}
                        >
                          {message.type === "property" &&
                          message.propertyData ? (
                            <div className="space-y-2">
                              <img
                                src={
                                  message.propertyData.image ||
                                  "/placeholder.svg"
                                }
                                alt={message.propertyData.title}
                                className="w-full h-32 object-cover rounded"
                              />
                              <div>
                                <h4 className="font-medium text-sm">
                                  {message.propertyData.title}
                                </h4>
                                <div className="flex items-center gap-1 text-xs opacity-75 mt-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{message.propertyData.address}</span>
                                </div>
                                <p className="font-semibold text-sm mt-1">
                                  ${message.propertyData.price}/month
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm">{message.content}</p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span
                              className={`text-xs ${
                                message.senderId === currentUserId
                                  ? "text-white/70"
                                  : "text-gray-500"
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                        </div>
                        {message.senderId === currentUserId && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {currentUserName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
