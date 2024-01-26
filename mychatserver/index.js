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
app.use(express.json({limit:'50mb'}));
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true,limit:"500mb"}));

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

io.on("connection",async(socket)=>{
    const userId = socket.handshake.query.userId;
    socket.emit("connected",userId);
    await User.findByIdAndUpdate(userId, { online: true });
    socket.broadcast.emit("userOnline",userId);
    
    
    socket.on("join chat",({room,socketid})=>{
        socket.join(room);
    });

    socket.on('join-call-room', ({ room, mypeerid }) => {
        socket.join(room);
        console.log(`User joined room ${room} with peer ID ${mypeerid}`);
        
        // Here, you can use the mypeerid as the remote peer ID for simplicity
        const remoteid = mypeerid;
        
        // Emit the event to the user who just joined
        socket.emit('joined-room-call', { remoteid });
        
        // Broadcast to other users in the room (if needed)
        socket.to(room).emit('joined-room-call', { remoteid });
      });

      socket.on('call-disconnected', ({ room,remotePeerId }) => {
        // Handle call disconnection
        console.log(`Call disconnected for remote peer ID: ${remotePeerId}`);
        
        // You can broadcast this information to other users in the same room if needed
         // Implement your logic to get the room based on peer ID
        socket.to(room).emit('call-disconnected', { room,remotePeerId });
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
