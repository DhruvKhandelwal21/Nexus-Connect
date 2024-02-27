import express from "express";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors());

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send({ message: "Hello World!" });
  });

  io.on('connection', (socket) => {
    socket.emit('connect', {message: 'a new client connected'})
})

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
