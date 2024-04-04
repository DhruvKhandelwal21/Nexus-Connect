import express from "express";
import cors from "cors";
//The * symbol indicates that all exports should be imported, 
//and as dotenv renames the imported module to dotenv.
import * as dotenv from "dotenv";
const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  },
});

console.log(process.env.PORT)

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send({ message: "Hello World!" });
  });

  io.on('connection', (socket) => {
    //connection with client is represented by this socket
    socket.on('call-host',(name,roomId)=>{
      if(!io.sockets.adapter.rooms.get(roomId)){
        io.to(socket.id).emit('answer',("Invalid Room Id"));
        return;
    }else if(io.sockets.adapter.rooms.get(roomId).size >1){
      io.to(socket.id).emit('answer',("Someone is in room, Come later!"));
      return;
    }

      socket.broadcast.to(roomId).emit('call-answer', name,socket.id);
    })
   
    socket.on('answer-to-guest',(answer,id)=>{
      console.log(answer)
      io.to(id).emit('answer',(answer));
    })
    socket.on('join-room', (roomId, userId,name) => {
      console.log(`a new user ${name} joined room ${roomId}`)
      socket.join(roomId)
      socket.broadcast.to(roomId).emit('user-connected', userId, name)
  })
  socket.on('leave-room', (roomId, userId) => {
    console.log(`a  user ${userId} left  joined room ${roomId}`)
    socket.leave(roomId)
    socket.broadcast.to(roomId).emit('user-left', userId)
})
socket.on("msg-user", (roomid, name, msg) => {
  socket.broadcast.to(roomid).emit('msg-rcv', name, msg);
});
  socket.on('toggle-audio',(roomId,userId)=>{
    socket.broadcast.to(roomId).emit('update-toggle-audio', userId)
  })
  socket.on('toggle-video',(roomId,userId)=>{
    socket.broadcast.to(roomId).emit('update-toggle-video', userId)
  })
})

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
