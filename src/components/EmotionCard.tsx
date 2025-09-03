import React from 'react';
import { Card } from '@/components/ui/card';

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

const EmotionCard: React.FC<EmotionCardProps> = ({ results, title, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card className="gradient-card shadow-soft p-6 animate-pulse-soft">
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="w-20 h-4 bg-muted rounded"></div>
              </div>
              <div className="w-12 h-4 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <Card className="gradient-card shadow-soft p-6 animate-float">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <div className="space-y-3">
        {results.map((result, index) => (
          <div key={index} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                {result.emoji}
              </span>
              <span className="font-medium capitalize">{result.emotion}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${result.percentage}%`,
                    backgroundColor: result.color
                  }}
                />
              </div>
              <span className="text-sm font-semibold w-10 text-right">
                {result.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default EmotionCard;