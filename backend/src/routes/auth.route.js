
const express=require('express');
const { login, logout, signup, updateProfile, checkAuth } = require('../controllers/auth.controller');
const protectRout = require('../middleware/protectRoute');
const router=express.Router();

router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout)

router.put("/update-profile",protectRout,updateProfile);

router.get("/check",protectRout,checkAuth)


module.exports=router;