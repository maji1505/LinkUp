// Import the dotenv package to load environment variables
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

import mongoose from "mongoose";

async function connection() {

    try {
        await mongoose.connect('mongodb+srv://kushalmaji511:u6KzDlTnyixS1J6d@cluster0.mqi9y.mongodb.net/linkUp?retryWrites=true&w=majority&appName=Cluster0');
        console.log('Database connected');
    } catch (error) {
        console.log(error);
    }
}

export default connection;
