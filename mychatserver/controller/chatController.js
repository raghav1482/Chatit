const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/msgModel");
const Request = require("../models/reqModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId ,myside,name} = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  // Check if a chat already exists between the two users
  const existingChat = await Chat.findOne({
    isGrpChat: false,
    users: { $all: [myside, userId] }
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (existingChat) { // Change this line
    console.log("Chat exists");
    res.send(existingChat);
  } else {
    // Create a new chat entry
    console.log("Creating new chat");
    var chatData = {
      chatName: name,
      isGrpChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});



  const fetchChats = asyncHandler(async (req, res) => {
    try {
    //   console.log("Fetch Chats aPI : ", req);
      Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: 1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name email",
          });
          res.status(200).send(results);
        });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });


const createGroupsChat = asyncHandler(async (req,res)=>{
    if(!req.body.users || !req.body.name){
        return res.sendStatus(400).send({message:"Data is insuff."})
    }

    var users = JSON.parse(req.body.users);
    users.push(req.user);
    users.push(req.user);

    try{
        const groupChat = await Chat.create({
            chatName:req.body.name,
            users:users,
            isGrpChat :true , 
            groupAdmin:req.user,
        });
        const fullGroupChat = await Chat.findOne({_id:groupChat.id}).populate("users","-password").populate("groupAdmin" , "-password");
        res.json(fullGroupChat);
    }catch(e){
        console.log("ERROR GROUP CHAT");
    }

});

const fetchGroups = asyncHandler(async (req, res) => {
  try {
      const allGroups = await Chat.find({ 'isGrpChat': true , users: { $nin: req.user }});
      res.status(200).send(allGroups); // Set status and send the response
  } catch (e) {
      res.status(400).send(e.message); // Set status and send the error message
  }
});



const groupExit = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  try {
      const removed = await Chat.findByIdAndUpdate(chatId, {
          $pull: { users: userId }
      }, { new: true })
          .populate("users", "-password")
          .populate("groupAdmin", "-password");

      if (!removed) {
          res.status(404).json({ message: "Chat not found" });
      } else {
          res.json(removed);
      }
  } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
  }
});



const searchChat = async (req, res) => {
  try {
    const { search_name, userId } = req.query;

    // Use a case-insensitive regex for searching chatName
    const result = await Chat.find({
      chatName: { $regex: new RegExp(search_name, 'i') },
      users: { $all: userId }
    }).populate("users", "-password").populate("latestMessage");

    if (result.length > 0) {
      // Respond with a 200 status code and the found chats
      res.status(200).json(result);
    } else {
      // Respond with a 404 status code and a meaningful message
      res.status(404).json({ error: "Chat not found" });
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error searching for chat:", error);
    
    // Respond with a 500 status code and a meaningful error message
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteGRP = async (req, res) => {
  const grpid  = req.query.grp_id;
  try {
    await Chat.deleteOne({ _id: grpid });
    res.status(200).json({ msg: "Group deleted successfully" });
  } catch (e) {
    console.error(e); // Log the error for debugging purposes
    res.status(400).json({ msg: "Error!" });
  }
};


const searchGrp = async (req, res) => {
  try {
    const { search_name, userId } = req.query;

    const result = await Chat.find({
      chatName: { $regex: new RegExp(search_name, 'i') },isGrpChat:true,users:{$nin:req.user}
    });


    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ msg: "Group not found" });
    }
  } catch (error) {
    console.error("Error searching for Group:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const reqGrp = async(req,res)=>{
  try{
    const {req_id,group_id,grpAdmin} = req.body;
    if(req_id!=grpAdmin){
      const temp = await Request.find({req_id,group_id});
      if(temp.length<=0){
        const request = await Request.create(req.body);
        res.json(request);
      }
      else{
        throw "Request already sent!!";
      }
    }
    else{
      const added = await Chat.findByIdAndUpdate(group_id,{$push:{users:req_id}},{new:true}).populate("users","-password").populate("groupAdmin","-password");
      if(!added){
        res.sendStatus(404);
        res.send("Group Not Found");
      }else{
        res.json(added);
      }
    }
  }catch(e){res.status(400).json({msg:"Request already sent"})};
}


const getreq = async(req,res)=>{
  const { grp_id } = req.query;
  try{
    const allreq = await Request.find({group_id:grp_id}).populate("req_id","-password");
    res.status(200).json(allreq);
  }catch(e){console.log(e)};
}

const grpaccept = async(req,res)=>{
  const {grpId , userId} = req.body;
  try{
    const added = await Chat.findByIdAndUpdate(grpId,{$push:{users:userId}},{new:true}).populate("users","-password").populate("groupAdmin","-password");
    if(!added){
      res.sendStatus(404);
      res.send("Chat Not Found");
    }else{
      const del = await Request.deleteOne({req_id:userId});
      res.json(added);
    }
  }catch(e){console.log(e);}
}

const grpreject = async (req, res) => {
  try {
    const requestId  = req.query.id;
    const result = await Request.deleteOne({req_id:requestId});
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = {accessChat ,searchChat,deleteGRP, fetchChats , fetchGroups , groupExit,createGroupsChat,searchGrp,reqGrp,getreq,grpaccept,grpreject}