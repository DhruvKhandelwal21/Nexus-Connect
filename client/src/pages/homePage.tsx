import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { v4 as uuidv4, validate as isValidUUID } from "uuid";
import { Button } from "../cssHelper/ui/button";
import { Input } from "@/cssHelper/ui/input";
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
  if(callAccepted){ 
    localStorage.setItem('username',hostUserName);
    navigate(`/${roomId}`);
  }
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
    localStorage.setItem('username',hostUserName);
    const roomId = uuidv4();
    navigate(`/${roomId}`);
  };



  return (
    <>
      <div className=" justify-center items-center flex gap-10 pt-15 px-5 w-full h-full">
        <div className="flex flex-col gap-4 px-4 items-center justify-center">
          <p
            className="text-white text-4xl font-bold text-wrap xs:hidden md:block text-center"
          >
            Connect face-to-face, no matter the place with Nexus Connect!
          </p>
          <div className="flex flex-col items-center gap-3 md:w-1/3 xs:w-full mt-6">
            <Input
              className="w-full"
              type="text"
              placeholder="Enter room id"
              onChange={(e) => setRoomId(e.target.value)}
            />
            <Input
              className="w-full"
              type="text"
              placeholder="Enter Username"
              onChange={(e) => setHostUserName(e.target.value)}
            />
            <div className="flex gap-1 w-full">
            <Button className="bg-white text-black hover:bg-gray-300 w-1/2" disabled={hostUserName===""||roomId!=""} onClick={createRoomandJoin}>
              Create Meet
            </Button>
            <Button 
              className="bg-white text-black hover:bg-gray-300 w-1/2" 
              disabled={hostUserName===""||roomId===""} 
              onClick={joinRoom}>
            Join Meet
            </Button>
            </div>
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
      
    </>
  );
};

export default HomePage;
