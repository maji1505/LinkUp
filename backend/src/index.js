const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path=require("path");
const cors = require('cors')
dotenv.config();
const authRoutes = require('./routes/auth.route');
const messageRoutes = require('./routes/message.route')
const connection = require('./lib/dbConnection');
const {io,server,app}=require('./lib/socket')

const PORT = process.env.PORT;
const __dirname=path.resolve();

app.use(express.json({limit:'10mb'})); 

app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }))

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes)

if(process.env.NODE_ENV==="production"){
app.use(express.static(path.join(__dirname,"..frontend/dist")));

app.get("*",(req,res)=>{
res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
})

}

server.listen(PORT, () => {
    connection();
    console.log('server started on port', PORT);
})