import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Mic, ArrowLeft } from 'lucide-react';
import FaceEmotionDetection from '@/components/FaceEmotionDetection';
import VoiceEmotionDetection from '@/components/VoiceEmotionDetection';

type DetectionMode = 'home' | 'face' | 'voice';

const Index = () => {
  const [currentMode, setCurrentMode] = useState<DetectionMode>('home');

  const renderContent = () => {
    switch (currentMode) {
      case 'face':
        return <FaceEmotionDetection />;
      case 'voice':
        return <VoiceEmotionDetection />;
      default:
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Emotion AI
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Discover emotions through advanced AI analysis of faces and voices
                </p>
              </div>
              
              <div className="flex justify-center">
                <div className="text-6xl animate-float">🎭</div>
              </div>
            </div>

            {/* Main Action Cards */}
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              <Card 
                className="gradient-card shadow-soft p-8 cursor-pointer group hover:shadow-glow transition-all duration-300"
                onClick={() => setCurrentMode('face')}
              >
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto gradient-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Face Emotion</h3>
                    <p className="text-muted-foreground">
                      Analyze emotions from facial expressions using camera or uploaded images
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 text-2xl">
                    <span>😊</span>
                    <span>😢</span>
                    <span>😡</span>
                    <span>😲</span>
                    <span>😰</span>
                  </div>
                </div>
              </Card>

              <Card 
                className="gradient-card shadow-soft p-8 cursor-pointer group hover:shadow-glow transition-all duration-300"
                onClick={() => setCurrentMode('voice')}
              >
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto gradient-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mic className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Voice Emotion</h3>
                    <p className="text-muted-foreground">
                      Detect emotions from voice recordings and speech patterns
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 text-2xl">
                    <span>😌</span>
                    <span>😊</span>
                    <span>😐</span>
                    <span>😰</span>
                    <span>😡</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Features Section */}
            <div className="max-w-4xl mx-auto">
              <Card className="gradient-card shadow-soft p-6">
                <h3 className="text-lg font-semibold mb-4 text-center">How It Works</h3>
                <div className="grid gap-4 md:grid-cols-3 text-center">
                  <div className="space-y-2">
                    <div className="text-3xl">📸</div>
                    <h4 className="font-medium">Capture</h4>
                    <p className="text-sm text-muted-foreground">
                      Take a photo or record audio
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl">🤖</div>
                    <h4 className="font-medium">Analyze</h4>
                    <p className="text-sm text-muted-foreground">
                      AI processes emotional patterns
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl">📊</div>
                    <h4 className="font-medium">Results</h4>
                    <p className="text-sm text-muted-foreground">
                      View emotion percentages
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        {currentMode !== 'home' && (
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setCurrentMode('home')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        )}

        {/* Main Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;