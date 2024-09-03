const jwt=require('jsonwebtoken');
require("dotenv").config();
const secret = process.env.JWT_SECRET;
const jwtAuthMiddleware=(req,res,next)=>{
    //Extract jwt Token from request header
    const token=req.headers.authorization.split(' ')[1];
    if(!token)return res.status(401).json({error:'Unauthorized'});
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({error:'Invalid token'});
    }
}

//func to generate Token
const generateToken = (userData) => {
    return jwt.sign(userData,process.env.JWT_SECRET);
}
module.exports= {jwtAuthMiddleware,generateToken};