const express = require('express');
const { resolve } = require('path');
const mongoose=require("mongoose")
require("dotenv").config()
const User=require("./schema")


mongoose.connect(process.env.mongodb)
.then(()=>{console.log("Connected to database")})
.catch((err)=>{console.error("Error connecting to database",err)})

const app = express();
const port = 3010;

app.use(express.json())


app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/api/users',async (req,res)=>{

  try {

    let newUser=new User(req.body)
    await newUser.save()

    res.status(201).json({message:"User created successfully"})
    
  } catch (error) {
    if(error.name=="ValidationError"){
        res.status(500).json({message:error.message})
    }
    if(error.errorResponse.code=="11000"){
      res.status(500).json({message:"email should be different"})
    }

    res.status(500).json({message:error})


    console.log(error)
  
  }




})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
