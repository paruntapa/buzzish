import { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import {X, Image, Send} from "lucide-react"
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import { use } from 'react';

const MessageInput = () => {

  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, selectedUsers } = useChatStore();
  const { socket } = useAuthStore();
  const [isTypingStatus, setIsTypingStatus] = useState(false);
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
};

  const removeImage = () => {
    setImagePreview(null)
    if(fileInputRef.current) fileInputRef.current.value = '';
    
  };

  const handleSendMessage = async (e) => {

    e.preventDefault();
    if(!text.trim() && !imagePreview) return;

    try {
      setIsTypingStatus(true);

      await sendMessage({

        text: text.trim(),
        image: imagePreview,

      });

      //Clear form after sending}
      setText('');
      setImagePreview();

      socket.emit("typing", {
        receiverId: selectedUsers._id,
        isTyping: false, // Notify the receiver that typing has stopped
    });

      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) { 
      toast.error('Image has to be less than 50 kb');
    }   

  }


  return (

    <div className="p-4 w-full">

      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
        <div className='flex-1 flex gap-2'>
        <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => {
              const newText = e.target.value;
              setText(newText);
              const isTypeStatus = newText.trim() !== '';
              setIsTypingStatus(isTypeStatus);

            // Emit typing event
            socket.emit("typing", {
            receiverId: selectedUsers._id, // Pass the receiver's ID
            isTyping: e.target.value === '' ? false : true, // Notify the receiver that typing has started
            });

            console.log(newText);

          }}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => {fileInputRef.current?.click(); }}
            
          >
            <Image size={20} />
          </button>

        </div>

        <button
          type="submit"
          className="btn  btn-md btn-circle "
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>

      </form>
      </div>
  )
}

export default MessageInput