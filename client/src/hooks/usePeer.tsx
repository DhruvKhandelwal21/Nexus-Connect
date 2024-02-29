import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";

export const usePeer = () => {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState(null);

  const peerIdRef = useRef(null);

  useEffect(() => {
    if (peerIdRef.current) return;
    peerIdRef.current = true;
    const peer = new Peer();
    setPeer(peer);
    peer.on("open", (id) => {
      setPeerId(id);
    });
  }, []);

  return { peer, peerId };
};
