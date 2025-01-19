import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom"
import AuthImagePattern from '../components/authImage';
import toast from 'react-hot-toast';


const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)

  const [formData, SetFormData] = useState({
    username:  "",
    email: "",
    password: ""
  })

  const {signup, isSigningUp } = useAuthStore();

  const validateForm = () =>{
     if (!formData.username.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

     return true
  }
  const handleSubmit = (e) =>{
    e.preventDefault();

    const success = validateForm()
    if(success == true){ signup(formData);
    }
  }

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>

      {/*LEFT SIDE*/}
    <div className='flex justify-center flex-col items-center p-6 sm:p-12'>
      <div className='w-full max-w-md space-y-3'> 

        {/*LOGO*/}
        <div className='text-center'> 
          <div className='gap-2 group flex-col flex items-center'>
            <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
              <MessageSquare className="text-2xl font-bold mt-1.5"/>
            </div>
            <h1 className='text-2xl font-bold '>Create Account</h1>
            <p className='text-base-content/60'>Get started with your free account</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className='space-y-6'>

          {/*INPUTS*/}
          <div className='form-control'>
            <label className='label'>
              <span className='label-text font-medium'>
                Name
              </span>
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <User className="size-5 text-base-content/40"/>
              </div>
              <input type="text"
              className='input input-bordered w-full pl-10'
              placeholder='Anuj Sundola' 
              value={formData.username}
              onChange={(e)=> SetFormData({...formData, username: e.target.value} )}/>
            </div>
          </div>

          <div className='form-control'>
            <label className='label'>
              <span className='label-text font-medium'>
                Email
              </span>
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Mail className="size-5 text-base-content/40"/>
              </div>
              <input type="email"
              className='input input-bordered w-full pl-10'
              placeholder='anujsundola@gmail.com' 
              value={formData.email}
              onChange={(e)=> SetFormData({...formData, email: e.target.value} )}/>
            </div>
          </div>

          <div className='form-control'>
            <label className='label'>
              <span className='label-text font-medium'>
                Password
              </span>
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Lock className="size-5 text-base-content/40"/>
              </div>
              <input type={showPassword ? "text" : "password"}
              className='input input-bordered w-full pl-10'
              placeholder='**********' 
              value={formData.password}
              onChange={(e)=> SetFormData({...formData, password: e.target.value} )}/>

              <button type='button'
              className='absolute inset-y-0 right-0 pr-3 flex items-center'
              onClick={()=> setShowPassword(!showPassword)}>

              {showPassword ? (
                <EyeOff className="size-5 text-base-content/40"/>
              ) : (
                <Eye className="size-5 text-base-content/40"/>
              )}
              </button>
            </div>
          </div>
          <button type='submit' className='btn btn-primary w-full' disabled={isSigningUp}>
            {isSigningUp ? (
              <>
              <Loader2 className='size-5 animate-spin' />
              Loading...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className='text-center'>
          <p className='text-base-content/60'>
            Already have an account? {""}
            <Link to="/signin" className='link link-primary'>
            Sign in</Link>
          </p>
        </div>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <AuthImagePattern
    title="Join our Whats App competitor"
    subtitle="Out chat app is the second best after the human speech"/>
    </div>
  )
}

export default SignUp