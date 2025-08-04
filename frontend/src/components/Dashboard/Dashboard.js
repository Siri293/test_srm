import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  Mic,
  Brain,
  Award
} from 'lucide-react';
import StudyChart from './StudyChart';
import RecentSessions from './RecentSessions';
import AIInsights from './AIInsights';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalSessions: 0,
    totalStudyTime: 0,
    currentStreak: 0
  });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demo
      const mockSubjects = [
        { id: 1, name: 'Mathematics', color: '#3B82F6' },
        { id: 2, name: 'Computer Science', color: '#10B981' },
        { id: 3, name: 'Physics', color: '#F59E0B' }
      ];
      
      const mockAnalytics = {
        summary: {
          total_time: 15.5,
          average_focus_level: 7.8
        }
      };
      
      const mockStreak = { current_streak: 5 };

      setStats({
        totalSubjects: mockSubjects.length,
        totalSessions: 12,
        totalStudyTime: mockAnalytics.summary.total_time,
        currentStreak: mockStreak.current_streak
      });

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Subjects',
      value: stats.totalSubjects,
      icon: BookOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      name: 'Study Hours (7 days)',
      value: `${stats.totalStudyTime.toFixed(1)}h`,
      icon: Clock,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      name: 'Current Streak',
      value: `${stats.currentStreak} days`,
      icon: Award,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      name: 'Avg Focus Level',
      value: analytics?.summary?.average_focus_level || '0.0',
      icon: Target,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
        <p className="text-primary-100">
          Ready to continue your learning journey? Let's track your progress today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Study Time Trend (Last 7 Days)
          </h3>
          {analytics && <StudyChart data={analytics} />}
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Study Sessions
          </h3>
          <RecentSessions />
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Brain className="h-6 w-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            AI-Powered Insights
          </h3>
        </div>
        <AIInsights />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200">
            <BookOpen className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Add New Subject</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200">
            <Clock className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Log Study Session</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200">
            <Mic className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Record Reflection</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;