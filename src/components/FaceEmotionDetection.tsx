import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Upload, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EmotionCard from './EmotionCard';

interface EmotionResult {
  emotion: string;
  percentage: number;
  emoji: string;
  color: string;
}

const FaceEmotionDetection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<EmotionResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const { toast } = useToast();

  // Mock emotion analysis function (replace with actual API call)
  const analyzeEmotion = async (imageData: string): Promise<EmotionResult[]> => {
    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock results - replace with actual API call
    const mockResults: EmotionResult[] = [
      { emotion: 'happy', percentage: 65, emoji: '😊', color: 'hsl(var(--emotion-happy))' },
      { emotion: 'neutral', percentage: 20, emoji: '😐', color: 'hsl(var(--emotion-neutral))' },
      { emotion: 'surprised', percentage: 10, emoji: '😲', color: 'hsl(var(--emotion-surprised))' },
      { emotion: 'sad', percentage: 5, emoji: '😢', color: 'hsl(var(--emotion-sad))' }
    ];
    
    setIsAnalyzing(false);
    return mockResults;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      setSelectedImage(imageData);
      
      try {
        const emotionResults = await analyzeEmotion(imageData);
        setResults(emotionResults);
      } catch (error) {
        toast({
          title: "Analysis failed",
          description: "Failed to analyze the image. Please try again.",
          variant: "destructive"
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to take photos.",
        variant: "destructive"
      });
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg');
    setSelectedImage(imageData);
    
    // Stop camera
    const stream = video.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setIsCameraActive(false);
    
    try {
      const emotionResults = await analyzeEmotion(imageData);
      setResults(emotionResults);
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Failed to analyze the captured image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setResults([]);
    setIsAnalyzing(false);
    
    if (isCameraActive && videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="gradient-card shadow-soft p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Face Emotion Detection</h2>
        
        {!selectedImage && !isCameraActive && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Button 
                variant="emotion" 
                size="xl" 
                onClick={startCamera}
                className="h-20"
              >
                <Camera className="w-6 h-6 mr-2" />
                Take Photo
              </Button>
              
              <Button 
                variant="soft" 
                size="xl"
                onClick={() => fileInputRef.current?.click()}
                className="h-20"
              >
                <Upload className="w-6 h-6 mr-2" />
                Upload Image
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {isCameraActive && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-md mx-auto block"
              />
            </div>
            <div className="flex gap-4 justify-center">
              <Button variant="emotion" onClick={capturePhoto}>
                Capture Photo
              </Button>
              <Button variant="outline" onClick={reset}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {selectedImage && !isCameraActive && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden max-w-md mx-auto">
              <img 
                src={selectedImage} 
                alt="Selected for analysis" 
                className="w-full h-auto"
              />
            </div>
            <div className="flex justify-center">
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Another
              </Button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </Card>

      <EmotionCard 
        results={results} 
        title="Face Emotion Analysis" 
        isLoading={isAnalyzing}
      />
    </div>
  );
};

export default FaceEmotionDetection;