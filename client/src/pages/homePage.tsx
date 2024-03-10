import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";
import { Button } from "../cssHelper/ui/button";
import { Input } from "@/cssHelper/ui/input";
import { motion } from "framer-motion";
import { useGetJoinedUsers } from "@/context/joinedUsersProvider";
const HomePage = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  // const [userName,setUserName] = useState("");
  const {userName, setUserName} = useGetJoinedUsers();

  const joinRoom = () => {
    if (roomId) {
      navigate(`/${roomId}`);
    } else {
      alert("Fuck you");
    }
  };
  const createRoomandJoin = () => {
    const roomId = uuidv4();
    navigate(`/${roomId}`);
  };

  return (
    <div className="relative">
      <div className="absolute flex gap-10 mt-40 pt-15 px-5 w-1/2">
        <div className="flex flex-col gap-4 px-4">
          <motion.div
            initial={{ x: -1000 }} // Initial position off-screen to the left
            animate={{ x: 0 }} // Final position (centered)
            transition={{ type: "spring", stiffness: 120, duration: 1 }}
            className="text-white text-4xl font-bold text-wrap"
          >
            Connect face-to-face, no matter the place with Nexus Connect!
          </motion.div>
          <div className="flex items-center gap-3">
            <Button className="bg-white text-black hover:bg-gray-300" disabled={userName===""} onClick={createRoomandJoin}>
              Create Meet
            </Button>
            <Input
              className="w-1/2"
              type="text"
              placeholder="Enter room id"
              onChange={(e) => setRoomId(e.target.value)}
            />
            <Input
              className="w-1/4"
              type="text"
              placeholder="Enter Username"
              onChange={(e) => setUserName(e.target.value)}
            />
            <Button 
              className="bg-white text-black hover:bg-gray-300" 
              disabled={userName===""||roomId===""} 
              onClick={joinRoom}>
            Join Meet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
