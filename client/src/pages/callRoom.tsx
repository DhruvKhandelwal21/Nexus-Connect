import { useEffect } from 'react'
import { usePeer } from '../hooks/usePeer'
import { useSocket } from '../context/socketProvider'
import { useGetJoinedUsers } from '../context/joinedUsersProvider';
import { useMediaPlayer } from '../hooks/useMediaPlayer'
import Player from '../components/player';


const CallRoom = () => {
  const {streamState} = useMediaPlayer();
  const {peer,peerId} = usePeer();
  const {socket} = useSocket();
  const {joinedUsers, setJoinedUsers} = useGetJoinedUsers();
console.log(joinedUsers)

  useEffect(() => {
    if(!peer || !streamState || !socket ) return;
   
    const handleUserConnected = (userId)=>{
      console.log(userId)
     const call = peer.call(userId,streamState)
     call.on('stream',(incomingStream)=>{
      setJoinedUsers(prevJoinedUsers => ({
        ...prevJoinedUsers,
        [userId]: { stream: incomingStream, playing: true, muted: false }
    }));
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
        setJoinedUsers(prevJoinedUsers => ({
          ...prevJoinedUsers,
          [callerId]: { stream: stream, playing: true, muted: false }
      }));
      });
    })
  }, [peer,streamState])

  useEffect(() => {
    if (!streamState || !peerId) return;
    console.log(`setting my stream ${peerId}`);
    setJoinedUsers((prev) => ({
      ...prev,
      [peerId]: {
        stream: streamState,
        muted: true,
        playing: true,
      },
    }));
  }, [peerId, setJoinedUsers, streamState]);
  
  return (
    <div>
      {Object.keys(joinedUsers)?.map((userId:any)=> <Player key={userId} stream = {joinedUsers[userId].stream} playing = {joinedUsers[userId].playing} muted = {joinedUsers[userId].muted} />)}
     
    </div>
  )
}

export default CallRoom