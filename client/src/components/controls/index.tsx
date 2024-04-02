import { useEffect, useRef, useState } from "react";
import { useGetJoinedUsers } from "../../context/joinedUsersProvider";
import { MicOff, Mic, PhoneOff, Video, VideoOff, MessageSquareText, ScreenShareOff, ScreenShare } from "lucide-react";
import { useSocket } from "@/context/socketProvider";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Controls = ({ peerId, fetchScreenStream }) => {
  const navigate = useNavigate();
  const {roomid} = useParams();
  const { setHostUser, setGuestUser, hostUserName, setScreenShare, screenShare, guestUser } = useGetJoinedUsers();
  const toastOptions: any = {
    position: "top-center",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };
  const [isMuteUser, setIsMuteUser] = useState(false);
  const [isDisablePlayer, setIsDisablePlayer] = useState(false);
  const [toggleScreenShare, setToggleScreenShare]=  useState(false);
  const [loading,setLoading] = useState(false);
  const {socket} = useSocket();

  useEffect(() => {
    if(!socket) return;
    const handleToggle = ()=>{
     setGuestUser((prevJoinedUsers) => ({
       ...prevJoinedUsers, muted: !prevJoinedUsers?.muted
     }));
   }
    
   const handleToggleV = ()=>{
     setGuestUser((prevJoinedUsers) => ({
       ...prevJoinedUsers, playing: !prevJoinedUsers?.playing
     }));
   }
 
    const handleUpdateToggleAudio = (userId) => {
     setTimeout(() => {
       handleToggle();
     }, 1000);
   };
 
   const handleUpdateToggleVideo = (userId) => {
     setTimeout(() => {
       handleToggleV();
     }, 1000);
   };
 
   const handleUserLeft = (name)=>{
     toast(`${name} has left the room`,toastOptions);
     if(screenShare?.id && peerId!==screenShare?.id){
      screenShare.stream.getTracks().forEach(track => track.stop());
      setScreenShare(null);
    } 
     setGuestUser(null);
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
   }, [socket,screenShare])

   useEffect(() => {
      if(screenShare?.stream){
        if(screenShare?.id && peerId!==screenShare?.id){
          setToggleScreenShare(false);
        }    
      }
   }, [screenShare])

  const handleToggleMic = () => {
    setIsMuteUser((prevIsMuteUser) => !prevIsMuteUser);
    setHostUser((prevJoinedUsers) => ({
      ...prevJoinedUsers, muted: !prevJoinedUsers?.muted
    }));
    socket.emit('toggle-audio',roomid,peerId);
  };

  const handleToggleVideo = () => {
    setIsDisablePlayer((prevIsDisableUser) => !prevIsDisableUser)
    setHostUser((prevJoinedUsers) => ({
      ...prevJoinedUsers, playing: !prevJoinedUsers?.playing
    }));
    socket.emit('toggle-video',roomid,peerId);
  };

  const handleScreenShareEnded = () => {
    if (screenShare && screenShare.stream) {
      screenShare.stream.getTracks().forEach(track => track.stop());
  }
  setScreenShare((prevState)=>({...prevState,screen:!prevState?.screen}))
    setToggleScreenShare(false);
    setLoading(false);
  };

  const handleToggleScreenShare = async ()=>{
    if(toggleScreenShare){
      screenShare?.stream?.getTracks().forEach(track => track.stop());
      if(guestUser){
        setScreenShare((prevState)=>({...prevState,screen:!prevState?.screen}))
      }else{
        setScreenShare(null);
      } 
      setToggleScreenShare((prevState)=> !prevState);
    }else{
      setLoading(true);
      try{
        if(!screenShare?.stream){
          const stream = await fetchScreenStream();
          stream.getTracks().forEach(track => {
            track.addEventListener('ended', handleScreenShareEnded);
          });
          setScreenShare({stream:stream,screen: true, id: peerId});
        }else{
          setScreenShare((prevState)=>({...prevState,screen:!prevState?.screen}))
          const stream = await fetchScreenStream();
          stream.getTracks().forEach(track => {
            track.addEventListener('ended', handleScreenShareEnded);
          });
          setScreenShare({stream:stream,screen: true,id: peerId});
        }
        setToggleScreenShare((prevState)=> !prevState); 
        setLoading(false);
      }catch(e){
        setLoading(false);
      }
    }
  }
  
  const handleLeaveRoom = ()=>{
      socket.emit('leave-room',roomid,hostUserName);
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
      {toggleScreenShare ? (
        <ScreenShareOff className="cursor-pointer" color="white" size={30} onClick={handleToggleScreenShare} />
      ):(
        <ScreenShare className="cursor-pointer" aria-disabled={loading} color="white" size={30} onClick={handleToggleScreenShare} />
      )}
      <PhoneOff className="cursor-pointer" color="red" size={30} onClick={handleLeaveRoom} />
    </div>
    <MessageSquareText className="cursor-pointer" color="white" size={30} />
  </div>
  <ToastContainer />
</div>

  );
};

export default Controls;
