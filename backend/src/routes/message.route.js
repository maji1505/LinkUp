const express=require('express');
const protectRout = require('../middleware/protectRoute');
const { getUsersForSidebar, getMessages, sendMessages } = require('../controllers/message.controller');
const router=express.Router();

router.get("/users",protectRout,getUsersForSidebar);
router.get("/:id",protectRout,getMessages);
router.post("/send/:id",protectRout,sendMessages)

module.exports=router;