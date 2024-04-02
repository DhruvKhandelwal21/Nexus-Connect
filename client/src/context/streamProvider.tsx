import React, { createContext, useContext, useState } from 'react';

const StreamContext = createContext(null);

export const useStreamContext = () => useContext(StreamContext);

export const StreamProvider = ({ children }) => {
  const [myStream, setMyStream] = useState(null);

  return (
    <StreamContext.Provider value={{ myStream, setMyStream }}>
      {children}
    </StreamContext.Provider>
  );
};