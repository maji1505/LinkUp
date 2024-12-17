
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import axios from "axios";
import{io} from 'socket.io-client';

Base_Url=import.meta.env.MODE==="development"?"http://localhost:5001/api":"/" 

export const useAuthStore=create((set,get)=>({
    authUser:null,
    isSigningUP:false,
    isLogging:false,
    isUpdatingProfile:false,
    onlineUsers:[],
    socket:null,
    isCheckingAuth:true,

    checkAuth:async ()=>{
        try{
            const res=await axiosInstance.get("/auth/check");
            console.log('check',res.data);
            set({authUser:res.data})
          get().connectSocket();
        }catch(error){
            console.log("error in checkAuth",error.response?.data?.message);
             set({authUser:null});
        }
        finally{
            set({isCheckingAuth:false});
        }
    },
    signup:async(data)=>{
        set({isSigningUP:true})
     try{
         const res= await axiosInstance.post('/auth/signup',data);
         console.log(res);
         set({authUser:res.data})
         toast.success("Account created");
         get().connectSocket();
     }catch(error){
   toast.error(error.response?.data?.message);
     }

     finally{
        set({isSigningUP:false});
     }
    },
    login:async(data)=>{
        set({isLogging:true})
        try{
            const res= await axiosInstance.post('/auth/login',data);
            set({authUser:res.data})
            toast.success("Login successfully");
            get().connectSocket();
        }catch(error){
      toast.error(error.response?.data?.message);
        }
   
        finally{
           set({isLogging:false});
        }
    },
    logout:async()=>{
        try{
            await axiosInstance.post('/auth/logout');
            set({authUser:null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        }catch(error){
               toast.error(error.response?.data?.message);
        }
    },
    updateProfile:async(data)=>{

        set({isUpdatingProfile:true})
        try{
            // console.log('useAuth',data);
              const res=await axiosInstance.put('/auth/update-profile',data);
              set({authUser:res.data});
              toast.success("Profile updated successfully");

        }
        catch(error){
            console.log("eror",error.response);
            toast.error(error.response?.data?.message);
        }
        finally{
              set({isUpdatingProfile:false})
        }
},
connectSocket:()=>{
    const {authUser}=get();
    if(!authUser || get().socket?.connected) return;
  const socket=io(Base_Url,{query:{userId:authUser._id}}); //when you write this socket automaticaly connect you do not need to connect
  socket.connect();       //explicitly socket.connect() but you use also nothing is chnged
  set({socket:socket});

  socket.on("getOnlineUsers",(userIds)=>{
    set({onlineUsers:userIds});
  })
},

disconnectSocket:()=>{
if(get().socket?.connected) get().socket.disconnect();
}
}));

//using get method we can access variable and functions


// The reason the error response is not captured in the try block is that 
// Axios treats HTTP status codes like 4xx and 5xx as errors. 
// When a server responds with a 400 status (e.g., for validation errors), 
// Axios automatically throws an exception, skipping the try block's successful 
// execution path and moving directly to the catch block.

