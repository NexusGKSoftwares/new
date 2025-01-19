import React, { useState, useRef } from 'react';
import './VoiceRecorder.css';

const VoiceRecorder = ({ onSendMessage }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [progressWidth, setProgressWidth] = useState(0);
  const streamRef = useRef(null);

  const startRecording = async () => {
    try {
      console.log('Starting recording...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm' // Using webm for better compatibility
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log('Received audio chunk of size:', event.data.size);
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        console.log('Recording stopped');
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        console.log('Created audio blob of size:', audioBlob.size);
        console.log('Blob type:', audioBlob.type);
        
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Test the blob content
        const reader = new FileReader();
        reader.onload = () => {
          console.log('Audio data loaded, first 50 bytes:', new Uint8Array(reader.result).slice(0, 50));
        };
        reader.readAsArrayBuffer(audioBlob);

        const audioDuration = audioChunksRef.current.reduce((acc, chunk) => acc + chunk.size, 0) / 32000;
        setDuration(audioDuration);

        try {
          await onSendMessage({
            text: 'Voice message',
            audio: audioBlob,
            duration: audioDuration
          });
          console.log('Voice message sent successfully');
        } catch (error) {
          console.error('Error sending voice message:', error);
        }

        streamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log('Audio track stopped:', track.label);
        });
      };

      mediaRecorderRef.current.start(200);
      setIsRecording(true);
      console.log('MediaRecorder started');

      setProgressWidth(0);
      const interval = setInterval(() => {
        setProgressWidth((prevWidth) => {
          if (prevWidth >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prevWidth + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error initializing recording:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('Stopping recording...');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setProgressWidth(0);
    }
  };

  // Rest of the component remains the same...
  return (
    <div className="voice-recorder-container">
      <div 
        className={`voice-recorder-button ${isRecording ? 'recording' : ''}`} 
        onClick={isRecording ? stopRecording : startRecording}
        title={isRecording ? "Stop recording" : "Start recording"}
      >
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
          <path d="M7.5 21c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm9 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm-4.5 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm8-12v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2zm-4 2c0 2.209-1.791 4-4 4s-4-1.791-4-4v-7c0-2.209 1.791-4 4-4s4 1.791 4 4v7zm-2 0c0 1.105-.895 2-2 2s-2-.895-2-2v-7c0-1.105.895-2 2-2s2 .895 2 2v7z"/>
        </svg>
      </div>

      {isRecording && (
        <>
          <div className="voice-recorder-progress">
            <div 
              className="voice-recorder-progress-bar" 
              style={{ width: `${progressWidth}%` }}
            />
          </div>

          <div className="voice-recorder-waveform recording">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="waveform-bar"
                style={{ '--bar-index': index }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VoiceRecorder;