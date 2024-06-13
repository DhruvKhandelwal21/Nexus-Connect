import { useEffect, useRef, useState } from "react";
import { usePeer } from "../hooks/usePeer";
import { useSocket } from "../context/socketProvider";
import { useGetJoinedUsers } from "../context/joinedUsersProvider";
import Player from "../components/player";
import Controls from "@/components/controls";
import { Button } from "@/cssHelper/ui/button";
import { ColorRing } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

const CallRoom = () => {
  const { peer, peerId, streamState, fetchScreenStream } = usePeer();
  const { socket } = useSocket();
  const {
    hostUserName,
    hostUser,
    setHostUser,
    guestUser,
    setGuestUser,
    setGuestUserName,
    guestId,
    setGuestId,
    hostId,
    setHostId,
    screenShare,
    setScreenShare,
  } = useGetJoinedUsers();
  const {roomid} = useParams();
  const navigate = useNavigate();

  const [openCallDialog, setOpenCallDialog] = useState({
    open: false,
    name: "",
    id: "",
  });
  const hostUserRef = useRef(null);
  const userReloadRef = useRef(null);

  if(!localStorage.getItem('username') || !hostUserName){
    localStorage.clear();
    navigate('/');
    window.location.reload();
  }

  useEffect(() => {
    if (!socket) return;
    const handleAnswerCall = (name: string, id: string) => {
      setOpenCallDialog({ open: true, name: name, id: id });
    };

    socket.on("call-answer", handleAnswerCall);
  }, [socket]);

  useEffect(()=>{
    hostUserRef.current = hostUser;
  },[hostUser])

  useEffect(() => {
    if (!streamState || !peerId) return;
    if (hostUser) {
      setHostUser((prevData) => ({ ...prevData, stream: streamState }));
    } else {
      setHostId(hostId);
      setHostUser({
        stream: streamState,
        playing: true,
        muted: false,
        userName: hostUserName,
      });
    }
  }, [peerId, streamState]);

  useEffect(() => {
    if (!guestUser) return;
    const options = { metadata: { name: hostUserName, type: 'call' } };
    const call = peer.call(guestId, streamState, options);
    call.on("stream", (incomingStream) => {
      console.log(incomingStream)  
    });
  }, [streamState]);

  //logic for making call to another peer for sharing screen

  useEffect(() => {
    if ( !guestId || !screenShare?.stream || screenShare?.id!=peerId) return;
    const options = { metadata: { name: hostUserName, screen:screenShare?.screen, type:'screen' } };
    const call = peer.call(guestId, screenShare?.stream, options);
    console.log(call)
    if(screenShare?.screen==false){
      screenShare?.stream.getTracks().forEach(track => track.stop());
      setScreenShare(null)
    }
  }, [screenShare, guestId]);

  useEffect(() => {
    if (!peer || !socket || !streamState) return;

    const handleUserConnected = (userId, name) => {
      setGuestId(userId);
      setGuestUserName(name);
      const currentHost = hostUserRef.current;
      const options = { metadata: { name: hostUserName,playing: currentHost.playing,muted:currentHost.muted, type:'call'} };
      const call = peer.call(userId, streamState, options);
      call.on("stream", (incomingStream) => {
        setGuestUser({
          stream: incomingStream,
          playing: true,
          muted: false,
          userName: name,
        });
      });
    };
  
    socket.on("user-connected", (userId, name) => {
      // console.log("Connected: ", userId,name);
      setTimeout(() => {
        handleUserConnected(userId, name);
      }, 1000);
    });

    return () => {
      socket.off("user-connected", handleUserConnected);
      // peer.off("call");
    };
  }, [peer, socket, streamState]);

  useEffect(() => {
    if (!peer || !streamState) return;
    peer.on("call", (call) => {
      const { peer: callerId, metadata: data } = call;
      const { name, playing, muted, screen, type } = data;
      if (type ==='call') {
        call.answer(streamState);
        call.on("stream", (stream) => {
          if (guestId) {
            //toggling video stream
            setGuestUser((prevState) => ({ ...prevState, stream: stream }));
          } else {
            // console.log(`stream recieved from ${callerId}`);
            setGuestUser({
              stream: stream,
              playing: playing,
              muted: muted,
              userName: name,
            });
            setGuestUserName(name);
            setGuestId(callerId);
          }
        });
      } 
      else if(type==='screen') {
          call.answer();
          call.on("stream", (stream) => {
            if(screen){
              if (!screenShare) {
                //setting stream first time
                setScreenShare({stream:stream,screen:true, id: callerId});
              }else{
                //logic for toggling screen share
                screenShare?.stream?.getTracks().forEach(track => track.stop());
                setScreenShare({stream:stream,screen:true, id: callerId});
              }
            }else{
              screenShare?.stream?.getTracks().forEach(track => track.stop());
              setScreenShare(null);
            }
          });
        }
    });
    return () => {
      peer.off("call");
    };
  }, [peer, streamState, guestId, screenShare]);

  useEffect(()=>{
      if(!socket) return;
      let timeoutId;
    const handleTimeout = () => {
      let response = 'Host not responding to call!'
      handleCallResponse(response);
    };
    if (openCallDialog.open) {
      timeoutId = setTimeout(handleTimeout, 20000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  },[socket,openCallDialog.open])

  useEffect(()=>{
      if(!socket) return;
    if(userReloadRef.current) return;
     userReloadRef.current = true;
     window.onpopstate = handleLeaveRoom;
     window.onbeforeunload = handleLeaveRoom;
     
    return () => {
    window.removeEventListener('popstate', handleLeaveRoom);
    window.removeEventListener('beforeunload',handleLeaveRoom)  
};
},[socket])

  const handleLeaveRoom = ()=>{
    const name = localStorage.getItem('username')
    if(!name) return;
    localStorage.clear();
    socket.emit('leave-room', roomid, name);
    navigate('/');
    window.location.reload();  
  }


  const handleCallResponse = (response: string) => {
    socket.emit("answer-to-guest", response, openCallDialog.id);
    setOpenCallDialog({ open: false, name: "", id: "" });
  };

  return (
    <div className="bg-slate-800 h-screen w-screen">
      <div
        className={`flex xs:flex-wrap md:flex-nowrap flex-row  ${
          guestUser ? "justify-between" : "justify-center"
        } h-[85vh] w-[100vw]`}
      >
       {screenShare ? (
          screenShare?.screen ? (
            <div className='w-full h-full xs:max-h-[65%] md:max-h-[100%] mt-5 p-2 flex justify-center'>
            <Player key={"567"} stream={screenShare.stream} screen={true} />
            </div>
          ) : (
            null
          )
        ) : null}
        
        {guestUser && (
          <div className={`${screenShare?.screen ? 'md:w-1/5 h-1/4 xs:w-1/3 justify-end mt-2' : 'w-full h-full xs:max-h-[65%] md:max-h-[100%] justify-center mt-5'}   px-2 flex relative`}>
            <Player
              key={guestId}
              stream={guestUser.stream}
              muted={guestUser.muted}
              playing={guestUser.playing}
              active={false}
              name={guestUser.userName}
            />
          </div>
        )}

        <div
          className={`${
            guestUser || screenShare?.screen
              ? "flex justify-end md:w-1/5 h-1/4 xs:w-1/3 mt-2 mr-2 relative"
              : "flex justify-center items-center mt-5 w-4/5 mx-auto h-full p-2 relative"
          }`}
        >
          {hostUser ? (
            <Player
              key={hostId}
              stream={hostUser.stream}
              muted={hostUser.muted}
              playing={hostUser.playing}
              active={true}
              name={hostUser.userName}
            />
          ) : (
            <ColorRing />
          )}
        </div>   
      </div>
      {hostUser && (
          <Controls peerId={peerId} fetchScreenStream={fetchScreenStream} handleLeave={handleLeaveRoom} roomid = {roomid} />
        )}
      {openCallDialog.open && (
        <div className="absolute bottom-10 right-10 sm:w-1/5 xs:w-1/2 h-20 z-10 bg-white rounded-lg">
          <div className="flex flex-col gap-1 p-2">
            <span>
              {" "}
              <span className="text-blue-500 font-semibold">
                {" "}
                {`${openCallDialog.name}`}
              </span>{" "}
              is calling you
            </span>
            <div className="flex justify-between">
              <Button
                className=""
                variant="default"
                size="sm"
                onClick={() => {
                  handleCallResponse("Yes");
                }}
              >
                Accept
              </Button>
              <Button
                className=""
                variant="destructive"
                size="sm"
                onClick={() => {
                  handleCallResponse("No");
                }}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallRoom;
