import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef<Camera>(null);

  // Mock emotion analysis function
  const analyzeEmotion = async (imageUri: string): Promise<EmotionResult[]> => {
    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock results
    const mockResults: EmotionResult[] = [
      { emotion: 'happy', percentage: 65, emoji: '😊', color: '#FCD34D' },
      { emotion: 'neutral', percentage: 20, emoji: '😐', color: '#94A3B8' },
      { emotion: 'surprised', percentage: 10, emoji: '😲', color: '#FB923C' },
      { emotion: 'sad', percentage: 5, emoji: '😢', color: '#60A5FA' }
    ];
    
    setIsAnalyzing(false);
    return mockResults;
  };

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      setSelectedImage(imageUri);
      
      try {
        const emotionResults = await analyzeEmotion(imageUri);
        setResults(emotionResults);
      } catch (error) {
        Alert.alert('Error', 'Failed to analyze the image. Please try again.');
      }
    }
  };

  const startCamera = async () => {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Camera access is needed to take photos.');
        return;
      }
    }
    setIsCameraActive(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setSelectedImage(photo.uri);
        setIsCameraActive(false);
        
        const emotionResults = await analyzeEmotion(photo.uri);
        setResults(emotionResults);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setResults([]);
    setIsAnalyzing(false);
    setIsCameraActive(false);
  };

  if (isCameraActive) {
    return (
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={CameraType.front}
        />
        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setIsCameraActive(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <LinearGradient
              colors={['#8B5CF6', '#A855F7']}
              style={styles.captureButtonGradient}
            >
              <Ionicons name="camera" size={32} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Face Emotion Detection</Text>
        
        {!selectedImage ? (
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={startCamera}>
              <LinearGradient
                colors={['#8B5CF6', '#A855F7']}
                style={styles.actionButtonGradient}
              >
                <Ionicons name="camera" size={24} color="white" />
                <Text style={styles.actionButtonText}>Take Photo</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleImagePicker}>
              <View style={styles.softButton}>
                <Ionicons name="image" size={24} color="#8B5CF6" />
                <Text style={styles.softButtonText}>Upload Image</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <TouchableOpacity style={styles.resetButton} onPress={reset}>
              <Ionicons name="refresh" size={20} color="#8B5CF6" />
              <Text style={styles.resetButtonText}>Try Another</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <EmotionCard 
        results={results} 
        title="Face Emotion Analysis" 
        isLoading={isAnalyzing}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  cancelButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  captureButton: {
    borderRadius: 40,
    overflow: 'hidden',
  },
  captureButtonGradient: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
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
  actionContainer: {
    gap: 16,
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  softButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 16,
    gap: 8,
  },
  softButtonText: {
    color: '#8B5CF6',
    fontSize: 18,
    fontWeight: '600',
  },
  imageContainer: {
    alignItems: 'center',
    gap: 16,
  },
  selectedImage: {
    width: 300,
    height: 225,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  resetButton: {
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
  resetButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FaceEmotionDetection;