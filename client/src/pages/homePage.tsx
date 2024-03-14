import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { v4 as uuidv4, validate as isValidUUID } from "uuid";
import { Button } from "../cssHelper/ui/button";
import { Input } from "@/cssHelper/ui/input";
import { motion } from "framer-motion";
import { useGetJoinedUsers } from "@/context/joinedUsersProvider";
import { useSocket } from "@/context/socketProvider";
import { Vortex } from "react-loader-spinner";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [roomId, setRoomId] = useState("");
  const {hostUserName, setHostUserName} = useGetJoinedUsers();
  const [callAccepted,setCallAccepted] = useState(false);
  const [loading,setLoading] = useState(false);
  const toastOptions: any = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  useEffect(() => {
    if(!socket) return;
    const handleCall = (answer:string)=>{
      if(answer==='Yes'){
        setCallAccepted(true);
      }else if(answer==='No'){
        toast.error(`Host rejected request to join the call`,toastOptions);
        setCallAccepted(false);
      }else{
        toast.error(answer,toastOptions);
        setCallAccepted(false);
      }
      setLoading(false);
    }
    socket.on('answer',handleCall);
    return () => {
      socket.off("answer", handleCall);
    };
  }, [socket])

  useEffect(()=>{
  if(callAccepted) navigate(`/${roomId}`);
  },[callAccepted])
  

  const joinRoom = () => {
    if (roomId) {
      if(!isValidUUID(roomId)){
        toast.error('Enter the valid Id',toastOptions);
        return;
      }
      setLoading(true);
      socket.emit('call-host',hostUserName,roomId);
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
            initial={{ x: -1000 }} 
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 120, duration: 1 }}
            className="text-white text-4xl font-bold text-wrap"
          >
            Connect face-to-face, no matter the place with Nexus Connect!
          </motion.div>
          <div className="flex items-center gap-3">
            <Button className="bg-white text-black hover:bg-gray-300" disabled={hostUserName===""||roomId!=""} onClick={createRoomandJoin}>
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
              onChange={(e) => setHostUserName(e.target.value)}
            />
            <Button 
              className="bg-white text-black hover:bg-gray-300" 
              disabled={hostUserName===""||roomId===""} 
              onClick={joinRoom}>
            Join Meet
            </Button>
          </div>
        </div>
      </div>
      {loading && (
         <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
         <div className="absolute">
           <Vortex />
         </div>
       </div>
      )}
      <ToastContainer />
      
    </div>
  );
};

export default HomePage;
