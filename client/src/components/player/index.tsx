import { useStreamContext } from "@/context/streamProvider";
import { MicOffIcon, UserX, } from "lucide-react";
import React from "react";
const Player = ({ stream, playing = true, muted = false, active = false, name = "", screen=false }) => {
  const {setMyStream} = useStreamContext();
  return (
    <>
      <video
      style={{position:"relative"}}
        className={`rounded-lg w-full h-full object-cover ${playing ? '':'opacity-50'}`}
        ref={async (ref) => {
          if (ref) {
            if(!screen){
              if(active){
                const prevStream:any = ref.srcObject;
                if(!playing){
                 prevStream.getVideoTracks().forEach((track)=> track.stop());
                }else{
                  if(prevStream && prevStream.getVideoTracks()[0].readyState!=='live'&&prevStream.id==stream.id){
                    const streamx = await navigator.mediaDevices.getUserMedia({audio:true,video:true});
                    ref.srcObject = streamx;
                    setMyStream(streamx);
                  }else{
                    const newStream = stream;
                    ref.srcObject = newStream;
                  }
                }
              }else{
                const newStream = stream;
                newStream.getVideoTracks()[0].enabled = playing;
                ref.srcObject = newStream;
              }  
            }else{
              ref.srcObject = stream;
            } 
          }
        }}
        autoPlay
        muted={muted}
      />
   {name && (
    <div className="absolute z-10 bottom-0 left-0 px-3 py-1 w-fit mb-3 ml-3 text-ellipsis text-white bg-black bg-opacity-50 rounded-lg">
      {name}
    </div>
  )}

  {!playing && (
    <div className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <UserX color="white" width="40" />
    </div>
  )}

  {muted && (
    <div className="absolute z-10 bottom-3 right-1 pr-2">
      <MicOffIcon color="white" width="20" />
    </div>
  )}
      </>
  );
};

export default React.memo(Player);
