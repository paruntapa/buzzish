import React, { useRef } from 'react'
import {useChatStore} from '../store/useChatStore'
import { useEffect } from 'react'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './skeletons/MessageSkeleton'
import { useAuthStore } from '../store/useAuthStore'
import { formatMessageTime } from '../lib/utils'


const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading,  selectedUsers, subscribeToMessages, unsubscribeFromMessages} = useChatStore()
  const {authUser} = useAuthStore()
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUsers._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages()
  }, [selectedUsers._id, getMessages, unsubscribeFromMessages, subscribeToMessages])

  useEffect(() => {
    if (messageEndRef.current && messages) 
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])

  if(isMessagesLoading) return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput/>
    </div>
  )

  return (
    <div className='flex-1 flex flex-col overflow-autos'>
      <ChatHeader />

      <div className='flex-1 overflow-y-auto p-4 space-y-4'> 
        {messages.map((message)=> (
          <div key={message._id} className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}
          ref={messageEndRef}>
            <div className='chat-image avatar'>
              <div className='size-8 rounded-full '> 
                <img src={
                  
                  message.senderId === authUser._id ? authUser.profileImage || 'https://w7.pngwing.com/pngs/665/132/png-transparent-user-defult-avatar-thumbnail.png'
                  : selectedUsers.profileImage || 'https://w7.pngwing.com/pngs/665/132/png-transparent-user-defult-avatar-thumbnail.png' 
                } alt="profile pic" 
                />
              </div>
            </div>
            <div className='chat-header mb-1'>
              <time className='text-xs opacity-50 ml-1'>
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className={`chat-bubble flex flex-col ${message.image ? "rounded-md" : "rounded-full"} bg-zinc-700 text-white`}>
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  )
}

export default ChatContainer