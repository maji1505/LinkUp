
import cloudinary from "../lib/cloudinary.js"
import {io,getReceiverSocketId} from '../lib/socket.js'
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password -email"); // Exclude sensitive fields
 
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        }).sort({ createdAt: 1 }); // Sort messages chronologically

        res.status(200).json(messages); // Return messages as an array
    } catch (error) {
        console.error("Error in getMessages controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const sendMessages = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const { text, image } = req.body;

        if (!text && !image) {
            return res.status(400).json({ message: "Message text or image is required" });
        }

        const myId = req.user._id;
        let imageUrl;

        if (image) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image, {
                    folder: "messages"
                });
                imageUrl = uploadResponse.secure_url;
            } catch (error) {
                console.error("Error uploading image to Cloudinary:", error.message);
                return res.status(500).json({ message: "Image upload failed" });
            }
        }

        const newMessage = new Message({
            senderId: myId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();
        // console.log(newMessage);
        //todo: realtime functionality goes here=>socket.io
        const receiverSockeetId=getReceiverSocketId(receiverId);
        if(receiverSockeetId){
            io.to(receiverSockeetId).emit("newMessage",newMessage);
        };

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessages controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { getUsersForSidebar, getMessages, sendMessages };
