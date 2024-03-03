import { createContext, useContext, useEffect,useState } from "react";
import { backendApi } from "../config";
import { io,Socket } from "socket.io-client";

interface SocketContextType {
   socket: Socket | null;
}

interface childrenNode{
    children: React.ReactNode;
}

const socketContext = createContext<SocketContextType>(null);

export const SocketContextProvider:React.FC<childrenNode>  = ({children})=>{
   const [socket,setSocket] = useState(null);
   useEffect(() => {
    const socket = io(`${backendApi}`)
    setSocket(socket);
   }, [])

   return(
    <socketContext.Provider value={{socket}}>
       {children}
    </socketContext.Provider>
   )
   
}

export const useSocket = ()=> useContext(socketContext);

