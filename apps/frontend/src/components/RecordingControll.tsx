import { useState } from "react";

type RecordingState = 'inactive' | 'recording' | 'paused';


interface ParticipantRecorder {
  recorder: MediaRecorder;  // the MediaRecorder instance for their stream so that each partipent recording can handled by a dedicated MediaRedorder 
  chunks: Blob[];           // array of data chunks (Blob[])
  state: RecordingState;
}

 export const useRecordingManager = () => {
  const [recorders, setRecorders] = useState<Map<string, ParticipantRecorder>>(new Map());

  const startRecording = (participantId: string, stream: MediaStream) => {
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.start();

    const recorder: ParticipantRecorder = {
      recorder: mediaRecorder,
      chunks,
      state: 'recording',
    };

    setRecorders((prev) => new Map(prev).set(participantId, recorder));
  };

  const stopRecording = (participantId: string): Blob | null => {
    const rec = recorders.get(participantId);
    if (!rec) return null;

    rec.recorder.stop();
    rec.state = 'inactive';

    const blob = new Blob(rec.chunks, { type: 'video/webm' });
    return blob;  //Returns a Blob containing all recorded chunks (as a single .webm file)
  };

  const pauseRecording = (participantId: string) => {
    const rec = recorders.get(participantId);
    if (rec && rec.recorder.state === 'recording') {
      rec.recorder.pause();
      rec.state = 'paused';
    }
  };

  const resumeRecording = (participantId: string) => {
    const rec = recorders.get(participantId);
    if (rec && rec.recorder.state === 'paused') {
      rec.recorder.resume();
      rec.state = 'recording';
    }
  };

  const getRecordingState = (participantId: string): RecordingState => {
    return recorders.get(participantId)?.state || 'inactive';
  };

  return {
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    getRecordingState,
  };                     
};

//What MediaRecoder does
//It does 1.ControlsRecording   You can start (.start()), stop (.stop()), pause (.pause()), and resume (.resume()) the recording.
//2.Captures Media Data It records whatever media (e.g., webcam + mic) is passed to it via a MediaStream.
//3. Provides Recorded Data in Chunks : It fires ondataavailable events containing media Blob chunks, which you collect and combine later to form the full recording.
// 🔹 What is a Media Blob Chunk?
// When you're recording audio/video in the browser using MediaRecorder, the data doesn't come all at once — it comes in small parts (called chunks) over time
// . Each part is a Blob, which is a binary object that holds media data (like audio/video