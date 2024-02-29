import React from 'react'
import { usePeer } from '../hooks/usePeer'
import { useMediaPlayer } from '../hooks/useMediaPlayer'

const CallRoom = () => {
  // const {peerId, peer} = usePeer();
  const {streamState} = useMediaPlayer();
  return (
    <div>Hi from CallRoom</div>
  )
}

export default CallRoom