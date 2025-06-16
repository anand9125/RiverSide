import { useState } from "react";
import { useRecordingManager } from "../../components/RecordingControll";

 
 import React from 'react'
import { ControlBar } from "../../components/ControlBar";
 
 function LocalRecorder() {
    const getUserData = localStorage.getItem("userData")
    const userId = getUserData ? JSON.parse(getUserData).id :null;
    const{} = ControlBar()
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [isRecording, setIsRecording] = useState(false);

   return (
     <div>LocalRecorder</div>
   )
 }
 
 export default LocalRecorder
