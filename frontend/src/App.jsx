import React, { useEffect } from 'react'
import Navbar from './components/Navbar';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';
import {Toaster} from 'react-hot-toast'
import {Loader2} from "lucide-react"
import { useThemeStore } from './store/useThemeStore';


function App() {
    const {checkAuth,authUser,isCheckingAuth,onlineUsers}=useAuthStore();
    const navigate=useNavigate();
    const {theme}=useThemeStore();
    console.log(onlineUsers);
    useEffect(()=>{
      console.log('useEffect runs')
checkAuth();
    },[checkAuth])
    
    console.log(authUser);
    if (isCheckingAuth) {
      return (
          <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="size-5 animate-spin" />&nbsp;Loading... {/* Replace with a spinner or skeleton */}
          </div>
      );
  }
  return (
    <div data-theme={theme} >
          <Navbar/>
          <Routes>
            <Route path='/' element={authUser?<HomePage/>:<Navigate to={'/login'}/>}/>
            <Route path='/signup' element={!authUser?<SignUpPage/>:<Navigate to={'/'}/>}/>
            <Route path='/login' element={!authUser?<LoginPage/>:<Navigate to={'/'}/>}/>
            <Route path='/settings' element={<SettingsPage/>}/>
            <Route path='/profile' element={authUser?<ProfilePage/>:<Navigate to={'/login'}/>}/>
            <Route path='*' element={<Navigate to={'/'}/>}/>
          </Routes>
          <Toaster/>
    </div>
  )
}

export default App;