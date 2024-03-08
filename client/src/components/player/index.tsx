const Player = ({ stream, playing, muted }) => {
  return (
    <div>
      <video
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
    </div>
  );
};

export default Player;
