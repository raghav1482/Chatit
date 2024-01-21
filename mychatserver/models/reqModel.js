const mongoose = require("mongoose");
const User = require("./userModel");
const reqModel = mongoose.Schema({
    req_id:{type:mongoose.Schema.Types.ObjectId , ref:"User"},
    group_id:{type:mongoose.Schema.Types.ObjectId , ref:"Chat"}
})

const Request = mongoose.model("Request",reqModel);
module.exports = Request;