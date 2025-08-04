import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, Lightbulb, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';

const AIInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await axios.get('/api/ai/suggestions');
      setInsights(response.data);
    } catch (error) {
      console.error('Failed to fetch AI insights:', error);
      // Set default insights if API fails
      setInsights({
        suggestions: ['Start logging study sessions to get personalized insights'],
        attention_areas: ['No data available yet'],
        motivation: 'Begin your learning journey today!',
        pattern_analysis: 'Track your study habits to see patterns and improvements.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInsights();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Brain className="h-5 w-5 text-primary-600 mr-2" />
          <span className="text-sm font-medium text-gray-700">AI Analysis</span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Suggestions */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start">
          <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Suggestions</h4>
            <ul className="space-y-1">
              {insights.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-blue-800">
                  • {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Attention Areas */}
      {insights.attention_areas && insights.attention_areas.length > 0 && (
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-yellow-900 mb-2">Areas for Attention</h4>
              <ul className="space-y-1">
                {insights.attention_areas.map((area, index) => (
                  <li key={index} className="text-sm text-yellow-800">
                    • {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Motivation */}
      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-start">
          <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-green-900 mb-2">Motivation</h4>
            <p className="text-sm text-green-800">{insights.motivation}</p>
          </div>
        </div>
      </div>

      {/* Pattern Analysis */}
      {insights.pattern_analysis && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start">
            <Brain className="h-5 w-5 text-gray-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Pattern Analysis</h4>
              <p className="text-sm text-gray-700">{insights.pattern_analysis}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;