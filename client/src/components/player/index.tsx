import { MicOffIcon, UserX, } from "lucide-react";
const Player = ({ stream, playing, muted, active, name }) => {

  return (
    <div className="relative">
      <video
        style={{position:'relative', height:"100%"}}
        className={`rounded-lg ${playing ? '':'opacity-50'}`}
        ref={(ref) => {
          if (ref) {
            const newStream = stream;
            newStream.getVideoTracks()[0].enabled = playing;
            ref.srcObject = newStream;
          }
        }}
        autoPlay
        muted={muted}
      />
   {name && (
    <div className="absolute z-10 bottom-0 left-0 px-3 py-1 w-fit mb-1 ml-1 text-ellipsis text-white bg-black bg-opacity-50 rounded-lg">
      {name}
    </div>
  )}

  {!playing && (
    <div className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <UserX color="white" width="40" />
    </div>
  )}

  {muted && (
    <div className="absolute z-10 bottom-2 right-0 pr-2">
      <MicOffIcon color="white" width="20" />
    </div>
  )}
      </div>
  );
};

export default Player;
