const express=require('express');
const router=express.Router();
require("dotenv").config();
const User=require('./../models/user');
const {jwtAuthMiddleware,generateToken}=require('./../jwt');
//Signup route
router.post('/signup', async (req,res)=>{
    try{
    const data=req.body;
    const newUser=new User(data);
    const response=await newUser.save();
    console.log('data saved');
    const payload={
        id:response.id
    }
    console.log(JSON.stringify(payload));
    const token=generateToken(payload);
    console.log("Token is : ",token);
    res.status(200).json({response:response,token:token});
}catch(err){
    console.log(err);
    res.status(401).json({error:'Invalid username or password'});
}
}
)
//Login route
router.post('/login',async (req,res)=>{
    try{
        const {adharCardNo,password}=req.body;//extract adhar and PW
        const user=await User.findOne({adharCardNo:adharCardNo});//find user by adhar
        if(!user ||!(await user.comparePassword(password))){
            return res.status(401).json({error:'Invalid username or password'});
        }const payload={
            id:user.id,
        }
        const token=generateToken(payload)
        res.json({token});
    }catch(err){
        console.log(err);
    }
})
//profile Route
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
    try {
        const userData=req.user;
        const userId=userData.id;
        const user=await User.findById(userId);
        res.status(200).json({user});
    } catch (err) {
        console.log(err);
        res.status(500).json({error:"Internal Server Error"});
    }
})
module.exports=router;
