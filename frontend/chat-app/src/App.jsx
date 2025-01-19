import {Routes, Route, Navigate} from "react-router-dom"
import Navbar from "../src/components/Navbar"
import HomePage from "../src/pages/HomePage"
import SignUp from "../src/pages/SignUp"
import SignIn from "../src/pages/SignIn"
import SettingsPage from "../src/pages/SettingsPage"
import ProfilePage from "../src/pages/ProfilePage"
import { useEffect } from "react"
import { useAuthStore } from "./store/useAuthStore"
import {Loader} from "lucide-react"
import {Toaster} from "react-hot-toast"
import { useThemeStore } from "./store/useThemeStore"


const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();
  const {theme} = useThemeStore();

  useEffect(()=>{
    checkAuth()
  }, [checkAuth])

  if(isCheckingAuth && !authUser){
    return <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  }

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to={"/signin"}/>} />
        <Route path="/signup" element={!authUser ? <SignUp/>: <Navigate to={"/"}/>} />
        <Route path="/signin" element={!authUser ? <SignIn/>: <Navigate to={"/"}/>} />
        <Route path="/settings" element={<SettingsPage/>} />
        <Route path="/profile" element={authUser ? <ProfilePage/>: <Navigate to={"/signin"}/>}  />
      </Routes>

      <Toaster/>
    </div>
  );
};

export default App