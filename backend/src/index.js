import dotenv from 'dotenv';
dotenv.config(); // Load environment variables immediately

import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { io, server, app } from './lib/socket.js';
import connection from './lib/dbConnection.js';
 
// Make sure dotenv.config() runs before accessing PORT
const PORT = process.env.PORT || 3000; // Use fallback port if env variable fails

const __dirname = path.resolve();
// Ensure database connection works

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

server.listen(PORT, () => {
    connection(); 
    console.log('Server started on port', PORT);
});
