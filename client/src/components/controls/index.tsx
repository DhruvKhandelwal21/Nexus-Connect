import { useEffect, useState } from "react";
import { useGetJoinedUsers } from "../../context/joinedUsersProvider";
import { MicOff, Mic, PhoneOff, Video, VideoOff } from "lucide-react";
import { useSocket } from "@/context/socketProvider";
import { useNavigate, useParams } from "react-router-dom";
import cloneDeep from 'lodash'

const Controls = ({ peerId }) => {
  const navigate = useNavigate();
  const {roomid} = useParams();
  const { joinedUsers, setJoinedUsers } = useGetJoinedUsers();
  console.log(joinedUsers)
  const [isMuteUser, setIsMuteUser] = useState(false);
  const [isDisablePlayer, setIsDisablePlayer] = useState(false);
  const {socket} = useSocket();

  const handleToggleMic = () => {
    setIsMuteUser(!isMuteUser);
    setJoinedUsers((prevJoinedUsers) => ({
      ...prevJoinedUsers,
      [peerId]: {
        ...prevJoinedUsers[peerId],
        muted: !prevJoinedUsers[`${peerId}`]?.muted,
      },
    }));
    socket.emit('toggle-audio',roomid,peerId);
  };

  useEffect(() => {
   if(!socket) return;
   const handleToggle = (userId)=>{
    setJoinedUsers((prevJoinedUsers) => ({
      ...prevJoinedUsers,
      [userId]: {
        ...prevJoinedUsers[userId],
        muted: !prevJoinedUsers[`${userId}`]?.muted,
      },
    }));
  }

   const handleUpdateToggleAudio = (userId) => {
    setTimeout(() => {
      handleToggle(userId);
    }, 1000);
  };

  socket.on('update-toggle-audio', handleUpdateToggleAudio);

  return () => {
    // Cleanup the socket event listener when the component unmounts
    socket.off('update-toggle-audio', handleUpdateToggleAudio);
  };
  }, [socket])
  

  const handleToggleVideo = () => {
    setIsDisablePlayer(!isDisablePlayer)
    setJoinedUsers((prevJoinedUsers) => ({
      ...prevJoinedUsers,
      [peerId]: {
        ...prevJoinedUsers[peerId],
        playing: !joinedUsers[`${peerId}`]?.playing,
      },
    }));
  };

  const handleLeaveRoom = ()=>{
      socket.emit('leave-room',roomid,peerId);
      navigate('/');
      window.location.reload();
  }
  return (
    <div className="bottom-0 fixed p-6 w-full">
      <div className="flex justify-center gap-7">
        {isMuteUser ? (
          <MicOff className="cursor-pointer" color="red" size={30} onClick={handleToggleMic} />
        ) : (
          <Mic className="cursor-pointer" color="white" size={30} onClick={handleToggleMic} />
        )}
        {isDisablePlayer ? (
          <VideoOff className="cursor-pointer" color="red" size={30} onClick={handleToggleVideo} />
        ) : (
          <Video className="cursor-pointer" color="white" size={30} onClick={handleToggleVideo} />
        )}
        <PhoneOff className="cursor-pointer" color="red" size={30} onClick={handleLeaveRoom} />
      </div>
    </div>
  );
};

export default Controls;
