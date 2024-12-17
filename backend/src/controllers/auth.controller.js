
import generateToken from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js'

 
const signup=async function(req,res){ 
    const{fullName,email,password}=req.body;
try{
    if(!fullName?.trim() || !email?.trim() || !password?.trim()){
      return   res.status(400).json({message:"All the fields are required"});
    }
if(password.length<6){
    return res.status(400).json({message:"password must be atleast 6 character"});
}
const user= await User.findOne({email});
if(user){
    return res.status(400).json({message:"Email already exists"})
}
const salt = await bcrypt.genSalt(6);
const hashPassword=await bcrypt.hash(password,salt);
const newUser= await User.create({
    fullName,email,password:hashPassword
});
if(newUser){
    generateToken(newUser._id,res);
    res.status(201).json({
        _id:newUser._id,
        fullName:newUser.fullName,
        email:newUser.email,
        profilePic:newUser.profilePic,
    })

}else{
    res.status(400).json({message:"Invalid user data"});
}
}catch(error){
console.log('Error in signup controller',error.message);
res.status(500).json({message:"internal server Error"})
}
}

const login=async function(req,res){
    const{email,password}=req.body;
    try{
        if( !email?.trim() || !password?.trim()){
          return   res.status(400).json({message:"All the fields are required"});
        }
 
    const user= await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"Invalid credentials"})
    }
     const isPasswordCorrect=await bcrypt.compare(password,user.password);
     if(!isPasswordCorrect){
        return res.status(400).json({message:"Invalid password"});
     }
     generateToken(user._id,res);
    res.status(200).json({
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profilePic:user.profilePic,
    })

    }catch(error){
    console.log('Error in Login controller',error.message);
    res.status(500).json({message:"internal server Error"})
    }
}

const logout=(req,res)=>{
   try{
    res.clearCookie('jwt');
    return res.status(200).json({message:"Logged out successfully"})
   }
   catch(error){
    console.log('error in logout controller',error.message);
    return res.status(500).json({message:"Internal server Error"});
   }
}

const updateProfile=async(req,res)=>{ 
try{
        const {profilePic}=req.body; 
       const userId= req.user._id;
       if(!profilePic){
        return res.status(400).json({message:"profilePic is required"}) 
       }
      const uploadResponse= await cloudinary.uploader.upload(profilePic);
    //   console.log(uploadResponse);
      const updatedUser= await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});
      res.status(200).json(updatedUser);
    }catch(error){
     console.log("error in update ProfilePic",error.message);
     res.status(500).json({message:"Internal Server error"}) 
    }
}

const checkAuth=(req,res)=>{
    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log("error in checkAuth controller",error.message);
        res.status(500).json({message:"internal server Error"});
    }
}
export {signup,login,logout,updateProfile,checkAuth}

