import { useEffect, useState } from "react";
import { usePeer } from "../hooks/usePeer";
import { useSocket } from "../context/socketProvider";
import { useGetJoinedUsers } from "../context/joinedUsersProvider";
import Player from "../components/player";
import Controls from "@/components/controls";
import { Button } from "@/cssHelper/ui/button";
import { ColorRing } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";

const CallRoom = () => {
  const { peer, peerId, streamState } = usePeer();
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
  } = useGetJoinedUsers();

  const [openCallDialog, setOpenCallDialog] = useState({
    open: false,
    name: "",
    id: "",
  });
console.log(streamState)
  useEffect(() => {
    if (!socket) return;
    const handleAnswerCall = (name: string, id: string) => {
      setOpenCallDialog({ open: true, name: name, id: id });
    };

    socket.on("call-answer", handleAnswerCall);
  }, [socket]);

  useEffect(() => {
    if (!peer || !streamState || !socket) return;

    const handleUserConnected = (userId, name) => {
      setGuestId(userId);
      setGuestUserName(name);
      const options = { metadata: { name: hostUserName } };
      const call = peer.call(userId, streamState, options);
      console.log(call)
      call.on("stream", (incomingStream) => {
        setGuestUser({
          stream: incomingStream,
          playing: true,
          muted: false,
          userName: name,
        });
        // console.log(incomingStream);
        // console.log(`recieved stream from ${userId}`);
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
    };
  }, [peer, streamState, socket]);

  useEffect(() => {
    if (!peer || !streamState) return;
    peer.on("call", (call) => {
      const { peer: callerId, metadata: data } = call;
      const { name } = data;
      setGuestUserName(name);
      setGuestId(callerId);

      call.answer(streamState);
      call.on("stream", (stream) => {
        // console.log(`stream recieved from ${callerId}`);
        setGuestUser({
          stream: stream,
          playing: true,
          muted: false,
          userName: name,
        });
      });
    });
  }, [peer, streamState]);

  useEffect(() => {
    if (!streamState || !peerId) return;
    console.log(peerId);
    // console.log(`setting my stream ${peerId}`);
    setHostId(hostId);
    setHostUser({
      stream: streamState,
      playing: true,
      muted: false,
      userName: hostUserName,
    });
  }, [peerId, streamState]);

  const handleCallResponse = (response: string) => {
    socket.emit("answer-to-guest", response, openCallDialog.id);
    setOpenCallDialog({ open: false, name: "", id: "" });
  };

  return (
    <div className="bg-slate-800 h-screen w-screen block">
      <div
        className={`flex  ${
          guestUser ? "justify-between" : "justify-center"
        } h-[80vh] w-[100vw]`}
      >
        {guestUser && (
          <div className="w-full h-full py-5 flex justify-center relative">
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
            guestUser
              ? "flex justify-end w-1/4 h-1/4 mt-2 mr-2 "
              : "flex justify-center items-center mt-5 w-full h-full "
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

        {hostUser && <Controls peerId={peerId} />}
      </div>
      {openCallDialog.open && (
        <div className="absolute bottom-10 right-10 w-1/5 h-20 z-10 bg-white rounded-lg">
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
