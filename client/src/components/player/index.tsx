import React from 'react'
import ReactPlayer from 'react-player'
const Player = ({stream,playing,muted}) => {
  return (
    <div>
       <ReactPlayer url = {stream} playing />
    </div>
  )
}

export default Player