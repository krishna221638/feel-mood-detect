import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import FaceEmotionDetection from './components/FaceEmotionDetection';
import VoiceEmotionDetection from './components/VoiceEmotionDetection';

type DetectionMode = 'home' | 'face' | 'voice';

const { width } = Dimensions.get('window');

const MainApp = () => {
  const [currentMode, setCurrentMode] = useState<DetectionMode>('home');

  const renderHomeContent = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Emotion AI</Text>
        <Text style={styles.heroSubtitle}>
          Discover emotions through advanced AI analysis of faces and voices
        </Text>
        <Text style={styles.heroEmoji}>🎭</Text>
      </View>

      {/* Main Action Cards */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => setCurrentMode('face')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#8B5CF6', '#A855F7']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="camera" size={40} color="white" />
              </View>
              <Text style={styles.cardTitle}>Face Emotion</Text>
              <Text style={styles.cardDescription}>
                Analyze emotions from facial expressions using camera or uploaded images
              </Text>
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>😊</Text>
                <Text style={styles.emoji}>😢</Text>
                <Text style={styles.emoji}>😡</Text>
                <Text style={styles.emoji}>😲</Text>
                <Text style={styles.emoji}>😰</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => setCurrentMode('voice')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#8B5CF6', '#A855F7']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="mic" size={40} color="white" />
              </View>
              <Text style={styles.cardTitle}>Voice Emotion</Text>
              <Text style={styles.cardDescription}>
                Detect emotions from voice recordings and speech patterns
              </Text>
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>😌</Text>
                <Text style={styles.emoji}>😊</Text>
                <Text style={styles.emoji}>😐</Text>
                <Text style={styles.emoji}>😰</Text>
                <Text style={styles.emoji}>😡</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Features Section */}
      <View style={styles.featuresCard}>
        <Text style={styles.featuresTitle}>How It Works</Text>
        <View style={styles.featuresGrid}>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>📸</Text>
            <Text style={styles.featureTitle}>Capture</Text>
            <Text style={styles.featureDescription}>
              Take a photo or record audio
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🤖</Text>
            <Text style={styles.featureTitle}>Analyze</Text>
            <Text style={styles.featureDescription}>
              AI processes emotional patterns
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>📊</Text>
            <Text style={styles.featureTitle}>Results</Text>
            <Text style={styles.featureDescription}>
              View emotion percentages
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch (currentMode) {
      case 'face':
        return <FaceEmotionDetection />;
      case 'voice':
        return <VoiceEmotionDetection />;
      default:
        return renderHomeContent();
    }
  };

  return (
    <LinearGradient
      colors={['#FAFBFF', '#F3F4FF']}
      style={styles.background}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        {currentMode !== 'home' && (
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCurrentMode('home')}
            >
              <Ionicons name="arrow-back" size={24} color="#8B5CF6" />
              <Text style={styles.backButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Main Content */}
        {renderContent()}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8B5CF6',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  heroEmoji: {
    fontSize: 64,
  },
  cardsContainer: {
    gap: 24,
    marginBottom: 32,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardGradient: {
    padding: 32,
  },
  cardContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  emojiContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  emoji: {
    fontSize: 24,
  },
  featuresCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1E293B',
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1E293B',
  },
  featureDescription: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default MainApp;