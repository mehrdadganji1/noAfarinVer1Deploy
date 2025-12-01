import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  MessageSquare,
  Search,
  User,
  Circle
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import ChatWindow from '@/components/ChatWindow'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'
import { useMessageSocket } from '@/hooks/useMessageSocket'

interface Conversation {
  _id: string
  participants: Array<{ _id: string; firstName: string; lastName: string }>
  lastMessage?: { content: string; createdAt: string }
  unreadCount?: number
}

export default function MessagesChat() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const queryClient = useQueryClient()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())

  // Real-time Socket.io integration
  const { 
    isConnected, 
    sendMessage: sendSocketMessage,
    onlineUsers,
    isUserOnline 
  } = useMessageSocket({
    onMessageReceived: (message) => {
      // Refresh messages when new message received
      queryClient.invalidateQueries({ queryKey: ['conversation-messages', selectedConversation] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
    onUserTyping: (data) => {
      setTypingUsers(prev => new Set(prev).add(data.userId))
      // Remove typing indicator after 3 seconds
      setTimeout(() => {
        setTypingUsers(prev => {
          const newSet = new Set(prev)
          newSet.delete(data.userId)
          return newSet
        })
      }, 3000)
    },
    onUserStoppedTyping: (userId) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    },
  })

  // Fetch conversations
  const { data: conversationsData, isLoading: isLoadingConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await api.get('/messages/conversations')
      return response.data
    },
  })

  // Fetch messages for selected conversation
  const { data: messagesData, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['conversation-messages', selectedConversation],
    queryFn: async () => {
      if (!selectedConversation) return { data: [] }
      const response = await api.get(`/api/messages/conversations/${selectedConversation}/messages`)
      return response.data
    },
    enabled: !!selectedConversation,
  })

  const conversations: Conversation[] = conversationsData?.data || []
  const messages = messagesData?.data || []

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const conversation = conversations.find((c) => c._id === selectedConversation)
      const recipientId = conversation?.participants.find((p) => p._id !== user?._id)?._id

      const response = await api.post('/messages/send', {
        receiverId: recipientId,
        content,
        messageType: 'text'
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation-messages', selectedConversation] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
    onError: () => {
      toast.error('خطا در ارسال پیام')
    },
  })

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return
    
    const conversation = conversations.find((c) => c._id === selectedConversation)
    const recipientId = conversation?.participants.find((p) => p._id !== user?._id)?._id
    
    if (!recipientId) return
    
    // Send via Socket.io for real-time delivery
    if (isConnected && sendSocketMessage) {
      sendSocketMessage({
        conversationId: selectedConversation,
        recipientId,
        content,
      })
    }
    
    // Also send via REST API as fallback
    await sendMessageMutation.mutateAsync(content)
  }

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true
    const otherParticipant = conv.participants.find((p) => p._id !== user?._id)
    const name = `${otherParticipant?.firstName} ${otherParticipant?.lastName}`.toLowerCase()
    return name.includes(searchQuery.toLowerCase())
  })

  const selectedConv = conversations.find((c) => c._id === selectedConversation)
  const otherParticipant = selectedConv?.participants.find((p) => p._id !== user?._id)
  const recipientName = otherParticipant
    ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
    : 'گیرنده'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">پیام‌ها</h1>
            {/* Connection Status */}
            <Badge 
              variant={isConnected ? "default" : "secondary"}
              className={cn(
                "flex items-center gap-1.5",
                isConnected ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
              )}
            >
              <Circle className={cn("h-2 w-2 fill-current", isConnected && "animate-pulse")} />
              {isConnected ? 'آنلاین' : 'آفلاین'}
            </Badge>
          </div>
          <p className="text-gray-500 mt-2">
            {isConnected ? 'پیام‌های شما در لحظه ارسال می‌شوند' : 'در حال اتصال مجدد...'}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/applicant/dashboard')}>
          <ArrowRight className="ml-2 h-4 w-4" />
          بازگشت به داشبورد
        </Button>
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="جستجو..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>

              {/* Conversations */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {isLoadingConversations ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">مکالمه‌ای وجود ندارد</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => {
                    const otherParticipant = conversation.participants.find((p) => p._id !== user?._id)
                    const isActive = selectedConversation === conversation._id

                    return (
                      <button
                        key={conversation._id}
                        onClick={() => setSelectedConversation(conversation._id)}
                        className={cn(
                          'w-full text-right p-3 rounded-lg transition-colors',
                          isActive
                            ? 'bg-blue-50 border-2 border-blue-500'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 relative">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                              <User className="h-5 w-5" />
                            </div>
                            {/* Online Status Indicator */}
                            {isUserOnline(otherParticipant?._id || '') && (
                              <div className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm truncate">
                                {otherParticipant?.firstName} {otherParticipant?.lastName}
                              </p>
                              {isUserOnline(otherParticipant?._id || '') && (
                                <span className="text-xs text-green-600">●</span>
                              )}
                            </div>
                            {conversation.lastMessage && (
                              <p className="text-xs text-gray-500 truncate">
                                {conversation.lastMessage.content}
                              </p>
                            )}
                          </div>
                          {conversation.unreadCount && conversation.unreadCount > 0 && (
                            <div className="flex-shrink-0">
                              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full">
                                {conversation.unreadCount}
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <ChatWindow
              messages={messages}
              currentUserId={user?._id || ''}
              onSendMessage={handleSendMessage}
              isLoading={isLoadingMessages}
              recipientName={recipientName}
              isTyping={typingUsers.has(otherParticipant?._id || '')}
              isOnline={isUserOnline(otherParticipant?._id || '')}
              onTypingStart={() => {
                // This will be handled by socket in handleInputChange
              }}
              onTypingStop={() => {
                // This will be handled by socket in handleInputChange
              }}
            />
          ) : (
            <Card className="h-[600px]">
              <CardContent className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">یک مکالمه را انتخاب کنید</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
