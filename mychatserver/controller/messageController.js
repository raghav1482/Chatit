const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/msgModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const allMessages = expressAsyncHandler(async (req,res)=>{
    try{
        const messages = await Message.find({chat:req.params.chatId}).populate("sender","name email image").populate("reciever").populate("chat");
        res.json(messages);
    }catch(e){
        res.status(400);
        throw new Error(error.message);
    }
})


const sendMessage = expressAsyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
  
    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
  
    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };
  
    try {
      var message = await Message.create(newMessage);

      message = await message.populate("sender", "name pic");
      message = await message.populate("chat");
      message = await message.populate("reciever");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name email",
      });
  
      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
      res.json(message);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });
  

module.exports = {allMessages , sendMessage};