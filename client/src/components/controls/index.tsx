import { useEffect, useState } from "react";
import { useGetJoinedUsers } from "../../context/joinedUsersProvider";
import { MicOff, Mic, PhoneOff, Video, VideoOff, MessageSquareText, ScreenShareOff, ScreenShare, Copy } from "lucide-react";
import { useSocket } from "@/context/socketProvider";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MessageDialog from "./messageDialog";
interface msgObj {
  msg: String;
  type: String;
  sender: String;
  timeStamp: String;

};

const Controls = ({ peerId, fetchScreenStream, handleLeave, roomid }) => {
  const { setHostUser, setGuestUser, hostUserName, setScreenShare, screenShare, guestUser, guestUserName } = useGetJoinedUsers();
  const toastOptions: any = {
    position: "top-center",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    closeOnClick: true,
    onClick: () => toast.dismiss()
  };
  const [isMuteUser, setIsMuteUser] = useState(false);
  const [isDisablePlayer, setIsDisablePlayer] = useState(false);
  const [toggleScreenShare, setToggleScreenShare]=  useState(false);
  const [loading,setLoading] = useState(false);
  const [openChatDialog,setOpenChatDialog] = useState(false);
  const [allChats,setAllChats] = useState([]);
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
    console.log(guestUserName)
     toast(`${name ? name : 'user'} has left the room`,toastOptions);
     if(screenShare?.id && peerId!==screenShare?.id){
      screenShare.stream.getTracks().forEach(track => track.stop());
      setScreenShare(null);
    } 
     setGuestUser(null);
  }
  
  const handleRecieveMsg = (userName,msg)=>{
    const newMsg: msgObj = {
      msg: msg,
      sender: userName,
      type: 'rcv',
      timeStamp: Date.now().toString(),
    };
  
      toast(`${userName} has sent you a message`, {
        position: "top-center",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        onClick: () => {
          setOpenChatDialog(true);
          toast.dismiss(); 
        }
      });

    setAllChats((prevState)=> [...prevState,newMsg]);
  }
 
   socket.on('update-toggle-audio', handleUpdateToggleAudio);
   socket.on('update-toggle-video', handleUpdateToggleVideo);
   socket.on('msg-rcv',handleRecieveMsg);
   socket.on('user-left', handleUserLeft)
 
   return () => {
     // Cleanup the socket event listener when the component unmounts
     socket.off('update-toggle-audio', handleUpdateToggleAudio);
     socket.off('update-toggle-video', handleUpdateToggleVideo);
     socket.off('msg-rcv',handleRecieveMsg);
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

  const sendMsgHandler = (msg)=>{
    const newMsg: msgObj = {
      msg: msg,
      sender: hostUserName,
      type: 'send',
      timeStamp: Date.now().toString(),
    };
    setAllChats([...allChats,newMsg]);
    console.log(roomid)
    socket.emit('msg-user', roomid,hostUserName,msg);
  }

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
  
  // const handleLeaveRoom = ()=>{
  //     socket.emit('leave-room',roomid,hostUserName);
  //     navigate('/');
  //     window.location.reload();
  // }
  return (
    <div className="bottom-0 fixed p-3 h-[10%] w-full">
  <div className="flex items-center justify-between">
    <div className="group relative">
    <Copy  
      className="cursor-pointer" 
      color="white" 
      size={30} 
      onClick={() => {
       navigator.clipboard.writeText(roomid)
       toast(`Copied the code`,toastOptions);
       }
      } />
    <div className="z-50 w-20 absolute px-3 py-2 text-xs font-medium text-black transition-opacity duration-300 bg-white rounded-lg shadow-sm hidden dark:bg-gray-700 group-hover:block bottom-8 left-1">
    Copy the Code
   </div>
  </div>
    <div className='flex md:gap-5 xs:gap-3 items-center justify-center w-full'>
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
      <PhoneOff className="cursor-pointer" color="red" size={30} onClick={()=> {handleLeave()}} />
    </div>
    <MessageSquareText className="cursor-pointer" color="white" size={30} onClick = {()=>{setOpenChatDialog((prevState)=> !prevState)}} />
  </div>
  {openChatDialog && (
    <MessageDialog onClose = {()=>setOpenChatDialog((prevState)=> !prevState)} sendMsgHandler={sendMsgHandler} allChats={allChats} />
  )}
  <ToastContainer />
</div>

  );
};

export default Controls;
