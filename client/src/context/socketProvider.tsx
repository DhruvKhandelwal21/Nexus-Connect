import { createContext, useContext, useEffect,useState } from "react";
import { backendApi } from "../config";
import { io } from "socket.io-client";

interface childrenNode{
    children: React.ReactNode;
}

const socketContext = createContext({});

export const SocketContextProvider:React.FC<childrenNode>  = ({children})=>{
   const [socket,setSocket] = useState(null);
   useEffect(() => {
    const socket = io(`${backendApi}`)
    console.log(socket)
    setSocket(socket);
   }, [])

   return(
    <socketContext.Provider value={{socket}}>
       {children}
    </socketContext.Provider>
   )
   
}

export const useSocket = ()=> useContext(socketContext);

