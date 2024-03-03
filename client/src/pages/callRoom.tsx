import React, { useEffect } from 'react'
import { usePeer } from '../hooks/usePeer'
import { useSocket } from '../context/socketProvider'
import { useMediaPlayer } from '../hooks/useMediaPlayer'


const CallRoom = () => {
  const {streamState} = useMediaPlayer();
  const {peer,peerId} = usePeer();
  const {socket} = useSocket();


  useEffect(() => {
    if(!peer || !streamState || !socket ) return;
   
    const handleUserConnected = (userId)=>{
      console.log(userId)
     const call = peer.call(userId,streamState)
     call.on('stream',(incomingStream)=>{
      console.log(incomingStream);
      console.log(`recieved stream from ${userId}`);
     })
    }
    
    socket.on('user-connected', (userId) => {
      console.log("Connected: ", userId)
      setTimeout(() => {
        handleUserConnected(userId)
      }, 1000);
      })

    return () => {
      socket.off("user-connected", handleUserConnected);
    };
  }, [peer,streamState,socket])

  useEffect(() => {
    if(!peer || !streamState) return;
    peer.on('call',(call)=>{
      const { peer: callerId } = call;
      console.log(callerId);
      call.answer(streamState);
      call.on('stream', (stream)=>{
        console.log(`stream recieved from ${callerId}`);
      });
    })
  }, [peer,streamState])
  
  return (
    <div>
      {/* <ReactPlayer url = {streamState} playing /> */}
    </div>
  )
}

export default CallRoom