import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface EmotionResult {
  emotion: string;
  percentage: number;
  emoji: string;
  color: string;
}

interface EmotionCardProps {
  results: EmotionResult[];
  title: string;
  isLoading?: boolean;
}

const EmotionCard: React.FC<EmotionCardProps> = ({ 
  results, 
  title, 
  isLoading = false 
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!isLoading && results.length > 0) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [isLoading, results]);

  if (isLoading) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.loadingContainer}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.loadingItem}>
              <View style={styles.loadingEmoji} />
              <View style={styles.loadingText} />
              <View style={styles.loadingPercentage} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.resultsContainer}>
        {results.map((result, index) => (
          <View key={index} style={styles.resultItem}>
            <View style={styles.resultLeft}>
              <Text style={styles.resultEmoji}>{result.emoji}</Text>
              <Text style={styles.resultEmotion}>{result.emotion}</Text>
            </View>
            <View style={styles.resultRight}>
              <View style={styles.progressBarContainer}>
                <Animated.View
                  style={[
                    styles.progressBar,
                    {
                      width: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', `${result.percentage}%`],
                      }),
                      backgroundColor: result.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.percentage}>{result.percentage}%</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginVertical: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1E293B',
  },
  resultsContainer: {
    gap: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resultEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  resultEmotion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    textTransform: 'capitalize',
  },
  resultRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarContainer: {
    width: 64,
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    width: 40,
    textAlign: 'right',
  },
  loadingContainer: {
    gap: 16,
  },
  loadingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loadingEmoji: {
    width: 32,
    height: 32,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
  },
  loadingText: {
    width: 80,
    height: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    flex: 1,
    marginLeft: 12,
  },
  loadingPercentage: {
    width: 48,
    height: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
});

export default EmotionCard;