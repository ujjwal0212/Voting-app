const express=require('express');
const router=express.Router();
require("dotenv").config();
const User=require('../models/user');
const Candidate=require('../models/candidate');
const {jwtAuthMiddleware}=require('../jwt');
const checkAdminrole= async (userId) => {
    try{
        const user =await User.findById(userId);
        if(user.role==='admin')return true;
    }catch(err){
        return false;
    }
}
//To add a candidate
router.post('/', jwtAuthMiddleware,async (req,res)=>{
    try{
        if(!( await checkAdminrole(req.user.id))){
            return res.status(404).json({message:'user has not admin role'});
        }
    const data=req.body;
    const newCandidate=new Candidate(data);
    const response=await newCandidate.save();
    console.log("Candidate data Saved");
    res.status(200).json({response:response});
}catch(err){
    console.log(err);
    res.status(401).json({error:'Invalid username or password'});
}
}
)

//delete
router.delete("/:candidateId",jwtAuthMiddleware,async(req,res)=>{
    try {
        if(!( await checkAdminrole(req.user.id))){
            return res.status(404).json({message:'user has not admin role'});
        }
        const candidateId=req.params.candidateId;//Extract from URL
        const response=await Candidate.findByIdAndDelete(candidateId);
        if(!response){
            return res.status(404).json({error:"Candidate Not found"});
        }
        console.log("Candidate Deleted");
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Server error'});
    }

})
//Voting
router.post('/votes/:candidateId',jwtAuthMiddleware,async (req,res)=>{
    //no admin can vote,user can only vote once
    candidateId=req.params.candidateId;
    userId=req.user.id;
    try {
        const candidate=await Candidate.findById(candidateId);
        if(!candidate){
            return res.status(404).json({message:"Candidate not found"});
        }
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        if(user.isvoted){
            return res.status(400).json({message:"You have already Voted"});
        }
        if(user.role==="admin"){
            return res.status(400).json({message:"Admins are not eligible to vote"});
        }
        candidate.votes.push({user:userId});
        candidate.voteCount++;
        await candidate.save();
        //update user document
        user.isvoted=true;
        await user.save();
        res.status(200).json({message:"Vote recorded Successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Server error'});
    }
})
//vote count
router.get('/votes/count',async(req,res)=>{
    try {
        //find all candidate and sort them by voteCount in descending order
        const candidate=await Candidate.find().sort({voteCount:'desc'});
        //Map the candidate to only return their name and voteCount
        const voteRecord=candidate.map((data)=>{
            return {
                party:data.party,
                count:data.voteCount
            }
        });
        return res.status(200).json(voteRecord);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Server error'});
    }
})

module.exports=router;
