import { useEffect, useRef } from "react";
import { useStreamContext } from "@/context/streamProvider";
export const useMediaPlayer = ()=>{
    const {myStream,setMyStream} = useStreamContext();
    const streamRef = useRef(null);
    // const [streamState,setStreamState] = useState(null);
    useEffect(()=>{
        if(myStream) return;
        if(streamRef.current) return;
        streamRef.current = true;
        fetchVideoStream();
    },[])
    const fetchVideoStream = async ()=>{
        try{
         const stream = await navigator.mediaDevices.getUserMedia({audio:true, video: { facingMode: "user" }})
         setMyStream(stream)
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
    return {streamState:myStream, fetchScreenStream}
}