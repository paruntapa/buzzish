import React from 'react'
import {useChatStore} from '../store/useChatStore'
import { useEffect } from 'react'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './skeletons/MessageSkeleton'
import { useAuthStore } from '../store/useAuthStore'
import { formatMessageTime } from '../lib/utils'
const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading,  selectedUsers } = useChatStore()
  const {authUser} = useAuthStore()
  useEffect(() => {
    getMessages(selectedUsers._id)
  }, 
  [selectedUsers._id, getMessages])

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
          <div key={message._id} className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}>
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'> 
                <img src={
                  message.senderId === authUser._id ? authUser.profileImage || '/avator.png'
                  : selectedUsers.profileImage || '/avator.png' 
                } alt="profile pic" 
                />
              </div>
            </div>
            <div className='chat-header mb-1'>
              <time className='text-xs opacity-50 ml-1'>
                {message.createdAt}
              </time>
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  )
}

export default ChatContainer