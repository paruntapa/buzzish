import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const BASE_URL =  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get)=>({
    authUser: null,
    isSigningUp: false,
    isSigningOut: false,
    isLoginin: false,
    isUpdateProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async ()=>{
        try {
            const res = await axiosInstance.get("/auth/check")
           
            set({authUser: res.data})
            
            get().connectSocket()
        } catch (error) {
            console.log(`error in useAuthStore ${error}`)
            set({authUser: null})
        } finally {
            set({isCheckingAuth: false});
        }
    },

    signup: async (data)=>{
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({authUser: res.data})
            toast.success("Signed up successfully!")
            console.log(authUser)

            get().connectSocket()
        } catch (error) {
            toast.error("Server Error", error.response.data.message);
        }finally{
            set({isSigningup: false})
        }

    },

    signin: async (data)=>{
        set({isLoginin: true})
        try {
            const res = await axiosInstance.post("/auth/signin", data)
            set({authUser: res.data})
            toast.success("Signed In Successfully!")

            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        } finally{
            set({isLoginin: false})
        }
    },
    

    logout: async () =>{
        set({isSigningOut: true})
        try {
            await axiosInstance.post("/auth/signout")   
            set({authUser: null})   
            
            get().disconnectSocket()
        } catch (error) {
            
            toast.error(error.response.data.message);
        } finally{
        set({isSigningOut: false})

        }
    },
    
    updateProfile: async (data)=>{
        set({ isUpdateProfile: true})
        try {
            const res = await axiosInstance.put("/auth/update-profile", data)
            set({ authUser: res.data });
            toast.success("Profile updated Successfully")
        } catch (error) {
            console.log(`error in updateProfile ${error}`)
            toast.error("Invalid Picture, Won't be uploaded");
        } finally{
            set({ isUpdateProfile: false})
        }
    },

    connectSocket: () =>{
        const {authUser} = get()
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            },
        });
        socket.connect()

        set({socket: socket})

        socket.on("getOnlineUsers", (userIds)=>{
            set({ onlineUsers: userIds })
        })
    },

    disconnectSocket: () =>{
        if(get().socket?.connected) get().socket.disconnect()
    }

}))