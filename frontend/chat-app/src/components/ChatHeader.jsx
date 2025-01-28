import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";

const ChatHeader = () => {
  const { selectedUsers, setSelectedUser, typingStatus, setTypingStatus } = useChatStore();
  const { onlineUsers, socket } = useAuthStore();

  useEffect(() => {
    socket.on("userTyping", ({ senderId, isTyping }) => {

        if (senderId === selectedUsers._id) {
            setTypingStatus(isTyping && ( true ));
        } 
    });

    return () => {
        socket.off("userTyping");
    };
}, [socket, selectedUsers._id]);


  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUsers.profileImage || "/avatar.png"} alt={selectedUsers.username} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUsers.username}</h3>
            <p className="text-sm text-base-content/70 text-green-500">
              {
               onlineUsers.includes(selectedUsers._id) ? `${typingStatus ? 'Typing...' : 'Online'}` : <div className="text-gray-300">Offline</div>
              }
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;