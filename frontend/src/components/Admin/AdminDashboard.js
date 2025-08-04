import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, BookOpen, Clock, Mic, TrendingUp, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch admin dashboard data:', error);
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

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-500">You don't have permission to access the admin dashboard.</p>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Users',
      value: dashboardData.overview.total_users,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      name: 'Total Subjects',
      value: dashboardData.overview.total_subjects,
      icon: BookOpen,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      name: 'Study Sessions',
      value: dashboardData.overview.total_sessions,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      name: 'Audio Notes',
      value: dashboardData.overview.total_audio_notes,
      icon: Mic,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <div className="flex items-center">
          <Shield className="h-8 w-8 mr-3" />
          <div>
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            <p className="text-primary-100">System overview and management</p>
          </div>
        </div>
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity (7 days)</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm text-gray-600">New Users</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {dashboardData.recent_activity.new_users}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm text-gray-600">New Sessions</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {dashboardData.recent_activity.new_sessions}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mic className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-sm text-gray-600">New Audio Notes</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {dashboardData.recent_activity.new_audio_notes}
              </span>
            </div>
          </div>
        </div>

        {/* Top Subjects */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Subjects</h3>
          <div className="space-y-3">
            {dashboardData.top_subjects.slice(0, 5).map((subject, index) => (
              <div key={subject.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xs font-medium text-primary-600">{index + 1}</span>
                  </div>
                  <span className="text-sm text-gray-900">{subject.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {subject.total_time}h
                  </div>
                  <div className="text-xs text-gray-500">
                    {subject.sessions} sessions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200">
            <Users className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Manage Users</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200">
            <BookOpen className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Subject Categories</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200">
            <TrendingUp className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;