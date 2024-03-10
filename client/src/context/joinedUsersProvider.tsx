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
    joinedUsers: object;
    setJoinedUsers: (joinedUsers:any)=> void;
    userName: string;
    setUserName: (userName:any)=> void;
}

const joinedUserContext = createContext({} as joinedUserType);

export const JoinedUserContextProvider:React.FC<childrenNode>  = ({children})=>{
   const [joinedUsers,setJoinedUsers] = useState({});
   const [userName,setUserName] = useState("");

   return(
    <joinedUserContext.Provider value={{joinedUsers, setJoinedUsers,userName,setUserName}}>
       {children}
    </joinedUserContext.Provider>
   )
   
}

export const useGetJoinedUsers = ()=> useContext(joinedUserContext);