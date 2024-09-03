const express=require('express')
const app=express()

const path=require('path')
const bodyParser=require('body-parser');
app.use(bodyParser.json());
const mongoose =require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Voters').then((e)=>console.log("Mongodb connected"));
const PORT=process.env.PORT||3001;


//Routes
const userRoutes=require('./routes/userRoute');
const candidateRoutes=require('./routes/candidateRoute');
app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);


app.listen(PORT,()=>{
    console.log('listening on port 3001');
})