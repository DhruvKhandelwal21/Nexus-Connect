import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {v4 as uuidv4} from 'uuid'
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
      <button onClick={createRoomandJoin}>Create Meet</button>
      <input
        type="text"
        placeholder="Enter room id"
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={joinRoom}>Join Meet</button>
    </div>
  );
};

export default HomePage;
