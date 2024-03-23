import { createContext, useContext, useState } from "react";

interface childrenNode{
    children: React.ReactNode;
}

// interface joinedUser{
//     id: any;
//     stream: any;
//     playing: boolean;
//     muted: boolean;
// }

interface joinedUserType{
    hostUser: any;
    setHostUser: (joinedUsers:any)=> void;
    guestUser: any;
    setGuestUser: (joinedUsers:any)=> void;
    hostUserName: string;
    guestUserName: string;
    setHostUserName: (userName:any)=> void;
    setGuestUserName: (userName:any)=> void;
    hostId: string;
    guestId: string;
    setHostId:(userId:any)=> void;
    setGuestId: (userId:any)=> void;
    screenShare: any;
    setScreenShare: (userId:any)=> void;
}

const joinedUserContext = createContext({} as joinedUserType);

export const JoinedUserContextProvider:React.FC<childrenNode>  = ({children})=>{
   const [hostUser,setHostUser] = useState(null);
   const [guestUser,setGuestUser] = useState(null)
   const [hostUserName,setHostUserName] = useState("");
   const [guestUserName,setGuestUserName] = useState("");
   const [hostId,setHostId] = useState("")
   const [guestId,setGuestId] = useState("");
   const [screenShare,setScreenShare]=  useState(null);

   return(
    <joinedUserContext.Provider value={{hostUser, setHostUser ,guestUser,setGuestUser,hostUserName, setHostUserName, guestUserName, setGuestUserName, hostId, setHostId, guestId, setGuestId, screenShare, setScreenShare}}>
       {children}
    </joinedUserContext.Provider>
   )
   
}

export const useGetJoinedUsers = ()=> useContext(joinedUserContext);