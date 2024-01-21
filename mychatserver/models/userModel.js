const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = mongoose.Schema({
    name : {type:String,required:true},
    email : {type:String,required:true},
    password :{type:String , required:true},
    image:{type:String},
    online:{type:Boolean}
},{
    timestamp:true
})

userModel.methods.matchPassword = async function (enterpass){
    return await bcrypt.compare(enterpass,this.password);
}

userModel.pre("save",async function (next){
    if(!this.isModified){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password , salt);
});

const User = mongoose.model("User" , userModel);
module.exports = User;