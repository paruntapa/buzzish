import React, { useState } from 'react'
import { Link, Links } from 'react-router-dom'
import AuthImagePattern from '../components/authImage'
import { Eye, EyeOff, Loader2, MessageSquare } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false)
    const { isLogining, signin} = useAuthStore()
  
  const [formData, SetFormData] = useState({
      username: "",
      password: ""
    })

    const submit = (e)=>{
      e.preventDefault();
      signin(formData)
    }
  
  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
     <div className='justify-center flex-col flex items-center '>  
      {/* Left Side - Form */}

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

      <form>
      <div>
        <b>Username</b>
        <input  className="input input-bordered w-full mb-5"
                type="text" 
                placeholder='buzzenjoyer'
                value={formData.username}
                onChange={(e)=>{SetFormData({...formData, username: e.target.value})}}
        />

        <b>Password</b>
    <div className='relative inset-y-0 left-0  flex  items-center w-full'>
        
        <input type={showPassword ? "text" : "password"} 
               value={formData.password}
               placeholder='**********'
               className='input input-bordered w-full mb-3'
               onChange={(e)=>{SetFormData({...formData, password: e.target.value})}}
        />
        <button type='button'
              className='absolute inset-y-0 right-0 mb-3.5 pr-3  items-center'
              onClick={()=> setShowPassword(!showPassword)}>

              {showPassword ? (
                <EyeOff className="size-5 text-base-content/40"/>
              ) : (
                <Eye className="size-5 text-base-content/40"/>
              )}
        </button>
    </div>
        
        <button onClick={submit} className='btn btn-primary w-full mt-5' disabled={isLogining}>
            {isLogining ? (
              <>
              <Loader2 className='size-5 animate-spin' />
              Loading...
              </>
            ) : (
              "Log In"
            )}
        </button>
        
      </div>
      
      <div className='text-center mt-5'>
        <p className='text-base-content/60'>
          Don't have an account? {""}
          <Link to="/signup" className='link link-primary'>
          Sign up</Link>
          </p>
      </div>
      </form>
      
    </div>
    <AuthImagePattern
    title="Welcome Back!"
    subtitle="Hop back into the hive! Sign in to resume the buzz."/>
    </div>
  )
}

export default SignIn