import React from 'react'
import { usePeer } from '../hooks/usePeer';
const HomePage = () => {
  const {peer} = usePeer();
  console.log(peer);
  return (
    <div>homePag</div>
  )
}

export default HomePage