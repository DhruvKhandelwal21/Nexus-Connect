import ReactPlayer from 'react-player'

const Player = ({stream,playing,muted}) => {
  return (
    <div>
       <ReactPlayer url = {stream} playing = {playing} muted = {muted} />
    </div>
  )
}

export default Player