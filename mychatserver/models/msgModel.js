const mongoose = require("mongoose");

const msgModel = mongoose.Schema({
    sender : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    },
    reciever : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat"
    },
    content: {
        type: String,
        trim: true,
      },

},{
    timestamps:true
}) 


const  Message= mongoose.model("Message" , msgModel);
module.exports = Message;