import { Mic, Square, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VoiceRecorder({ onTranscript, className }: VoiceRecorderProps) {
  const { 
    isRecording, 
    transcript, 
    isSupported, 
    error, 
    startRecording, 
    stopRecording,
    resetTranscript 
  } = useVoiceRecorder();

  useEffect(() => {
    if (transcript && !isRecording) {
      onTranscript(transcript);
      resetTranscript();
    }
  }, [transcript, isRecording, onTranscript, resetTranscript]);

  if (!isSupported) {
    return (
      <div className={cn('flex items-center gap-2 text-gray-500 text-sm', className)}>
        <AlertCircle className="h-4 w-4" />
        Voice input not supported in this browser
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Recording Button */}
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        className={cn(
          'relative flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 shadow-lg',
          isRecording
            ? 'bg-emergency text-white animate-recording'
            : 'bg-primary text-white hover:scale-105'
        )}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
        
        {isRecording && (
          <>
            <span className="absolute inset-0 rounded-full bg-emergency/30 animate-ping" />
            <span className="absolute inset-[-4px] rounded-full border-2 border-emergency/50 animate-pulse" />
          </>
        )}
      </button>

      {/* Status */}
      <p className={cn(
        'text-sm font-medium transition-colors',
        isRecording ? 'text-emergency' : 'text-gray-600 dark:text-gray-400'
      )}>
        {isRecording ? 'Listening... Tap to stop' : 'Tap to speak your symptoms'}
      </p>

      {/* Live Transcript */}
      {isRecording && transcript && (
        <div className="w-full max-w-md p-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-fade-in">
          <p className="text-sm text-gray-500 mb-1">Transcribing:</p>
          <p className="text-gray-900 dark:text-gray-100">{transcript}</p>
        </div>
      )}

      {/* Waveform */}
      {isRecording && (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-emergency rounded-full animate-waveform"
              style={{
                height: '24px',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-emergency text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}