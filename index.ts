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
const io = require('socket.io')(server);

console.log(process.env.PORT)

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send({ message: "Hello World!" });
  });

  io.on('connection', (socket) => {
    socket.emit('connect', {message: 'a new client connected'})
})

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
