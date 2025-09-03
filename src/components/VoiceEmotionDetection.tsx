import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import EmotionCard from './EmotionCard';

interface EmotionResult {
  emotion: string;
  percentage: number;
  emoji: string;
  color: string;
}

const VoiceEmotionDetection: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<EmotionResult[]>([]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Mock emotion analysis function
  const analyzeVoiceEmotion = async (audioUri: string): Promise<EmotionResult[]> => {
    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Mock results
    const mockResults: EmotionResult[] = [
      { emotion: 'calm', percentage: 45, emoji: '😌', color: '#10B981' },
      { emotion: 'happy', percentage: 30, emoji: '😊', color: '#FCD34D' },
      { emotion: 'neutral', percentage: 15, emoji: '😐', color: '#94A3B8' },
      { emotion: 'fear', percentage: 10, emoji: '😰', color: '#8B5CF6' }
    ];
    
    setIsAnalyzing(false);
    return mockResults;
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Microphone access is needed to record audio.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      recordingRef.current = recording;
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      setRecordingUri(uri);
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      recordingRef.current = null;
    } catch (error) {
      Alert.alert('Error', 'Failed to stop recording.');
    }
  };

  const playRecording = async () => {
    if (!recordingUri) return;

    try {
      const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      Alert.alert('Error', 'Failed to play recording.');
    }
  };

  const analyzeRecording = async () => {
    if (!recordingUri) return;
    
    try {
      const emotionResults = await analyzeVoiceEmotion(recordingUri);
      setResults(emotionResults);
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze the recording. Please try again.');
    }
  };

  const reset = () => {
    setRecordingUri(null);
    setResults([]);
    setRecordingDuration(0);
    setIsAnalyzing(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Voice Emotion Detection</Text>
        
        <View style={styles.contentContainer}>
          {isRecording ? (
            <View style={styles.recordingContainer}>
              <View style={styles.recordingIndicator}>
                <LinearGradient
                  colors={['#8B5CF6', '#A855F7']}
                  style={styles.recordingCircle}
                >
                  <Ionicons name="mic" size={32} color="white" />
                </LinearGradient>
              </View>
              <Text style={styles.recordingText}>
                Recording... {formatTime(recordingDuration)}
              </Text>
              <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
                <View style={styles.stopButtonInner}>
                  <Ionicons name="stop" size={20} color="white" />
                  <Text style={styles.stopButtonText}>Stop Recording</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actionContainer}>
              {!recordingUri ? (
                <TouchableOpacity style={styles.startButton} onPress={startRecording}>
                  <LinearGradient
                    colors={['#8B5CF6', '#A855F7']}
                    style={styles.startButtonGradient}
                  >
                    <Ionicons name="mic" size={24} color="white" />
                    <Text style={styles.startButtonText}>Start Recording</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <View style={styles.recordingCompleteContainer}>
                  <Text style={styles.completedText}>
                    Recording completed ({formatTime(recordingDuration)})
                  </Text>
                  
                  <TouchableOpacity style={styles.playButton} onPress={playRecording}>
                    <Ionicons name="play" size={20} color="#8B5CF6" />
                    <Text style={styles.playButtonText}>Play Recording</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity 
                      style={styles.analyzeButton} 
                      onPress={analyzeRecording}
                      disabled={isAnalyzing}
                    >
                      <LinearGradient
                        colors={['#8B5CF6', '#A855F7']}
                        style={styles.analyzeButtonGradient}
                      >
                        <Text style={styles.analyzeButtonText}>
                          {isAnalyzing ? 'Analyzing...' : 'Analyze Emotion'}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.newRecordingButton} onPress={reset}>
                      <Text style={styles.newRecordingButtonText}>New Recording</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      <EmotionCard 
        results={results} 
        title="Voice Emotion Analysis" 
        isLoading={isAnalyzing}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1E293B',
  },
  contentContainer: {
    alignItems: 'center',
  },
  recordingContainer: {
    alignItems: 'center',
    gap: 16,
  },
  recordingIndicator: {
    marginBottom: 8,
  },
  recordingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  stopButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  stopButtonInner: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  actionContainer: {
    width: '100%',
    gap: 16,
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  recordingCompleteContainer: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  completedText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  playButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  analyzeButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  analyzeButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  newRecordingButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  newRecordingButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VoiceEmotionDetection;