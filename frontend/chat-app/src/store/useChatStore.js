import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUsers: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () =>{
        set({isUsersLoading: true});
        try {
            const res = await axiosInstance.get("/messages/users");
            set({users: res.data});
        } catch (error) {
            toast.error(error.response.data.message)
        } finally{
            set({isUsersLoading: false})
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({messages: res.data});
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
        set({ isMessagesLoading: false});
            
        }
    },
    
    sendMessage: async (messageData) => {
        const {selectedUsers, messages} = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUsers._id}`, messageData);
            set({messages: [...messages, res.data]});
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    setSelectedUsers: (selectedUsers) => set({selectedUsers}),
}))
