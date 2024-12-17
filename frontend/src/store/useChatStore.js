

import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import {useAuthStore} from './useAuthStore'

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get('/messages/users');
      // console.log(res.data);
      set({ users: res.data });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch users";
      toast.error(errorMessage);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      // console.log(res.data);
      set({ messages: res.data }); // Backend now returns an array directly
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch messages";
      toast.error(errorMessage);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) {
      toast.error("No user selected for sending messages");
      return;
    }

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

      // console.log(res.data);
    //   const { message: newMessage } = res.data;
      set({ messages: [...messages,res.data] }); // Append the new message
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send message";
      toast.error(errorMessage);
    }
  },

  subscribeToMessages:()=>{
  const {selectedUser}=get();
  if(!selectedUser) return;

  const socket=useAuthStore.getState().socket;
  socket.on("newMessage",(newMessage)=>{
    if(newMessage.senderId !== selectedUser._id) return;
    set({messages:[...get().messages,newMessage]})
  })
  },

  unSubscribeToMessages:()=>{
    const socket=useAuthStore.getState().socket;
        socket.off("newMessage")
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));



