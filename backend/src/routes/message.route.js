import express from 'express';
import protectRout from '../middleware/protectRoute.js';
import { getUsersForSidebar, getMessages, sendMessages } from '../controllers/message.controller.js';

const router=express.Router();

router.get("/users",protectRout,getUsersForSidebar);
router.get("/:id",protectRout,getMessages);
router.post("/send/:id",protectRout,sendMessages)

export default router;