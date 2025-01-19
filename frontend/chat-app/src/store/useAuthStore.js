import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set)=>({
    authUser: null,
    isSigningUp: false,
    isSigningOut: false,
    isLogining: false,
    isUpdateProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    

    checkAuth: async ()=>{
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser: res.data})
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
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isSigningup: false})
        }

    },

    logout: async () =>{
        set({isSigningOut: true})
        try {
            await axiosInstance.post("/auth/signout")   
            set({authUser: null})   
            
        } catch (error) {
            
            toast.error(error.response.data.message);
        } finally{
        set({isSigningOut: false})

        }
    },

    signin: async (data)=>{
        set({isLogining: true})
        try {
            const res = await axiosInstance.post("/auth/signin", data)
            set({authUser: res.data})
            toast.success("Signed In Successfully!")
            console.log(authUser)
        } catch (error) {
            toast.error(error.response.data.message)
        } finally{
            set({isLogining: false})
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
    }
}))