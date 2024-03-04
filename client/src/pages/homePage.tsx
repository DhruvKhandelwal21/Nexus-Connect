import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {v4 as uuidv4} from 'uuid'
import { Button } from "../cssHelper/ui/button";
const HomePage = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  const joinRoom = () => {
    if(roomId){
      navigate(`/${roomId}`)
    }else{
      alert("Fuck you")
    }  
  };
  const createRoomandJoin = () => {
    const roomId = uuidv4();
    navigate(`/${roomId}`)
  };

  return (
    <div>
      <Button onClick={createRoomandJoin}>Create Meet</Button>
      <input
        type="text"
        placeholder="Enter room id"
        onChange={(e) => setRoomId(e.target.value)}
      />
      <Button onClick={joinRoom}>Join Meet</Button>
    </div>
  );
};

export default HomePage;
