// socketService.js
import io from 'socket.io-client';

const socket = io("https://chatitserver.onrender.com");

const connectToSocket = (userId) => {
    socket.io.opts.query = { userId };
    if(userId){
        socket.connect();
    }
    else{
        return;
    }
};

const disconnectFromSocket = () => {
  socket.disconnect();
};

// Save socket connection information in sessionStorage
const saveSocketConnection = () => {
  sessionStorage.setItem('socketId', socket.id);
};

// Re-establish socket connection using the saved information
const reestablishSocketConnection = (userId) => {
  const savedSocketId = sessionStorage.getItem('socketId');
  if (savedSocketId) {
    socket.io.opts.query = { savedSocketId ,userId};
    connectToSocket(userId);
  }
};

export { connectToSocket, disconnectFromSocket, saveSocketConnection, reestablishSocketConnection, socket };
