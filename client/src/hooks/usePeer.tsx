import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/socketProvider";
import { useParams } from 'react-router-dom';

export const usePeer = () => {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState(null);

  const {roomid} = useParams();
  const context = useSocket();
  
  const {socket} = context;
  const peerIdRef = useRef(null);
  useEffect(() => {
    if(!socket || !roomid) return;
    if (peerIdRef.current) return;
    peerIdRef.current = true;
    const peer = new Peer();
    setPeer(peer);
    peer.on("open", (id) => {
      setPeerId(id);
      socket.emit('join-room',roomid,id)
    });
  }, [socket, roomid]);

  return { peer, peerId };
};
