import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/socketProvider";
import { useParams } from 'react-router-dom';
import { useGetJoinedUsers } from "@/context/joinedUsersProvider";
import { useMediaPlayer } from "./useMediaPlayer";

export const usePeer = () => {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState(null);
  const { streamState, fetchScreenStream } = useMediaPlayer();
  const { hostUserName } = useGetJoinedUsers();
  const {roomid} = useParams();
  const context = useSocket();
  
  const {socket} = context;
  const peerIdRef = useRef(null);
  useEffect(() => {
    if(!socket || !roomid || !streamState ) return;
    if (peerIdRef.current) return;
    console.log('hello')
    peerIdRef.current = true;
    const peer = new Peer();
    setPeer(peer);
    peer.on("open", (id) => {
      setPeerId(id);
      socket.emit('join-room',roomid,id,hostUserName)
    });
  }, [socket, roomid, streamState]);

  return { peer, peerId, streamState, fetchScreenStream };
};
