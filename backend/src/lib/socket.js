
const {Server}=require('socket.io');
const http=require('http');
const express=require('express');
const app=express();
const server=http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:["http://localhost:5173"]
    }
});

getReceiverSocketId=(userId)=>{
return userSocketMap[userId];
}

//used to store online users
const userSocketMap={}       //{userId:socketId}

io.on("connection",(socket)=>{
    console.log("a User connected",socket.id);
      
    const userId=socket.handshake.query.userId; //this is pass form client
    // The socket.handshake.query.userId is a way to retrieve query parameters that were sent 
    // from the client when establishing a WebSocket connection in a socket.io 
    // server. In this case, the userId is being passed as a query parameter from the client side.
    if(userId) userSocketMap[userId]=socket.id;

    //io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap))


    socket.on("disconnect",()=>{
        console.log("a user disconnted",socket.id)
        delete userSocketMap[userId];
        io.emit ("getOnlineUsers",Object.keys(userSocketMap));
    })
})

module.exports={app,io,server,getReceiverSocketId};