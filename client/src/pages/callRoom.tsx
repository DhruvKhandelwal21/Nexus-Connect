import { useEffect, useState } from "react";
import { usePeer } from "../hooks/usePeer";
import { useSocket } from "../context/socketProvider";
import { useGetJoinedUsers } from "../context/joinedUsersProvider";
import { useMediaPlayer } from "../hooks/useMediaPlayer";
import Player from "../components/player";
import Controls from "@/components/controls";
import { cloneDeep, isEmpty } from "lodash";

const CallRoom = () => {
  const { streamState } = useMediaPlayer();
  const { peer, peerId } = usePeer();
  const { socket } = useSocket();
  const { userName, joinedUsers, setJoinedUsers } = useGetJoinedUsers();
  const [hostPlayer, setHostPlayer] = useState(null);
  const [guestPlayers, setGuestPlayers] = useState({});

  useEffect(() => {
    const data = cloneDeep(joinedUsers);
    const highlightedPlayer = data[peerId];
    delete data[peerId];
    const nonHighlightedPlayer = data;
    setHostPlayer(highlightedPlayer);
    setGuestPlayers(nonHighlightedPlayer);
  }, [joinedUsers]);



  useEffect(() => {
    if (!peer || !streamState || !socket) return;

    const handleUserConnected = (userId, name) => {
      console.log(userId);
      console.log(name)
      const options = {metadata: {"name":userName}};
      const call = peer.call(userId, streamState, options);
      call.on("stream", (incomingStream) => {
        setJoinedUsers((prevJoinedUsers) => ({
          ...prevJoinedUsers,
          [userId]: { stream: incomingStream, playing: true, muted: false, userName: name },
        }));
        console.log(incomingStream);
        console.log(`recieved stream from ${userId}`);
      });
    };

    socket.on("user-connected", (userId,name) => {
      console.log("Connected: ", userId,name);
      setTimeout(() => {
        handleUserConnected(userId,name);
      }, 1000);
    });

    return () => {
      socket.off("user-connected", handleUserConnected);
    };
  }, [peer, streamState, socket]);

  useEffect(() => {
    if (!peer || !streamState) return;
    
    peer.on("call", (call) => {
      const { peer: callerId, metadata: data } = call;
      const {name} = data;
      console.log(callerId);
     
      call.answer(streamState);
      call.on("stream", (stream) => {
        console.log(`stream recieved from ${callerId}`);
        setJoinedUsers((prevJoinedUsers) => ({
          ...prevJoinedUsers,
          [callerId]: { stream: stream, playing: true, muted: false, userName: name },
        }));
      });
    });
  }, [peer, streamState]);

  useEffect(() => {
    if (!streamState || !peerId) return;
    console.log(`setting my stream ${peerId}`);
    setJoinedUsers((prev) => ({
      ...prev,
      [peerId]: {
        stream: streamState,
        muted: false,
        playing: true,
        userName:userName
      },
    }));
  }, [peerId, streamState]);
  console.log(joinedUsers)

  return (
    <div className="bg-slate-800 h-screen">
      {Object.keys(joinedUsers)?.map((userId:any)=> <Player key={userId} stream = {joinedUsers[userId].stream} playing = {joinedUsers[userId].playing} muted = {joinedUsers[userId].muted} />)}
      {joinedUsers[peerId] && <Controls peerId={peerId} />}
    </div>
  );
};

export default CallRoom;
