import { useEffect, useState } from "react";

export const useMediaPlayer = ()=>{
    const [streamState,setStreamState] = useState(null);
    useEffect(()=>{
        fetchVideoStream();
    },[])
    const fetchVideoStream = async ()=>{
        try{
         const stream = await navigator.mediaDevices.getUserMedia({audio:true,video:true})
         setStreamState(stream)
        }catch(e){
            console.log(e);
        }
    }
    
    const fetchScreenStream = async ()=>{
        try{
         const stream = await navigator.mediaDevices.getDisplayMedia({
            audio: true,
            video: {
              displaySurface:"monitor"
            }
          });
         return stream;
        }catch(e){
            console.log(e);
        }
    }
    return {streamState, fetchScreenStream}
}