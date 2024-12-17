
import express from 'express';
import { login, logout, signup, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import protectRout from '../middleware/protectRoute.js';

const router = express.Router();

router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout)

router.put("/update-profile",protectRout,updateProfile);

router.get("/check",protectRout,checkAuth)


export default router;