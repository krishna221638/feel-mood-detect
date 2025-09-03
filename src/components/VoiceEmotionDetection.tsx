import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Play, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EmotionCard from './EmotionCard';

interface EmotionResult {
  emotion: string;
  percentage: number;
  emoji: string;
  color: string;
}

const VoiceEmotionDetection: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<EmotionResult[]>([]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Mock emotion analysis function (replace with actual API call)
  const analyzeVoiceEmotion = async (audioData: Blob): Promise<EmotionResult[]> => {
    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Mock results - replace with actual API call
    const mockResults: EmotionResult[] = [
      { emotion: 'calm', percentage: 45, emoji: '😌', color: 'hsl(var(--emotion-calm))' },
      { emotion: 'happy', percentage: 30, emoji: '😊', color: 'hsl(var(--emotion-happy))' },
      { emotion: 'neutral', percentage: 15, emoji: '😐', color: 'hsl(var(--emotion-neutral))' },
      { emotion: 'fear', percentage: 10, emoji: '😰', color: 'hsl(var(--emotion-fear))' }
    ];
    
    setIsAnalyzing(false);
    return mockResults;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to record audio.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const analyzeRecording = async () => {
    if (!audioBlob) return;
    
    try {
      const emotionResults = await analyzeVoiceEmotion(audioBlob);
      setResults(emotionResults);
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Failed to analyze the recording. Please try again.",
        variant: "destructive"
      });
    }
  };

  const reset = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setResults([]);
    setRecordingDuration(0);
    setIsAnalyzing(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card className="gradient-card shadow-soft p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Voice Emotion Detection</h2>
        
        <div className="space-y-6">
          {/* Recording Section */}
          <div className="text-center space-y-4">
            {isRecording ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center animate-pulse-soft">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-lg font-semibold">
                  Recording... {formatTime(recordingDuration)}
                </div>
                <Button 
                  variant="destructive" 
                  size="lg" 
                  onClick={stopRecording}
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop Recording
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {!audioBlob ? (
                  <Button 
                    variant="emotion" 
                    size="xl" 
                    onClick={startRecording}
                    className="w-full max-w-xs"
                  >
                    <Mic className="w-6 h-6 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2">
                        Recording completed ({formatTime(recordingDuration)})
                      </p>
                      
                      {audioUrl && (
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <audio ref={audioRef} src={audioUrl} controls className="max-w-xs" />
                        </div>
                      )}
                      
                      <div className="flex gap-3 justify-center">
                        <Button 
                          variant="emotion" 
                          onClick={analyzeRecording}
                          disabled={isAnalyzing}
                        >
                          {isAnalyzing ? 'Analyzing...' : 'Analyze Emotion'}
                        </Button>
                        <Button variant="outline" onClick={reset}>
                          New Recording
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      <EmotionCard 
        results={results} 
        title="Voice Emotion Analysis" 
        isLoading={isAnalyzing}
      />
    </div>
  );
};

export default VoiceEmotionDetection;