import { useEffect, useState } from "react";
import { useGetJoinedUsers } from "../../context/joinedUsersProvider";
import { MicOff, Mic, PhoneOff, Video, VideoOff, MessageSquareText } from "lucide-react";
import { useSocket } from "@/context/socketProvider";
import { useNavigate, useParams } from "react-router-dom";
import { cloneDeep } from "lodash";

const Controls = ({ peerId }) => {
  const navigate = useNavigate();
  const {roomid} = useParams();
  const { joinedUsers, setJoinedUsers } = useGetJoinedUsers();
  const [isMuteUser, setIsMuteUser] = useState(false);
  const [isDisablePlayer, setIsDisablePlayer] = useState(false);
  const {socket} = useSocket();

  const handleToggleMic = () => {
    setIsMuteUser((prevIsMuteUser) => !prevIsMuteUser);
    setJoinedUsers((prevJoinedUsers) => ({
      ...prevJoinedUsers,
      [peerId]: {
        ...prevJoinedUsers[peerId],
        muted: !prevJoinedUsers[`${peerId}`]?.muted,
      },
    }));
    socket.emit('toggle-audio',roomid,peerId);
  };

  const handleToggleVideo = () => {
    setIsDisablePlayer((prevIsDisableUser) => !prevIsDisableUser)
    setJoinedUsers((prevJoinedUsers) => ({
      ...prevJoinedUsers,
      [peerId]: {
        ...prevJoinedUsers[peerId],
        playing: !joinedUsers[`${peerId}`]?.playing,
      },
    }));
    socket.emit('toggle-video',roomid,peerId);
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
   
  const handleToggleV = (userId)=>{
    setJoinedUsers((prevJoinedUsers) => ({
      ...prevJoinedUsers,
      [userId]: {
        ...prevJoinedUsers[userId],
        playing: !prevJoinedUsers[`${userId}`]?.playing,
      },
    }));
  }


   const handleUpdateToggleAudio = (userId) => {
    setTimeout(() => {
      handleToggle(userId);
    }, 1000);
  };

  const handleUpdateToggleVideo = (userId) => {
    setTimeout(() => {
      handleToggleV(userId);
    }, 1000);
  };

  const handleUserLeft = (userId)=>{
    const data = cloneDeep(joinedUsers);
    delete data[userId];
    setJoinedUsers(data);
  }

  socket.on('update-toggle-audio', handleUpdateToggleAudio);
  socket.on('update-toggle-video', handleUpdateToggleVideo);
  socket.on('user-left', handleUserLeft)

  return () => {
    // Cleanup the socket event listener when the component unmounts
    socket.off('update-toggle-audio', handleUpdateToggleAudio);
    socket.off('update-toggle-video', handleUpdateToggleVideo);
    socket.off('user-left',handleUserLeft)
  };
  }, [socket])
  
  const handleLeaveRoom = ()=>{
      socket.emit('leave-room',roomid,peerId);
      navigate('/');
      window.location.reload();
  }
  return (
    <div className="bottom-0 fixed p-3 h-[10%] w-full">
  <div className="flex items-center justify-between">
    <span className='font-semibold text-sm text-white'>{`${roomid}`}</span>
    <div className='flex gap-5 items-center justify-center w-full'>
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
    <MessageSquareText className="cursor-pointer" color="white" size={30} />
  </div>
</div>

  );
};

export default Controls;
