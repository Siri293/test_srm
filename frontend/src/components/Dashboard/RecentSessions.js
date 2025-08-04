import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, BookOpen, Target } from 'lucide-react';

const RecentSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentSessions();
  }, []);

  const fetchRecentSessions = async () => {
    try {
      const response = await axios.get('/api/sessions/?limit=5');
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to fetch recent sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No study sessions yet</p>
        <p className="text-sm text-gray-400">Start logging your study time to see recent sessions here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <div key={session.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-600" />
            </div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {session.subject_name}
            </p>
            <div className="flex items-center text-xs text-gray-500 space-x-2">
              <span>{session.time_spent}h</span>
              {session.focus_level && (
                <>
                  <span>•</span>
                  <div className="flex items-center">
                    <Target className="h-3 w-3 mr-1" />
                    <span>{session.focus_level}/10</span>
                  </div>
                </>
              )}
              <span>•</span>
              <span>{new Date(session.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentSessions;