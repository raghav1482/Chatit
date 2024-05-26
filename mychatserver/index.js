const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const msgRoutes = require("./routes/msgRoutes");
const bodyParser = require("body-parser")
const cors=require("cors");
const User = require("./models/userModel");
const app = express();
dotenv.config();
const DB = process.env.DATABASE;
app.use(express.json({limit:'100mb'}));
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true,limit:"5000mb"}));

app.use(cors(
    {
        origin:"*",
        credentials:true
    }
))

// Connection 
const connectDB = async()=>{
    try{
        await mongoose.connect(DB).then((res)=>{
            console.log("DB CONNECTED");
        });
    }catch(e){
        console.log("DB not Connected");
    }
}
connectDB();


const PORT = process.env.PORT;
app.get("/" , (req , res)=>{
    res.send("hello");
})

app.use("/user",userRoutes);
app.use("/chat",chatRoutes);
app.use("/message",msgRoutes);

// console.log(process.env.DATABASE);

const server=app.listen(PORT , console.log("Server is running...",PORT));

const io = require("socket.io")(server,{
    cors:{
        origin:"*",
    },
    pingTimeout:60000,
});

const userPeer = new Map();
io.on("connection",async(socket)=>{
    const userId = socket.handshake.query.userId;
    await User.findByIdAndUpdate(userId, { online: true });
    socket.broadcast.emit("userOnline",userId);
    socket.emit("connected",userId);
    
    
    socket.on("join chat",({room,socketid})=>{
        socket.join(room);
    });
    socket.on('join-call-room', ({ room, mypeerid ,myuserid}) => {
        socket.join(room);
        userPeer.set(myuserid,mypeerid);

        
        // Here, you can use the mypeerid as the remote peer ID for simplicity
        const remoteid = mypeerid;
        
        // Emit the event to the user who just joined
        socket.emit('joined-room-call', { remoteid,userPeer: Object.fromEntries(userPeer)  });
        
        // Broadcast to other users in the room (if needed)
        socket.to(room).emit('joined-room-call', { remoteid });
        socket.emit('usersBeforeYou', {userPeer: Object.fromEntries(userPeer) });
        socket.on("call-disconnected",(data)=>{
            socket.to(data.room).emit("call-off");
        })
      });

    socket.on("new message", (newMsg) => {
        var chat = newMsg.data.chat;
        socket.to(chat._id).emit("messageReceived", newMsg); // Fix the event name here
    }); 
    socket.on('disconnect', async() => {
        // Handle disconnection logic here
        await User.findByIdAndUpdate(userId, { online: false });
        socket.broadcast.emit("userOffline",userId);
    });
    
});
