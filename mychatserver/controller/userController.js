const express = require("express");
const User = require("../models/userModel");
const expresAsyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const expressAsyncHandler = require("express-async-handler");
require("dotenv").config();
const cloudinary = require('cloudinary').v2;

const name = process.env.CLD_NAME;
const key = process.env.CLD_KEY;
const secret = process.env.CLD_SCRT;

cloudinary.config({ 
  cloud_name: name, 
  api_key: key, 
  api_secret: secret 
});


const loginController = expresAsyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ name });

  if (user) {
      if (await user.matchPassword(password)) {
          await User.updateOne({ name: name }, { online: true }).then(() => {
              res.status(200).json({
                  message: "Login Successful",
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  isAdmin: user.isAdmin,
                  token: generateToken(user._id),
                  image: user.image
              });
          });
      } else {
          res.status(400).json({ message: "Wrong credentials !!!" });
          throw new Error("Wrong credentials !!!");
      }
  } else {
      res.status(400).json({ message: "Please Signup First!!!" });
      throw new Error("Please Signup First !!!");
  }
});




const regController =expresAsyncHandler( async(req,res)=>{
    try{
    const {name , email , password} = req.body;
    
    // check all fields
    if(!name || !email || !password){
        res.sendStatus(400);
        throw Error("Please fill all fields");
    }

    //pre existing user
    const userExist = await User.findOne({email:email});
    if(userExist){
        res.sendStatus(405);
        throw new Error("User already exist");
    }

    //userName already Taken
    const userNameExist =  await User.findOne({name});
    if(userNameExist){
        res.sendStatus(406);
        throw new Error("Username already taken");
    }

    //create user in db 
    const user = await  User.create({name , email , password});
    if(user){
        res.status(200).json({message:"Signup Successfull",_id:user._id , name:user.name , email:user.email , isAdmin:user.isAdmin , token:generateToken(user._id)})
    }
    else{
        res.status(400);
        throw new Error("Registration Error");
    }
}catch(e){console.log("ERROR : "+e)}});


const fetchAllUsersController = expresAsyncHandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
  
    const users = await User.find(keyword).find({
      _id: { $ne: req.user._id },
    }).select('-password');
    res.send(users);
  });

  const searchUser = async(req,res)=>{
    const {search_name}=req.query;
    const result = await User.find({ name: { $regex: new RegExp(search_name, 'i') } }).select('-password');

  
    if(result.length>0){
      res.status(200).json(result);
    }
    else{
      res.status(404).json({msg:"User NOT Found !!"});
    }
  }


  const picupload = expressAsyncHandler(async (req, res) => {
      try {
          // Assuming you have a base64-encoded image in the request body
          const base64Image = req.body.data;

          // Upload the base64-encoded image to Cloudinary
          const result = await cloudinary.uploader.upload(base64Image, {
            upload_preset: 'chat_pic' // Optional: Set the folder where you want to store the uploaded files
          });

          // You can access the public URL of the uploaded file using result.secure_url
          res.json({image:result.public_id + '.' + result.format});
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
  });


  const updateusr = expressAsyncHandler(async (req, res) => {
    try {
      const { userid, image } = req.body;
  
      const user = await User.findByIdAndUpdate(
        { _id: userid },
        { $set: { image: image } },
        { new: true, useFindAndModify: false }
      );
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ msg: 'User updated successfully', image:user.image });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  const online = async (req, res) => {
    const { userid } = req.query;
  
    try {
      const result = await User.findById(userid, { online: 1, _id: 0 }); // Include only the 'online' field
  
      if (result) {
        res.status(200).json({ online: result.online });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  const logout = async(req,res)=>{
    const {userId} = req.body;
    try{
      await User.findByIdAndUpdate(userId , {online:false}).then(()=>{res.json({msg : userId + " ONLINE"})})
    }catch(error){
      res.status(400);
      console.log(e);
    }
  }
  

module.exports = {loginController ,logout,searchUser, regController , fetchAllUsersController,picupload,updateusr,online};