import { createContext, useContext, useState } from "react";

interface childrenNode{
    children: React.ReactNode;
}

interface joinedUser{
    stream: any;
    playing: boolean;
    muted: boolean;
}

interface joinedUserType{
    joinedUsers: joinedUser[];
    setJoinedUsers: (joinedUsers:any)=> void;
}

const joinedUserContext = createContext({} as joinedUserType);

export const JoinedUserContextProvider:React.FC<childrenNode>  = ({children})=>{
   const [joinedUsers,setJoinedUsers] = useState<joinedUser[]>([]);

   return(
    <joinedUserContext.Provider value={{joinedUsers, setJoinedUsers}}>
       {children}
    </joinedUserContext.Provider>
   )
   
}

export const useGetJoinedUsers = ()=> useContext(joinedUserContext);